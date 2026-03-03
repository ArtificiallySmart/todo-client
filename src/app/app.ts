import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskStateService } from './services/task-state.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
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
}
