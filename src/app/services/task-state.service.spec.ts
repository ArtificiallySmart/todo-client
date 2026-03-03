import { TestBed } from '@angular/core/testing';

import { TaskStateService } from './task-state.service';
import { Task } from '../models/task.model';
import { TaskApiService } from './task-api.service';
import { of, Subject, throwError } from 'rxjs';

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

const mockTask2: Task = {
  id: '2',
  title: 'Water the plants',
  status: 'todo',
  priority: 'medium',
  isRecurring: true,
  recurrence: { type: 'interval', intervalUnit: 'weeks', intervalValue: 1 },
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const mockApiService = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

describe('TaskStateService', () => {
  let service: TaskStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskStateService, { provide: TaskApiService, useValue: mockApiService }],
    });

    service = TestBed.inject(TaskStateService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------
  it('should start with an empty tasklist', () => {
    expect(service.tasks()).toEqual([]);
  });

  it('should start with loading false', () => {
    expect(service.loading()).toEqual(false);
  });

  it('should start without errors', () => {
    expect(service.error()).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // Base actions
  // ---------------------------------------------------------------------------
  describe('loadTasks', () => {
    it('should set tasks signal on success', () => {
      const mockTasks = [mockTask];

      mockApiService.getAll.mockReturnValue(of(mockTasks));

      service.loadTasks();

      expect(service.tasks()).toEqual(mockTasks);
    });

    it('should set loading to true while fetching, and to false when done', () => {
      const subject = new Subject<Task[]>();

      mockApiService.getAll.mockReturnValue(subject.asObservable());

      service.loadTasks();

      // At this point, the subject hasn't emitted yet, so the request is still running and loading should be true
      expect(service.loading()).toBe(true);

      // Now we resolve the request by emitting a value through the subject
      subject.next([mockTask]);
      subject.complete();

      // Now that the request has completed, loading should be false again
      expect(service.loading()).toBe(false);
    });

    it('should set the error signal on error', () => {
      mockApiService.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      service.loadTasks();

      expect(service.error()).toBe('Failed to load tasks');
    });

    it('should set loading to true while fetching, and to false on error', () => {
      mockApiService.getAll.mockReturnValue(throwError(() => new Error('Network error')));
      service.loadTasks();

      expect(service.loading()).toBe(false);
    });
  });

  describe('addTask()', () => {
    const { id, createdAt, updatedAt, ...taskToCreate } = mockTask;
    it('should add the created task to the tasks signal', () => {
      mockApiService.create.mockReturnValue(of(mockTask));

      service.addTask(taskToCreate);

      expect(service.tasks()).toEqual([mockTask]);
    });

    it('should add to the error signal on error', () => {
      mockApiService.create.mockReturnValue(throwError(() => new Error('Network error')));

      service.addTask(taskToCreate);

      expect(service.error()).toBe('Failed to add task');
    });
  });

  describe('updateTask()', () => {
    it('should update the relevant task in the tasks signal', () => {
      mockApiService.getAll.mockReturnValue(of([mockTask, mockTask2]));
      service.loadTasks();

      const expectedTask = { ...mockTask2, title: 'different title' };
      mockApiService.update.mockReturnValue(of(expectedTask));

      service.updateTask(mockTask2.id, { title: 'different title' });

      expect(service.tasks()).toContainEqual({ ...expectedTask });
      expect(service.tasks()).toContainEqual({ ...mockTask });
    });

    it('should add to the error signal on error', () => {
      mockApiService.update.mockReturnValue(throwError(() => new Error('Network error')));

      service.updateTask(mockTask.id, { title: 'different title' });

      expect(service.error()).toBe('Failed to update task');
    });
  });

  describe('deleteTask()', () => {
    it('should delete the relevant task from the tasks signal', () => {
      mockApiService.getAll.mockReturnValue(of([mockTask]));
      service.loadTasks();

      mockApiService.delete.mockReturnValue(of(void 0));

      service.deleteTask(mockTask.id);

      expect(service.tasks().length).toBe(0);
    });

    it('should add to the error signal on error', () => {
      mockApiService.delete.mockReturnValue(throwError(() => new Error('Network error')));

      service.deleteTask(mockTask.id);

      expect(service.error()).toBe('Failed to delete task');
    });
  });

  // ---------------------------------------------------------------------------
  // Specific actions
  // ---------------------------------------------------------------------------
  describe('markAsDone()', () => {
    it('should change the status of the relevant task to done', () => {
      mockApiService.getAll.mockReturnValue(of([mockTask]));
      service.loadTasks();

      const expectedTask = { ...mockTask, status: 'done' };

      mockApiService.update.mockReturnValue(of(expectedTask));

      service.markAsDone(mockTask.id);

      expect(service.tasks()[0]).toEqual(expectedTask);
    });
  });
});
