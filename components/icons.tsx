

import React from 'react';

interface IconProps {
    className?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const StopIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

export const AddIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

interface PlantIconProps extends IconProps {
    level?: number;
}

export const PlantIcon: React.FC<PlantIconProps> = ({ level = 0, className }) => {
  const plantLevels = [
    // Level 0: Seedling
    <path key="0" d="M12 16v-1c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v1H10v-1c0-1.1.9-2 2-2h0c.55 0 1 .45 1 1" fill="currentColor" />,
    // Level 1: Sprout
    <g key="1">
      <path d="M12 18v-6" />
      <path d="M12 12c-1.1 0-2-.9-2-2s2-4 2-4s2 1.9 2 4s-.9 2-2 2z" fill="currentColor" />
    </g>,
    // Level 2: Small plant
    <g key="2">
      <path d="M12 20v-9" />
      <path d="M12 11c-2.21 0-4-1.79-4-4s4-6 4-6s4 3.79 4 6-1.79 4-4 4z" fill="currentColor" />
      <path d="M15 14s-2-1-2-3" />
      <path d="M9 14s2-1 2-3" />
    </g>,
    // Level 3: Bushy plant
    <g key="3">
      <path d="M12 22v-12" />
      <path d="M12 10a5 5 0 0 0-5 5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3a5 5 0 0 0-5-5z" fill="currentColor" />
      <path d="M17 15s-2-1.5-2-4" />
      <path d="M7 15s2-1.5 2-4" />
    </g>,
    // Level 4: Tree
    <g key="4">
      <path d="M12 22V10" strokeWidth="2" />
      <path d="M12 10C8.69 10 6 7.31 6 4s2.69-4 6-4s6 2.69 6 4-2.69 6-6 6z" fill="currentColor" />
    </g>
  ];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {plantLevels[level] || plantLevels[0]}
    </svg>
  );
};