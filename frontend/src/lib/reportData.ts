// Shared demo data for reports — will be replaced by API calls later
import { Language } from './i18n';

export interface KPIData {
  overall_progress_planned: number;
  overall_progress_actual: number;
  spi: number;
  cpi: number;
  budget_consumed_pct: number;
  days_remaining: number;
  total_budget: number;
  total_actual_cost: number;
  active_critical_risks: number;
  open_ncrs: number;
  pending_change_requests: number;
  total_personnel_today: number;
}

export const kpiData: KPIData = {
  overall_progress_planned: 45.0,
  overall_progress_actual: 38.5,
  spi: 0.86,
  cpi: 0.92,
  budget_consumed_pct: 32.5,
  days_remaining: 485,
  total_budget: 85000000,
  total_actual_cost: 27625000,
  active_critical_risks: 3,
  open_ncrs: 7,
  pending_change_requests: 2,
  total_personnel_today: 245,
};

export const budgetData = [
  { lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', initial: 25000000, committed: 22000000, actual: 18000000, eac: 26500000 },
  { lot_fr: 'VRD', lot_en: 'Roads & Utilities', initial: 8000000, committed: 7500000, actual: 5200000, eac: 8200000 },
  { lot_fr: 'Électricité CF', lot_en: 'Electrical (HV)', initial: 12000000, committed: 10000000, actual: 3500000, eac: 12500000 },
  { lot_fr: 'Plomberie', lot_en: 'Plumbing', initial: 9000000, committed: 8000000, actual: 2800000, eac: 9100000 },
  { lot_fr: 'CVC', lot_en: 'HVAC', initial: 15000000, committed: 12000000, actual: 4000000, eac: 15800000 },
  { lot_fr: 'Menuiserie', lot_en: 'Carpentry', initial: 6000000, committed: 4500000, actual: 1200000, eac: 6000000 },
];

export const activityData = [
  { name_fr: 'Terrassement', name_en: 'Earthworks', lot_fr: 'VRD', lot_en: 'Roads & Utilities', planned_start: '2026-01-15', planned_end: '2026-03-15', actual_progress: 100, planned_progress: 100, status: 'completed' },
  { name_fr: 'Fondations profondes', name_en: 'Deep Foundations', lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', planned_start: '2026-02-01', planned_end: '2026-05-01', actual_progress: 85, planned_progress: 95, status: 'delayed' },
  { name_fr: 'Infrastructure béton RDC', name_en: 'Ground Floor Concrete', lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', planned_start: '2026-04-01', planned_end: '2026-07-01', actual_progress: 35, planned_progress: 45, status: 'in_progress' },
  { name_fr: 'Réseau assainissement', name_en: 'Drainage Network', lot_fr: 'VRD', lot_en: 'Roads & Utilities', planned_start: '2026-03-01', planned_end: '2026-05-15', actual_progress: 60, planned_progress: 70, status: 'in_progress' },
  { name_fr: 'Superstructure 1er étage', name_en: '1st Floor Superstructure', lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', planned_start: '2026-06-01', planned_end: '2026-09-01', actual_progress: 0, planned_progress: 0, status: 'not_started' },
];

export const riskData = [
  { desc_fr: 'Retard approvisionnement acier', desc_en: 'Steel supply delay', category_fr: 'Planning', category_en: 'Schedule', probability: 'high', impact: 'major', score: 12, status: 'mitigating' },
  { desc_fr: 'Dépassement budget lot CVC', desc_en: 'HVAC lot budget overrun', category_fr: 'Financier', category_en: 'Financial', probability: 'medium', impact: 'major', score: 9, status: 'identified' },
  { desc_fr: 'Conflit contractuel entrepreneur VRD', desc_en: 'VRD contractor dispute', category_fr: 'Contractuel', category_en: 'Contractual', probability: 'low', impact: 'critical', score: 8, status: 'identified' },
  { desc_fr: 'Instabilité du sol zone parking', desc_en: 'Soil instability parking area', category_fr: 'Technique', category_en: 'Technical', probability: 'very_high', impact: 'critical', score: 20, status: 'mitigating' },
];

export const qualityData = [
  { type_fr: 'Béton', type_en: 'Concrete', lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', date: '2026-04-25', result: 'conforming' },
  { type_fr: 'Acier', type_en: 'Steel', lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', date: '2026-04-24', result: 'conforming' },
  { type_fr: 'Étanchéité', type_en: 'Waterproofing', lot_fr: 'Étanchéité', lot_en: 'Waterproofing', date: '2026-04-22', result: 'non_conforming' },
  { type_fr: 'Compactage', type_en: 'Compaction', lot_fr: 'VRD', lot_en: 'Roads & Utilities', date: '2026-04-20', result: 'conforming' },
];

export const ncrData = [
  { id: 'NCR-001', desc_fr: 'Défaut étanchéité toiture zone B', desc_en: 'Roof waterproofing defect zone B', severity: 'major', lot_fr: 'Étanchéité', lot_en: 'Waterproofing', deadline: '2026-05-10', status: 'open' },
  { id: 'NCR-002', desc_fr: 'Résistance béton insuffisante pieu P12', desc_en: 'Insufficient concrete strength pile P12', severity: 'critical', lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', deadline: '2026-05-01', status: 'in_progress' },
  { id: 'NCR-003', desc_fr: 'Alignement canalisation non conforme', desc_en: 'Non-conforming pipe alignment', severity: 'minor', lot_fr: 'VRD', lot_en: 'Roads & Utilities', deadline: '2026-05-15', status: 'open' },
];

export const personnelSummary = [
  { company: 'BTP STAR', count: 92 },
  { company: 'VRD Tunisie', count: 35 },
  { company: 'ElecPro', count: 18 },
  { company: 'HydroTech', count: 14 },
  { company: 'ClimaPro', count: 10 },
  { company: 'Direction', count: 5 },
  { company: 'Supervision', count: 3 },
];

export function fmt(n: number): string {
  return (n / 1000000).toFixed(2) + 'M';
}

/** Helper to pick the right lot name based on language */
export function lotName(item: { lot_fr: string; lot_en: string }, lang: Language): string {
  return lang === 'en' ? item.lot_en : item.lot_fr;
}
