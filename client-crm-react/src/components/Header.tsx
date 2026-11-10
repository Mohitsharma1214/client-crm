import React from 'react';

interface HeaderProps {
  unsentCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenBulkModal: () => void;
  onOpenAddModal: () => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unsentCount,
  theme,
  onToggleTheme,
  onOpenBulkModal,
  onOpenAddModal,
  onDownloadZip,
}) => {
  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'var(--terracotta)',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: '1.1rem'
        }}>*</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Client CRM</span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              padding: '2px 6px',
              borderRadius: '4px',
              color: 'var(--text-secondary)'
            }}>REACT TS</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Neon Database badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 10px',
          borderRadius: '20px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#25D366' }}></span>
          <span>Neon PostgreSQL</span>
        </div>

        {/* 1-Click WhatsApp Blast CTA */}
        <button
          onClick={onOpenBulkModal}
          style={{
            background: '#25D366',
            color: '#FFFFFF',
            border: '1px solid #20BA5A',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            boxShadow: '0 1px 3px rgba(37, 211, 102, 0.28)',
            transition: 'all 0.15s ease'
          }}
          title="1-Click WhatsApp outreach to all unsent clients"
        >
          <span>⚡ Send All Unsent ({unsentCount})</span>
        </button>

        {/* Download Zip CTA */}
        <button
          onClick={onDownloadZip}
          style={{
            background: 'var(--bg-subtle)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            transition: 'all 0.15s ease'
          }}
          title="Download complete React TypeScript codebase as ZIP"
        >
          <span>📥 Download React App</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.85rem'
          }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Add New Client CTA */}
        <button
          onClick={onOpenAddModal}
          style={{
            background: 'var(--terracotta)',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.78rem'
          }}
        >
          <span>+</span> Add Client
        </button>
      </div>
    </header>
  );
};

