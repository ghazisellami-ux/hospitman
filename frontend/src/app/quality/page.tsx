'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { Search, ShieldAlert } from 'lucide-react';

const demoInspections = [
  { id: 1, type: 'Béton', lot: 'Gros Œuvre', date: '2026-04-25', inspector: 'Ing. Trabelsi', result: 'conforming' },
  { id: 2, type: 'Acier', lot: 'Gros Œuvre', date: '2026-04-24', inspector: 'Ing. Trabelsi', result: 'conforming' },
  { id: 3, type: 'Étanchéité', lot: 'Étanchéité', date: '2026-04-22', inspector: 'Lab. CTTP', result: 'non_conforming' },
  { id: 4, type: 'Compactage', lot: 'VRD', date: '2026-04-20', inspector: 'Lab. Géotech', result: 'conforming' },
  { id: 5, type: 'Soudure', lot: 'Plomberie', date: '2026-04-18', inspector: 'Ing. Ben Ali', result: 'pending' },
];

const demoNCRs = [
  { id: 'NCR-001', description: 'Défaut étanchéité toiture zone B', severity: 'major', lot: 'Étanchéité', deadline: '2026-05-10', status: 'open' },
  { id: 'NCR-002', description: 'Résistance béton insuffisante pieu P12', severity: 'critical', lot: 'Gros Œuvre', deadline: '2026-05-01', status: 'in_progress' },
  { id: 'NCR-003', description: 'Alignement canalisation non conforme', severity: 'minor', lot: 'VRD', deadline: '2026-05-15', status: 'open' },
];

export default function QualityPage() {
  const { lang } = useLanguage();

  const resultBadge = (r: string) => r === 'conforming' ? 'badge-success' : r === 'non_conforming' ? 'badge-danger' : 'badge-warning';
  const severityBadge = (s: string) => s === 'critical' ? 'badge-danger' : s === 'major' ? 'badge-warning' : 'badge-info';

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('quality.title', lang)}</h1>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card success"><div className="kpi-label">{lang === 'fr' ? 'Conformes' : 'Conforming'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#10b981' }}>42</div></div>
        <div className="kpi-card danger"><div className="kpi-label">{lang === 'fr' ? 'Non Conformes' : 'Non-Conforming'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#ef4444' }}>7</div></div>
        <div className="kpi-card warning"><div className="kpi-label">{lang === 'fr' ? 'NCR Ouvertes' : 'Open NCRs'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#f59e0b' }}>3</div></div>
        <div className="kpi-card info"><div className="kpi-label">{lang === 'fr' ? 'Inspections ce mois' : 'This month'}</div><div className="kpi-value" style={{ fontSize: 28 }}>12</div></div>
      </div>

      {/* Inspections */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Search size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('quality.inspections', lang)}</h2>
        <button className="btn btn-primary btn-sm">+ {t('quality.addInspection', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Type</th><th>Lot</th><th>{t('common.date', lang)}</th><th>{lang === 'fr' ? 'Inspecteur' : 'Inspector'}</th><th>{lang === 'fr' ? 'Résultat' : 'Result'}</th></tr></thead>
          <tbody>
            {demoInspections.map((i) => (
              <tr key={i.id}>
                <td style={{ fontWeight: 600 }}>{i.type}</td>
                <td>{i.lot}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{i.date}</td>
                <td>{i.inspector}</td>
                <td><span className={`badge ${resultBadge(i.result)}`}>{t(`status.${i.result}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NCRs */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><ShieldAlert size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('quality.ncrs', lang)}</h2>
        <button className="btn btn-danger btn-sm">+ {t('quality.addNCR', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>N°</th><th>{t('common.description', lang)}</th><th>{lang === 'fr' ? 'Sévérité' : 'Severity'}</th><th>Lot</th><th>Deadline</th><th>{t('common.status', lang)}</th></tr></thead>
          <tbody>
            {demoNCRs.map((n) => (
              <tr key={n.id}>
                <td style={{ fontWeight: 600, color: '#ef4444' }}>{n.id}</td>
                <td>{n.description}</td>
                <td><span className={`badge ${severityBadge(n.severity)}`}>{n.severity.toUpperCase()}</span></td>
                <td>{n.lot}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{n.deadline}</td>
                <td><span className={`badge ${n.status === 'open' ? 'badge-warning' : 'badge-info'}`}>{t(`status.${n.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
