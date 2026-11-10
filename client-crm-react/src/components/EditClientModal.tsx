import React, { useState } from 'react';
import { Prospect, PipelineStage } from '../types/crm';
import { getWhatsAppPitchUrl, getWhatsAppFollowUpUrl } from '../utils/whatsapp';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Prospect | null;
  onSave: (updated: Prospect) => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSave,
}) => {
  if (!isOpen || !lead) return null;

  const [business, setBusiness] = useState(lead.business);
  const [owner, setOwner] = useState(lead.owner || '');
  const [phone, setPhone] = useState(lead.phone);
  const [niche, setNiche] = useState(lead.niche);
  const [website, setWebsite] = useState(lead.website || '');
  const [stage, setStage] = useState<PipelineStage>(lead.stage);
  const [notes, setNotes] = useState(lead.reply_notes || lead.notes || '');
  const [dealValue, setDealValue] = useState(String(lead.deal_value || 29999));
  const [nextFollowUp, setNextFollowUp] = useState(lead.next_follow_up || '');
  const [pitch, setPitch] = useState(lead.pitch || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Prospect = {
      ...lead,
      business: business.trim(),
      owner: owner.trim() || undefined,
      phone: phone.trim(),
      niche,
      website: website.trim() || undefined,
      stage,
      has_replied: ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON'].includes(stage),
      notes: notes.trim() || undefined,
      reply_notes: notes.trim() || undefined,
      deal_value: parseInt(dealValue) || 29999,
      next_follow_up: nextFollowUp.trim() || undefined,
      pitch: pitch.trim(),
    };
    onSave(updated);
    onClose();
  };

  const waPitchUrl = getWhatsAppPitchUrl({ ...lead, phone, pitch });
  const waFollowUpUrl = getWhatsAppFollowUpUrl({ ...lead, phone });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">✏️ Client Details & Conversation History</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {lead.business} ({lead.niche})
            </div>
          </div>
          <button className="btn btn-secondary btn-xs" onClick={onClose}>✕</button>
        </div>

        {/* Quick WhatsApp Action Strip */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <a
            href={waPitchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-xs"
            style={{ textDecoration: 'none', color: 'var(--sage-green)' }}
          >
            💬 Open WhatsApp Pitch ↗
          </a>
          <a
            href={waFollowUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-xs"
            style={{ textDecoration: 'none', color: 'var(--terracotta)' }}
          >
            ⚡ Open 2nd-Touch Follow-Up ↗
          </a>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Business Name
              </label>
              <input
                type="text"
                required
                className="form-input"
                style={{ width: '100%' }}
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Owner / Key Decision Maker
              </label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%' }}
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Phone Number
              </label>
              <input
                type="text"
                required
                className="form-input"
                style={{ width: '100%' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Pipeline Stage
              </label>
              <select
                className="select-dropdown"
                style={{ width: '100%' }}
                value={stage}
                onChange={(e) => setStage(e.target.value as PipelineStage)}
              >
                <option value="PITCH_READY">🚀 Ready to Pitch</option>
                <option value="PITCH_SENT">⏳ Pitch Sent (Awaiting)</option>
                <option value="REPLIED">💬 Replied</option>
                <option value="DEMO_SHARED">🎬 In Discussion</option>
                <option value="CALL_BOOKED">📅 Call Booked</option>
                <option value="CLOSED_WON">🏆 Closed Won</option>
                <option value="LOST">❌ Not Interested</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Next Follow-Up Date
              </label>
              <input
                type="date"
                className="form-input"
                style={{ width: '100%' }}
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Deal Value (₹)
              </label>
              <input
                type="number"
                className="form-input"
                style={{ width: '100%' }}
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
              Conversation Log / Objection Notes
            </label>
            <textarea
              rows={3}
              className="form-input"
              style={{ width: '100%', resize: 'vertical' }}
              placeholder="e.g. Doctor replied asking if it integrates with Practo / WhatsApp Business API..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
              Custom Outreach Pitch
            </label>
            <textarea
              rows={2}
              className="form-input"
              style={{ width: '100%', resize: 'vertical' }}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-terracotta btn-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

