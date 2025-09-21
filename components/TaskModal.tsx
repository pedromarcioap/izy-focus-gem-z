

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> & { id?: string }) => void;
  task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    if (task && isOpen) {
      setName(task.name);
      setDuration(task.duration);
    } else {
      setName('');
      setDuration(25);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: task ? task.id : undefined,
      name,
      duration,
    });
    onClose();
  };

  // Render modal as a portal directly in the body
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-light-navy p-8 rounded-2xl shadow-xl w-full max-w-md m-4 border border-lightest-navy/30 animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate hover:text-error text-2xl font-bold focus:outline-none"
          aria-label="Fechar modal"
        >×</button>
        <h2 className="text-2xl font-bold mb-6 text-lightest-slate">{task ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-name" className="block text-sm font-medium text-light-slate mb-1">Task Name</label>
            <input
              type="text"
              id="task-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-navy border border-brand rounded-full p-3 text-lightest-slate focus:ring-2 focus:ring-brand focus:outline-none shadow-sm text-base"
              placeholder="e.g., Design Sprint"
            />
          </div>
          <div>
            <label htmlFor="task-duration" className="block text-sm font-medium text-light-slate mb-1">Duration (minutes)</label>
            <input
              type="number"
              id="task-duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
              min="1"
              max="180"
              className="w-full bg-navy border border-brand rounded-full p-3 text-lightest-slate focus:ring-2 focus:ring-brand focus:outline-none shadow-sm text-base"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full text-slate hover:bg-lightest-navy transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-brand text-navy font-bold hover:bg-opacity-80 transition-colors shadow">Salvar</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;