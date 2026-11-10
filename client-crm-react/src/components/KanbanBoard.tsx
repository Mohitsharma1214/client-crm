import React, { useState } from 'react';
import { Prospect, PipelineStage } from '../types/crm';

interface KanbanBoardProps {
  leads: Prospect[];
  onOpenWhatsApp: (lead: Prospect) => void;
  onQuickReply: (lead: Prospect) => void;
  onChangeStage: (leadId: string, stage: PipelineStage) => void;
  onOpenEditModal: (lead: Prospect) => void;
  onCopyPitch: (pitch: string) => void;
  onOpenBulkModal: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onOpenWhatsApp,
  onQuickReply,
  onChangeStage,
  onOpenEditModal,
  onCopyPitch,
  onOpenBulkModal,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const columns: { stage: PipelineStage; title: string; icon: string; leads: Prospect[] }[] = [
    {
      stage: 'PITCH_READY',
      title: 'Ready to Pitch',
      icon: '🚀',
      leads: leads.filter(l => l.stage === 'PITCH_READY' && !l.has_replied),
    },
    {
      stage: 'PITCH_SENT',
      title: 'Pitch Sent',
      icon: '⏳',
      leads: leads.filter(l => l.stage === 'PITCH_SENT' && !l.has_replied),
    },
    {
      stage: 'REPLIED',
      title: 'Replied',
      icon: '💬',
      leads: leads.filter(l => l.stage === 'REPLIED' || (l.has_replied && l.stage !== 'DEMO_SHARED' && l.stage !== 'CALL_BOOKED' && l.stage !== 'CLOSED_WON')),
    },
    {
      stage: 'DEMO_SHARED',
      title: 'In Discussion',
      icon: '🎬',
      leads: leads.filter(l => l.stage === 'DEMO_SHARED' || l.stage === 'CALL_BOOKED'),
    },
    {
      stage: 'CLOSED_WON',
      title: 'Closed Won',
      icon: '🏆',
      leads: leads.filter(l => l.stage === 'CLOSED_WON'),
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    if (draggedId) {
      onChangeStage(draggedId, targetStage);
      setDraggedId(null);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '14px',
      overflowX: 'auto',
      paddingBottom: '20px'
    }}>
      {columns.map(col => (
        <div
          key={col.stage}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.stage)}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '480px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.84rem' }}>
              <span>{col.icon}</span>
              <span>{col.title}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {col.stage === 'PITCH_READY' && col.leads.length > 0 && (
                <button
                  onClick={onOpenBulkModal}
                  style={{
                    background: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Send WhatsApp pitch to all unsent leads"
                >
                  ⚡ Send All
                </button>
              )}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '2px 8px'
              }}>
                {col.leads.length}
              </span>
            </div>
          </div>

          {/* Cards List */}
          <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {col.leads.length === 0 ? (
              <div style={{
                flex: 1,
                border: '1px dashed var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-tertiary)',
                fontSize: '0.74rem'
              }}>
                Drop client here
              </div>
            ) : (
              col.leads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => setDraggedId(lead.id)}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    cursor: 'grab',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text)' }}>
                      {lead.business}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--terracotta)'
                    }}>
                      ₹{(Number(lead.deal_value) || 29999).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {lead.owner && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      👤 {lead.owner}
                    </div>
                  )}

                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                    📍 {lead.location}
                  </div>

                  {/* Actions footer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => onOpenWhatsApp(lead)}
                        style={{
                          flex: 1,
                          background: '#25D366',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        💬 Pitch
                      </button>
                      {col.stage === 'PITCH_SENT' && (
                        <button
                          onClick={() => onQuickReply(lead)}
                          style={{
                            background: 'var(--sage-green)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '5px 8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          title="1-Tap: Mark client as Replied!"
                        >
                          💬 Got Reply
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <select
                        value={lead.stage}
                        onChange={(e) => onChangeStage(lead.id, e.target.value as PipelineStage)}
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)'
                        }}
                      >
                        <option value="PITCH_READY">🚀 Ready</option>
                        <option value="PITCH_SENT">⏳ Sent</option>
                        <option value="REPLIED">💬 Replied</option>
                        <option value="DEMO_SHARED">🎬 Discuss</option>
                        <option value="CLOSED_WON">🏆 Won</option>
                      </select>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => onCopyPitch(lead.pitch)}
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.68rem'
                          }}
                        >
                          📋
                        </button>
                        <button
                          onClick={() => onOpenEditModal(lead)}
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.68rem'
                          }}
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

