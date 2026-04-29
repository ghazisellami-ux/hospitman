// Bilingual demo data for all modules
// Usage: use `lang` to pick the right field, e.g. item[`name_${lang}`] or biLot(item.lot, lang)

export type Language = 'fr' | 'en';

// ── Lot names mapping ──────────────────────────────────────
const lotTranslations: Record<string, Record<Language, string>> = {
  'Gros Œuvre': { fr: 'Gros Œuvre', en: 'Structural Work' },
  'VRD': { fr: 'VRD', en: 'Roads & Utilities' },
  'Électricité CF': { fr: 'Électricité CF', en: 'Electrical (High Voltage)' },
  'Électricité Courant Fort': { fr: 'Électricité Courant Fort', en: 'High Voltage Electrical' },
  'Électricité Courant Faible': { fr: 'Électricité Courant Faible', en: 'Low Voltage Electrical' },
  'Électricité': { fr: 'Électricité', en: 'Electrical' },
  'Plomberie Sanitaire': { fr: 'Plomberie Sanitaire', en: 'Plumbing' },
  'Plomberie': { fr: 'Plomberie', en: 'Plumbing' },
  'CVC': { fr: 'CVC', en: 'HVAC' },
  'Menuiserie Aluminium': { fr: 'Menuiserie Aluminium', en: 'Aluminum Joinery' },
  'Menuiserie': { fr: 'Menuiserie', en: 'Joinery' },
  'Étanchéité': { fr: 'Étanchéité', en: 'Waterproofing' },
  'Tous les lots': { fr: 'Tous les lots', en: 'All lots' },
};

export function biLot(lot: string, lang: Language): string {
  return lotTranslations[lot]?.[lang] || lot;
}

// ── Scope lots ─────────────────────────────────────────────
export const scopeLots = [
  { id: 1, name_fr: 'Gros Œuvre', name_en: 'Structural Work', desc_fr: 'Structure béton armé, fondations', desc_en: 'Reinforced concrete structure, foundations', contractor: 'BTP STAR', status: 'in_progress' },
  { id: 2, name_fr: 'VRD', name_en: 'Roads & Utilities', desc_fr: 'Voirie et Réseaux Divers', desc_en: 'Roads and Utility Networks', contractor: 'VRD Tunisie', status: 'in_progress' },
  { id: 3, name_fr: 'Électricité Courant Fort', name_en: 'High Voltage Electrical', desc_fr: 'Distribution électrique, TGBT', desc_en: 'Electrical distribution, main switchboard', contractor: 'ElecPro', status: 'planned' },
  { id: 4, name_fr: 'Électricité Courant Faible', name_en: 'Low Voltage Electrical', desc_fr: 'Réseau informatique, sécurité', desc_en: 'IT network, security systems', contractor: 'ElecPro', status: 'planned' },
  { id: 5, name_fr: 'Plomberie Sanitaire', name_en: 'Plumbing', desc_fr: 'Alimentation eau, évacuation', desc_en: 'Water supply, drainage', contractor: 'HydroTech', status: 'not_started' },
  { id: 6, name_fr: 'CVC', name_en: 'HVAC', desc_fr: 'Chauffage, Ventilation, Climatisation', desc_en: 'Heating, Ventilation, Air Conditioning', contractor: 'ClimaPro', status: 'not_started' },
  { id: 7, name_fr: 'Menuiserie Aluminium', name_en: 'Aluminum Joinery', desc_fr: 'Portes, fenêtres, mur rideau', desc_en: 'Doors, windows, curtain wall', contractor: 'AluDesign', status: 'planned' },
  { id: 8, name_fr: 'Étanchéité', name_en: 'Waterproofing', desc_fr: 'Étanchéité toiture et sous-sol', desc_en: 'Roof and basement waterproofing', contractor: 'WaterStop', status: 'not_started' },
];

