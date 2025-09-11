

import React from 'react';
import { HomeIcon, ChartIcon } from './icons';
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
    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
      view === targetView
        ? 'bg-brand text-navy'
        : 'text-lightest-slate hover:bg-light-navy hover:text-brand'
    }`}
    aria-current={view === targetView ? 'page' : undefined}
  >
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-light-navy/80 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0">
      <nav className="flex justify-between items-center p-3">
        <h1 className="text-lg font-bold text-lightest-slate tracking-tighter">
          Izy <span className="text-brand">Focus</span>
        </h1>
        <div className="flex items-center gap-2">
          <NavButton view={currentView} targetView="DASHBOARD" onClick={() => setView('DASHBOARD')}>
            <HomeIcon className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </NavButton>
          <NavButton view={currentView} targetView="STATS" onClick={() => setView('STATS')}>
            <ChartIcon className="w-5 h-5" />
            <span className="text-xs">Stats</span>
          </NavButton>
        </div>
      </nav>
    </header>
  );
};

export default Header;