'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { ClipboardList, X } from 'lucide-react';

interface RiskItem {
  id: number;
  desc: string;
  category: string;
  probability: string;
  impact: string;
  score: number;
  status: string;
  responsible: string;
}

const initialRisks: RiskItem[] = [
  { id: 1, desc: 'Retard approvisionnement acier à cause de la crise logistique', category: 'schedule', probability: 'high', impact: 'major', score: 12, status: 'mitigating', responsible: 'BTP STAR' },
  { id: 2, desc: 'Dépassement budget lot CVC suite aux spécifications médicales', category: 'financial', probability: 'medium', impact: 'major', score: 9, status: 'identified', responsible: 'ClimaPro' },
  { id: 3, desc: 'Conflit contractuel entrepreneur VRD', category: 'contractual', probability: 'low', impact: 'critical', score: 8, status: 'identified', responsible: 'Direction' },
  { id: 4, desc: 'Instabilité du sol zone parking souterrain', category: 'technical', probability: 'very_high', impact: 'critical', score: 20, status: 'mitigating', responsible: 'BET Géotech' },
  { id: 5, desc: 'Pénurie de main d\'œuvre qualifiée CVC', category: 'schedule', probability: 'medium', impact: 'moderate', score: 6, status: 'accepted', responsible: 'ClimaPro' },
  { id: 6, desc: 'Non-conformité normes antisismiques', category: 'technical', probability: 'low', impact: 'critical', score: 8, status: 'identified', responsible: 'BET Structure' },
];

const categories = ['technical', 'financial', 'schedule', 'contractual', 'hse'];
const probabilities = ['very_low', 'low', 'medium', 'high', 'very_high'];
const impacts = ['negligible', 'moderate', 'major', 'critical'];
const statuses = ['identified', 'mitigating', 'accepted', 'resolved'];
const responsibles = ['BTP STAR', 'Direction', 'ClimaPro', 'ElecPro', 'HydroTech', 'VRD Tunisie', 'BET Structure', 'BET Géotech', 'Lab. CTTP'];

const probScore: Record<string, number> = { very_low: 1, low: 2, medium: 3, high: 4, very_high: 5 };
const impactScore: Record<string, number> = { negligible: 1, moderate: 2, major: 3, critical: 4 };

