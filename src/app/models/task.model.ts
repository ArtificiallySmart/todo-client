export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Recurrence
  isRecurring: boolean;
  recurrence?: Recurrence;
  recurrenceParentId?: string; // links a generated task back to its "template" task
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurrenceType = 'interval' | 'fixed-dates';
export type IntervalUnit = 'days' | 'weeks' | 'months' | 'years';

export interface IntervalRecurrence {
  type: 'interval';
  intervalUnit: IntervalUnit;
  intervalValue: number; // e.g. 1 (week), 2 (weeks), etc.
}

export interface FixedDatesRecurrence {
  type: 'fixed-dates';
  daysOfMonth: number[]; // e.g. [1, 15] for the 1st and 15th of each month
  months?: number[]; // optional: e.g. [1, 6, 12] to limit to specific months
}

export type Recurrence = IntervalRecurrence | FixedDatesRecurrence;
