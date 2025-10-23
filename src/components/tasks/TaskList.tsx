'use client';

import { trpc } from '@/utils/trpc';
import { useTaskStore } from '@/store/taskStore';
import type { Task } from '@prisma/client';
import { useShallow } from 'zustand/react/shallow';
import TaskCard from '@/components/tasks/TaskCard';

interface TaskListProps {
  className?: string;
}

export default function TaskList({ className }: TaskListProps) {
  const { tasks, setTasks } = useTaskStore(
    useShallow(s => ({
      tasks: s.tasks,
      setTasks: s.setTasks,
    }))
  );

  const utils = trpc.useUtils();

  const toggleMutation = trpc.task.updateTask.useMutation({
    onMutate: async input => {
      await utils.task.getTasks.cancel();

      const prev = utils.task.getTasks.getData();

      utils.task.getTasks.setData(
        undefined,
        (old: Task[] | undefined): Task[] => {
          const list = old ?? [];
          return list.map((t: Task) =>
            t.id === input.id ? ({ ...t, ...input } as Task) : t
          );
        }
      );

      setTasks(
        (prev ?? []).map((t: Task) =>
          t.id === input.id ? ({ ...t, ...input } as Task) : t
        )
      );

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        utils.task.getTasks.setData(undefined, ctx.prev as Task[]);
        setTasks(ctx.prev);
      }
    },
    onSettled: () => {
      utils.task.getTasks.invalidate();
    },
  });

  const deleteMutation = trpc.task.deleteTask.useMutation({
    onMutate: async input => {
      await utils.task.getTasks.cancel();
      const prev = utils.task.getTasks.getData();

      utils.task.getTasks.setData(
        undefined,
        (old: Task[] | undefined): Task[] => {
          const list = old ?? [];
          return list.filter((t: Task) => t.id !== input.id);
        }
      );

      setTasks((prev ?? []).filter((t: Task) => t.id !== input.id));

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        utils.task.getTasks.setData(undefined, ctx.prev as Task[]);
        setTasks(ctx.prev);
      }
    },
    onSettled: () => {
      utils.task.getTasks.invalidate();
    },
  });
  const editMutation = trpc.task.updateTask.useMutation({
    onMutate: async input => {
      await utils.task.getTasks.cancel();
      const prev = utils.task.getTasks.getData();

      utils.task.getTasks.setData(
        undefined,
        (old: Task[] | undefined): Task[] => {
          const list = old ?? [];
          return list.map((t: Task) =>
            t.id === input.id ? ({ ...t, ...input } as Task) : t
          );
        }
      );

      setTasks(
        (prev ?? []).map((t: Task) =>
          t.id === input.id ? ({ ...t, ...input } as Task) : t
        )
      );

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        utils.task.getTasks.setData(undefined, ctx.prev as Task[]);
        setTasks(ctx.prev);
      }
    },
    onSettled: () => {
      utils.task.getTasks.invalidate();
    },
  });

  function onToggle(task: Task) {
    toggleMutation.mutate({ id: task.id, completed: !task.completed });
  }

  function onDelete(id: string) {
    deleteMutation.mutate({ id });
  }

  return (
    <div className={className} aria-label="Task list">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks yet.</p>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
              Active
            </h2>
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {tasks
                .filter(t => !t.completed)
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onSave={payload => editMutation.mutate(payload)}
                    isDeleting={deleteMutation.isPending}
                    isSaving={editMutation.isPending}
                  />
                ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
              Completed
            </h2>
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-gray-50">
              {tasks
                .filter(t => t.completed)
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onSave={payload => editMutation.mutate(payload)}
                    isDeleting={deleteMutation.isPending}
                    isSaving={editMutation.isPending}
                    className="opacity-80"
                  />
                ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
