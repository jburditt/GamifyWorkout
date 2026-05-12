import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExerciseService } from '@app/api/services';
import { ScheduleService } from '@app/api/services';
import { Exercise, WorkoutLog } from '@app/api/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-exercise',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Add Exercise</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>Exercise</mat-label>
          <mat-select formControlName="exerciseId">
            <mat-option *ngFor="let exercise of exercises$ | async" [value]="exercise.id">
              {{ exercise.name }} ({{ exercise.primaryMuscleGroup }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Sets</mat-label>
          <input matInput type="number" formControlName="sets" min="1" max="100">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Reps</mat-label>
          <input matInput type="number" formControlName="reps" min="1" max="100">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Weight</mat-label>
          <input matInput type="number" formControlName="weight" min="0" step="0.1">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `]
})
export class AddExerciseComponent {
  form: FormGroup;
  exercises$: Observable<Exercise[]>;

  private dialogRef = inject(MatDialogRef<AddExerciseComponent>);
  private fb = inject(FormBuilder);
  private exerciseService = inject(ExerciseService);
  private scheduleService = inject(ScheduleService);

  constructor() {
    this.form = this.fb.group({
      exerciseId: ['', Validators.required],
      sets: [3, [Validators.required, Validators.min(1), Validators.max(100)]],
      reps: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      weight: [0, [Validators.required, Validators.min(0)]]
    });

    this.exercises$ = this.exerciseService.apiExerciseGet();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.valid) {
      const workoutLog: WorkoutLog = {
        scheduleId: '', // TODO: Get today's schedule ID
        exerciseId: this.form.value.exerciseId,
        sets: this.form.value.sets,
        reps: this.form.value.reps,
        weight: this.form.value.weight,
        date: new Date().toISOString().split('T')[0] // Today's date
      };

      this.scheduleService.apiScheduleExercisePost({ body: workoutLog }).subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (err) => {
          console.error('Error saving workout log', err);
          // TODO: Show error
        }
      });
    }
  }
}
