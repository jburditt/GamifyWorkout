import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';
import { ExerciseService, ScheduleService } from '@app/api/services';
import { Exercise, WorkoutLog } from '@app/api/models';

@Component({
  selector: 'app-add-exercise',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.scss']
})
export class AddExerciseComponent {
  form: FormGroup;
  exercises$: Observable<Exercise[]>;
  saveError = '';

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

    this.exercises$ = this.exerciseService.apiExerciseGet().pipe(
      catchError(() => of([]))
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const workoutLog: WorkoutLog = {
      exerciseId: this.form.value.exerciseId,
      sets: this.form.value.sets,
      reps: this.form.value.reps,
      weight: this.form.value.weight,
      date: new Date().toISOString().split('T')[0],
      scheduleId: ''
    };

    this.scheduleService.apiScheduleExercisePost({ body: workoutLog }).subscribe({
      next: result => this.dialogRef.close(result),
      error: () => {
        this.saveError = 'Unable to save exercise. Please try again.';
      }
    });
  }
}
