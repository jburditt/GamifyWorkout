# RPG Gamification Feature Specification

> Full-stack specification for player leveling, experience system, and creature-based gamification mechanics.

## Metadata

| Property | Value |
|----------|-------|
| **Spec ID** | `rpg-gamification` |
| **Title** | RPG Gamification System |
| **Status** | In Progress (framework complete, workout integration pending) |
| **Last Updated** | 2024-01-15 |
| **Version** | 1.0.0 |
| **Related Specs** | [weekly-schedule.spec.md](./weekly-schedule.spec.md), [authentication.spec.md](./authentication.spec.md) |
| **Implemented In** | Frontend: `projects/gamifyworkout/src/app/features/rpg/`, Backend: (planned) |

---

## 1. Overview

### What This Feature Does

The RPG Gamification system transforms workout activities into game-like progression. Players gain experience points (XP) for completing workouts, which accumulate toward level-ups. The system tracks player level, health (HP), and mana (MP), providing a game-like progression layer over workout data.

**Key Capabilities**:
- Player progression system with levels and experience
- Experience accumulation from workouts
- Automatic level-up mechanics with stat increases
- Multiple creature types (Player, Warrior, Enemy) with different stat progression
- NgRx state management with persistent hydration
- Framework for future combat/challenge mechanics

### Key Responsibilities

- **Experience Management**: Award XP for completed workouts, track cumulative progress
- **Level Progression**: Automatically level up when XP threshold reached
- **Stat Scaling**: Increase HP/MP on level-up with configurable per-class bonuses
- **State Persistence**: Save player state across sessions using NgRx hydration
- **Creature Hierarchy**: Provide base classes and subclasses for different character types

### Integration Points

- **Upstream Dependencies**:
  - Weekly Schedule (triggers XP awards on workout completion)
  - Workout Logging (actual workout data feeds XP calculation)
  
- **Downstream Consumers**:
  - UI Display (show player level, HP, XP progress bars)
  - Challenge System (future: battles use creature classes)
  - Leaderboards (future: compete on level/XP)

- **External Systems**:
  - NgRx Store (state management and persistence)
  - Browser LocalStorage (hydration for state persistence)

---

## 2. Data Models

### Domain Model Diagram

```
Player (extends BaseCreature)
├── Level (1-∞)
├── Experience (0-maxExperience)
├── MaxExperience (increases 20% per level)
├── HP (health points)
├── MaxHP (increases 5 per level)
├── MP (mana points)
├── MaxMP (increases 3 per level)
└── levelUp() → Level++, XP reset, stats increase

Warrior (extends Player)
├── MaxHP = Player.MaxHP + 5
└── MaxMP = Player.MaxMP + 2

BaseCreature (interface)
├── HP
├── MaxHP
├── MP
├── MaxMP

Enemy (extends BaseCreature)
└── check(key) → boolean (type guard)

Creature (interface - minimal)
├── hp
├── maxHp
├── mp
├── maxMp
```

### TypeScript Models (Frontend)

**Located in `src/app/features/rpg/model/`**

