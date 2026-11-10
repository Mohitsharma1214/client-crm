import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_PROSPECTS } from './data/initialProspects';
import { Prospect, PipelineStage, DashboardMetrics } from './types/crm';
import { calculateFollowUpBuckets, calculateNicheStats } from './utils/analytics';
import { Header } from './components/Header';
import { ActionsRibbon } from './components/ActionsRibbon';
import { NicheAnalyticsPanel } from './components/NicheAnalyticsPanel';
import { KpiStrip } from './components/KpiStrip';
import { ControlsStrip } from './components/ControlsStrip';
import { ClientTable } from './components/ClientTable';
import { MobileCardView } from './components/MobileCardView';
import { KanbanBoard } from './components/KanbanBoard';
import { BulkOutreachModal } from './components/BulkOutreachModal';
import { AddClientModal } from './components/AddClientModal';
import { EditClientModal } from './components/EditClientModal';

const STORAGE_KEY = 'voice_ai_crm_leads';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('voice_crm_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('voice_crm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Leads State
  const [prospects, setProspects] = useState<Prospect[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PROSPECTS.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_PROSPECTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [prospects]);

  // View & Filter State
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [currentFilter, setCurrentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [nicheFilter, setNicheFilter] = useState<string>('ALL');

  // Modals & Collapsible Panels State
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Prospect | null>(null);
  const [activeFollowUpBucket, setActiveFollowUpBucket] = useState<'overdue' | 'today' | 'upcoming' | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Analytics & Buckets
  const followUps = useMemo(() => calculateFollowUpBuckets(prospects), [prospects]);
  const nicheAnalytics = useMemo(() => calculateNicheStats(prospects), [prospects]);

  // Metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const total = prospects.length;
    const sent = prospects.filter((p) => p.stage !== 'PITCH_READY' && p.stage !== 'RESEARCHED').length;
    const replied = prospects.filter(
      (p) => p.has_replied || ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON'].includes(p.stage)
    ).length;
    const inDiscussion = prospects.filter((p) => ['DEMO_SHARED', 'CALL_BOOKED'].includes(p.stage)).length;
    const closedWon = prospects.filter((p) => p.stage === 'CLOSED_WON').length;
    const closedRevenue = prospects
      .filter((p) => p.stage === 'CLOSED_WON')
      .reduce((sum, p) => sum + (p.deal_value || 29999), 0);
    const pipelineValue = prospects
      .filter((p) => ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED'].includes(p.stage))
      .reduce((sum, p) => sum + (p.deal_value || 29999), 0);

    return {
      total,
      sent,
      replied,
      inDiscussion,
      closedWon,
      closedRevenue,
      pipelineValue,
      replyRate: sent > 0 ? (replied / sent) * 100 : 0,
    };
  }, [prospects]);

  // Unsent Leads
  const unsentLeads = useMemo(
    () => prospects.filter((p) => (p.stage === 'PITCH_READY' || p.stage === 'RESEARCHED') && !p.has_replied),
    [prospects]
  );

  // Filtered Leads
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      // 1. Status Filter
      if (currentFilter === 'REPLIED') {
        const isRep = p.has_replied || ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON'].includes(p.stage);
        if (!isRep) return false;
      } else if (currentFilter === 'AWAITING') {
        if (p.stage !== 'PITCH_SENT' || p.has_replied) return false;
      } else if (currentFilter === 'READY') {
        if (p.stage !== 'PITCH_READY' && p.stage !== 'RESEARCHED') return false;
      } else if (currentFilter === 'DISCUSSION') {
        if (!['DEMO_SHARED', 'CALL_BOOKED'].includes(p.stage)) return false;
      } else if (currentFilter === 'WON') {
        if (p.stage !== 'CLOSED_WON') return false;
      }

      // 2. Niche Filter
      if (nicheFilter !== 'ALL' && p.niche !== nicheFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const b = (p.business || '').toLowerCase();
        const o = (p.owner || '').toLowerCase();
        const ph = (p.phone || '').toLowerCase();
        const n = (p.niche || '').toLowerCase();
        if (!b.includes(q) && !o.includes(q) && !ph.includes(q) && !n.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [prospects, currentFilter, nicheFilter, searchQuery]);

  // Mutators
  const handleStageChange = (id: string, stage: PipelineStage) => {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const hasReplied = ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON'].includes(stage);
        return { ...p, stage, has_replied: hasReplied };
      })
    );
    showToast(`✓ Updated stage to ${stage}`);
  };

  const handleQuickReply = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          stage: 'REPLIED',
          has_replied: true,
          reply_notes: p.reply_notes || 'Client replied expressing interest in 24/7 AI Receptionist walkthrough.',
        };
      })
    );
    showToast('💬 Logged client reply!');
  };

  const handleToggleReplied = (id: string) => {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newReplied = !p.has_replied;
        const newStage: PipelineStage = newReplied ? 'REPLIED' : 'PITCH_SENT';
        return { ...p, has_replied: newReplied, stage: newStage };
      })
    );
  };

  const handleBulkDispatched = (dispatchedIds: string[]) => {
    const nowStr = new Date().toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setProspects((prev) =>
      prev.map((p) => {
        if (!dispatchedIds.includes(p.id)) return p;
        return { ...p, stage: 'PITCH_SENT', has_replied: false, last_contacted: nowStr };
      })
    );
    showToast(`🚀 Dispatched WhatsApp pitches to ${dispatchedIds.length} clients!`);
  };

  const handleAddClient = (newLead: Prospect) => {
    setProspects((prev) => [newLead, ...prev]);
    showToast(`✓ Added ${newLead.business} to pipeline`);
  };

  const handleSaveClient = (updated: Prospect) => {
    setProspects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`✓ Saved updates for ${updated.business}`);
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        unsentCount={unsentLeads.length}
        onOpenBulkModal={() => setIsBulkOpen(true)}
        onOpenAddModal={() => setIsAddOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main>
        {/* Section Header */}
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Enterprise Client Acquisition Pipeline</div>
            <h1 className="page-title">Voice AI Client Command Center</h1>
            <p className="page-desc">
              Gurugram & Delhi NCR verified high-ticket healthcare, aesthetics, and design practices.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-wa-blast btn-sm" onClick={() => setIsBulkOpen(true)}>
              ⚡ 1-Click WhatsApp Blast ({unsentLeads.length})
            </button>
            <button className="btn btn-terracotta btn-sm" onClick={() => setIsAddOpen(true)}>
              + Add Client
            </button>
          </div>
        </div>

        {/* Action Ribbon & Follow-Up Workspaces */}
        <ActionsRibbon
          followUps={followUps}
          unsentCount={unsentLeads.length}
          onOpenBulkModal={() => setIsBulkOpen(true)}
          activeFollowUpBucket={activeFollowUpBucket}
          onToggleFollowUpBucket={(bucket) => {
            setIsAnalyticsOpen(false);
            setActiveFollowUpBucket((prev) => (prev === bucket ? null : bucket));
          }}
          isAnalyticsOpen={isAnalyticsOpen}
          onToggleAnalytics={() => {
            setActiveFollowUpBucket(null);
            setIsAnalyticsOpen((prev) => !prev);
          }}
          onEditLead={(id) => {
            const found = prospects.find((p) => p.id === id);
            if (found) setEditingLead(found);
          }}
        />

        {/* Niche Conversion Funnel Panel */}
        <NicheAnalyticsPanel
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          analytics={nicheAnalytics}
        />

        {/* KPI Strip */}
        <KpiStrip metrics={metrics} />

        {/* Controls, Filters & View Toggle */}
        <ControlsStrip
          prospects={prospects}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          nicheFilter={nicheFilter}
          onNicheChange={setNicheFilter}
          currentView={view}
          onViewChange={setView}
        />

        {/* Views */}
        {view === 'table' ? (
          <div>
            {/* Desktop Table */}
            <div className="header-desktop-only">
              <ClientTable
                prospects={filteredProspects}
                onStageChange={handleStageChange}
                onQuickReply={handleQuickReply}
                onToggleReplied={handleToggleReplied}
                onEditClient={(lead) => setEditingLead(lead)}
              />
            </div>
            {/* Mobile / Tablet Cards */}
            <div className="mobile-only">
              <MobileCardView
                prospects={filteredProspects}
                onStageChange={handleStageChange}
                onQuickReply={handleQuickReply}
                onToggleReplied={handleToggleReplied}
                onEditClient={(lead) => setEditingLead(lead)}
              />
            </div>
          </div>
        ) : (
          <KanbanBoard
            prospects={filteredProspects}
            onStageChange={handleStageChange}
            onQuickReply={handleQuickReply}
            onEditClient={(lead) => setEditingLead(lead)}
            onOpenBulkModal={() => setIsBulkOpen(true)}
            unsentCount={unsentLeads.length}
          />
        )}
      </main>

      {/* Modals */}
      <BulkOutreachModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        unsentLeads={unsentLeads}
        onDispatched={handleBulkDispatched}
      />

      <AddClientModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddClient}
      />

      <EditClientModal
        isOpen={editingLead !== null}
        onClose={() => setEditingLead(null)}
        lead={editingLead}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default App;

