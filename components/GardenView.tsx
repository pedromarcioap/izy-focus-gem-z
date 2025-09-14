

import React, { CSSProperties } from 'react';
import {
  IsometricGardenBase,
  IsometricTree1,
  IsometricTree2,
  IsometricFlowers,
  IsometricPond,
  IsometricRock,
} from './GardenAssets';

interface GardenViewProps {
    purchasedAssets: string[];
}

const ASSET_MAP: { [key: string]: React.FC<{ style: CSSProperties }> } = {
    'tree1': IsometricTree1,
    'tree2': IsometricTree2,
    'flowers': IsometricFlowers,
    'rock': IsometricRock,
    'pond': IsometricPond,
};

// Define fixed positions for each asset to make the garden look curated
const ASSET_POSITIONS: { [key: string]: CSSProperties } = {
    'pond': { top: '50%', left: '50%', width: '30%' },
    'tree1': { top: '35%', left: '20%', width: '18%' },
    'tree2': { top: '25%', left: '75%', width: '20%' },
    'flowers': { top: '70%', left: '30%', width: '15%' },
    'rock': { top: '65%', left: '80%', width: '12%' },
};

const GardenView: React.FC<GardenViewProps> = ({ purchasedAssets }) => {
  return (
    <div className="bg-light-navy p-4 sm:p-6 rounded-lg border border-lightest-navy/20">
      <div className="relative w-full aspect-[2/1] bg-navy rounded-lg p-4 overflow-hidden mb-4 flex items-center justify-center">
        <IsometricGardenBase />
        {purchasedAssets.map(assetId => {
          const AssetComponent = ASSET_MAP[assetId];
          const style = ASSET_POSITIONS[assetId];
          if (!AssetComponent || !style) return null;
          return <AssetComponent key={assetId} style={style} />;
        })}
        <div className="absolute top-2 left-3 text-lightest-slate font-bold text-sm">
          Your Focus Garden
        </div>
      </div>
    </div>
  );
};

export default GardenView;