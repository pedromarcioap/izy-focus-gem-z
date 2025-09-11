

import React, { CSSProperties } from 'react';

const assetStyle: CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  transition: 'all 0.5s ease-in-out',
  opacity: 0,
  animation: 'fadeIn 0.5s ease-out forwards',
};

const keyframes = `
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
`;

export const IsometricGardenBase: React.FC = () => (
  <div className="absolute w-10/12 h-10/12">
    <style>{keyframes}</style>
    <svg viewBox="0 0 200 100" className="w-full h-full">
      <polygon points="100,0 200,50 100,100 0,50" className="fill-green-800/50 stroke-green-900/50 stroke-1" />
    </svg>
  </div>
);

interface AssetProps {
    style: CSSProperties;
}

export const IsometricTree1: React.FC<AssetProps> = ({ style }) => (
    <div style={{ ...assetStyle, ...style }}>
        <svg viewBox="0 0 100 100">
            {/* Trunk */}
            <rect x="46" y="70" width="8" height="30" className="fill-yellow-900/80" />
            {/* Leaves */}
            <circle cx="50" cy="45" r="30" className="fill-green-500" />
            <circle cx="65" cy="55" r="20" className="fill-green-600/70" />
            <circle cx="35" cy="55" r="20" className="fill-green-600/70" />
        </svg>
    </div>
);

export const IsometricTree2: React.FC<AssetProps> = ({ style }) => (
    <div style={{ ...assetStyle, ...style }}>
        <svg viewBox="0 0 100 100">
            {/* Trunk */}
            <rect x="47" y="80" width="6" height="20" className="fill-yellow-900" />
            {/* Leaves */}
            <polygon points="50,10 75,50 25,50" className="fill-green-700" />
            <polygon points="50,30 80,70 20,70" className="fill-green-600" />
            <polygon points="50,50 85,90 15,90" className="fill-green-500" />
        </svg>
    </div>
);

export const IsometricFlowers: React.FC<AssetProps> = ({ style }) => (
    <div style={{ ...assetStyle, ...style }}>
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="8" className="fill-red-500" />
            <circle cx="65" cy="60" r="6" className="fill-yellow-400" />
            <circle cx="40" cy="65" r="7" className="fill-purple-500" />
            <circle cx="55" cy="75" r="8" className="fill-red-400" />
        </svg>
    </div>
);

export const IsometricRock: React.FC<AssetProps> = ({ style }) => (
    <div style={{ ...assetStyle, ...style }}>
        <svg viewBox="0 0 100 100">
            <path d="M20,80 Q50,50 80,80 Q60,95 40,95 Q20,90 20,80 Z" className="fill-slate/70" />
        </svg>
    </div>
);

export const IsometricPond: React.FC<AssetProps> = ({ style }) => (
    <div style={{ ...assetStyle, ...style }}>
        <svg viewBox="0 0 100 100">
             <ellipse cx="50" cy="50" rx="45" ry="25" className="fill-blue-500/80" />
             <ellipse cx="50" cy="50" rx="35" ry="20" className="fill-blue-400/90 animate-pulse" />
        </svg>
    </div>
);