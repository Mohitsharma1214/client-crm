import React, { useState } from 'react';
import { Prospect } from '../types/crm';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newLead: Prospect) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [business, setBusiness] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [niche, setNiche] = useState('Dentistry');
  const [website, setWebsite] = useState('');
  const [weakness, setWeakness] = useState('');
  const [dealValue, setDealValue] = useState('29999');
  const [gmapsRaw, setGmapsRaw] = useState('');

  if (!isOpen) return null;

  const handleAutoFill = () => {
    if (!gmapsRaw.trim()) return;
    const text = gmapsRaw;

    // 1. Phone extraction (+91 or standard 10 digit)
    const phoneMatch = text.match(/(?:\+91[\s-]?)?[6789]\d{9}/);
    if (phoneMatch) setPhone(phoneMatch[0].replace(/\s+/g, ''));

    // 2. Website extraction
    const webMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/);
    if (webMatch) setWebsite(webMatch[1].replace(/^https?:\/\//, '').replace(/^www\./, ''));

    // 3. Business Name & Owner extraction
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      setBusiness(lines[0]);
    }

    // Doctor / Founder pattern
    const docMatch = text.match(/(?:Dr\.?|Dr\s+|Doctor\s+|Founder\s+|Ar\.\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (docMatch) {
      setOwner(docMatch[0]);
    }

    // Niche classification
    const lower = text.toLowerCase();
    if (lower.includes('dent') || lower.includes('ortho') || lower.includes('tooth')) {
      setNiche('Dentistry');
      setWeakness('High patient missed-call volume during procedures & closed weekend hours');
    } else if (lower.includes('derma') || lower.includes('skin') || lower.includes('cosmetic') || lower.includes('laser') || lower.includes('aesthetic')) {
      setNiche('Aesthetic Clinic');
      setWeakness('Leads dropping off WhatsApp without immediate quotation or consultation slots');
    } else if (lower.includes('architect') || lower.includes('interior') || lower.includes('design') || lower.includes('living')) {
      setNiche('Interior Design');
      setWeakness('Clients requiring rapid architectural portfolio and floor-plan consultation booking');
    } else if (lower.includes('real estate') || lower.includes('property') || lower.includes('realty')) {
      setNiche('Real Estate');
      setWeakness('Instant site-visit qualification & brochure dispatch required 24/7');
    } else if (lower.includes('salon') || lower.includes('spa') || lower.includes('hair')) {
      setNiche('Salon / Spa');
      setWeakness('High volume of weekend appointment booking inquiries unattended');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business.trim() || !phone.trim()) {
      alert('Business name and Phone number are required.');
      return;
    }

    const newLead: Prospect = {
      id: `client_${Date.now()}`,
      business: business.trim(),
      owner: owner.trim() || undefined,
      phone: phone.trim(),
      niche,
      website: website.trim() || undefined,
      weakness: weakness.trim() || 'Missing modern 24/7 client booking presence',
      pitch: `Hi ${owner || business}! Admiring your work at ${business}. Quick question: would you be open to an automated 24/7 AI booking assistant for your client inquiries?`,
      stage: 'PITCH_READY',
      deal_value: parseInt(dealValue) || 29999,
      has_replied: false,
      date_added: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onAdd(newLead);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">+ Add Target Client</div>
          <button className="btn btn-secondary btn-xs" onClick={onClose}>✕</button>
        </div>

        {/* Smart Gmaps Paste Parser */}
        <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--terracotta)', marginBottom: '6px' }}>
            📍 Smart Auto-Fill from Google Maps / Visiting Card
          </div>
          <textarea
            rows={2}
            className="form-input"
            style={{ width: '100%', resize: 'none', marginBottom: '6px', fontSize: '0.8rem' }}
            placeholder="Paste raw Google Maps listing text, phone, or address here..."
            value={gmapsRaw}
            onChange={(e) => setGmapsRaw(e.target.value)}
          />
          <button type="button" className="btn btn-secondary btn-xs" onClick={handleAutoFill}>
            ⚡ Auto-Fill Fields
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
              Business Name *
            </label>
            <input
              type="text"
              required
              className="form-input"
              style={{ width: '100%' }}
              placeholder="e.g. The Dental Roots"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Owner / Doctor / Director
              </label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%' }}
                placeholder="e.g. Dr. Dheeraj Setia"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Phone Number *
              </label>
              <input
                type="text"
                required
                className="form-input"
                style={{ width: '100%' }}
                placeholder="+91 98110 XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Niche / Industry
              </label>
              <select
                className="select-dropdown"
                style={{ width: '100%' }}
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              >
                <option value="Dentistry">Dentistry</option>
                <option value="Aesthetic Clinic">Aesthetic Clinic</option>
                <option value="Interior Design">Interior Design</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Salon / Spa">Salon / Spa</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Website
              </label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%' }}
                placeholder="domain.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>
                Audited Pain Point / Weakness
              </label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%' }}
                placeholder="Missing instant 24/7 consultation booking..."
                value={weakness}
                onChange={(e) => setWeakness(e.target.value)}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-terracotta btn-sm">
              Save Client Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

