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
    <header className="pt-10 pb-6 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="eyebrow mb-3">Trail Log</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: '#e8f0e9' }}>
          Tiyul Time
        </h1>
        <div className="mt-3 mb-4">
          <span className="hebrew-pill">תקופת טיולים</span>
        </div>
        <div className="hero-divider mb-6" />

        <nav className="flex items-center justify-center gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-underline ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label.toUpperCase()}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-underline-bar"
                  className="tab-underline-bar"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
