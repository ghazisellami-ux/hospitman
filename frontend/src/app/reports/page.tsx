'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { kpiData, budgetData, activityData, riskData, ncrData, personnelSummary, fmt } from '@/lib/reportData';
import { FileText, FileSpreadsheet, Calendar, BarChart3, Settings, Download, CheckCircle, Clock, PieChart, TrendingUp, Activity } from 'lucide-react';
import type { Language } from '@/lib/i18n';

type ReportType = 'weekly' | 'monthly' | 'custom';

function buildPdfHtml(lang: Language, type: ReportType, weekStart: string, weekEnd: string, selectedMonth: string, modules: Record<string, boolean>, charts: Record<string, boolean> = {}) {
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
.chart-container{margin:12px 0 18px;text-align:center}
.chart-container svg{max-width:100%}
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

  // S-Curve Chart
  if (charts.scurve) {
    const scurveData = [
      { w: 'S1', p: 2, a: 1.5 }, { w: 'S4', p: 8, a: 7 }, { w: 'S8', p: 16, a: 14 },
      { w: 'S12', p: 24, a: 21 }, { w: 'S16', p: 32, a: 27 }, { w: 'S20', p: 40, a: 34 }, { w: 'S24', p: 45, a: 38.5 },
    ];
    const svgW = 500, svgH = 200, pad = 40;
    const xStep = (svgW - pad * 2) / (scurveData.length - 1);
    const yScale = (v: number) => svgH - pad - (v / 50) * (svgH - pad * 2);
    const plannedPts = scurveData.map((d, i) => `${pad + i * xStep},${yScale(d.p)}`).join(' ');
    const actualPts = scurveData.map((d, i) => `${pad + i * xStep},${yScale(d.a)}`).join(' ');
    const xLabels = scurveData.map((d, i) => `<text x="${pad + i * xStep}" y="${svgH - 10}" text-anchor="middle" font-size="9" fill="#64748b">${d.w}</text>`).join('');
    html += `<h2>${l('Courbe en S — Avancement', 'S-Curve — Progress')}</h2>
<div class="chart-container"><svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
<rect width="${svgW}" height="${svgH}" fill="#f8fafc" rx="6"/>
${[0, 10, 20, 30, 40, 50].map(v => `<line x1="${pad}" y1="${yScale(v)}" x2="${svgW - pad}" y2="${yScale(v)}" stroke="#e2e8f0" stroke-dasharray="3"/><text x="${pad - 6}" y="${yScale(v) + 3}" text-anchor="end" font-size="8" fill="#94a3b8">${v}%</text>`).join('')}
<polyline points="${plannedPts}" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
<polyline points="${actualPts}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,3"/>
${xLabels}
<circle cx="${svgW - 120}" cy="15" r="4" fill="#3b82f6"/><text x="${svgW - 112}" y="19" font-size="9" fill="#334155">${l('Planifié', 'Planned')}</text>
<circle cx="${svgW - 60}" cy="15" r="4" fill="#10b981"/><text x="${svgW - 52}" y="19" font-size="9" fill="#334155">${l('Réel', 'Actual')}</text>
</svg></div>`;
  }

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

  // Progress Gantt Chart
  if (charts.gantt) {
    const svgW = 500, svgH = 180, pad = 120, barH = 18, gap = 6;
    const bars = activityData.slice(0, 6);
    const rowH = barH + gap;
    const actualH = pad > 0 ? bars.length * rowH + 30 : svgH;
    html += `<h2>${l('Gantt — Avancement', 'Gantt — Progress')}</h2>
<div class="chart-container"><svg viewBox="0 0 ${svgW} ${actualH}" xmlns="http://www.w3.org/2000/svg">
<rect width="${svgW}" height="${actualH}" fill="#f8fafc" rx="6"/>`;
    bars.forEach((a, i) => {
      const y = 12 + i * rowH;
      const name = lang === 'en' ? a.name_en : a.name_fr;
      const maxW = svgW - pad - 20;
      html += `<text x="${pad - 6}" y="${y + barH / 2 + 3}" text-anchor="end" font-size="8" fill="#334155">${name.length > 18 ? name.slice(0, 18) + '…' : name}</text>`;
      html += `<rect x="${pad}" y="${y}" width="${(a.planned_progress / 100) * maxW}" height="${barH / 2}" rx="3" fill="#3b82f6" opacity="0.4"/>`;
      html += `<rect x="${pad}" y="${y + barH / 2}" width="${(a.actual_progress / 100) * maxW}" height="${barH / 2}" rx="3" fill="#10b981"/>`;
      html += `<text x="${pad + Math.max((a.actual_progress / 100) * maxW, (a.planned_progress / 100) * maxW) + 4}" y="${y + barH / 2 + 3}" font-size="8" fill="#64748b">${a.actual_progress}%</text>`;
    });
    html += `</svg></div>`;
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

  // Budget Breakdown Bar Chart
  if (charts.budget_chart) {
    const svgW = 500, svgH = 200, pad = 80, barW = 28;
    const maxVal = Math.max(...budgetData.map(b => b.initial));
    const yScale = (v: number) => svgH - 30 - (v / maxVal) * (svgH - 60);
    const groupW = svgW - pad - 20;
    const step = groupW / budgetData.length;
    html += `<h2>${l('Graphique Budget par Lot', 'Budget Breakdown Chart')}</h2>
<div class="chart-container"><svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
<rect width="${svgW}" height="${svgH}" fill="#f8fafc" rx="6"/>`;
    budgetData.forEach((b, i) => {
      const x = pad + i * step;
      const lotName = lang === 'en' ? b.lot_en : b.lot_fr;
      html += `<rect x="${x}" y="${yScale(b.initial)}" width="${barW / 3}" height="${svgH - 30 - yScale(b.initial)}" fill="#3b82f6" rx="2"/>`;
      html += `<rect x="${x + barW / 3}" y="${yScale(b.committed)}" width="${barW / 3}" height="${svgH - 30 - yScale(b.committed)}" fill="#8b5cf6" rx="2"/>`;
      html += `<rect x="${x + 2 * barW / 3}" y="${yScale(b.actual)}" width="${barW / 3}" height="${svgH - 30 - yScale(b.actual)}" fill="#10b981" rx="2"/>`;
      html += `<text x="${x + barW / 2}" y="${svgH - 14}" text-anchor="middle" font-size="7" fill="#64748b">${lotName.length > 10 ? lotName.slice(0, 10) : lotName}</text>`;
    });
    html += `<circle cx="${svgW - 180}" cy="12" r="4" fill="#3b82f6"/><text x="${svgW - 172}" y="16" font-size="8" fill="#334155">Budget</text>`;
    html += `<circle cx="${svgW - 120}" cy="12" r="4" fill="#8b5cf6"/><text x="${svgW - 112}" y="16" font-size="8" fill="#334155">${l('Engagé', 'Committed')}</text>`;
    html += `<circle cx="${svgW - 55}" cy="12" r="4" fill="#10b981"/><text x="${svgW - 47}" y="16" font-size="8" fill="#334155">${l('Réel', 'Actual')}</text>`;
    html += `</svg></div>`;
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

  // Quality Pie Chart
  if (charts.quality_pie) {
    const data = [
      { label: l('Conforme', 'Conforming'), value: 42, color: '#16a34a' },
      { label: l('Non-conforme', 'Non-conforming'), value: 7, color: '#dc2626' },
      { label: l('En attente', 'Pending'), value: 5, color: '#f59e0b' },
    ];
    const total = data.reduce((s, d) => s + d.value, 0);
    const cx = 120, cy = 100, r = 70;
    let startAngle = -Math.PI / 2;
    let arcs = '';
    data.forEach(d => {
      const angle = (d.value / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      arcs += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${d.color}"/>`;
      startAngle = endAngle;
    });
    const legend = data.map((d, i) =>
      `<circle cx="260" cy="${50 + i * 22}" r="5" fill="${d.color}"/><text x="272" y="${54 + i * 22}" font-size="10" fill="#334155">${d.label}: ${d.value} (${Math.round(d.value / total * 100)}%)</text>`
    ).join('');
    html += `<h2>${l('Camembert Qualité', 'Quality Pie Chart')}</h2>
<div class="chart-container"><svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">
<rect width="420" height="200" fill="#f8fafc" rx="6"/>
${arcs}
<circle cx="${cx}" cy="${cy}" r="35" fill="#f8fafc"/>
<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e3a8a">${total}</text>
<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="8" fill="#64748b">Total</text>
${legend}
</svg></div>`;
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

  // Risk Matrix Heatmap
  if (charts.risk_matrix) {
    const cellSize = 44, pad2 = 60, gap2 = 2;
    const probLabels = ['T.H', l('Élevé', 'High'), l('Moyen', 'Med'), l('Faible', 'Low'), 'T.B'];
    const impLabels = [l('Mineur', 'Minor'), l('Modéré', 'Mod'), l('Majeur', 'Major'), l('Critique', 'Crit')];
    const probs = [5, 4, 3, 2, 1];
    const imps = [1, 2, 3, 4];
    const riskCounts: Record<string, number> = {};
    riskData.forEach(r => {
      const pMap: Record<string, number> = { very_high: 5, high: 4, medium: 3, low: 2, very_low: 1 };
      const iMap: Record<string, number> = { negligible: 1, moderate: 2, major: 3, critical: 4 };
      const key = `${pMap[r.probability] || 3}-${iMap[r.impact] || 2}`;
      riskCounts[key] = (riskCounts[key] || 0) + 1;
    });
    const w = pad2 + impLabels.length * (cellSize + gap2) + 10;
    const h = 30 + probLabels.length * (cellSize + gap2) + 10;
    let cells = '';
    probs.forEach((p, pi) => {
      cells += `<text x="${pad2 - 6}" y="${30 + pi * (cellSize + gap2) + cellSize / 2 + 3}" text-anchor="end" font-size="8" fill="#64748b">${probLabels[pi]}</text>`;
      imps.forEach((im, ii) => {
        const score = p * im;
        const color = score >= 15 ? '#dc2626' : score >= 10 ? '#f59e0b' : score >= 5 ? '#3b82f6' : '#10b981';
        const opacity = score >= 15 ? '0.25' : score >= 10 ? '0.2' : score >= 5 ? '0.15' : '0.1';
        const count = riskCounts[`${p}-${im}`] || 0;
        cells += `<rect x="${pad2 + ii * (cellSize + gap2)}" y="${30 + pi * (cellSize + gap2)}" width="${cellSize}" height="${cellSize}" rx="4" fill="${color}" opacity="${opacity}" stroke="${color}" stroke-width="1"/>`;
        if (count > 0) cells += `<text x="${pad2 + ii * (cellSize + gap2) + cellSize / 2}" y="${30 + pi * (cellSize + gap2) + cellSize / 2 + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="${color}">${count}</text>`;
      });
    });
    const colHeaders = impLabels.map((lb, i) =>
      `<text x="${pad2 + i * (cellSize + gap2) + cellSize / 2}" y="22" text-anchor="middle" font-size="8" fill="#64748b">${lb}</text>`
    ).join('');
    html += `<h2>${l('Matrice des Risques', 'Risk Matrix')}</h2>
<div class="chart-container"><svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
<rect width="${w}" height="${h}" fill="#f8fafc" rx="6"/>
<text x="${pad2 / 2}" y="12" text-anchor="middle" font-size="8" fill="#94a3b8">${l('Prob.', 'Prob.')}</text>
${colHeaders}
${cells}
</svg></div>`;
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
  const [charts, setCharts] = useState({
    scurve: true, gantt: true, budget_chart: true, quality_pie: true, risk_matrix: true,
  });
  const [generated, setGenerated] = useState<{ type: string; format: string; date: string }[]>([]);

  const toggleModule = (key: string) => setModules((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  const toggleChart = (key: string) => setCharts((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  function downloadPDF(type: ReportType) {
    try {
      const html = buildPdfHtml(lang, type, weekStart, weekEnd, selectedMonth, modules, type === 'custom' ? charts : { scurve: true, gantt: true, budget_chart: true, quality_pie: true, risk_matrix: true });
      // Use a hidden iframe to bypass popup blockers
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) { alert('Erreur lors de la génération du PDF'); return; }
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          // Fallback: open in new tab
          const win = window.open('', '_blank');
          if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500); }
        }
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
      }, 600);
      setGenerated((prev) => [{ type, format: 'PDF', date: new Date().toLocaleTimeString() }, ...prev]);
    } catch (e) {
      console.error('PDF generation error:', e);
      alert(lang === 'fr' ? 'Erreur lors de la génération du PDF' : 'Error generating PDF');
    }
  }

  function downloadExcel(type: ReportType) {
    try {
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
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      setGenerated((prev) => [{ type, format: 'Excel/CSV', date: new Date().toLocaleTimeString() }, ...prev]);
    } catch (e) {
      console.error('CSV generation error:', e);
      alert(lang === 'fr' ? 'Erreur lors de la génération du CSV' : 'Error generating CSV');
    }
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
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-title"><Settings size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{lang === 'fr' ? 'Export Personnalisé' : 'Custom Export'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr' ? 'Sélectionnez les modules et graphiques à inclure dans votre rapport.' : 'Select modules and charts to include in your report.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Data Modules */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={15} />{lang === 'fr' ? 'Modules de données' : 'Data Modules'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(modules).map(([key, checked]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleModule(key)} style={{ width: 16, height: 16 }} />
                    {moduleLabels[key][lang]}
                  </label>
                ))}
              </div>
            </div>
            {/* Charts */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BarChart3 size={15} />{lang === 'fr' ? 'Graphiques & Diagrammes' : 'Charts & Diagrams'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(charts).map(([key, checked]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleChart(key)} style={{ width: 16, height: 16 }} />
                    {key === 'scurve' && <><TrendingUp size={14} style={{ color: '#3b82f6' }} />{lang === 'fr' ? 'Courbe en S (Avancement)' : 'S-Curve (Progress)'}</>}
                    {key === 'gantt' && <><Activity size={14} style={{ color: '#10b981' }} />{lang === 'fr' ? 'Gantt — Avancement' : 'Gantt — Progress'}</>}
                    {key === 'budget_chart' && <><BarChart3 size={14} style={{ color: '#8b5cf6' }} />{lang === 'fr' ? 'Histogramme Budget par Lot' : 'Budget Breakdown Bar Chart'}</>}
                    {key === 'quality_pie' && <><PieChart size={14} style={{ color: '#f59e0b' }} />{lang === 'fr' ? 'Camembert Qualité' : 'Quality Pie Chart'}</>}
                    {key === 'risk_matrix' && <><BarChart3 size={14} style={{ color: '#ef4444' }} />{lang === 'fr' ? 'Matrice des Risques' : 'Risk Matrix Heatmap'}</>}
                  </label>
                ))}
              </div>
            </div>
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