export const scopeCRs = [
  { id: 1, title_fr: 'Modification emplacement bloc opératoire', title_en: 'Operating theater location change', cost_impact: 150000, schedule_impact_days: 15, status: 'pending' },
  { id: 2, title_fr: 'Ajout système gaz médicaux supplémentaire', title_en: 'Additional medical gas system', cost_impact: 85000, schedule_impact_days: 7, status: 'approved' },
];

// ── Schedule activities ────────────────────────────────────
export const scheduleActivities = [
  { id: 1, name_fr: 'Terrassement', name_en: 'Earthwork', lot: 'VRD', planned_start: '2026-01-15', planned_end: '2026-03-15', actual_start: '2026-01-20', actual_progress: 100, planned_progress: 100, status: 'completed' },
  { id: 2, name_fr: 'Fondations profondes', name_en: 'Deep Foundations', lot: 'Gros Œuvre', planned_start: '2026-02-01', planned_end: '2026-05-01', actual_start: '2026-02-10', actual_progress: 85, planned_progress: 95, status: 'delayed' },
  { id: 3, name_fr: 'Infrastructure béton RDC', name_en: 'Ground Floor Concrete', lot: 'Gros Œuvre', planned_start: '2026-04-01', planned_end: '2026-07-01', actual_start: '2026-04-15', actual_progress: 35, planned_progress: 45, status: 'in_progress' },
  { id: 4, name_fr: 'Réseau assainissement', name_en: 'Sewer Network', lot: 'VRD', planned_start: '2026-03-01', planned_end: '2026-05-15', actual_start: '2026-03-10', actual_progress: 60, planned_progress: 70, status: 'in_progress' },
  { id: 5, name_fr: 'Superstructure 1er étage', name_en: '1st Floor Superstructure', lot: 'Gros Œuvre', planned_start: '2026-06-01', planned_end: '2026-09-01', actual_progress: 0, planned_progress: 0, status: 'not_started' },
  { id: 6, name_fr: 'Chemin de câble principal', name_en: 'Main Cable Tray', lot: 'Électricité', planned_start: '2026-07-01', planned_end: '2026-10-01', actual_progress: 0, planned_progress: 0, status: 'not_started' },
];

// ── Cost budgets ───────────────────────────────────────────
export const costBudgets = [
  { lot: 'Gros Œuvre', initial: 25000000, committed: 22000000, actual: 18000000, eac: 26500000 },
  { lot: 'VRD', initial: 8000000, committed: 7500000, actual: 5200000, eac: 8200000 },
  { lot: 'Électricité CF', initial: 12000000, committed: 10000000, actual: 3500000, eac: 12500000 },
  { lot: 'Plomberie', initial: 9000000, committed: 8000000, actual: 2800000, eac: 9100000 },
  { lot: 'CVC', initial: 15000000, committed: 12000000, actual: 4000000, eac: 15800000 },
  { lot: 'Menuiserie', initial: 6000000, committed: 4500000, actual: 1200000, eac: 6000000 },
];

export const costInvoices = [
  { id: 'DEC-001', lot: 'Gros Œuvre', amount: 3500000, date: '2026-04-15', status: 'paid' },
  { id: 'DEC-002', lot: 'VRD', amount: 1200000, date: '2026-04-20', status: 'approved' },
  { id: 'DEC-003', lot: 'Gros Œuvre', amount: 4200000, date: '2026-04-25', status: 'pending' },
];

