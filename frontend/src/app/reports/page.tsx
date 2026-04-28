'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';

export default function ReportsPage() {
  const { lang } = useLanguage();

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">📄 {lang === 'fr' ? 'Génération de Rapports' : 'Report Generation'}</h1>
        <p className="page-description">{lang === 'fr' ? 'Générez et exportez vos rapports hebdomadaires et mensuels' : 'Generate and export your weekly and monthly reports'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Weekly Report */}
        <div className="chart-card">
          <div className="chart-title">📅 {lang === 'fr' ? 'Rapport Hebdomadaire' : 'Weekly Report'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr'
              ? 'Contenu : avancement de la semaine, activités critiques, problèmes rencontrés, effectifs, conditions météo.'
              : 'Content: weekly progress, critical activities, issues, workforce, weather conditions.'}
          </p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Semaine du' : 'Week of'}</label>
              <input className="form-input" type="date" defaultValue="2026-04-27" />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Au' : 'To'}</label>
              <input className="form-input" type="date" defaultValue="2026-05-03" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary">📥 PDF</button>
            <button className="btn btn-secondary">📊 Excel</button>
          </div>
        </div>

        {/* Monthly Report */}
        <div className="chart-card">
          <div className="chart-title">📊 {lang === 'fr' ? 'Rapport Mensuel' : 'Monthly Report'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr'
              ? 'Contenu : KPIs PMBOK, courbe en S, analyse EVM (SPI, CPI), risques, qualité, communication, recommandations.'
              : 'Content: PMBOK KPIs, S-curve, EVM analysis (SPI, CPI), risks, quality, communication, recommendations.'}
          </p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Mois' : 'Month'}</label>
              <select className="form-select">
                <option>Avril 2026</option>
                <option>Mars 2026</option>
                <option>Février 2026</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary">📥 PDF</button>
            <button className="btn btn-secondary">📊 Excel</button>
          </div>
        </div>

        {/* Custom Export */}
        <div className="chart-card">
          <div className="chart-title">⚙️ {lang === 'fr' ? 'Export Personnalisé' : 'Custom Export'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr'
              ? 'Sélectionnez les modules à inclure dans votre rapport personnalisé.'
              : 'Select modules to include in your custom report.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {['Planning', 'Coûts / EVM', 'Qualité / NCR', 'Risques', 'Communication', 'RH / Effectifs'].map((m) => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-primary)' }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                {m}
              </label>
            ))}
          </div>
          <button className="btn btn-primary">{lang === 'fr' ? '📥 Générer' : '📥 Generate'}</button>
        </div>
      </div>
    </div>
  );
}
