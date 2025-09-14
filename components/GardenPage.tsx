import React from 'react';
import GardenView from './GardenView';
import GardenStore from './GardenStore';
import { Stats } from '../types';

interface GardenPageProps {
  stats: Stats;
  setStats: (stats: Stats) => void;
  purchasedAssets: string[];
  setPurchasedAssets: (assets: string[]) => void;
}

const GardenPage: React.FC<GardenPageProps> = ({ stats, setStats, purchasedAssets, setPurchasedAssets }) => {

  const handlePurchase = (itemId: string, cost: number) => {
    if ((stats.focusPoints || 0) >= cost && !purchasedAssets.includes(itemId)) {
      setStats({
        ...stats,
        focusPoints: (stats.focusPoints || 0) - cost,
      });
      setPurchasedAssets([...purchasedAssets, itemId]);
    }
  };

  return (
    <div className="space-y-6">
      <GardenView purchasedAssets={purchasedAssets} />
      <GardenStore
        stats={stats}
        purchasedAssets={purchasedAssets}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default GardenPage;
