import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleService } from '@app/api/services';
import { Exercise, MuscleGroup } from '@app/api/models';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddExerciseComponent } from '../../dialogs/add-exercise.component';

@Component({
  selector: 'app-today-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `
    <div class="today-schedule">
      <h2>Today's Exercises</h2>

      <div *ngIf="muscleGroups$ | async as muscleGroups; else loading">
        <p *ngIf="muscleGroups.length > 0; else noMuscleGroups">
          <strong>Muscle Groups:</strong> {{ muscleGroups.join(', ') }}
        </p>
        <ng-template #noMuscleGroups>
          <p>No muscle groups scheduled for today. <a routerLink="/schedule/week">Go to Weekly Schedule</a></p>
        </ng-template>
      </div>

      <div *ngIf="exercises$ | async as exercises; else loading">
        <table mat-table [dataSource]="exercises" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let exercise">{{ exercise.name }}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let exercise">{{ exercise.description }}</td>
          </ng-container>

          <ng-container matColumnDef="primaryMuscleGroup">
            <th mat-header-cell *matHeaderCellDef>Primary Muscle Group</th>
            <td mat-cell *matCellDef="let exercise">{{ exercise.primaryMuscleGroup }}</td>
          </ng-container>

          <ng-container matColumnDef="primaryMuscle">
            <th mat-header-cell *matHeaderCellDef>Primary Muscle</th>
            <td mat-cell *matCellDef="let exercise">{{ exercise.primaryMuscle }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <button mat-raised-button color="primary" (click)="addExercise()">Add Exercise</button>
      </div>

      <ng-template #loading>
        <mat-spinner></mat-spinner>
      </ng-template>

      <div *ngIf="error" class="error">
        Error loading data: {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .today-schedule {
      padding: 20px;
    }
    .error {
      color: red;
    }
  `]
})
export class TodayScheduleComponent implements OnInit {
  muscleGroups$: Observable<MuscleGroup[]> = of([]);
  exercises$: Observable<Exercise[]> = of([]);
  error: string | null = null;
  displayedColumns: string[] = ['name', 'description', 'primaryMuscleGroup', 'primaryMuscle'];

  constructor(private scheduleService: ScheduleService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadMuscleGroups();
    this.loadExercises();
  }

  private loadMuscleGroups() {
    this.muscleGroups$ = this.scheduleService.apiScheduleTodayMuscleGet().pipe(
      catchError(err => {
        this.error = 'Failed to load muscle groups';
        return of([]);
      })
    );
  }

  private loadExercises() {
    this.exercises$ = this.scheduleService.apiScheduleTodayExerciseGet().pipe(
      catchError(err => {
        this.error = 'Failed to load exercises';
        return of([]);
      })
    );
  }

  addExercise() {
    const dialogRef = this.dialog.open(AddExerciseComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the exercises list
        this.loadExercises();
      }
    });
  }
}