```typescript
/**
 * Minimal creature interface
 */
export interface Creature {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

/**
 * Base creature class implementing Creature interface
 * All character types inherit from this
 */
export class BaseCreature implements Creature {
  hp!: number;
  maxHp!: number;
  mp!: number;
  maxMp!: number;
}

/**
 * Player class - main character with experience and leveling
 * Experience formula: maxExperience = floor((10 + (level - 1)) * 1.2^level)
 * Each level: maxExperience increases by 20%
 */
export class Player extends BaseCreature {
  private _level: number;
  public get level() { return this._level; }

  private _experience: number;
  public get experience() { return this._experience; }
  private set experience(value: number) {
    this._experience = value;
    // Auto level-up when XP threshold reached
    if (this._experience >= this.maxExperience)
      this.levelUp();
  }

  private _maxExperience: number;
  public get maxExperience() { return this._maxExperience; }

  /**
   * Initialize player at given level
   * @param level - Starting level (default 1)
   */
  constructor(level: number = 1) {
    super();
    this._level = level;
    
    // Stats based on level
    this.maxHp = 10 + (level - 1) * 5;       // Base 10 + 5 per level
    this.hp = this.maxHp;
    this.maxMp = 5 + (level - 1) * 3;        // Base 5 + 3 per level
    this.mp = this.maxMp;
    
    // XP requirements increase 20% per level
    this._experience = 0;
    this._maxExperience = Math.floor((10 + (level - 1)) * 1.2);
  }

  /**
   * Level up the player
   * Increases level, resets XP, increases stat caps
   */
  protected levelUp() {
    this._level++;
    this._experience = 0;
    this._maxExperience = Math.floor(this.maxExperience * 1.2);
    
    // Restore HP/MP on level-up
    this.hp = this.maxHp;
    this.mp = this.maxMp;
  }
}

/**
 * Warrior subclass - tankier variant of Player
 * Extra HP and MP compared to base Player
 */
export class Warrior extends Player {
  constructor(level: number = 1) {
    super(level);
    this.maxHp += 5;      // +5 HP bonus over base Player
    this.hp = this.maxHp;
    this.maxMp += 2;      // +2 MP bonus over base Player
    this.mp = this.maxMp;
  }
}

/**
 * Enemy class - NPCs for future combat
 * Allows dynamic property access (for combat mechanics)
 */
export class Enemy extends BaseCreature {
  // Allow dynamic properties for combat system
  [key: number]: Enemy | ((key: number) => Enemy);

  /**
   * Type guard to check if value is Enemy instance
   */
  check(key: number): boolean {
    return this[key] instanceof Enemy;
  }
}
```

### NgRx Store Models

**Located in `src/app/features/rpg/store/`**

```typescript
/**
 * Player state in Redux store
 * Mirrors Player class properties
 */
export interface PlayerState {
  hp: number;           // Current health points
  maxHp: number;        // Maximum health points
  mp: number;           // Current mana points
  maxMp: number;        // Maximum mana points
  experience: number;   // Current experience points
  level: number;        // Current level (1 = level 1)
}

/**
 * Initial player state (level 1)
 */
export const initialState: PlayerState = {
  hp: 100,       // 10 + (1-1)*5 = 10, but initialized to 100 (TODO: verify this)
  maxHp: 100,
  mp: 100,       // 5 + (1-1)*3 = 5, but initialized to 100 (TODO: verify this)
  maxMp: 100,
  experience: 0,
  level: 1
};
```

### Validation Rules

| Field | Type | Required | Constraints | Error Message | Backend Enforced |
|-------|------|----------|-------------|---|---|
| `level` | int | Yes | >= 1 | "Level must be >= 1" | N/A (frontend only) |
| `experience` | int | Yes | >= 0 | "Experience cannot be negative" | N/A (frontend only) |
| `hp` | int | Yes | 0 to maxHp | "HP cannot exceed maxHp" | N/A (frontend only) |
| `mp` | int | Yes | 0 to maxMp | "MP cannot exceed maxMp" | N/A (frontend only) |

---

## 3. NgRx Store Specification

### Actions

**File**: `src/app/features/rpg/store/player.actions.ts`

```typescript
import { createAction, props } from '@ngrx/store';

/**
 * Damage player
 * Reduces HP by specified amount
 */
export const damage = createAction(
  '[Player] Damage',
  props<{ damageHp: number }>()
);

/**
 * Heal player
 * Increases HP by 10 points (or to maxHp if less)
 */
export const heal = createAction('[Player] Heal');

/**
 * Award experience to player
 * Increases XP, triggers level-up if threshold reached
 * (NOT YET IMPLEMENTED - planned)
 */
export const awardExperience = createAction(
  '[Player] Award Experience',
  props<{ xp: number }>()
);

/**
 * Level up player
 * (NOT YET IMPLEMENTED - planned)
 */
export const levelUp = createAction('[Player] Level Up');

/**
 * Initialize player at specific level
 * (NOT YET IMPLEMENTED - planned)
 */
export const initializePlayer = createAction(
  '[Player] Initialize',
  props<{ level: number }>()
);
```

### Reducer

**File**: `src/app/features/rpg/store/player.reducer.ts`

