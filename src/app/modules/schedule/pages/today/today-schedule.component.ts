import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ScheduleService } from '@app/api/services';
import { Exercise, MuscleGroup } from '@app/api/models';
import { AddExerciseComponent } from '../../dialogs/add-exercise.component';

@Component({
  selector: 'app-today-schedule',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './today-schedule.component.html',
  styleUrls: ['./today-schedule.component.scss']
})
export class TodayScheduleComponent implements OnInit {
  muscleGroups$: Observable<MuscleGroup[]> = of([]);
  exercises$: Observable<Exercise[]> = of([]);
  error: string | null = null;
  displayedColumns = ['name', 'description', 'primaryMuscleGroup', 'primaryMuscle'];

  constructor(private scheduleService: ScheduleService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadMuscleGroups();
    this.loadExercises();
  }

  private loadMuscleGroups(): void {
    this.muscleGroups$ = this.scheduleService.apiScheduleTodayMuscleGet().pipe(
      catchError(() => {
        this.error = 'Unable to load today’s muscle groups.';
        return of([]);
      })
    );
  }

  private loadExercises(): void {
    this.exercises$ = this.scheduleService.apiScheduleTodayExerciseGet().pipe(
      catchError(() => {
        this.error = 'Unable to load today’s exercises.';
        return of([]);
      })
    );
  }

  addExercise(): void {
    const dialogRef = this.dialog.open(AddExerciseComponent);
    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.loadExercises();
      }
    });
  }
}