export default function RiskPage() {
  const { lang } = useLanguage();
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    desc: '', category: 'technical', probability: 'medium', impact: 'moderate', status: 'identified', responsible: responsibles[0],
  });

  const categoryBadge = (c: string) => {
    const colors: Record<string, string> = { technical: 'badge-info', financial: 'badge-warning', schedule: 'badge-danger', contractual: 'badge-neutral', hse: 'badge-success' };
    const labels: Record<string, Record<string, string>> = {
      fr: { technical: 'Technique', financial: 'Financier', schedule: 'Planning', contractual: 'Contractuel', hse: 'HSE' },
      en: { technical: 'Technical', financial: 'Financial', schedule: 'Schedule', contractual: 'Contractual', hse: 'HSE' },
    };
    return { cls: colors[c] || 'badge-neutral', label: labels[lang]?.[c] || c };
  };

  const scoreColor = (s: number) => s >= 15 ? '#ef4444' : s >= 10 ? '#f59e0b' : s >= 5 ? '#3b82f6' : '#10b981';

  const probLabel = (p: string) => {
    const map: Record<string, Record<string, string>> = {
      fr: { very_low: 'Très faible', low: 'Faible', medium: 'Moyen', high: 'Élevé', very_high: 'Très élevé' },
      en: { very_low: 'Very Low', low: 'Low', medium: 'Medium', high: 'High', very_high: 'Very High' },
    };
    return map[lang]?.[p] || p;
  };

  const impactLabel = (i: string) => {
    const map: Record<string, Record<string, string>> = {
      fr: { negligible: 'Négligeable', moderate: 'Modéré', major: 'Majeur', critical: 'Critique' },
      en: { negligible: 'Negligible', moderate: 'Moderate', major: 'Major', critical: 'Critical' },
    };
    return map[lang]?.[i] || i;
  };

  const handleAdd = () => {
    if (!form.desc.trim()) return;
    const score = (probScore[form.probability] || 3) * (impactScore[form.impact] || 2);
    const newRisk: RiskItem = {
      id: risks.length + 1,
      desc: form.desc,
      category: form.category,
      probability: form.probability,
      impact: form.impact,
      score,
      status: form.status,
      responsible: form.responsible,
    };
    setRisks([...risks, newRisk]);
    setShowModal(false);
    setForm({ desc: '', category: 'technical', probability: 'medium', impact: 'moderate', status: 'identified', responsible: responsibles[0] });
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('risk.title', lang)}</h1>
      </div>

      {/* Risk Summary */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card danger"><div className="kpi-label">{lang === 'fr' ? 'Critiques (≥15)' : 'Critical (≥15)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#ef4444' }}>{risks.filter(r => r.score >= 15).length}</div></div>
        <div className="kpi-card warning"><div className="kpi-label">{lang === 'fr' ? 'Élevés (10-14)' : 'High (10-14)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#f59e0b' }}>{risks.filter(r => r.score >= 10 && r.score < 15).length}</div></div>
        <div className="kpi-card info"><div className="kpi-label">{lang === 'fr' ? 'Moyens (5-9)' : 'Medium (5-9)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#3b82f6' }}>{risks.filter(r => r.score >= 5 && r.score < 10).length}</div></div>
        <div className="kpi-card success"><div className="kpi-label">{lang === 'fr' ? 'Faibles (<5)' : 'Low (<5)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#10b981' }}>{risks.filter(r => r.score < 5).length}</div></div>
      </div>

      {/* Risk Register */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><ClipboardList size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('risk.register', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('risk.add', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>#</th><th>{t('common.description', lang)}</th><th>{lang === 'fr' ? 'Catégorie' : 'Category'}</th><th>{lang === 'fr' ? 'Probabilité' : 'Prob.'}</th><th>Impact</th><th>Score</th><th>{lang === 'fr' ? 'Responsable' : 'Owner'}</th><th>{t('common.status', lang)}</th></tr></thead>
          <tbody>
            {risks.map((r) => {
              const cat = categoryBadge(r.category);
              return (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text-muted)' }}>R-{r.id}</td>
                  <td style={{ fontWeight: 500, maxWidth: 300 }}>{r.desc}</td>
                  <td><span className={`badge ${cat.cls}`}>{cat.label}</span></td>
                  <td style={{ fontSize: 13 }}>{probLabel(r.probability)}</td>
                  <td style={{ fontSize: 13 }}>{impactLabel(r.impact)}</td>
                  <td><span style={{ display: 'inline-block', background: scoreColor(r.score), color: 'white', padding: '3px 10px', borderRadius: 12, fontWeight: 700, fontSize: 13 }}>{r.score}</span></td>
                  <td>{r.responsible}</td>
                  <td><span className={`badge ${r.status === 'mitigating' ? 'badge-info' : r.status === 'resolved' ? 'badge-success' : r.status === 'accepted' ? 'badge-neutral' : 'badge-warning'}`}>{t(`status.${r.status}`, lang)}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Risk Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{lang === 'fr' ? 'Nouveau Risque' : 'New Risk'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder={lang === 'fr' ? 'Décrivez le risque identifié...' : 'Describe the identified risk...'} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Catégorie' : 'Category'}</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c} value={c}>{categoryBadge(c).label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Probabilité' : 'Probability'}</label>
                <select className="form-select" value={form.probability} onChange={(e) => setForm({ ...form, probability: e.target.value })}>
                  {probabilities.map(p => <option key={p} value={p}>{probLabel(p)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Impact</label>
                <select className="form-select" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })}>
                  {impacts.map(i => <option key={i} value={i}>{impactLabel(i)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Responsable' : 'Owner'}</label>
                <select className="form-select" value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })}>
                  {responsibles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.status', lang)}</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {statuses.map(s => <option key={s} value={s}>{t(`status.${s}`, lang)}</option>)}
              </select>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{lang === 'fr' ? 'Score calculé' : 'Calculated Score'}: </span>
              <span style={{ fontWeight: 700, fontSize: 18, color: scoreColor((probScore[form.probability] || 3) * (impactScore[form.impact] || 2)) }}>
                {(probScore[form.probability] || 3) * (impactScore[form.impact] || 2)}
              </span>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</button>
              <button className="btn btn-primary" onClick={handleAdd}>{lang === 'fr' ? 'Ajouter Risque' : 'Add Risk'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
