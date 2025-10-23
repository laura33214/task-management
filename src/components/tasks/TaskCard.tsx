'use client';

import { useState } from 'react';
import type { Task, Priority } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { DateInput } from '@/components/ui/DateInput';

export interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onSave: (payload: {
    id: string;
    title?: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
  }) => void;
  isDeleting?: boolean;
  isSaving?: boolean;
  className?: string;
}

function fmtDate(d?: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : '';
}

function priorityBadgeClasses(p: Priority) {
  switch (p) {
    case 'LOW':
      return 'bg-green-100 text-green-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'URGENT':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
  onSave,
  isDeleting,
  isSaving,
  className,
}: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState<string>(fmtDate(task.dueDate));

  function handleSave() {
    onSave({
      id: task.id,
      title: title.trim() || undefined,
      description: description.trim(),
      priority,
      dueDate: dueDate || undefined,
    });
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPriority(task.priority);
    setDueDate(fmtDate(task.dueDate));
  }

  return (
    <li
      className={`flex items-start gap-3 p-3 sm:p-4 ${className ?? ''}`}
      role="listitem"
    >
      <input
        aria-label={task.completed ? 'Mark as open' : 'Mark as done'}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      {editing ? (
        <div className="flex w-full flex-col gap-3">
          <Input
            className=""
            value={title}
            onChange={e => setTitle(e.target.value)}
            aria-label="Edit title"
            placeholder="Task title"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Select
                aria-label="Edit priority"
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
              >
                <option value="LOW">🔵 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="URGENT">🔴 Urgent</option>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <DateInput
                aria-label="Edit due date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`truncate text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
            >
              {task.title}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadgeClasses(task.priority)}`}
            >
              {task.priority}
            </span>
          </div>
          {task.description ? (
            <span className="truncate text-xs text-gray-500">
              {task.description}
            </span>
          ) : null}
          <div className="flex gap-3 text-xs text-gray-500">
            {task.dueDate ? (
              <span>Due: {fmtDate(task.dueDate)}</span>
            ) : (
              <span className="italic">No due date</span>
            )}
          </div>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {editing ? (
          <>
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={isSaving}
              aria-label="Save changes"
            >
              Save
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => setEditing(true)}
              aria-label={`Edit ${task.title}`}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              aria-label={`Delete ${task.title}`}
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
