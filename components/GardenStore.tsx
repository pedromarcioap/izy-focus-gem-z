import React from 'react';
import { GARDEN_STORE_ITEMS } from '../constants';
import { Stats } from '../types';

interface GardenStoreProps {
  stats: Stats;
  purchasedAssets: string[];
  onPurchase: (itemId: string, cost: number) => void;
}

const GardenStore: React.FC<GardenStoreProps> = ({ stats, purchasedAssets, onPurchase }) => {
  return (
    <div className="bg-light-navy p-6 rounded-lg border border-lightest-navy/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-lightest-slate">Garden Store</h2>
        <div className="text-lg font-bold text-yellow-400">
          {stats.focusPoints || 0} ✨
        </div>
      </div>
      <p className="text-sm text-slate mb-4">Spend your Focus Points to buy new items for your garden!</p>

      <div className="space-y-3">
        {GARDEN_STORE_ITEMS.map(item => {
          const isPurchased = purchasedAssets.includes(item.id);
          const canAfford = (stats.focusPoints || 0) >= item.cost;

          return (
            <div key={item.id} className={`bg-navy p-4 rounded-md flex items-center justify-between ${isPurchased ? 'opacity-50' : ''}`}>
              <div>
                <p className="font-bold text-light-slate">{item.name}</p>
                <p className="text-sm text-yellow-400">{item.cost} points</p>
              </div>
              <button
                onClick={() => onPurchase(item.id, item.cost)}
                disabled={isPurchased || !canAfford}
                className="px-4 py-2 rounded-md bg-brand text-navy font-bold hover:bg-opacity-80 transition-colors disabled:bg-slate disabled:cursor-not-allowed"
              >
                {isPurchased ? 'Owned' : 'Buy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GardenStore;