```typescript
import { createReducer, on } from '@ngrx/store';
import { damage, heal } from './player.actions';

/**
 * Player reducer - pure function that updates state based on actions
 */
export const playerReducer = createReducer(
  initialState,
  
  on(damage, (state, { damageHp }) => ({
    ...state,
    hp: Math.max(0, state.hp - damageHp)  // Don't go below 0
  })),
  
  on(heal, (state) => ({
    ...state,
    hp: Math.min(state.hp + 10, state.maxHp)  // Cap at maxHp
  }))
  
  // TODO: Implement awardExperience handler
  // TODO: Implement levelUp handler
);

/**
 * State shape for player feature
 */
export interface State {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  experience: number;
  level: number;
}
```

### Selectors

**Planned (not yet implemented)**

```typescript
/**
 * Select player state
 */
export const selectPlayerState = (state: any) => state.player;

/**
 * Select current player level
 */
export const selectLevel = createSelector(
  selectPlayerState,
  (state: State) => state.level
);

/**
 * Select current experience
 */
export const selectExperience = createSelector(
  selectPlayerState,
  (state: State) => state.experience
);

/**
 * Select HP percentage for progress bar
 */
export const selectHpPercentage = createSelector(
  selectPlayerState,
  (state: State) => (state.hp / state.maxHp) * 100
);

/**
 * Select XP percentage for progress bar
 */
export const selectXpPercentage = createSelector(
  selectPlayerState,
  (state: State) => (state.experience / state.maxExperience) * 100  // TODO: maxExperience not in state
);
```

### Effects

**Planned (not yet implemented)**

```typescript
@Injectable()
export class PlayerEffects {
  
  /**
   * When workout completed, award XP
   */
  workoutCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActions.completeWorkout),
      map((action) => {
        // Calculate XP based on workout difficulty
        const xp = action.workout.sets * action.workout.reps * 10;
        return PlayerActions.awardExperience({ xp });
      })
    )
  );

  /**
   * When XP reaches threshold, level up
   */
  experienceGained$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.awardExperience),
      withLatestFrom(this.store.select(selectExperience)),
      filter(([action, currentXp]) => currentXp + action.xp >= maxExperienceForLevel),
      map(() => PlayerActions.levelUp())
    )
  );

  constructor(private actions$: Actions, private store: Store) { }
}
```

### Hydration (Persistence)

**File**: `src/app/features/rpg/store/hydration.reducer.ts` (planned/partial)

```typescript
/**
 * Hydration reducer for persisting player state to localStorage
 * Allows player state to survive page refreshes
 */
export const hydrationFeatureKey = 'hydration';

/**
 * Save player state to localStorage on every change
 */
export function hydratePlayerState(state: State): State {
  const savedState = localStorage.getItem('playerState');
  return savedState ? JSON.parse(savedState) : state;
}

/**
 * Override meta-reducer to save to localStorage
 */
export const hydrationMetaReducer = (
  reducer: ActionReducer<any>
): ActionReducer<any> => {
  return (state, action) => {
    if (action.type === '@ngrx/store/init' || action.type === '@ngrx/effects/init') {
      const storageValue = localStorage.getItem('playerState');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('playerState');
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('playerState', JSON.stringify(nextState));
    return nextState;
  };
};
```

---

## 4. Components & UI

### Component Specifications (Planned)

#### PlayerStatusComponent

**Purpose**: Display player level, HP, MP, and experience progress bars

**Inputs**:
```typescript
@Input() level$: Observable<number>;
@Input() hp$: Observable<number>;
@Input() maxHp$: Observable<number>;
@Input() mp$: Observable<number>;
@Input() maxMp$: Observable<number>;
@Input() experience$: Observable<number>;
```

**Template**:
```html
<div class="player-status">
  <div class="level">Level: {{ level$ | async }}</div>
  
  <div class="hp-bar">
    <label>HP</label>
    <mat-progress-bar 
      mode="determinate" 
      [value]="(hpPercentage$ | async) || 0">
    </mat-progress-bar>
    <span>{{ (hp$ | async) }} / {{ (maxHp$ | async) }}</span>
  </div>
  
  <div class="mp-bar">
    <label>MP</label>
    <mat-progress-bar 
      mode="determinate" 
      [value]="(mpPercentage$ | async) || 0"
      color="accent">
    </mat-progress-bar>
    <span>{{ (mp$ | async) }} / {{ (maxMp$ | async) }}</span>
  </div>
  
  <div class="xp-bar">
    <label>Experience</label>
    <mat-progress-bar 
      mode="determinate" 
      [value]="(xpPercentage$ | async) || 0"
      color="warn">
    </mat-progress-bar>
    <span>{{ (experience$ | async) }} / {{ (maxExperience$ | async) }}</span>
  </div>
</div>
```

