import React, { useState } from 'react';
import { DeleteIcon } from './icons';

interface BlocklistManagerProps {
  blockedSites: string[];
  setBlockedSites: (sites: string[]) => void;
}

const BlocklistManager: React.FC<BlocklistManagerProps> = ({ blockedSites, setBlockedSites }) => {
  const [newSite, setNewSite] = useState('');

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Normalize the domain: remove protocol, www, and path.
      const normalizedSite = new URL(newSite.startsWith('http') ? newSite : `https://${newSite}`).hostname.replace(/^www\./, '');

      if (normalizedSite && !blockedSites.includes(normalizedSite)) {
        setBlockedSites([...blockedSites, normalizedSite]);
        setNewSite('');
      }
    } catch (error) {
      // Handle invalid URL input gracefully
      console.warn("Invalid URL entered:", newSite);
      // Maybe show an error to the user in the future
    }
  };

  const handleRemoveSite = (siteToRemove: string) => {
    setBlockedSites(blockedSites.filter(site => site !== siteToRemove));
  };

  return (
    <div className="dashboard-container">
        <div className="dashboard-header-card">
            <h2 className="dashboard-header-title">Site Blocklist</h2>
            <p className="dashboard-header-subtitle">Sites in this list will be blocked during focus sessions.</p>
        </div>
        <div className="mt-6 bg-light-navy p-6 rounded-lg border border-lightest-navy/20">
            <form onSubmit={handleAddSite} className="flex gap-2 mb-4">
                <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                className="input-base flex-grow rounded-full px-4 py-2 border border-brand focus:ring-2 focus:ring-brand bg-navy text-lightest-slate shadow-sm"
                placeholder="e.g., twitter.com"
                />
                <button type="submit" className="button-primary rounded-full px-4 py-2 bg-brand text-navy font-bold hover:bg-opacity-80 transition-colors shadow-sm">
                Adicionar
                </button>
            </form>

            <div className="space-y-2">
                {blockedSites.length > 0 ? (
                blockedSites.map(site => (
                    <div key={site} className="bg-navy p-3 rounded-md flex items-center justify-between">
                    <p className="font-mono text-light-slate truncate">{site}</p>
                    <button
                        className="button-secondary text-slate hover:text-brand transition-colors flex-shrink-0 mr-2"
                        title="Editar site da lista"
                        aria-label={`Editar ${site}`}
                        style={{background:'#1E293B',border:'1px solid #334155',padding:'0.5rem',borderRadius:'0.75rem',marginLeft:'0.5rem'}}
                    >
                        <EditIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleRemoveSite(site)}
                        className="button-secondary text-slate hover:text-error transition-colors flex-shrink-0"
                        title="Remover site da lista"
                        aria-label={`Remover ${site}`}
                        style={{background:'#1E293B',border:'1px solid #334155',padding:'0.5rem',borderRadius:'0.75rem',marginLeft:'0.5rem'}}
                    >
                        <DeleteIcon className="w-5 h-5" />
                    </button>
                    </div>
                ))
                ) : (
                <p className="text-slate text-center py-4">No sites in your blocklist yet.</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default BlocklistManager;
