import React from 'react';
import TaskList from './TaskList';
import { Task, Stats } from '../types';

interface DashboardProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  stats: Stats;
  onTaskStart: (task: Task) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, setTasks, stats, onTaskStart }) => {
  return (
    <div className="dashboard-container"> {/* Custom class */}
        <div className="dashboard-header-card"> {/* Custom class */}
            <h2 className="dashboard-header-title">Focus Dashboard</h2> {/* Custom class */}
            <p className="dashboard-header-subtitle">Select a task to begin a focus session.</p> {/* Custom class */}
        </div>
        <div className="dashboard-content-area"> {/* Custom class */}
            <TaskList tasks={tasks} setTasks={setTasks} onTaskStart={onTaskStart} />
            <div className="quick-stats-card"> {/* Custom class */}
                <h3 className="quick-stats-title">Quick Stats</h3> {/* Custom class */}
                <div className="quick-stats-list"> {/* Custom class */}
                    <p>Completed: <span className="quick-stats-value-brand">{stats.completedSessions}</span></p> {/* Custom class */}
                    <p>Interrupted: <span className="quick-stats-value-slate">{stats.interruptedSessions}</span></p> {/* Custom class */}
                    <p>Total Focus: <span className="quick-stats-value-brand">{stats.totalFocusTime}</span> min</p> {/* Custom class */}
                    {/* Removed focusPoints as it's no longer part of the gamification */}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;