---

## 5. Business Logic & Workflows

### Experience and Leveling Workflow

```
Workout Completed
    ↓
Calculate XP Earned
    ├── Base: 10 XP per set-rep combination
    ├── Multiplier: Difficulty factor (planned)
    └── Total: sets * reps * 10 * difficulty_multiplier
    ↓
Dispatch awardExperience(xp) Action
    ↓
NgRx Effect Receives Action
    ↓
Add XP to Current Experience
    ├── experience += xp
    └── If experience >= maxExperience:
        ├── experience -= maxExperience
        ├── level++
        ├── maxExperience *= 1.2
        ├── maxHp += 5 (or class bonus)
        ├── hp = maxHp (restore on level-up)
        └── Dispatch levelUp() action
    ↓
Reducer Updates State
    ↓
Selectors Emit New State
    ↓
UI Components Re-render
    ├── Level badge updates
    ├── Experience progress bar updates
    └── Level-up notification shown
```

### Experience Formula

```
Level 1: maxXp = floor((10 + 0) * 1.2^1) = 12
Level 2: maxXp = floor(12 * 1.2) = 14
Level 3: maxXp = floor(14 * 1.2) = 16
Level 4: maxXp = floor(16 * 1.2) = 19
Level 5: maxXp = floor(19 * 1.2) = 22
...
Level 10: maxXp ≈ 51
Level 20: maxXp ≈ 309
Level 50: maxXp ≈ 10,000+

Growth: Each level requires ~20% more XP than previous
```

### Damage and Heal Workflow

```
Combat Action Triggered
    ↓
Dispatch damage({ damageHp: 20 }) or heal()
    ↓
Reducer Updates HP
    ├── damage: hp = max(0, hp - damageHp)
    ├── heal: hp = min(hp + 10, maxHp)
    └── Clamp to valid range [0, maxHp]
    ↓
Selector Emits New HP Value
    ↓
UI Updates Health Bar
```

### Level-Up Effects

```
Level-Up Triggered
    ↓
Increase Stats
    ├── Level: level++
    ├── MaxHP: +5 (Player), +5 (Warrior) base +5
    ├── MaxMP: +3 (Player), +3 (Warrior) base +3
    └── MaxExperience: floor(maxExperience * 1.2)
    ↓
Restore Resources
    ├── HP = MaxHP (full heal on level-up)
    ├── MP = MaxMP (full restore on level-up)
    └── Experience = 0 (reset XP counter)
    ↓
Emit Level-Up Notification
    ├── Show toast/animation
    ├── Play level-up sound (future)
    └── Award bonus (future)
    ↓
Persist to localStorage
    ├── Save all state changes
    └── Survives page refresh
```

---

## 6. Usage Examples

### Frontend Usage - Award Experience

```typescript
// When workout completed, dispatch action
import { PlayerActions } from '@app/features/rpg/store';

export class WorkoutComponent {
  constructor(private store: Store) { }

  completeWorkout(workout: WorkoutLog) {
    // Calculate XP
    const xp = workout.sets * workout.reps * 10;
    
    // Dispatch to store
    this.store.dispatch(PlayerActions.awardExperience({ xp }));
  }
}
```

### Frontend Usage - Display Player Status

```typescript
// In component
export class PlayerStatusComponent {
  level$ = this.store.select(selectLevel);
  hp$ = this.store.select(selectHp);
  experience$ = this.store.select(selectExperience);

  constructor(private store: Store) { }
}
```

### Backend Usage - Persist Player Data (Future)

```csharp
// Player would be stored in database
// Not yet implemented - currently frontend-only
[Serializable]
public class PlayerData : BaseEntity
{
    public Guid UserId { get; set; }
    public int Level { get; set; }
    public int Experience { get; set; }
    public int MaxExperience { get; set; }
    public int Hp { get; set; }
    public int MaxHp { get; set; }
    public int Mp { get; set; }
    public int MaxMp { get; set; }
}
```

