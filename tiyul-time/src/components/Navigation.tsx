import { Mountain } from 'lucide-react';
import type { ActiveTab } from '../types';
import { motion } from 'framer-motion';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const tabs: { id: ActiveTab; label: string }[] = [
  { id: 'hikes', label: 'My Hikes' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'map', label: 'Map' },
];

export function Navigation({ activeTab, setActiveTab }: Props) {
  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201, 168, 76, 0.2)', border: '1px solid rgba(201, 168, 76, 0.4)' }}>
            <Mountain size={20} style={{ color: '#c9a84c' }} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold leading-none" style={{ color: '#e8f0e9' }}>
              Tiyul Time
            </h1>
            <p className="text-xs leading-none mt-0.5" style={{ color: '#8aab8f' }}>טיול טיים</p>
          </div>
        </div>

        <nav className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(15, 35, 20, 0.6)', border: '1px solid rgba(106, 171, 122, 0.15)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: activeTab === tab.id ? '#0a1a0f' : '#8aab8f' }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: '#c9a84c' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
