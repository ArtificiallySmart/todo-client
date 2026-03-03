import { Task } from '../models/task.model';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Wekelijkse teamvergadering voorbereiden',
    description: 'Agenda opstellen en documenten delen met het team',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2026-03-07'),
    createdAt: new Date('2026-03-03'),
    updatedAt: new Date('2026-03-03'),
    isRecurring: true,
    recurrence: {
      type: 'interval',
      intervalUnit: 'weeks',
      intervalValue: 1,
    },
  },
  {
    id: '2',
    title: 'Facturen verwerken',
    description: 'Openstaande facturen controleren en boeken',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date('2026-03-15'),
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-03'),
    isRecurring: true,
    recurrence: {
      type: 'fixed-dates',
      daysOfMonth: [1, 15],
    },
  },
  {
    id: '3',
    title: 'Jaarlijkse belastingaangifte',
    status: 'done',
    priority: 'low',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-02-28'),
    isRecurring: true,
    recurrence: {
      type: 'fixed-dates',
      daysOfMonth: [1],
      months: [4],
    },
  },
];
