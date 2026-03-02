import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { TaskApiService } from './task-api.service';
import { Task } from '../models/task.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  private readonly api = inject(TaskApiService);
  private readonly destroyRef = inject(DestroyRef);

  // State
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public signals
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Base actions
  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.api
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this._tasks.set(tasks);
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Failed to load tasks');
          this._loading.set(false);
        },
      });
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.api
      .create(task)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newTask) => {
          this._tasks.update((tasks) => [...tasks, newTask]);
        },
        error: () => {
          this._error.set('Failed to add task');
        },
      });
  }

  updateTask(id: string, task: Partial<Task>): void {
    this.api
      .update(id, task)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedTask) => {
          this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? updatedTask : t)));
        },
        error: () => {
          this._error.set('Failed to update task');
        },
      });
  }

  deleteTask(id: string): void {
    this.api
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
        },
        error: () => {
          this._error.set('Failed to delete task');
        },
      });
  }

  // Specific actions
  markAsDone(id: string): void {
    this.updateTask(id, { status: 'done' });
  }
}
