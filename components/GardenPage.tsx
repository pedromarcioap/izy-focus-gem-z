import React from 'react';
import GardenView from './GardenView';
import { Stats } from '../types';

interface GardenPageProps {
  stats: Stats;
}

const GardenPage: React.FC<GardenPageProps> = ({ stats }) => {
  return (
    <div className="dashboard-container">
        <div className="dashboard-header-card">
            <h2 className="dashboard-header-title">Your Focus Garden</h2>
            <p className="dashboard-header-subtitle">Visualize your focus progress as a flourishing garden.</p>
        </div>
        <div className="dashboard-content-area">
            <GardenView totalFocusTime={stats.totalFocusTime} sessionLogs={stats.sessionLogs} />
        </div>
    </div>
  );
};

export default GardenPage;