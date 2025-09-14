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
    <div className="bg-light-navy p-6 rounded-lg border border-lightest-navy/20">
      <h2 className="text-xl font-bold text-lightest-slate mb-4">Site Blocklist</h2>
      <p className="text-sm text-slate mb-4">Sites in this list will be blocked during focus sessions.</p>

      <form onSubmit={handleAddSite} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          className="flex-grow bg-navy border border-lightest-navy rounded-md p-2 text-lightest-slate focus:ring-2 focus:ring-brand focus:outline-none"
          placeholder="e.g., twitter.com"
        />
        <button type="submit" className="px-4 py-2 rounded-md bg-brand text-navy font-bold hover:bg-opacity-80 transition-colors">
          Add
        </button>
      </form>

      <div className="space-y-2">
        {blockedSites.length > 0 ? (
          blockedSites.map(site => (
            <div key={site} className="bg-navy p-3 rounded-md flex items-center justify-between">
              <p className="font-mono text-light-slate">{site}</p>
              <button onClick={() => handleRemoveSite(site)} className="p-1 text-slate hover:text-red-500 transition-colors">
                <DeleteIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate text-center py-4">No sites in your blocklist yet.</p>
        )}
      </div>
    </div>
  );
};

export default BlocklistManager;
