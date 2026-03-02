import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TaskApiService } from './task-api.service';
import { Task } from '../models/task.model';

// ---------------------------------------------------------------------------
// A mock task we'll reuse across tests, so we don't repeat ourselves.
// ---------------------------------------------------------------------------
const mockTask: Task = {
  id: '1',
  title: 'Clean aquarium',
  status: 'todo',
  priority: 'medium',
  isRecurring: true,
  recurrence: { type: 'interval', intervalUnit: 'weeks', intervalValue: 1 },
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('TaskApiService', () => {
  let service: TaskApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // getAll()
  // ---------------------------------------------------------------------------
  it('should fetch all tasks via GET /api/tasks', () => {
    const mockTasks: Task[] = [mockTask];

    service.getAll().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('/api/tasks');

    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);
  });

  // ---------------------------------------------------------------------------
  // getById()
  // ---------------------------------------------------------------------------
  it('should fetch a single task via GET /api/tasks/:id', () => {
    service.getById('1').subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne('/api/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  // ---------------------------------------------------------------------------
  // create()
  // ---------------------------------------------------------------------------
  it('should create a task via POST /api/tasks', () => {
    // Omit the fields the backend is responsible for generating.
    const { id, createdAt, updatedAt, ...newTask } = mockTask;

    service.create(newTask).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne('/api/tasks');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush(mockTask);
  });

  // ---------------------------------------------------------------------------
  // update()
  // ---------------------------------------------------------------------------
  it('should update a task via PATCH /api/tasks/:id', () => {
    const changes: Partial<Task> = { status: 'done' };
    const updatedTask: Task = { ...mockTask, status: 'done' };

    service.update('1', changes).subscribe((task) => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne('/api/tasks/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(changes);
    req.flush(updatedTask);
  });

  // ---------------------------------------------------------------------------
  // delete()
  // ---------------------------------------------------------------------------
  it('should delete a task via DELETE /api/tasks/:id', () => {
    service.delete('1').subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne('/api/tasks/1');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  // ---------------------------------------------------------------------------
  // Error propagation — good to test that your service doesn't silently swallow errors.
  // ---------------------------------------------------------------------------
  it('should propagate errors from the backend', () => {
    service.getAll().subscribe({
      next: () => {
        throw new Error('expected an error, not a successful response');
      },
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/tasks');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });
});
