import React from 'react';

interface ControlsStripProps {
  currentFilter: string;
  searchQuery: string;
  selectedNiche: string;
  currentView: 'table' | 'kanban';
  counts: {
    all: number;
    replied: number;
    awaiting: number;
    ready: number;
    discussion: number;
    won: number;
  };
  onSetFilter: (filter: string) => void;
  onSetSearch: (query: string) => void;
  onSetNiche: (niche: string) => void;
  onSwitchView: (view: 'table' | 'kanban') => void;
}

export const ControlsStrip: React.FC<ControlsStripProps> = ({
  currentFilter,
  searchQuery,
  selectedNiche,
  currentView,
  counts,
  onSetFilter,
  onSetSearch,
  onSetNiche,
  onSwitchView,
}) => {
  const pills = [
    { key: 'ALL', label: 'All', count: counts.all },
    { key: 'REPLIED', label: '💬 Replied', count: counts.replied },
    { key: 'AWAITING', label: '⏳ Awaiting Reply', count: counts.awaiting },
    { key: 'READY', label: '🚀 Ready to Pitch', count: counts.ready },
    { key: 'DISCUSSION', label: '🎬 In Discussion', count: counts.discussion },
    { key: 'WON', label: '🏆 Won', count: counts.won },
  ];

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 18px',
      marginBottom: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Pills with wrapping */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        alignItems: 'center',
        width: 'auto',
        maxWidth: '100%'
      }}>
        {pills.map(p => {
          const isActive = currentFilter === p.key;
          return (
            <button
              key={p.key}
              onClick={() => onSetFilter(p.key)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.74rem',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '30px',
                background: isActive ? 'var(--text)' : 'var(--bg)',
                color: isActive ? 'var(--bg)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isActive ? 'var(--text)' : 'var(--border)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              <span>{p.label}</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                opacity: 0.85
              }}>
                {p.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search, Niche & View Switcher */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '180px' }}>
          <input
            type="text"
            placeholder="Search clinic, doctor, phone..."
            value={searchQuery}
            onChange={(e) => onSetSearch(e.target.value)}
            style={{
              padding: '7px 12px 7px 30px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '0.78rem',
              width: '100%',
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', left: '9px', top: '7px', fontSize: '0.8rem', opacity: 0.6 }}>🔍</span>
        </div>

        {/* Niche select */}
        <select
          value={selectedNiche}
          onChange={(e) => onSetNiche(e.target.value)}
          style={{
            padding: '7px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontSize: '0.78rem',
            outline: 'none'
          }}
        >
          <option value="ALL">All Industries</option>
          <option value="Dental">Dentistry & Implants</option>
          <option value="Aesthetic">Aesthetic & Dermatology</option>
          <option value="Interior">Interior Design</option>
          <option value="Real Estate">Luxury Real Estate</option>
          <option value="Salon">Luxury Salon & Spa</option>
        </select>

        {/* View Switcher */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '2px'
        }}>
          <button
            onClick={() => onSwitchView('table')}
            style={{
              padding: '5px 10px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              background: currentView === 'table' ? 'var(--surface)' : 'transparent',
              color: currentView === 'table' ? 'var(--text)' : 'var(--text-tertiary)',
              boxShadow: currentView === 'table' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            ☰ List
          </button>
          <button
            onClick={() => onSwitchView('kanban')}
            style={{
              padding: '5px 10px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              background: currentView === 'kanban' ? 'var(--surface)' : 'transparent',
              color: currentView === 'kanban' ? 'var(--text)' : 'var(--text-tertiary)',
              boxShadow: currentView === 'kanban' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            ▥ Kanban
          </button>
        </div>
      </div>
    </div>
  );
};

