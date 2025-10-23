'use client';

import { useEffect } from 'react';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import { trpc } from '@/utils/trpc';
import { useTaskStore } from '@/store/taskStore';

export default function TasksPage() {
  const { data, isLoading, isError, error } = trpc.task.getTasks.useQuery();
  const setTasks = useTaskStore(s => s.setTasks);

  useEffect(() => {
    if (data) setTasks(data);
  }, [data, setTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay organized. Add, edit, complete, and manage your tasks.
          </p>
        </header>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <TaskForm />
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading tasks…</p>
          ) : isError ? (
            <p role="alert" className="text-sm text-red-600">
              {error?.message ?? 'Failed to load tasks'}
            </p>
          ) : (
            <TaskList />
          )}
        </section>
      </main>
    </div>
  );
}
