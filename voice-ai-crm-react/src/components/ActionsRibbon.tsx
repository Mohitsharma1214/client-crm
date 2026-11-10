import React from 'react';
import { Prospect, FollowUpBuckets } from '../types/crm';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface ActionsRibbonProps {
  followUps: FollowUpBuckets;
  isFollowUpOpen: boolean;
  activeBucket: 'overdue' | 'due_today' | 'upcoming' | 'all';
  onToggleFollowUp: (bucket?: 'overdue' | 'due_today' | 'upcoming') => void;
  onToggleAnalytics: () => void;
  onQuickReply: (lead: Prospect) => void;
  onRecordFollowUp: (leadId: string) => void;
  onBlastFollowUps: () => void;
}

export const ActionsRibbon: React.FC<ActionsRibbonProps> = ({
  followUps,
  isFollowUpOpen,
  activeBucket,
  onToggleFollowUp,
  onToggleAnalytics,
  onQuickReply,
  onRecordFollowUp,
  onBlastFollowUps,
}) => {
  const getDisplayedItems = (): Prospect[] => {
    if (activeBucket === 'overdue') return followUps.overdue;
    if (activeBucket === 'due_today') return followUps.due_today;
    if (activeBucket === 'upcoming') return followUps.upcoming;
    return [...followUps.overdue, ...followUps.due_today];
  };

  const displayedItems = getDisplayedItems();
  const actionableCount = followUps.overdue.length + followUps.due_today.length;

  return (
    <div style={{ marginBottom: '22px' }}>
      {/* 4 Action Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '10px',
        marginBottom: isFollowUpOpen ? '14px' : '0'
      }}>
        {/* Tile 1: Overdue */}
        <div
          onClick={() => onToggleFollowUp('overdue')}
          style={{
            background: 'var(--surface)',
            border: '1px solid #E53E3E',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
          title="Click to view overdue follow-ups"
        >
          <div style={{ fontSize: '1.4rem' }}>🔴</div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
              {followUps.overdue.length}
            </div>
            <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>
              Overdue Follow-Ups
            </div>
          </div>
        </div>

        {/* Tile 2: Due Today */}
        <div
          onClick={() => onToggleFollowUp('due_today')}
          style={{
            background: 'var(--surface)',
            border: '1px solid #DD6B20',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
          title="Click to view follow-ups due today"
        >
          <div style={{ fontSize: '1.4rem' }}>🟡</div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
              {followUps.due_today.length}
            </div>
            <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>
              Due Today
            </div>
          </div>
        </div>

        {/* Tile 3: Upcoming */}
        <div
          onClick={() => onToggleFollowUp('upcoming')}
          style={{
            background: 'var(--surface)',
            border: '1px solid #3182CE',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
          title="Click to view upcoming follow-ups"
        >
          <div style={{ fontSize: '1.4rem' }}>🔵</div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
              {followUps.upcoming.length}
            </div>
            <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>
              Upcoming (1-2d)
            </div>
          </div>
        </div>

        {/* Tile 4: Niche Analytics */}
        <div
          onClick={onToggleAnalytics}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--sage-green)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
          title="Click to view conversion analytics by vertical"
        >
          <div style={{ fontSize: '1.4rem' }}>📊</div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
              5
            </div>
            <div style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>
              Niche Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Follow-up action list */}
      {isFollowUpOpen && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          marginTop: '12px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏰</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                {activeBucket === 'overdue' ? '🔴 Overdue Follow-Ups' : activeBucket === 'due_today' ? '🟡 Follow-Ups Due Today' : 'Follow-Up Action Queue'}
              </span>
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'var(--terracotta-soft)',
                color: 'var(--terracotta)',
                border: '1px solid var(--terracotta)'
              }}>
                {displayedItems.length} Actionable
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={onBlastFollowUps}
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  border: '1px solid #20BA5A',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                ⚡ Blast Follow-Ups ({actionableCount})
              </button>
              <button
                onClick={() => onToggleFollowUp()}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  fontSize: '0.72rem',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)'
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {displayedItems.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>✨</div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>No clients in this follow-up queue!</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>All prospects in this category are up to date.</div>
              </div>
            ) : (
              displayedItems.map(lead => {
                const followUpMsg = lead.follow_up_message || `Hi ${lead.owner}! Just following up on my note regarding 24/7 AI lead capture for ${lead.business}. Mind if I send a 60-second interactive demo? 🙏`;
                const waUrl = buildWhatsAppUrl(lead.phone, followUpMsg);

                return (
                  <div
                    key={lead.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: activeBucket === 'overdue' ? '#E53E3E' : '#DD6B20',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span>{lead.business}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
                          {lead.phone}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        👤 {lead.owner} • 📍 {lead.location} • 🏷️ {lead.niche}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-tertiary)',
                        marginTop: '4px',
                        background: 'var(--bg)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)',
                        lineHeight: 1.35
                      }}>
                        💬 <em>"{followUpMsg}"</em>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button
                        onClick={() => onQuickReply(lead)}
                        style={{
                          background: 'var(--sage-green)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        title="1-Tap: Mark client as Replied!"
                      >
                        💬 Got Reply
                      </button>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onRecordFollowUp(lead.id)}
                        style={{
                          background: '#25D366',
                          color: '#FFFFFF',
                          border: '1px solid #20BA5A',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        ⚡ Follow-Up ↗
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