// ── Quality ────────────────────────────────────────────────
export const qualityInspections = [
  { id: 1, type_fr: 'Béton', type_en: 'Concrete', lot: 'Gros Œuvre', date: '2026-04-25', inspector: 'Ing. Trabelsi', result: 'conforming' },
  { id: 2, type_fr: 'Acier', type_en: 'Steel', lot: 'Gros Œuvre', date: '2026-04-24', inspector: 'Ing. Trabelsi', result: 'conforming' },
  { id: 3, type_fr: 'Étanchéité', type_en: 'Waterproofing', lot: 'Étanchéité', date: '2026-04-22', inspector: 'Lab. CTTP', result: 'non_conforming' },
  { id: 4, type_fr: 'Compactage', type_en: 'Compaction', lot: 'VRD', date: '2026-04-20', inspector: 'Lab. Géotech', result: 'conforming' },
  { id: 5, type_fr: 'Soudure', type_en: 'Welding', lot: 'Plomberie', date: '2026-04-18', inspector: 'Ing. Ben Ali', result: 'pending' },
];

export const qualityNCRs = [
  { id: 'NCR-001', desc_fr: 'Défaut étanchéité toiture zone B', desc_en: 'Roof waterproofing defect in zone B', severity: 'major', lot: 'Étanchéité', deadline: '2026-05-10', status: 'open' },
  { id: 'NCR-002', desc_fr: 'Résistance béton insuffisante pieu P12', desc_en: 'Insufficient concrete strength in pile P12', severity: 'critical', lot: 'Gros Œuvre', deadline: '2026-05-01', status: 'in_progress' },
  { id: 'NCR-003', desc_fr: 'Alignement canalisation non conforme', desc_en: 'Non-compliant pipe alignment', severity: 'minor', lot: 'VRD', deadline: '2026-05-15', status: 'open' },
];

// ── Communication ──────────────────────────────────────────
export const commMeetings = [
  { id: 1, type: 'meeting', date: '2026-04-28', subject_fr: 'Réunion hebdomadaire de chantier #18', subject_en: 'Weekly site meeting #18', participants: 'Direction, BTP STAR, Supervision' },
  { id: 2, type: 'rfi', date: '2026-04-26', subject_fr: 'RFI-045: Épaisseur dalle bloc opératoire', subject_en: 'RFI-045: Operating theater slab thickness', participants: 'BET Structure, Direction' },
  { id: 3, type: 'correspondence', date: '2026-04-24', subject_fr: 'Mise en demeure retard lot VRD', subject_en: 'Formal notice for Roads & Utilities delay', participants: 'Direction, VRD Tunisie' },
  { id: 4, type: 'meeting', date: '2026-04-21', subject_fr: 'Réunion coordination MEP', subject_en: 'MEP coordination meeting', participants: 'ElecPro, HydroTech, ClimaPro, Direction' },
];

export const commActions = [
  { id: 1, desc_fr: 'Fournir plan d\'exécution révisé zone B', desc_en: 'Provide revised execution plan for zone B', assigned: 'BTP STAR', deadline: '2026-05-02', status: 'open' },
  { id: 2, desc_fr: 'Soumettre fiches techniques gaz médicaux', desc_en: 'Submit medical gas technical data sheets', assigned: 'ClimaPro', deadline: '2026-05-05', status: 'open' },
  { id: 3, desc_fr: 'Valider échantillons carrelage hall principal', desc_en: 'Validate main hall tile samples', assigned: 'Direction', deadline: '2026-04-30', status: 'in_progress' },
  { id: 4, desc_fr: 'Corriger NCR-002 résistance béton', desc_en: 'Fix NCR-002 concrete strength', assigned: 'BTP STAR', deadline: '2026-05-01', status: 'open' },
];

