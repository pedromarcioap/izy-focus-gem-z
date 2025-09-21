import React from 'react';
import { HomeIcon, ChartIcon, SettingsIcon, PlantIcon } from './icons';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

interface NavButtonProps {
  view: View;
  targetView: View;
  onClick: () => void;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ view, targetView, onClick, children }) => (
  <button
    onClick={onClick}
    className={`nav-button ${view === targetView ? 'nav-button-active' : ''}`}
    aria-current={view === targetView ? 'page' : undefined}
  >
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="app-header">
      <nav className="header-nav">
        <h1 className="header-title">
          Izy <span className="header-title-brand">Focus</span>
        </h1>
        <div className="nav-buttons-container">
          <NavButton view={currentView} targetView="DASHBOARD" onClick={() => setView('DASHBOARD')}>
            <HomeIcon className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavButton>
          <NavButton view={currentView} targetView="STATS" onClick={() => setView('STATS')}>
            <ChartIcon className="nav-icon" />
            <span className="nav-text">Stats</span>
          </NavButton>
          <NavButton view={currentView} targetView="GARDEN" onClick={() => setView('GARDEN')}>
            <PlantIcon className="nav-icon" />
            <span className="nav-text">Garden</span>
          </NavButton>
          <NavButton view={currentView} targetView="AI_SETTINGS" onClick={() => setView('AI_SETTINGS')}>
            <SettingsIcon className="nav-icon" />
            <span className="nav-text">AI Settings</span>
          </NavButton>
          <NavButton view={currentView} targetView="SETTINGS" onClick={() => setView('SETTINGS')}>
            <SettingsIcon className="nav-icon" />
            <span className="nav-text">Settings</span>
          </NavButton>
        </div>
      </nav>
    </header>
  );
};

export default Header;