import React, { CSSProperties } from 'react';
import {
  IsometricGardenBase,
  IsometricTree1,
  IsometricTree2,
  IsometricFlowers,
  IsometricPond,
  IsometricRock,
} from './GardenAssets';

import { SessionLog } from '../types';

interface GardenViewProps {
    totalFocusTime: number; // in minutes
    sessionLogs: SessionLog[];
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

const GROWTH_TIERS = [
    { threshold: 30, asset: 'flowers', name: 'Flowers 🌸' },
    { threshold: 60, asset: 'rock', name: 'Mossy Rock 🗿' },
    { threshold: 120, asset: 'tree1', name: 'Small Tree 🌳' },
    { threshold: 240, asset: 'tree2', name: 'Tall Tree 🌲' },
    { threshold: 480, asset: 'pond', name: 'Serene Pond 🌊' },
];

const GardenView: React.FC<GardenViewProps> = ({ totalFocusTime, sessionLogs }) => {
  // ==== Streak Calculation ====
  const streak = (() => {
    if (!sessionLogs.length) return 0;
    // Get unique days with at least 1 minute focused
    const days = Array.from(new Set(sessionLogs
      .filter(log => log.actualDuration > 0)
      .map(log => new Date(log.startTime).toISOString().split('T')[0]))).sort().reverse();
    let count = 0;
    let prev = new Date(days[0]);
    for (const day of days) {
      const d = new Date(day);
      if (count === 0 || prev.getTime() - d.getTime() === 86400000) {
        count++;
        prev = d;
      } else {
        break;
      }
    }
    return count;
  })();

  // ==== Level Calculation ====
  const level = Math.floor(totalFocusTime / 120) + 1; // 2h por nível
  const nextLevel = level * 120;
  const currentLevelProgress = totalFocusTime % 120;
  const progressPercent = Math.min(100, (currentLevelProgress / 120) * 100);

  // ==== Achievements ====
  const achievements = [
    { name: 'Primeira Planta', unlocked: totalFocusTime >= 30 },
    { name: 'Streak 3 Dias', unlocked: streak >= 3 },
    { name: 'Jardim Completo', unlocked: totalFocusTime >= 480 },
    { name: 'Foco Total 10h', unlocked: totalFocusTime >= 600 },
    { name: 'Streak 7 Dias', unlocked: streak >= 7 },
  ];
  console.log('GardenView: totalFocusTime received:', totalFocusTime); // Log 1

  const assetsToShow = GROWTH_TIERS
    .filter(tier => totalFocusTime >= tier.threshold)
    .map(tier => tier.asset);

  console.log('GardenView: assetsToShow:', assetsToShow); // Log 2

  return (
    <div className="bg-light-navy p-4 sm:p-6 rounded-lg border border-lightest-navy/20">
      <div className="relative w-full aspect-[2/1] bg-navy rounded-lg p-4 overflow-hidden mb-4 flex items-center justify-center">
        <IsometricGardenBase />
        {assetsToShow.map(assetId => {
          const AssetComponent = ASSET_MAP[assetId];
          const style = ASSET_POSITIONS[assetId];
          if (!AssetComponent || !style) {
            console.warn(`GardenView: Missing AssetComponent or style for ${assetId}`); // Log 3
            return null;
          }
          console.log(`GardenView: Rendering ${assetId} at style:`, style); // Log 4
          return <AssetComponent key={assetId} style={style} />; 
        })}
        <div className="absolute top-2 left-3 text-lightest-slate font-bold text-sm">
          Your Focus Garden
        </div>
        <div className="absolute bottom-2 right-3 text-lightest-slate font-semibold text-xs bg-navy/50 px-2 py-1 rounded-md">
          Total Focus: {Math.floor(totalFocusTime)} minutes
        </div>
      </div>
      <div className="text-center text-slate mt-4">
        <p className="font-bold text-light-slate">Your garden grows as you focus.</p>
        <p className="text-sm">Keep focusing to unlock new items and watch it flourish!</p>
      </div>

      {/* Barra de progresso e informações de gamificação */}
      <div className="mt-6 grid md:grid-cols-3 gap-6 text-center">
        <div>
          <h3 className="text-md font-bold text-lightest-slate mb-1">Streak de Dias</h3>
          <div className="text-3xl font-bold text-green-400">{streak}</div>
          <div className="text-xs text-slate">dias seguidos focando</div>
        </div>
        <div>
          <h3 className="text-md font-bold text-lightest-slate mb-1">Nível</h3>
          <div className="text-3xl font-bold text-brand">{level}</div>
          <div className="w-full bg-lightest-navy rounded-full h-2 mt-2 mb-1">
            <div className="bg-brand h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-xs text-slate">{Math.floor(currentLevelProgress)}/120 min para o próximo nível</div>
        </div>
        <div>
          <h3 className="text-md font-bold text-lightest-slate mb-1">Conquistas</h3>
          <ul className="text-xs space-y-1">
            {achievements.map(a => (
              <li key={a.name} className={a.unlocked ? 'text-green-400 font-bold' : 'text-slate-500'}>
                {a.unlocked ? '🏆 ' : '⬜ '} {a.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Itens desbloqueáveis do jardim */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-lightest-slate mb-2">Unlockable Items:</h3>
        <ul className="list-disc list-inside text-slate">
          {GROWTH_TIERS.map(tier => (
            <li key={tier.asset} className={totalFocusTime >= tier.threshold ? 'text-green-400' : 'text-slate-500'}>
              {tier.name} at {tier.threshold} minutes of focus
              {totalFocusTime >= tier.threshold && ' (Unlocked!)'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GardenView;
