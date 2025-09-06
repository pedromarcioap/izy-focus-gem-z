

// @ts-ignore
import React from '../react.js';
import TaskList from './TaskList.tsx';

const Dashboard = (props) => {
  const { tasks, setTasks, stats, onTaskStart } = props;

  return (
    React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "text-center p-4 bg-light-navy rounded-lg border border-lightest-navy/20" },
            React.createElement("h2", { className: "text-xl font-bold text-lightest-slate" }, "Focus Dashboard"),
            React.createElement("p", { className: "text-slate text-sm mt-1 max-w-2xl mx-auto" }, "Select a task to begin a focus session.")
        ),
        React.createElement("div", { className: "space-y-6" },
            React.createElement(TaskList, { tasks: tasks, setTasks: setTasks, onTaskStart: onTaskStart }),
            React.createElement("div", { className: "p-4 bg-light-navy rounded-lg border border-lightest-navy/20" },
                React.createElement("h3", { className: "font-bold text-lightest-slate mb-2" }, "Quick Stats"),
                React.createElement("div", { className: "space-y-1 text-sm" },
                    React.createElement("p", null, "Completed: ", React.createElement("span", { className: "font-bold text-brand" }, stats.completedSessions)),
                    React.createElement("p", null, "Interrupted: ", React.createElement("span", { className: "font-bold text-slate" }, stats.interruptedSessions)),
                    React.createElement("p", null, "Total Focus: ", React.createElement("span", { className: "font-bold text-brand" }, stats.totalFocusTime), " min")
                )
            )
        )
    )
  );
};

export default Dashboard;