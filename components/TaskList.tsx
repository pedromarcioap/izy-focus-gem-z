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
    <div className="task-list-container"> {/* Custom class */}
      <div className="task-list-header"> {/* Custom class */}
        <h2 className="task-list-title">Focus Tasks</h2> {/* Custom class */}
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="button-primary task-list-new-button" /* Use button-primary and override */
        >
          <AddIcon className="task-list-icon" /> {/* Custom class */}
          <span>New Task</span>
        </button>
      </div>
      <div className="task-list-items-container"> {/* Custom class */}
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task.id} className="task-item-card"> {/* Custom class */}
            <div className="task-item-details"> {/* Custom class */}
              <p className="task-item-name">{task.name}</p> {/* Custom class */}
              <p className="task-item-duration">{task.duration} minutes</p> {/* Custom class */}
            </div>
            <div className="task-item-actions"> {/* Custom class */}
              <button onClick={() => handleEdit(task)} className="task-action-button"> {/* Custom class */}
                <EditIcon className="task-action-icon" /> {/* Custom class */}
              </button>
              <button onClick={() => handleDelete(task.id)} className="task-action-button task-action-button-delete"> {/* Custom class */}
                <DeleteIcon className="task-action-icon" /> {/* Custom class */}
              </button>
              <button onClick={() => onTaskStart(task)} className="task-action-button task-action-button-play"> {/* Custom class */}
                <PlayIcon className="task-action-icon-play" /> {/* Custom class */}
              </button>
            </div>
          </div>
        )) : (
            <p className="task-list-empty-message" /* Custom class */>No tasks yet. Create one to get started!</p>
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
