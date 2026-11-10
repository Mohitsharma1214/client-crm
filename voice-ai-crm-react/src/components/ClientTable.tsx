import React from 'react';
import { Prospect, PipelineStage } from '../types/crm';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface ClientTableProps {
  leads: Prospect[];
  onOpenWhatsApp: (lead: Prospect) => void;
  onQuickReply: (lead: Prospect) => void;
  onChangeStage: (leadId: string, stage: PipelineStage) => void;
  onOpenEditModal: (lead: Prospect) => void;
  onCopyPitch: (pitch: string) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
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
        borderRadius: 'var(--radius-lg)',
        padding: '48px 16px',
        textAlign: 'center',
        color: 'var(--text-tertiary)'
      }}>
        No matching client records found.
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflowX: 'auto',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.68rem', fontWeight: 600 }}>
            <th style={{ padding: '12px 18px' }}>Client & Business</th>
            <th style={{ padding: '12px 14px' }}>Direct Contact</th>
            <th style={{ padding: '12px 14px' }}>Client Status</th>
            <th style={{ padding: '12px 14px' }}>Pipeline Stage</th>
            <th style={{ padding: '12px 14px' }}>Reply Notes / Follow-Up</th>
            <th style={{ padding: '12px 14px' }}>Audited Weakness</th>
            <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => {
            const isReplied = lead.has_replied || ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON'].includes(lead.stage);

            return (
              <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }}>
                {/* Business */}
                <td style={{ padding: '14px 18px', verticalAlign: 'top', minWidth: '220px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem' }}>{lead.business}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {lead.owner && <span style={{ fontWeight: 500 }}>{lead.owner}</span>}
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{
                      fontSize: '0.66rem',
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
                  {lead.website && (
                    <div style={{ marginTop: '4px' }}>
                      <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'var(--terracotta)', textDecoration: 'none' }}>
                        ↗ {lead.website}
                      </a>
                    </div>
                  )}
                </td>

                {/* Contact */}
                <td style={{ padding: '14px 14px', verticalAlign: 'top', minWidth: '160px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    {lead.phone}
                  </div>
                  <button
                    onClick={() => onOpenWhatsApp(lead)}
                    style={{
                      background: '#25D366',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                    title="Open WhatsApp with pre-filled personalized message"
                  >
                    💬 WhatsApp Pitch
                  </button>
                </td>

                {/* Status Toggle */}
                <td style={{ padding: '14px 14px', verticalAlign: 'top' }}>
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
                    <span>{isReplied ? 'Replied' : 'Awaiting'}</span>
                  </span>
                </td>

                {/* Stage Select */}
                <td style={{ padding: '14px 14px', verticalAlign: 'top' }}>
                  <select
                    value={lead.stage}
                    onChange={(e) => onChangeStage(lead.id, e.target.value as PipelineStage)}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: '0.76rem',
                      fontWeight: 600
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
                </td>

                {/* Notes */}
                <td style={{ padding: '14px 14px', verticalAlign: 'top', maxWidth: '200px' }}>
                  <div
                    onClick={() => onOpenEditModal(lead)}
                    style={{
                      fontSize: '0.74rem',
                      color: lead.reply_notes || lead.notes ? 'var(--text)' : 'var(--text-tertiary)',
                      fontStyle: lead.reply_notes || lead.notes ? 'normal' : 'italic',
                      cursor: 'pointer',
                      lineHeight: 1.4
                    }}
                    title="Click to view or edit notes"
                  >
                    {lead.reply_notes || lead.notes || '+ Add conversation note...'}
                  </div>
                </td>

                {/* Weakness */}
                <td style={{ padding: '14px 14px', verticalAlign: 'top', maxWidth: '220px', color: 'var(--text-secondary)', fontSize: '0.74rem', lineHeight: 1.35 }}>
                  {lead.weakness || 'Missing 24/7 client booking presence'}
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 18px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {!isReplied && (
                    <button
                      onClick={() => onQuickReply(lead)}
                      style={{
                        background: 'var(--sage-green)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        marginRight: '4px',
                        cursor: 'pointer'
                      }}
                      title="1-Tap: Mark client as Replied!"
                    >
                      💬 Got Reply
                    </button>
                  )}
                  <button
                    onClick={() => onCopyPitch(lead.pitch)}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      fontSize: '0.74rem',
                      marginRight: '4px',
                      cursor: 'pointer'
                    }}
                    title="Copy pitch message"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => onOpenEditModal(lead)}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '5px 8px',
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                    title="Edit client details"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

