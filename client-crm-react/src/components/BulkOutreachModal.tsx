import React, { useState } from 'react';
import { Prospect } from '../types/crm';
import { getWhatsAppPitchUrl, formatWhatsAppPhone } from '../utils/whatsapp';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [editedPitch, setEditedPitch] = useState<string | null>(null);
  const [openedCurrent, setOpenedCurrent] = useState(false);

  if (!isOpen) return null;

  const currentLead = unsentLeads[currentIndex];
  const total = unsentLeads.length;

  const defaultPitch = currentLead
    ? currentLead.pitch ||
      `Hi ${currentLead.owner || 'there'}! Admiring your work at ${currentLead.business}. Quick question: would you be open to an automated 24/7 AI booking assistant on WhatsApp for your client inquiries?`
    : '';

  const activePitch = editedPitch !== null ? editedPitch : defaultPitch;

  const handleOpenWhatsApp = () => {
    if (!currentLead) return;
    const cleanPhone = formatWhatsAppPhone(currentLead.phone);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(activePitch)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpenedCurrent(true);
  };

  const handleConfirmSent = () => {
    if (!currentLead) return;
    const updatedSent = [...sentIds, currentLead.id];
    setSentIds(updatedSent);
    onDispatched([currentLead.id]);
    setEditedPitch(null);
    setOpenedCurrent(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    setEditedPitch(null);
    setOpenedCurrent(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const progressPct = total > 0 ? Math.round((currentIndex / total) * 100) : 100;

  return (
    <div
      className="modal-backdrop active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">⚡ WhatsApp Outreach Queue (1-by-1 Flow)</h3>
            <div className="modal-subtitle">
              Open one client, send message, confirm "Sent", then advance to the next!
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Progress Tracker */}
        <div
          style={{
            marginBottom: '14px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            <span style={{ color: 'var(--terracotta)' }}>
              {total === 0 || currentIndex >= total
                ? 'Queue Complete'
                : `Client ${currentIndex + 1} of ${total}`}
            </span>
            <span>
              {progressPct}% Completed ({sentIds.length} Sent)
            </span>
          </div>
          <div
            style={{
              height: '6px',
              background: 'var(--border-subtle)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.max(5, progressPct)}%`,
                background: '#25D366',
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </div>

        {/* Finished View */}
        {total === 0 || currentIndex >= total ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
            <strong
              style={{
                color: 'var(--text)',
                display: 'block',
                fontSize: '1.05rem',
                marginBottom: '6px',
              }}
            >
              All Unsent Clients Completed!
            </strong>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
              }}
            >
              You reached out to <strong>{sentIds.length}</strong> clients. Pipeline metrics
              and timestamps have been updated.
            </p>
            <button className="btn btn-terracotta" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* Active Client Card */
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--text)',
                  }}
                >
                  {currentLead.business}
                </h4>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    marginTop: '2px',
                  }}
                >
                  👤 <strong>{currentLead.owner || 'Key Contact'}</strong> • 📍{' '}
                  {currentLead.location || 'Gurugram'} • 🏷️ {currentLead.niche}
                </div>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
                ₹{(currentLead.deal_value || 29999).toLocaleString('en-IN')}
              </span>
            </div>

            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Direct WhatsApp Number:
              </span>
              <strong
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  color: 'var(--text)',
                }}
              >
                {formatWhatsAppPhone(currentLead.phone)}
              </strong>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}
              >
                <label
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Personalized Pitch (Editable):
                </label>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setEditedPitch(defaultPitch)}
                  style={{ fontSize: '0.68rem', padding: '2px 7px' }}
                >
                  Reset
                </button>
              </div>
              <textarea
                rows={3}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  fontSize: '0.82rem',
                  lineHeight: '1.45',
                  padding: '9px 11px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  resize: 'vertical',
                }}
                value={activePitch}
                onChange={(e) => setEditedPitch(e.target.value)}
              />
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-wa-blast"
                onClick={handleOpenWhatsApp}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  padding: '11px 16px',
                }}
              >
                <span>💬</span> Step 1: Open WhatsApp for This Client ↗
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-terracotta"
                  onClick={handleConfirmSent}
                  style={{
                    justifyContent: 'center',
                    fontSize: '0.84rem',
                    padding: '10px',
                    boxShadow: openedCurrent
                      ? '0 0 14px rgba(217, 119, 87, 0.7)'
                      : undefined,
                  }}
                >
                  <span>✓</span> {openedCurrent ? 'Sent! Next Client ➔' : 'Step 2: Sent! Next Client ➔'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSkip}
                  style={{
                    justifyContent: 'center',
                    fontSize: '0.82rem',
                    padding: '10px',
                  }}
                >
                  Skip ⏭️
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
