import { create } from 'zustand';
import type { Task } from '@prisma/client';

export type TaskFilters = {
  status?: 'open' | 'done';
};

export interface TaskState {
  tasks: Task[];
  filters?: TaskFilters;
  loading: boolean;
}

export interface TaskActions {
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState & TaskActions>(set => ({
  tasks: [],
  filters: undefined,
  loading: false,

  setTasks: tasks => set({ tasks }),

  addTask: task =>
    set(state => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: task =>
    set(state => ({
      tasks: state.tasks.map(t => (t.id === task.id ? { ...t, ...task } : t)),
    })),

  removeTask: id =>
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id),
    })),

  clearTasks: () => set({ tasks: [] }),
}));
