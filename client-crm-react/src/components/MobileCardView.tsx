import React from 'react';
import { Prospect, PipelineStage } from '../types/crm';

interface MobileCardViewProps {
  leads: Prospect[];
  onOpenWhatsApp: (lead: Prospect) => void;
  onQuickReply: (lead: Prospect) => void;
  onChangeStage: (leadId: string, stage: PipelineStage) => void;
  onOpenEditModal: (lead: Prospect) => void;
  onCopyPitch: (pitch: string) => void;
}

export const MobileCardView: React.FC<MobileCardViewProps> = ({
  leads,
  onOpenWhatsApp,
  onQuickReply,
  onChangeStage,
  onOpenEditModal,
  onCopyPitch,
}) => {
  if (leads.length === 0) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '36px 16px',
        textAlign: 'center',
        color: 'var(--text-tertiary)'
      }}>
        No matching client records found.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {leads.map(lead => {
        const isReplied = lead.has_replied || ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON'].includes(lead.stage);

        return (
          <div
            key={lead.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Header: Title & Deal value */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text)' }}>
                  {lead.business}
                </div>
                {lead.owner && (
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    👤 {lead.owner}
                  </div>
                )}
                <div style={{ marginTop: '4px' }}>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)'
                  }}>
                    {lead.niche}
                  </span>
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--terracotta)',
                background: 'var(--terracotta-soft)',
                padding: '4px 8px',
                borderRadius: '6px',
                whiteSpace: 'nowrap'
              }}>
                ₹{(Number(lead.deal_value) || 29999).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Contact row: Stacked */}
            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text)' }}>
                  {lead.phone}
                </div>
                {lead.website && (
                  <a
                    href={`https://${lead.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--terracotta)',
                      textDecoration: 'none',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}
                  >
                    ↗ {lead.website}
                  </a>
                )}
              </div>

              <button
                onClick={() => onOpenWhatsApp(lead)}
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  border: '1px solid #20BA5A',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%'
                }}
              >
                💬 WhatsApp Pitch
              </button>
            </div>

            {/* Status & Quick Reply row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: isReplied ? 'var(--sage-green-soft)' : 'var(--bg-subtle)',
                color: isReplied ? 'var(--sage-green)' : 'var(--text-tertiary)',
                border: '1px solid',
                borderColor: isReplied ? 'var(--sage-green-border)' : 'var(--border)'
              }}>
                <span>{isReplied ? '●' : '○'}</span>
                <span>{isReplied ? 'Replied' : 'Awaiting Reply'}</span>
              </span>

              {!isReplied && (
                <button
                  onClick={() => onQuickReply(lead)}
                  style={{
                    background: 'var(--sage-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                  title="1-Tap: Mark client as Replied!"
                >
                  💬 Got Reply
                </button>
              )}

              <select
                value={lead.stage}
                onChange={(e) => onChangeStage(lead.id, e.target.value as PipelineStage)}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  minWidth: '120px'
                }}
              >
                <option value="PITCH_READY">🚀 Ready to Pitch</option>
                <option value="PITCH_SENT">⏳ Pitch Sent</option>
                <option value="REPLIED">💬 Replied</option>
                <option value="DEMO_SHARED">🎬 In Discussion</option>
                <option value="CALL_BOOKED">📅 Call Booked</option>
                <option value="CLOSED_WON">🏆 Closed Won</option>
                <option value="LOST">❌ Not Interested</option>
              </select>
            </div>

            {/* Weakness */}
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              lineHeight: 1.35
            }}>
              <strong style={{ color: 'var(--text)' }}>Audited Weakness:</strong> {lead.weakness || 'Missing 24/7 engagement'}
            </div>

            {/* Note box */}
            {lead.reply_notes || lead.notes ? (
              <div
                onClick={() => onOpenEditModal(lead)}
                style={{
                  background: 'var(--surface-hover)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  color: 'var(--text)',
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}
              >
                💬 <strong>Note:</strong> {lead.reply_notes || lead.notes}
              </div>
            ) : null}

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--text-tertiary)'
            }}>
              <div>
                {lead.last_contacted ? `🕒 Sent: ${lead.last_contacted}` : `Added: ${lead.date_added || 'Recently'}`}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => onCopyPitch(lead.pitch)}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem'
                  }}
                  title="Copy pitch message"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => onOpenEditModal(lead)}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem'
                  }}
                  title="Edit details"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

