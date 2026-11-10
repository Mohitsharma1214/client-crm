import React from 'react';
import { DashboardMetrics } from '../types/crm';

interface KpiStripProps {
  metrics: DashboardMetrics;
}

export const KpiStrip: React.FC<KpiStripProps> = ({ metrics }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginBottom: '22px'
    }}>
      {/* Card 1: Total */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>Total Prospects</span>
          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>{metrics.total}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--text)' }}>
          {metrics.total}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Audited high-ticket businesses</div>
      </div>

      {/* Card 2: Pitches Sent */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>Pitches Sent</span>
          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>{metrics.sentPct}%</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--text)' }}>
          {metrics.sent}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{Math.max(0, metrics.total - metrics.sent)} remaining to reach</div>
      </div>

      {/* Card 3: Replied */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>Clients Replied</span>
          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--sage-green-soft)', color: 'var(--sage-green)', border: '1px solid var(--sage-green-border)', fontWeight: 600 }}>{metrics.replyRate}% Rate</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--sage-green)' }}>
          {metrics.replied}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>High-intent responses</div>
      </div>

      {/* Card 4: In Discussion */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>In Discussion</span>
          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--amber-soft)', color: 'var(--amber-warm)', border: '1px solid var(--amber-border)', fontWeight: 600 }}>Active</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--amber-warm)' }}>
          {metrics.discussion}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Calls & live walkthroughs</div>
      </div>

      {/* Card 5: Closed Revenue */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text-tertiary)' }}>Closed Revenue</span>
          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', fontWeight: 600 }}>{metrics.closedWon} Won</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--terracotta)' }}>
          ₹{metrics.revenue.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Pipeline: ₹{metrics.pipelineValue.toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
};

