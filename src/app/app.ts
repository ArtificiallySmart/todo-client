import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskStateService } from './services/task-state.service';
import { JsonPipe } from '@angular/common';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private taskState = inject(TaskStateService);

  tasks = this.taskState.tasks;

  protected readonly title = signal('todo-client');

  ngOnInit(): void {
    this.taskState.loadTasks();
  }

  deleteTask(id: string): void {
    this.taskState.deleteTask(id);
  }

  newTask() {
    const task = {
      title: 'Taken testen',
      description: 'Agenda opstellen en documenten delen met het team',
      status: 'todo',
      priority: 'high',
      dueDate: new Date('2026-03-07'),
      isRecurring: true,
      recurrence: {
        type: 'interval',
        intervalUnit: 'weeks',
        intervalValue: 1,
      },
    } as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
    this.taskState.addTask(task);
  }
}
