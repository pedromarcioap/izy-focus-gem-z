

import React, { useState } from 'react';
import { PlayIcon, EditIcon, DeleteIcon, AddIcon } from './icons';
import TaskModal from './TaskModal';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onTaskStart: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, onTaskStart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSaveTask = (task: Omit<Task, 'id'> & { id?: string }) => {
    if (editingTask && task.id) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, ...task } : t));
    } else {
      setTasks([...tasks, { ...task, id: `task-${Date.now()}` }]);
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
        setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  return (
    <div className="bg-light-navy p-6 rounded-lg border border-lightest-navy/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-lightest-slate">Focus Tasks</h2>
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-brand text-navy px-3 py-2 rounded-md font-bold hover:bg-opacity-80 transition-all"
        >
          <AddIcon className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>
      <div className="space-y-3">
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task.id} className="bg-navy p-4 rounded-md flex items-center justify-between transition-all hover:shadow-lg hover:shadow-brand/10">
            <div>
              <p className="font-bold text-light-slate">{task.name}</p>
              <p className="text-sm text-slate">{task.duration} minutes</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(task)} className="p-2 text-slate hover:text-brand transition-colors"><EditIcon className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(task.id)} className="p-2 text-slate hover:text-red-500 transition-colors"><DeleteIcon className="w-5 h-5" /></button>
              <button onClick={() => onTaskStart(task)} className="p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/20 transition-colors">
                <PlayIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )) : (
            <p className="text-slate text-center py-6">No tasks yet. Create one to get started!</p>
        )}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default TaskList;