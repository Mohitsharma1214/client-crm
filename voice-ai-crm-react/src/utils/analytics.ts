import { Prospect, NicheCategoryStats, AnalyticsResponse } from '../types/crm';

const NICHE_CATEGORIES: Record<string, string[]> = {
  'Dental': ['dental', 'dentistry', 'implant', 'endodontics', 'invisalign', 'oral', 'orthodont'],
  'Aesthetic & Dermatology': ['aesthetic', 'dermatology', 'skin', 'cosmetic', 'botox', 'laser', 'derma', 'hydra'],
  'Interior Design': ['interior', 'design', 'architect', 'decor', 'millwork', 'joinery'],
  'Real Estate': ['real estate', 'realty', 'property', 'broker', 'housing', 'residential'],
  'Salon & Grooming': ['salon', 'grooming', 'barber', 'spa', 'beauty', 'hair', 'nail'],
};

export function categorizeNiche(nicheStr: string): string {
  const lower = (nicheStr || '').toLowerCase();
  for (const [category, keywords] of Object.entries(NICHE_CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category;
    }
  }
  return 'Other';
}

export function computeAnalytics(prospects: Prospect[]): AnalyticsResponse {
  const cats: Record<string, NicheCategoryStats> = {};

  for (const p of prospects) {
    const cat = categorizeNiche(p.niche);
    if (!cats[cat]) {
      cats[cat] = {
        category: cat,
        total: 0,
        pitched: 0,
        replied: 0,
        in_discussion: 0,
        closed_won: 0,
        revenue: 0,
        pipeline_value: 0,
        reply_rate: 0,
      };
    }

    const c = cats[cat];
    c.total += 1;
    const stage = p.stage;
    const dealValue = Number(p.deal_value) || 29999;

    if (['PITCH_SENT', 'REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON', 'LOST'].includes(stage)) {
      c.pitched += 1;
    }
    if (p.has_replied || ['REPLIED', 'DEMO_SHARED', 'CALL_BOOKED', 'CLOSED_WON'].includes(stage)) {
      c.replied += 1;
    }
    if (['DEMO_SHARED', 'CALL_BOOKED'].includes(stage)) {
      c.in_discussion += 1;
      c.pipeline_value += dealValue;
    }
    if (stage === 'CLOSED_WON') {
      c.closed_won += 1;
      c.revenue += dealValue;
    }
    if (stage === 'REPLIED') {
      c.pipeline_value += dealValue;
    }
  }

  for (const c of Object.values(cats)) {
    c.reply_rate = c.pitched > 0 ? Math.round((c.replied / c.pitched) * 1000) / 10 : 0;
  }

  const categoryList = Object.values(cats).sort((a, b) => b.revenue - a.revenue || b.total - a.total);
  const totalPipeline = categoryList.reduce((sum, c) => sum + c.pipeline_value, 0);
  const totalRev = categoryList.reduce((sum, c) => sum + c.revenue, 0);

  const best = categoryList.length ? [...categoryList].sort((a, b) => b.reply_rate - a.reply_rate)[0] : null;
  const worst = categoryList.length ? [...categoryList].sort((a, b) => a.reply_rate - b.reply_rate)[0] : null;

  return {
    categories: categoryList,
    funnel: {
      total_pipeline_value: totalPipeline,
      total_revenue: totalRev,
      best_performing_niche: best ? best.category : null,
      worst_performing_niche: worst ? worst.category : null,
    },
  };
}

