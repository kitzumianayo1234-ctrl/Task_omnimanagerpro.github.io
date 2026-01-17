export enum TaskStatus {
  PENDING = 'PENDING',
  ON_GOING = 'ON-GOING',
  DONE = 'DONE',
  CANCELED = 'CANCELED'
}

export enum DashboardView {
  CALENDAR = 'CALENDAR',
  TASKS = 'TASKS',
  MEETINGS = 'MEETINGS',
  HISTORY = 'HISTORY',
  NOTES = 'NOTES',
  REPORTS = 'REPORTS'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // ISO Date String YYYY-MM-DD
  status: TaskStatus;
  remarks: string;
  reminder: boolean; // Reminder toggle
  createdAt: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  platform: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface CalendarDateState {
  currentDate: Date;
  viewMode: 'day' | 'month' | 'year';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: number;
  read: boolean;
}