---

## 7. Related Files & References

### Frontend Implementation

- **Player Model**: [src/app/features/rpg/model/player.ts](../src/app/features/rpg/model/player.ts)
- **BaseCreature**: [src/app/features/rpg/model/creature.ts](../src/app/features/rpg/model/creature.ts)
- **Warrior Class**: [src/app/features/rpg/model/warrior.ts](../src/app/features/rpg/model/warrior.ts)
- **Enemy Class**: [src/app/features/rpg/model/enemy.ts](../src/app/features/rpg/model/enemy.ts)
- **Actions**: [src/app/features/rpg/store/player.actions.ts](../src/app/features/rpg/store/player.actions.ts)
- **Reducer**: [src/app/features/rpg/store/player.reducer.ts](../src/app/features/rpg/store/player.reducer.ts)

### Backend Implementation (Planned)

- Player data persistence layer (not yet created)
- Experience calculation service (not yet created)
- Leaderboard queries (not yet created)

---

## 8. Known Issues & TODOs

| Issue | Priority | Status | Description | Workaround | Epic |
|-------|----------|--------|---|---|---|
| **Frontend-only state** | High | Open | Player data not persisted to backend database | State lost on logout | Persistence |
| **No XP award mechanism** | High | Open | No connection between workout completion and XP | Manual testing only | Integration |
| **localStorage hydration incomplete** | High | Open | Hydration reducer partially implemented | State lost on browser clear | Persistence |
| **Initial state hardcoded** | Medium | Open | HP/MP start at 100 instead of calculated | Should use Player class init | Bug |
| **No level cap** | Low | Open | Player can level infinitely (20% formula grows unbounded) | Add max level = 100 | Design |
| **No difficulty multiplier** | Low | Planned | XP award ignores workout intensity | All workouts = same XP | Feature |
| **No class selection UI** | Low | Planned | Can't choose between Player/Warrior | Can instantiate in code | Feature |
| **No combat system** | Low | Planned | Creature classes exist but no combat mechanics | Framework only | Feature |
| **No backend sync** | Medium | Planned | Player state not synced to server | Refresh clears state | Persistence |
| **No leaderboards** | Low | Planned | No way to compare progress with other users | Single-player only | Feature |

---

## 9. Future Enhancements

- [ ] Backend database persistence for player data
- [ ] Server-side XP award validation (can't fake XP)
- [ ] Difficulty-based XP multipliers (harder workouts = more XP)
- [ ] Class selection and switching
- [ ] Combat system with creatures
- [ ] PvP challenges between users
- [ ] Achievements and badges
- [ ] Leaderboards (global, friends, guild)
- [ ] Skill trees and abilities
- [ ] Equipment/gear system
- [ ] Boss battles
- [ ] Guild/team system
- [ ] Daily quests and missions
- [ ] Seasonal battle passes

---

## 10. Appendix: Code Generation Notes

### For AI Code Generators

When generating code based on this spec:

**Class Generation**:
1. Inherit Player from BaseCreature
2. Inherit Warrior from Player (with HP/MP bonuses)
3. Use getters/setters for experience auto-level-up
4. Implement Math.floor() for XP calculations
5. Clamp HP/MP values to [0, maxHp] and [0, maxMp]

**NgRx Generation**:
1. Create playerReducer with damage and heal handlers
2. Add Math.max/min to clamp values
3. Implement hydration meta-reducer for localStorage
4. Create selectors for computed values (hp %, xp %)
5. Plan effects for future awardExperience action

**Component Generation**:
1. Use mat-progress-bar for HP/MP/XP display
2. Use async pipe for observable subscriptions
3. Create reusable progress bar component
4. Show level, XP to next level
5. Add animations for level-up

**Backend Generation** (Future):
1. Create PlayerData entity matching Player class properties
2. Add migrations for player_data table
3. Create PlayerRepository for CRUD operations
4. Add endpoints: GET /api/player, POST /api/player/{userId}/experience
5. Validate XP awards server-side (prevent cheating)

---

*Last reviewed: January 15, 2024 | Spec version: 1.0.0 | Status: In Progress*
