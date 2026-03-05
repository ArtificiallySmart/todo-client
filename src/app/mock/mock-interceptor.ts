import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { MOCK_TASKS } from './mock.data';
import { delay, of } from 'rxjs';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { Task } from '../models/task.model';
import {v4 as uuidv4} from 'uuid';

let mockTasks = MOCK_TASKS;

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  // ---------------------------------------------------------------------------
  // GET, geeft lijst met mocktasks terug (Voor nu alleen get all)
  // ---------------------------------------------------------------------------
  if (req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: mockTasks })).pipe(delay(300));
  }

  if (req.method === 'POST') {
    const newTask = req.body as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
    const newId = uuidv4();
    const newDate = new Date(Date.now());
    const createdTask: Task = { id: newId, createdAt: newDate, updatedAt: newDate, ...newTask };
    mockTasks = [... mockTasks, createdTask];

    return of(new HttpResponse({ status: 201, body: createdTask }));
  }

  if (req.method === 'PATCH') {
    const newValues = req.body as Partial<Task>;
    const id = req.url.split('/').pop()!;
    const index = mockTasks.findIndex((i) => i.id === id);
    const updatedTask = { ...mockTasks[index], ...newValues }
    mockTasks = mockTasks.map((t) => (t.id === id ? updatedTask : t));

    if (index > -1) {
      return of(new HttpResponse({ status: 200, body: updatedTask }));
    }
    return of(new HttpResponse({ status: 404 }));
  }

  if (req.method === 'DELETE') {
    const id = req.url.split('/').pop()!;
    const index = mockTasks.findIndex((i) => i.id === id);
    mockTasks = mockTasks.filter((t) => t.id !== id)
    if (index > -1) {
      return of(new HttpResponse({ status: 204 }));
    }
    return of(new HttpResponse({ status: 404 }));
  }

  return next(req);
};
