import { Task } from '../models/task.model';

export const MOCK_TASKS: Task[] = [
  {
    id: '104538b6-fd85-4f24-beb9-9d989842d7f6',
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
    id: 'a0361a42-8ac3-4819-99c7-311a2ffcd85b',
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
    id: 'd7d75b8c-4100-40ca-8e3b-46a4b662710a',
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
