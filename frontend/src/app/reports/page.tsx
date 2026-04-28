'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { kpiData, budgetData, activityData, riskData, ncrData, personnelSummary, fmt } from '@/lib/reportData';
import { FileText, FileSpreadsheet, Calendar, BarChart3, Settings, Download, CheckCircle, Clock } from 'lucide-react';
import type { Language } from '@/lib/i18n';

type ReportType = 'weekly' | 'monthly' | 'custom';

function buildPdfHtml(lang: Language, type: ReportType, weekStart: string, weekEnd: string, selectedMonth: string, modules: Record<string, boolean>) {
  const l = (fr: string, en: string) => lang === 'fr' ? fr : en;
  const statusLabel = (s: string) => t(`status.${s}`, lang);

  const reportTitle = type === 'weekly'
    ? l(`Rapport Hebdomadaire: ${weekStart} au ${weekEnd}`, `Weekly Report: ${weekStart} to ${weekEnd}`)
    : type === 'monthly'
      ? l(`Rapport Mensuel: ${selectedMonth}`, `Monthly Report: ${selectedMonth}`)
      : l('Rapport Personnalisé', 'Custom Report');

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>HospitMan - ${reportTitle}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#1a1a1a;padding:0}
.header{background:#1e3a8a;color:#fff;padding:20px 30px;text-align:center}
.header h1{font-size:22px;margin-bottom:4px}
.header p{font-size:11px;opacity:.85}
.content{padding:24px 30px}
h2{font-size:14px;color:#1e3a8a;border-bottom:2px solid #3b82f6;padding-bottom:4px;margin:18px 0 10px}
table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:10px}
th{background:#1e3a8a;color:#fff;padding:6px 8px;text-align:left;font-weight:600}
td{padding:5px 8px;border-bottom:1px solid #e2e8f0}
tr:nth-child(even){background:#f8fafc}
.kpi-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
.kpi-box{border:1px solid #cbd5e1;border-radius:6px;padding:8px 12px;flex:1;min-width:120px;text-align:center}
.kpi-box .val{font-size:18px;font-weight:700;color:#1e3a8a}
.kpi-box .lbl{font-size:9px;color:#64748b;margin-top:2px}
.footer{text-align:center;font-size:9px;color:#94a3b8;margin-top:24px;padding-top:8px;border-top:1px solid #e2e8f0}
.warn{color:#dc2626;font-weight:600}
.ok{color:#16a34a;font-weight:600}
@media print{body{padding:0}.header{-webkit-print-color-adjust:exact;print-color-adjust:exact}th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header">
  <h1>HospitMan</h1>
  <p>${l('Hôpital Régional 300 Lits — Rapport de Construction', 'Regional Hospital 300 Beds — Construction Report')}</p>
  <p style="margin-top:6px;font-size:13px;font-weight:bold">${reportTitle}</p>
</div>
<div class="content">`;

  // KPIs
  html += `<h2>1. ${l('Indicateurs Clés', 'Key Performance Indicators')}</h2>
<div class="kpi-row">
  <div class="kpi-box"><div class="val">${kpiData.overall_progress_actual}%</div><div class="lbl">${l('Avancement Réel', 'Actual Progress')}</div></div>
  <div class="kpi-box"><div class="val ${kpiData.spi < 1 ? 'warn' : 'ok'}">${kpiData.spi}</div><div class="lbl">SPI</div></div>
  <div class="kpi-box"><div class="val ${kpiData.cpi < 1 ? 'warn' : 'ok'}">${kpiData.cpi}</div><div class="lbl">CPI</div></div>
  <div class="kpi-box"><div class="val">${kpiData.budget_consumed_pct}%</div><div class="lbl">${l('Budget Consommé', 'Budget Consumed')}</div></div>
  <div class="kpi-box"><div class="val">${kpiData.days_remaining}</div><div class="lbl">${l('Jours Restants', 'Days Remaining')}</div></div>
  <div class="kpi-box"><div class="val ${kpiData.active_critical_risks > 0 ? 'warn' : 'ok'}">${kpiData.active_critical_risks}</div><div class="lbl">${l('Risques Critiques', 'Critical Risks')}</div></div>
</div>`;

  // Schedule
  if (type !== 'custom' || modules.schedule) {
    html += `<h2>2. ${l('Planning — Avancement', 'Schedule — Progress')}</h2><table>
<tr><th>${l('Activité', 'Activity')}</th><th>Lot</th><th>${l('Planifié', 'Planned')}</th><th>${l('Réel', 'Actual')}</th><th>${l('Écart', 'Variance')}</th><th>${l('Statut', 'Status')}</th></tr>`;
    activityData.forEach(a => {
      const v = a.actual_progress - a.planned_progress;
      html += `<tr><td>${lang === 'en' ? a.name_en : a.name_fr}</td><td>${a.lot}</td><td>${a.planned_progress}%</td><td>${a.actual_progress}%</td><td class="${v < 0 ? 'warn' : ''}">${v}%</td><td>${statusLabel(a.status)}</td></tr>`;
    });
    html += `</table>`;
  }

  // Cost
  if (type !== 'custom' || modules.cost) {
    html += `<h2>3. ${l('Coûts — Suivi Budgétaire', 'Cost — Budget Tracking')}</h2><table>
<tr><th>Lot</th><th>${l('Budget Initial', 'Initial Budget')}</th><th>${l('Engagé', 'Committed')}</th><th>${l('Réel', 'Actual')}</th><th>EAC</th><th>Variance</th></tr>`;
    budgetData.forEach(b => {
      const variance = b.eac - b.initial;
      html += `<tr><td>${lang === 'en' ? b.lot_en : b.lot_fr}</td><td>${fmt(b.initial)} TND</td><td>${fmt(b.committed)} TND</td><td>${fmt(b.actual)} TND</td><td>${fmt(b.eac)} TND</td><td class="${variance > 0 ? 'warn' : 'ok'}">${variance > 0 ? '+' : ''}${fmt(variance)} TND</td></tr>`;
    });
    html += `</table>`;
  }

  // Quality / NCR
  if (type !== 'custom' || modules.quality) {
    html += `<h2>4. ${l('Qualité — NCR', 'Quality — NCR')}</h2>
<p style="margin-bottom:8px">${l('Conformes: 42 | Non-conformes: 7 | NCR ouvertes:', 'Conforming: 42 | Non-conforming: 7 | Open NCRs:')} ${ncrData.length}</p><table>
<tr><th>N°</th><th>Description</th><th>${l('Sévérité', 'Severity')}</th><th>Lot</th><th>Deadline</th><th>${l('Statut', 'Status')}</th></tr>`;
    ncrData.forEach(n => {
      html += `<tr><td>${n.id}</td><td>${lang === 'en' ? n.desc_en : n.desc_fr}</td><td>${n.severity.toUpperCase()}</td><td>${n.lot}</td><td>${n.deadline}</td><td>${statusLabel(n.status)}</td></tr>`;
    });
    html += `</table>`;
  }

  // Risks
  if (type !== 'custom' || modules.risk) {
    html += `<h2>5. ${l('Risques', 'Risks')}</h2><table>
<tr><th>Description</th><th>${l('Catégorie', 'Category')}</th><th>${l('Prob.', 'Prob.')}</th><th>Impact</th><th>Score</th><th>${l('Statut', 'Status')}</th></tr>`;
    riskData.forEach(r => {
      html += `<tr><td>${lang === 'en' ? r.desc_en : r.desc_fr}</td><td>${lang === 'en' ? r.category_en : r.category_fr}</td><td>${r.probability}</td><td>${r.impact}</td><td class="${r.score >= 12 ? 'warn' : ''}">${r.score}</td><td>${statusLabel(r.status)}</td></tr>`;
    });
    html += `</table>`;
  }

  // HR
  if (type !== 'custom' || modules.hr) {
    html += `<h2>6. ${l('Effectifs sur site', 'On-site Workforce')}</h2>
<p style="margin-bottom:8px">${l('Total personnel:', 'Total personnel:')} ${kpiData.total_personnel_today}</p><table>
<tr><th>${l('Entreprise', 'Company')}</th><th>${l('Effectif', 'Headcount')}</th></tr>`;
    personnelSummary.forEach(p => {
      html += `<tr><td>${p.company}</td><td>${p.count}</td></tr>`;
    });
    html += `</table>`;
  }

  html += `<div class="footer">${l('Généré le', 'Generated on')} ${new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')} — HospitMan</div>
</div></body></html>`;
  return html;
}

function buildExcelCsv(lang: Language, type: ReportType, modules: Record<string, boolean>) {
  const l = (fr: string, en: string) => lang === 'fr' ? fr : en;
  const statusLabel = (s: string) => t(`status.${s}`, lang);
  const rows: string[][] = [];
  const sep = (title: string) => { rows.push([]); rows.push([`=== ${title} ===`]); };

  sep(l('INDICATEURS CLÉS', 'KEY INDICATORS'));
  rows.push([l('Indicateur', 'Indicator'), l('Valeur', 'Value')]);
  rows.push([l('Avancement Réel', 'Actual Progress'), `${kpiData.overall_progress_actual}%`]);
  rows.push(['SPI', `${kpiData.spi}`]);
  rows.push(['CPI', `${kpiData.cpi}`]);
  rows.push([l('Budget Consommé', 'Budget Consumed'), `${kpiData.budget_consumed_pct}%`]);
  rows.push([l('Jours Restants', 'Days Remaining'), `${kpiData.days_remaining}`]);
  rows.push([l('Risques Critiques', 'Critical Risks'), `${kpiData.active_critical_risks}`]);
  rows.push(['NCR', `${kpiData.open_ncrs}`]);

  if (type !== 'custom' || modules.schedule) {
    sep(l('PLANNING', 'SCHEDULE'));
    rows.push([l('Activité', 'Activity'), 'Lot', l('Début', 'Start'), l('Fin', 'End'), l('Planifié %', 'Planned %'), l('Réel %', 'Actual %'), l('Statut', 'Status')]);
    activityData.forEach(a => rows.push([lang === 'en' ? a.name_en : a.name_fr, a.lot, a.planned_start, a.planned_end, `${a.planned_progress}`, `${a.actual_progress}`, statusLabel(a.status)]));
  }

  if (type !== 'custom' || modules.cost) {
    sep(l('COÛTS', 'COST'));
    rows.push(['Lot', l('Budget Initial', 'Initial Budget'), l('Engagé', 'Committed'), l('Réel', 'Actual'), 'EAC', 'Variance']);
    budgetData.forEach(b => rows.push([lang === 'en' ? b.lot_en : b.lot_fr, `${b.initial}`, `${b.committed}`, `${b.actual}`, `${b.eac}`, `${b.eac - b.initial}`]));
  }

  if (type !== 'custom' || modules.quality) {
    sep('NCR');
    rows.push(['ID', 'Description', l('Sévérité', 'Severity'), 'Lot', 'Deadline', l('Statut', 'Status')]);
    ncrData.forEach(n => rows.push([n.id, lang === 'en' ? n.desc_en : n.desc_fr, n.severity, n.lot, n.deadline, statusLabel(n.status)]));
  }

  if (type !== 'custom' || modules.risk) {
    sep(l('RISQUES', 'RISKS'));
    rows.push(['Description', l('Catégorie', 'Category'), l('Probabilité', 'Probability'), 'Impact', 'Score', l('Statut', 'Status')]);
    riskData.forEach(r => rows.push([lang === 'en' ? r.desc_en : r.desc_fr, lang === 'en' ? r.category_en : r.category_fr, r.probability, r.impact, `${r.score}`, statusLabel(r.status)]));
  }

  if (type !== 'custom' || modules.hr) {
    sep(l('EFFECTIFS', 'WORKFORCE'));
    rows.push([l('Entreprise', 'Company'), l('Effectif', 'Headcount')]);
    personnelSummary.forEach(p => rows.push([p.company, `${p.count}`]));
  }

  // BOM for Excel UTF-8 compat + CSV
  return '\uFEFF' + rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
}

export default function ReportsPage() {
  const { lang } = useLanguage();
  const [weekStart, setWeekStart] = useState('2026-04-27');
  const [weekEnd, setWeekEnd] = useState('2026-05-03');
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [modules, setModules] = useState({
    schedule: true, cost: true, quality: true, risk: true, communication: true, hr: true,
  });
  const [generated, setGenerated] = useState<{ type: string; format: string; date: string }[]>([]);

  const toggleModule = (key: string) => setModules((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  function downloadPDF(type: ReportType) {
    const html = buildPdfHtml(lang, type, weekStart, weekEnd, selectedMonth, modules);
    const win = window.open('', '_blank');
    if (!win) { alert(lang === 'fr' ? 'Veuillez autoriser les popups pour télécharger le PDF' : 'Please allow popups to download PDF'); return; }
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
    setGenerated((prev) => [{ type, format: 'PDF', date: new Date().toLocaleTimeString() }, ...prev]);
  }

  function downloadExcel(type: ReportType) {
    const csv = buildExcelCsv(lang, type, modules);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = type === 'weekly'
      ? `HospitMan_Weekly_${weekStart}.csv`
      : type === 'monthly'
        ? `HospitMan_Monthly_${selectedMonth}.csv`
        : `HospitMan_Custom_${new Date().toISOString().slice(0, 10)}.csv`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setGenerated((prev) => [{ type, format: 'Excel/CSV', date: new Date().toLocaleTimeString() }, ...prev]);
  }

  const moduleLabels: Record<string, Record<string, string>> = {
    schedule: { fr: 'Planning', en: 'Schedule' },
    cost: { fr: 'Coûts / EVM', en: 'Cost / EVM' },
    quality: { fr: 'Qualité / NCR', en: 'Quality / NCR' },
    risk: { fr: 'Risques', en: 'Risks' },
    communication: { fr: 'Communication', en: 'Communication' },
    hr: { fr: 'RH / Effectifs', en: 'HR / Workforce' },
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title"><FileText size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />{lang === 'fr' ? 'Génération de Rapports' : 'Report Generation'}</h1>
        <p className="page-description">{lang === 'fr' ? 'Générez et exportez vos rapports hebdomadaires et mensuels en PDF ou CSV' : 'Generate and export your weekly and monthly reports as PDF or CSV'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Weekly */}
        <div className="chart-card">
          <div className="chart-title"><Calendar size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{lang === 'fr' ? 'Rapport Hebdomadaire' : 'Weekly Report'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr' ? 'KPIs, avancement, coûts, qualité, risques, effectifs.' : 'KPIs, progress, costs, quality, risks, workforce.'}
          </p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Semaine du' : 'Week of'}</label>
              <input className="form-input" type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Au' : 'To'}</label>
              <input className="form-input" type="date" value={weekEnd} onChange={(e) => setWeekEnd(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => downloadPDF('weekly')}><Download size={14} style={{ marginRight: 4 }} />PDF</button>
            <button className="btn btn-secondary" onClick={() => downloadExcel('weekly')}><FileSpreadsheet size={14} style={{ marginRight: 4 }} />CSV</button>
          </div>
        </div>

        {/* Monthly */}
        <div className="chart-card">
          <div className="chart-title"><BarChart3 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{lang === 'fr' ? 'Rapport Mensuel' : 'Monthly Report'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr' ? 'KPIs PMBOK, analyse EVM (SPI, CPI), risques, qualité.' : 'PMBOK KPIs, EVM analysis (SPI, CPI), risks, quality.'}
          </p>
          <div className="form-group">
            <label className="form-label">{lang === 'fr' ? 'Mois' : 'Month'}</label>
            <input className="form-input" type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => downloadPDF('monthly')}><Download size={14} style={{ marginRight: 4 }} />PDF</button>
            <button className="btn btn-secondary" onClick={() => downloadExcel('monthly')}><FileSpreadsheet size={14} style={{ marginRight: 4 }} />CSV</button>
          </div>
        </div>

        {/* Custom */}
        <div className="chart-card">
          <div className="chart-title"><Settings size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{lang === 'fr' ? 'Export Personnalisé' : 'Custom Export'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr' ? 'Sélectionnez les modules à inclure.' : 'Select modules to include.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {Object.entries(modules).map(([key, checked]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={checked} onChange={() => toggleModule(key)} style={{ width: 16, height: 16 }} />
                {moduleLabels[key][lang]}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => downloadPDF('custom')}><Download size={14} style={{ marginRight: 4 }} />PDF</button>
            <button className="btn btn-secondary" onClick={() => downloadExcel('custom')}><FileSpreadsheet size={14} style={{ marginRight: 4 }} />CSV</button>
          </div>
        </div>
      </div>

      {/* History */}
      {generated.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div className="toolbar">
            <h2 style={{ fontSize: 18, fontWeight: 700 }}><CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: '#10b981' }} />{lang === 'fr' ? 'Rapports Générés' : 'Generated Reports'}</h2>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Type</th><th>Format</th><th><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{lang === 'fr' ? 'Heure' : 'Time'}</th></tr></thead>
              <tbody>
                {generated.map((g, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{g.type === 'weekly' ? (lang === 'fr' ? 'Hebdomadaire' : 'Weekly') : g.type === 'monthly' ? (lang === 'fr' ? 'Mensuel' : 'Monthly') : (lang === 'fr' ? 'Personnalisé' : 'Custom')}</td>
                    <td><span className={`badge ${g.format === 'PDF' ? 'badge-danger' : 'badge-success'}`}>{g.format}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{g.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
