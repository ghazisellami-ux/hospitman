'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';

const demoRisks = [
  { id: 1, desc: 'Retard approvisionnement acier à cause de la crise logistique', category: 'schedule', probability: 'high', impact: 'major', score: 12, status: 'mitigating', responsible: 'BTP STAR' },
  { id: 2, desc: 'Dépassement budget lot CVC suite aux spécifications médicales', category: 'financial', probability: 'medium', impact: 'major', score: 9, status: 'identified', responsible: 'ClimaPro' },
  { id: 3, desc: 'Conflit contractuel entrepreneur VRD', category: 'contractual', probability: 'low', impact: 'critical', score: 8, status: 'identified', responsible: 'Direction' },
  { id: 4, desc: 'Instabilité du sol zone parking souterrain', category: 'technical', probability: 'very_high', impact: 'critical', score: 20, status: 'mitigating', responsible: 'BET Géotech' },
  { id: 5, desc: 'Pénurie de main d\'œuvre qualifiée CVC', category: 'schedule', probability: 'medium', impact: 'moderate', score: 6, status: 'accepted', responsible: 'ClimaPro' },
  { id: 6, desc: 'Non-conformité normes antisismiques', category: 'technical', probability: 'low', impact: 'critical', score: 8, status: 'identified', responsible: 'BET Structure' },
];

export default function RiskPage() {
  const { lang } = useLanguage();

  const categoryBadge = (c: string) => {
    const colors: Record<string, string> = { technical: 'badge-info', financial: 'badge-warning', schedule: 'badge-danger', contractual: 'badge-neutral', hse: 'badge-success' };
    const labels: Record<string, Record<string, string>> = {
      fr: { technical: 'Technique', financial: 'Financier', schedule: 'Planning', contractual: 'Contractuel', hse: 'HSE' },
      en: { technical: 'Technical', financial: 'Financial', schedule: 'Schedule', contractual: 'Contractual', hse: 'HSE' },
    };
    return { cls: colors[c] || 'badge-neutral', label: labels[lang]?.[c] || c };
  };

  const scoreColor = (s: number) => s >= 15 ? '#ef4444' : s >= 10 ? '#f59e0b' : s >= 5 ? '#3b82f6' : '#10b981';

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('risk.title', lang)}</h1>
      </div>

      {/* Risk Summary */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card danger"><div className="kpi-label">{lang === 'fr' ? 'Critiques (≥15)' : 'Critical (≥15)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#ef4444' }}>{demoRisks.filter(r => r.score >= 15).length}</div></div>
        <div className="kpi-card warning"><div className="kpi-label">{lang === 'fr' ? 'Élevés (10-14)' : 'High (10-14)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#f59e0b' }}>{demoRisks.filter(r => r.score >= 10 && r.score < 15).length}</div></div>
        <div className="kpi-card info"><div className="kpi-label">{lang === 'fr' ? 'Moyens (5-9)' : 'Medium (5-9)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#3b82f6' }}>{demoRisks.filter(r => r.score >= 5 && r.score < 10).length}</div></div>
        <div className="kpi-card success"><div className="kpi-label">{lang === 'fr' ? 'Faibles (<5)' : 'Low (<5)'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#10b981' }}>{demoRisks.filter(r => r.score < 5).length}</div></div>
      </div>

      {/* Risk Register */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>📋 {t('risk.register', lang)}</h2>
        <button className="btn btn-primary btn-sm">+ {t('risk.add', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>#</th><th>{t('common.description', lang)}</th><th>{lang === 'fr' ? 'Catégorie' : 'Category'}</th><th>{lang === 'fr' ? 'Probabilité' : 'Prob.'}</th><th>Impact</th><th>Score</th><th>{lang === 'fr' ? 'Responsable' : 'Owner'}</th><th>{t('common.status', lang)}</th></tr></thead>
          <tbody>
            {demoRisks.map((r) => {
              const cat = categoryBadge(r.category);
              return (
                <tr key={r.id}>
                  <td style={{ color: 'var(--text-muted)' }}>R-{r.id}</td>
                  <td style={{ fontWeight: 500, maxWidth: 300 }}>{r.desc}</td>
                  <td><span className={`badge ${cat.cls}`}>{cat.label}</span></td>
                  <td style={{ fontSize: 13 }}>{r.probability}</td>
                  <td style={{ fontSize: 13 }}>{r.impact}</td>
                  <td><span style={{ display: 'inline-block', background: scoreColor(r.score), color: 'white', padding: '3px 10px', borderRadius: 12, fontWeight: 700, fontSize: 13 }}>{r.score}</span></td>
                  <td>{r.responsible}</td>
                  <td><span className={`badge ${r.status === 'mitigating' ? 'badge-info' : r.status === 'resolved' ? 'badge-success' : r.status === 'accepted' ? 'badge-neutral' : 'badge-warning'}`}>{t(`status.${r.status}`, lang)}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