// ── Risk ───────────────────────────────────────────────────
export const riskItems = [
  { id: 1, desc_fr: 'Retard approvisionnement acier à cause de la crise logistique', desc_en: 'Steel supply delay due to logistics crisis', category: 'schedule', probability: 'high', impact: 'major', score: 12, status: 'mitigating', responsible: 'BTP STAR' },
  { id: 2, desc_fr: 'Dépassement budget lot CVC suite aux spécifications médicales', desc_en: 'HVAC budget overrun due to medical specifications', category: 'financial', probability: 'medium', impact: 'major', score: 9, status: 'identified', responsible: 'ClimaPro' },
  { id: 3, desc_fr: 'Conflit contractuel entrepreneur VRD', desc_en: 'Contractual dispute with Roads & Utilities contractor', category: 'contractual', probability: 'low', impact: 'critical', score: 8, status: 'identified', responsible: 'Direction' },
  { id: 4, desc_fr: 'Instabilité du sol zone parking souterrain', desc_en: 'Soil instability in underground parking area', category: 'technical', probability: 'very_high', impact: 'critical', score: 20, status: 'mitigating', responsible: 'BET Géotech' },
  { id: 5, desc_fr: 'Pénurie de main d\'œuvre qualifiée CVC', desc_en: 'Shortage of qualified HVAC workers', category: 'schedule', probability: 'medium', impact: 'moderate', score: 6, status: 'accepted', responsible: 'ClimaPro' },
  { id: 6, desc_fr: 'Non-conformité normes antisismiques', desc_en: 'Non-compliance with seismic standards', category: 'technical', probability: 'low', impact: 'critical', score: 8, status: 'identified', responsible: 'BET Structure' },
];

// ── Shared lot list for forms ──────────────────────────────
export const lotNames: Record<Language, string[]> = {
  fr: ['Gros Œuvre', 'VRD', 'Étanchéité', 'Plomberie', 'Électricité', 'CVC'],
  en: ['Structural Work', 'Roads & Utilities', 'Waterproofing', 'Plumbing', 'Electrical', 'HVAC'],
};

// ── Category / label translations ──────────────────────────
export const categoryLabels: Record<string, Record<Language, string>> = {
  technical: { fr: 'Technique', en: 'Technical' },
  financial: { fr: 'Financier', en: 'Financial' },
  schedule: { fr: 'Planning', en: 'Schedule' },
  contractual: { fr: 'Contractuel', en: 'Contractual' },
  hse: { fr: 'HSE', en: 'HSE' },
};

export const probabilityLabels: Record<string, Record<Language, string>> = {
  very_low: { fr: 'Très faible', en: 'Very Low' },
  low: { fr: 'Faible', en: 'Low' },
  medium: { fr: 'Moyen', en: 'Medium' },
  high: { fr: 'Élevé', en: 'High' },
  very_high: { fr: 'Très élevé', en: 'Very High' },
};

export const impactLabels: Record<string, Record<Language, string>> = {
  negligible: { fr: 'Négligeable', en: 'Negligible' },
  moderate: { fr: 'Modéré', en: 'Moderate' },
  major: { fr: 'Majeur', en: 'Major' },
  critical: { fr: 'Critique', en: 'Critical' },
};

export const severityLabels: Record<string, Record<Language, string>> = {
  minor: { fr: 'Mineur', en: 'Minor' },
  major: { fr: 'Majeur', en: 'Major' },
  critical: { fr: 'Critique', en: 'Critical' },
};

export const commTypeLabels: Record<string, Record<Language, string>> = {
  meeting: { fr: 'Réunion', en: 'Meeting' },
  rfi: { fr: 'RFI', en: 'RFI' },
  correspondence: { fr: 'Correspondance', en: 'Correspondence' },
  minutes: { fr: 'PV', en: 'Minutes' },
};

export const roleLabels: Record<string, Record<Language, string>> = {
  engineer: { fr: 'Ingénieur', en: 'Engineer' },
  technician: { fr: 'Technicien', en: 'Technician' },
  worker: { fr: 'Ouvrier', en: 'Worker' },
  director: { fr: 'Directeur', en: 'Director' },
  foreman: { fr: 'Chef d\'équipe', en: 'Foreman' },
};

export const invoiceStatusLabels: Record<string, Record<Language, string>> = {
  paid: { fr: 'Payé', en: 'Paid' },
  approved: { fr: 'Approuvé', en: 'Approved' },
  pending: { fr: 'En attente', en: 'Pending' },
};
