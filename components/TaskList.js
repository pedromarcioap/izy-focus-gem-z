

import React, { useState } from '../react.js';
import { PlayIcon, EditIcon, DeleteIcon, AddIcon } from './icons.js';
import TaskModal from './TaskModal.js';

const TaskList = ({ tasks, setTasks, onTaskStart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleSaveTask = (task) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, { ...task, id: `task-${Date.now()}` }]);
    }
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
        setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  return (
    React.createElement("div", { className: "bg-light-navy p-6 rounded-lg border border-lightest-navy/20" },
      React.createElement("div", { className: "flex justify-between items-center mb-4" },
        React.createElement("h2", { className: "text-xl font-bold text-lightest-slate" }, "Focus Tasks"),
        React.createElement("button", {
          onClick: () => { setEditingTask(null); setIsModalOpen(true); },
          className: "flex items-center gap-2 bg-brand text-navy px-3 py-2 rounded-md font-bold hover:bg-opacity-80 transition-all"
        },
          React.createElement(AddIcon, { className: "w-5 h-5" }),
          React.createElement("span", null, "New Task")
        )
      ),
      React.createElement("div", { className: "space-y-3" },
        tasks.length > 0 ? tasks.map(task => (
          React.createElement("div", { key: task.id, className: "bg-navy p-4 rounded-md flex items-center justify-between transition-all hover:shadow-lg hover:shadow-brand/10" },
            React.createElement("div", null,
              React.createElement("p", { className: "font-bold text-light-slate" }, task.name),
              React.createElement("p", { className: "text-sm text-slate" }, task.duration, " minutes")
            ),
            React.createElement("div", { className: "flex items-center gap-2" },
              React.createElement("button", { onClick: () => handleEdit(task), className: "p-2 text-slate hover:text-brand transition-colors" }, React.createElement(EditIcon, { className: "w-5 h-5" })),
              React.createElement("button", { onClick: () => handleDelete(task.id), className: "p-2 text-slate hover:text-red-500 transition-colors" }, React.createElement(DeleteIcon, { className: "w-5 h-5" })),
              React.createElement("button", { onClick: () => onTaskStart(task), className: "p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/20 transition-colors" },
                React.createElement(PlayIcon, { className: "w-6 h-6" })
              )
            )
          )
        )) : (
            React.createElement("p", { className: "text-slate text-center py-6" }, "No tasks yet. Create one to get started!")
        )
      ),
      React.createElement(TaskModal, {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        onSave: handleSaveTask,
        task: editingTask
      })
    )
  );
};

export default TaskList;