import React, { useState } from 'react';
import { Prospect } from '../types/crm';
import { getWhatsAppPitchUrl } from '../utils/whatsapp';

interface BulkOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  unsentLeads: Prospect[];
  onDispatched: (dispatchedIds: string[]) => void;
}

export const BulkOutreachModal: React.FC<BulkOutreachModalProps> = ({
  isOpen,
  onClose,
  unsentLeads,
  onDispatched,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    unsentLeads.map((l) => l.id)
  );
  const [isDispatching, setIsDispatching] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [dispatchedMap, setDispatchedMap] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(unsentLeads.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleLead = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedTotalValue = unsentLeads
    .filter((l) => selectedIds.includes(l.id))
    .reduce((sum, l) => sum + (l.deal_value || 29999), 0);

  const startDispatch = async (openWhatsAppTabs: boolean) => {
    if (selectedIds.length === 0) return;
    setIsDispatching(true);
    setProgress({
      current: 0,
      total: selectedIds.length,
      status: 'Initializing outreach sequence...',
    });

    const leadsToDispatch = unsentLeads.filter((l) => selectedIds.includes(l.id));
    const newlyDispatched: Record<string, string> = {};

    for (let i = 0; i < leadsToDispatch.length; i++) {
      const lead = leadsToDispatch[i];
      const waUrl = getWhatsAppPitchUrl(lead);
      newlyDispatched[lead.id] = waUrl;

      if (openWhatsAppTabs) {
        try {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {
          console.warn('Popup blocked:', e);
        }
      }

      setProgress({
        current: i + 1,
        total: leadsToDispatch.length,
        status: `Dispatched to ${lead.business}...`,
      });
      setDispatchedMap({ ...newlyDispatched });

      if (openWhatsAppTabs && i < leadsToDispatch.length - 1) {
        await new Promise((r) => setTimeout(r, 450));
      }
    }

    setProgress({
      current: leadsToDispatch.length,
      total: leadsToDispatch.length,
      status: `✓ Successfully dispatched outreach to ${leadsToDispatch.length} clients!`,
    });
    setIsDispatching(false);
    onDispatched(selectedIds);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">⚡ 1-Click WhatsApp Client Outreach</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Sequential deep-link dispatch with custom tailored pitches
            </div>
          </div>
          <button className="btn btn-secondary btn-xs" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Stats Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '16px',
            background: 'var(--bg-subtle)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Pending Unsent
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>
              {unsentLeads.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Selected
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--sage-green)' }}>
              {selectedIds.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Target Pipeline
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--terracotta)' }}>
              ₹{selectedTotalValue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {progress.total > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600 }}>{progress.status}</span>
              <span>
                {progress.current} / {progress.total}
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                  height: '100%',
                  background: 'var(--sage-green)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedIds.length === unsentLeads.length && unsentLeads.length > 0}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            Select All ({unsentLeads.length})
          </label>
        </div>

        {/* Leads Checklist */}
        <div
          style={{
            maxHeight: '320px',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
          }}
        >
          {unsentLeads.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              🎉 All prospects in your database have already received their pitches!
            </div>
          ) : (
            unsentLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: selectedIds.includes(lead.id) ? 'var(--bg-subtle)' : 'transparent',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, cursor: 'pointer', minWidth: 0 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead.id)}
                    onChange={() => toggleLead(lead.id)}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lead.business}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {lead.owner ? `${lead.owner} • ` : ''}
                      {lead.niche} • {lead.phone}
                    </div>
                  </div>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--terracotta)', fontWeight: 600 }}>
                    ₹{(lead.deal_value || 29999).toLocaleString('en-IN')}
                  </span>
                  {dispatchedMap[lead.id] && (
                    <a
                      href={dispatchedMap[lead.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.72rem', color: 'var(--sage-green)', fontWeight: 600 }}
                    >
                      ✓ Dispatched ↗
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-secondary btn-sm"
            disabled={selectedIds.length === 0 || isDispatching}
            onClick={() => startDispatch(false)}
            title="Mark as Pitch Sent without opening browser tabs"
          >
            Mark as Sent (No Tabs)
          </button>
          <button
            className="btn btn-wa-blast btn-sm"
            disabled={selectedIds.length === 0 || isDispatching}
            onClick={() => startDispatch(true)}
          >
            {isDispatching ? '⏳ Dispatching...' : `⚡ Launch Outreach (${selectedIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

