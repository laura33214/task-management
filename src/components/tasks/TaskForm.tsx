'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { trpc } from '@/utils/trpc';
import { useTaskStore } from '@/store/taskStore';
import type { Priority } from '@prisma/client';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { DateInput } from '@/components/ui/DateInput';

interface TaskFormProps {
  className?: string;
}

const TaskForm = ({ className }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState(''); // yyyy-mm-dd
  const addTask = useTaskStore(s => s.addTask);

  const createMutation = trpc.task.createTask.useMutation({
    onSuccess(task) {
      addTask(task);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate('');
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={className}
      aria-label="Create task form"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            aria-label="Task title"
            required
            minLength={1}
            maxLength={255}
          />
        </div>
        <div className="sm:col-span-2">
          <Select
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            aria-label="Priority"
          >
            <option value="LOW">🔵 Low</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="HIGH">🟠 High</option>
            <option value="URGENT">🔴 Urgent</option>
          </Select>
        </div>
        <div className="sm:col-span-1">
          <DateInput
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            aria-label="Due date"
          />
        </div>
        <div className="sm:col-span-6">
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            aria-label="Task description"
            rows={2}
          />
        </div>
        <div className="flex justify-end sm:col-span-6">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            aria-busy={createMutation.isPending}
          >
            {createMutation.isPending ? 'Adding…' : 'Add task'}
          </Button>
        </div>
      </div>
      {createMutation.error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {createMutation.error.message || 'Failed to create task'}
        </p>
      ) : null}
    </form>
  );
};

export default TaskForm;
