import React from 'react';
import { AnalyticsResponse } from '../types/crm';

interface NicheAnalyticsPanelProps {
  analytics: AnalyticsResponse;
  isOpen: boolean;
  onClose: () => void;
}

const NICHE_ICONS: Record<string, string> = {
  'Dental': '🦷',
  'Aesthetic & Dermatology': '✨',
  'Interior Design': '🛋️',
  'Real Estate': '🏢',
  'Salon & Grooming': '✂️',
  'Other': '💼',
};

export const NicheAnalyticsPanel: React.FC<NicheAnalyticsPanelProps> = ({
  analytics,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '22px',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 18px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span>
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)' }}>
            Niche Conversion & Performance Analytics
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            fontSize: '0.74rem',
            padding: '4px 8px',
            borderRadius: '6px',
            color: 'var(--text-secondary)'
          }}
        >
          ✕ Close
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        padding: '16px 18px'
      }}>
        {analytics.categories.map(cat => {
          const icon = NICHE_ICONS[cat.category] || '💼';
          const total = cat.total || 1;
          const sentPct = Math.round((cat.pitched / total) * 100);
          const repPct = Math.round((cat.replied / total) * 100);
          const wonPct = Math.round((cat.closed_won / total) * 100);

          return (
            <div
              key={cat.category}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span>{icon}</span>
                <span style={{ flex: 1, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>
                  {cat.category}
                </span>
                <span style={{
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: 'var(--sage-green-soft)',
                  color: 'var(--sage-green)',
                  border: '1px solid var(--sage-green-border)'
                }}>
                  {cat.reply_rate}% Reply
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '70px', color: 'var(--text-secondary)' }}>Total Leads</span>
                  <div style={{ flex: 1, height: '7px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--text-tertiary)' }} />
                  </div>
                  <span style={{ width: '24px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cat.total}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '70px', color: 'var(--text-secondary)' }}>Pitched</span>
                  <div style={{ flex: 1, height: '7px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${sentPct}%`, height: '100%', background: '#25D366' }} />
                  </div>
                  <span style={{ width: '24px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cat.pitched}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '70px', color: 'var(--text-secondary)' }}>Replied</span>
                  <div style={{ flex: 1, height: '7px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${repPct}%`, height: '100%', background: 'var(--sage-green)' }} />
                  </div>
                  <span style={{ width: '24px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cat.replied}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '70px', color: 'var(--text-secondary)' }}>Closed Won</span>
                  <div style={{ flex: 1, height: '7px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${wonPct}%`, height: '100%', background: 'var(--amber-warm)' }} />
                  </div>
                  <span style={{ width: '24px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cat.closed_won}</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.72rem'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Won: <strong style={{ color: 'var(--terracotta)' }}>₹{cat.revenue.toLocaleString('en-IN')}</strong>
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Pipeline: <strong style={{ color: 'var(--text)' }}>₹{cat.pipeline_value.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

