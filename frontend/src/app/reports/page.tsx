'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { kpiData, budgetData, activityData, riskData, ncrData, qualityData, personnelSummary, fmt } from '@/lib/reportData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type ReportType = 'weekly' | 'monthly' | 'custom';

export default function ReportsPage() {
  const { lang } = useLanguage();
  const [generating, setGenerating] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState('2026-04-27');
  const [weekEnd, setWeekEnd] = useState('2026-05-03');
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [modules, setModules] = useState({
    schedule: true, cost: true, quality: true, risk: true, communication: true, hr: true,
  });
  const [generated, setGenerated] = useState<{ type: string; format: string; date: string }[]>([]);

  const toggleModule = (key: string) => setModules((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const statusLabel = (s: string) => t(`status.${s}`, lang);

  async function generatePDF(type: ReportType) {
    setGenerating(`${type}-pdf`);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = doc.internal.pageSize.getWidth();
      let y = 15;

      const addTitle = (text: string, size = 16) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        doc.text(text, pageW / 2, y, { align: 'center' });
        y += size * 0.6;
      };

      const addSubtitle = (text: string) => {
        if (y > 260) { doc.addPage(); y = 15; }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(text, 14, y);
        y += 3;
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(14, y, pageW - 14, y);
        y += 6;
      };

      const addText = (text: string, bold = false) => {
        if (y > 270) { doc.addPage(); y = 15; }
        doc.setFontSize(10);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(text, 14, y);
        y += 5;
      };

      // Header
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, pageW, 35, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('HospitMan', pageW / 2, 14, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const subtitle = lang === 'fr' ? 'Hopital Regional 300 Lits - Rapport de Construction' : 'Regional Hospital 300 Beds - Construction Report';
      doc.text(subtitle, pageW / 2, 22, { align: 'center' });

      const reportTitle = type === 'weekly'
        ? (lang === 'fr' ? `Rapport Hebdomadaire: ${weekStart} au ${weekEnd}` : `Weekly Report: ${weekStart} to ${weekEnd}`)
        : type === 'monthly'
          ? (lang === 'fr' ? `Rapport Mensuel: ${selectedMonth}` : `Monthly Report: ${selectedMonth}`)
          : (lang === 'fr' ? 'Rapport Personnalise' : 'Custom Report');
      doc.text(reportTitle, pageW / 2, 30, { align: 'center' });

      y = 45;

      // 1. KPIs
      addSubtitle(lang === 'fr' ? '1. Indicateurs Cles (KPIs)' : '1. Key Performance Indicators');
      autoTable(doc, {
        startY: y,
        head: [[lang === 'fr' ? 'Indicateur' : 'Indicator', lang === 'fr' ? 'Valeur' : 'Value', lang === 'fr' ? 'Cible' : 'Target', 'Status']],
        body: [
          [lang === 'fr' ? 'Avancement Global' : 'Overall Progress', `${kpiData.overall_progress_actual}%`, `${kpiData.overall_progress_planned}%`, kpiData.overall_progress_actual >= kpiData.overall_progress_planned ? 'OK' : (lang === 'fr' ? 'Retard' : 'Delayed')],
          ['SPI', kpiData.spi.toString(), '>= 1.0', kpiData.spi >= 1 ? 'OK' : (lang === 'fr' ? 'Attention' : 'Warning')],
          ['CPI', kpiData.cpi.toString(), '>= 1.0', kpiData.cpi >= 1 ? 'OK' : (lang === 'fr' ? 'Attention' : 'Warning')],
          [lang === 'fr' ? 'Budget Consomme' : 'Budget Consumed', `${kpiData.budget_consumed_pct}%`, '-', '-'],
          [lang === 'fr' ? 'Jours Restants' : 'Days Remaining', kpiData.days_remaining.toString(), '-', '-'],
          [lang === 'fr' ? 'Risques Critiques' : 'Critical Risks', kpiData.active_critical_risks.toString(), '0', kpiData.active_critical_risks > 0 ? (lang === 'fr' ? 'Critique' : 'Critical') : 'OK'],
          ['NCR', kpiData.open_ncrs.toString(), '0', kpiData.open_ncrs > 3 ? (lang === 'fr' ? 'Eleve' : 'High') : 'OK'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;

      // 2. Schedule (if selected)
      if (type !== 'custom' || modules.schedule) {
        addSubtitle(lang === 'fr' ? '2. Planning - Avancement des Activites' : '2. Schedule - Activity Progress');
        autoTable(doc, {
          startY: y,
          head: [[lang === 'fr' ? 'Activite' : 'Activity', 'Lot', lang === 'fr' ? 'Planifie' : 'Planned', lang === 'fr' ? 'Reel' : 'Actual', lang === 'fr' ? 'Ecart' : 'Variance', lang === 'fr' ? 'Statut' : 'Status']],
          body: activityData.map((a) => [
            lang === 'en' ? a.name_en : a.name_fr,
            a.lot,
            `${a.planned_progress}%`,
            `${a.actual_progress}%`,
            `${a.actual_progress - a.planned_progress}%`,
            statusLabel(a.status),
          ]),
          theme: 'striped',
          headStyles: { fillColor: [30, 58, 138], fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // 3. Cost
      if (type !== 'custom' || modules.cost) {
        if (y > 220) { doc.addPage(); y = 15; }
        addSubtitle(lang === 'fr' ? '3. Couts - Suivi Budgetaire' : '3. Cost - Budget Tracking');
        autoTable(doc, {
          startY: y,
          head: [['Lot', lang === 'fr' ? 'Budget Initial' : 'Initial Budget', lang === 'fr' ? 'Engage' : 'Committed', lang === 'fr' ? 'Reel' : 'Actual', 'EAC', 'Variance']],
          body: budgetData.map((b) => [
            lang === 'en' ? b.lot_en : b.lot_fr,
            `${fmt(b.initial)} TND`,
            `${fmt(b.committed)} TND`,
            `${fmt(b.actual)} TND`,
            `${fmt(b.eac)} TND`,
            `${b.eac > b.initial ? '+' : ''}${fmt(b.eac - b.initial)} TND`,
          ]),
          theme: 'striped',
          headStyles: { fillColor: [30, 58, 138], fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // 4. Quality
      if (type !== 'custom' || modules.quality) {
        if (y > 220) { doc.addPage(); y = 15; }
        addSubtitle(lang === 'fr' ? '4. Qualite - Inspections & NCR' : '4. Quality - Inspections & NCR');
        addText(lang === 'fr' ? `Inspections conformes: 42 | Non-conformes: 7 | NCR ouvertes: ${ncrData.length}` : `Conforming inspections: 42 | Non-conforming: 7 | Open NCRs: ${ncrData.length}`);
        autoTable(doc, {
          startY: y,
          head: [['N°', lang === 'fr' ? 'Description' : 'Description', lang === 'fr' ? 'Severite' : 'Severity', 'Lot', 'Deadline', lang === 'fr' ? 'Statut' : 'Status']],
          body: ncrData.map((n) => [n.id, lang === 'en' ? n.desc_en : n.desc_fr, n.severity.toUpperCase(), n.lot, n.deadline, statusLabel(n.status)]),
          theme: 'striped',
          headStyles: { fillColor: [220, 38, 38], fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // 5. Risk
      if (type !== 'custom' || modules.risk) {
        if (y > 220) { doc.addPage(); y = 15; }
        addSubtitle(lang === 'fr' ? '5. Risques' : '5. Risks');
        autoTable(doc, {
          startY: y,
          head: [[lang === 'fr' ? 'Description' : 'Description', lang === 'fr' ? 'Categorie' : 'Category', lang === 'fr' ? 'Prob.' : 'Prob.', 'Impact', 'Score', lang === 'fr' ? 'Statut' : 'Status']],
          body: riskData.map((r) => [
            lang === 'en' ? r.desc_en : r.desc_fr,
            lang === 'en' ? r.category_en : r.category_fr,
            r.probability, r.impact, r.score.toString(), statusLabel(r.status),
          ]),
          theme: 'striped',
          headStyles: { fillColor: [245, 158, 11], textColor: [0, 0, 0], fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // 6. HR
      if (type !== 'custom' || modules.hr) {
        if (y > 240) { doc.addPage(); y = 15; }
        addSubtitle(lang === 'fr' ? '6. Effectifs sur site' : '6. On-site Workforce');
        addText(`${lang === 'fr' ? 'Total personnel aujourd\'hui' : 'Total personnel today'}: ${kpiData.total_personnel_today}`);
        autoTable(doc, {
          startY: y,
          head: [[lang === 'fr' ? 'Entreprise' : 'Company', lang === 'fr' ? 'Effectif' : 'Headcount']],
          body: personnelSummary.map((p) => [p.company, p.count.toString()]),
          theme: 'striped',
          headStyles: { fillColor: [30, 58, 138], fontSize: 9 },
          bodyStyles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
          tableWidth: 100,
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // Footer on each page
      const totalPages = (doc as any).getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`HospitMan - ${lang === 'fr' ? 'Genere le' : 'Generated on'} ${new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}`, 14, 290);
        doc.text(`Page ${i}/${totalPages}`, pageW - 14, 290, { align: 'right' });
      }

      const filename = type === 'weekly'
        ? `HospitMan_Weekly_${weekStart}.pdf`
        : type === 'monthly'
          ? `HospitMan_Monthly_${selectedMonth}.pdf`
          : `HospitMan_Custom_${new Date().toISOString().slice(0, 10)}.pdf`;

      doc.save(filename);
      setGenerated((prev) => [{ type, format: 'PDF', date: new Date().toLocaleTimeString() }, ...prev]);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert(lang === 'fr' ? 'Erreur lors de la generation du PDF' : 'Error generating PDF');
    } finally {
      setGenerating(null);
    }
  }

  async function generateExcel(type: ReportType) {
    setGenerating(`${type}-excel`);
    try {
      const wb = XLSX.utils.book_new();

      // KPIs sheet
      const kpiSheet = [
        [lang === 'fr' ? 'Indicateur' : 'Indicator', lang === 'fr' ? 'Valeur' : 'Value'],
        [lang === 'fr' ? 'Avancement Planifie' : 'Planned Progress', `${kpiData.overall_progress_planned}%`],
        [lang === 'fr' ? 'Avancement Reel' : 'Actual Progress', `${kpiData.overall_progress_actual}%`],
        ['SPI', kpiData.spi],
        ['CPI', kpiData.cpi],
        [lang === 'fr' ? 'Budget Total' : 'Total Budget', kpiData.total_budget],
        [lang === 'fr' ? 'Cout Reel' : 'Actual Cost', kpiData.total_actual_cost],
        [lang === 'fr' ? 'Risques Critiques' : 'Critical Risks', kpiData.active_critical_risks],
        ['NCR', kpiData.open_ncrs],
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpiSheet), 'KPIs');

      if (type !== 'custom' || modules.schedule) {
        const schedSheet = [
          [lang === 'fr' ? 'Activite' : 'Activity', 'Lot', lang === 'fr' ? 'Debut' : 'Start', lang === 'fr' ? 'Fin' : 'End', lang === 'fr' ? 'Planifie %' : 'Planned %', lang === 'fr' ? 'Reel %' : 'Actual %', lang === 'fr' ? 'Statut' : 'Status'],
          ...activityData.map((a) => [lang === 'en' ? a.name_en : a.name_fr, a.lot, a.planned_start, a.planned_end, a.planned_progress, a.actual_progress, statusLabel(a.status)]),
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(schedSheet), lang === 'fr' ? 'Planning' : 'Schedule');
      }

      if (type !== 'custom' || modules.cost) {
        const costSheet = [
          ['Lot', lang === 'fr' ? 'Budget Initial' : 'Initial Budget', lang === 'fr' ? 'Engage' : 'Committed', lang === 'fr' ? 'Reel' : 'Actual', 'EAC', 'Variance'],
          ...budgetData.map((b) => [lang === 'en' ? b.lot_en : b.lot_fr, b.initial, b.committed, b.actual, b.eac, b.eac - b.initial]),
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(costSheet), lang === 'fr' ? 'Couts' : 'Cost');
      }

      if (type !== 'custom' || modules.quality) {
        const qualSheet = [
          ['NCR', lang === 'fr' ? 'Description' : 'Description', lang === 'fr' ? 'Severite' : 'Severity', 'Lot', 'Deadline', lang === 'fr' ? 'Statut' : 'Status'],
          ...ncrData.map((n) => [n.id, lang === 'en' ? n.desc_en : n.desc_fr, n.severity, n.lot, n.deadline, statusLabel(n.status)]),
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(qualSheet), lang === 'fr' ? 'Qualite' : 'Quality');
      }

      if (type !== 'custom' || modules.risk) {
        const riskSheet = [
          [lang === 'fr' ? 'Description' : 'Description', lang === 'fr' ? 'Categorie' : 'Category', lang === 'fr' ? 'Probabilite' : 'Probability', 'Impact', 'Score', lang === 'fr' ? 'Statut' : 'Status'],
          ...riskData.map((r) => [lang === 'en' ? r.desc_en : r.desc_fr, lang === 'en' ? r.category_en : r.category_fr, r.probability, r.impact, r.score, statusLabel(r.status)]),
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(riskSheet), lang === 'fr' ? 'Risques' : 'Risks');
      }

      if (type !== 'custom' || modules.hr) {
        const hrSheet = [
          [lang === 'fr' ? 'Entreprise' : 'Company', lang === 'fr' ? 'Effectif' : 'Headcount'],
          ...personnelSummary.map((p) => [p.company, p.count]),
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(hrSheet), lang === 'fr' ? 'Effectifs' : 'Workforce');
      }

      const filename = type === 'weekly'
        ? `HospitMan_Weekly_${weekStart}.xlsx`
        : type === 'monthly'
          ? `HospitMan_Monthly_${selectedMonth}.xlsx`
          : `HospitMan_Custom_${new Date().toISOString().slice(0, 10)}.xlsx`;

      XLSX.writeFile(wb, filename);
      setGenerated((prev) => [{ type, format: 'Excel', date: new Date().toLocaleTimeString() }, ...prev]);
    } catch (err) {
      console.error('Excel generation error:', err);
      alert(lang === 'fr' ? 'Erreur lors de la generation Excel' : 'Error generating Excel');
    } finally {
      setGenerating(null);
    }
  }

  const moduleLabels: Record<string, Record<string, string>> = {
    schedule: { fr: 'Planning', en: 'Schedule' },
    cost: { fr: 'Couts / EVM', en: 'Cost / EVM' },
    quality: { fr: 'Qualite / NCR', en: 'Quality / NCR' },
    risk: { fr: 'Risques', en: 'Risks' },
    communication: { fr: 'Communication', en: 'Communication' },
    hr: { fr: 'RH / Effectifs', en: 'HR / Workforce' },
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">📄 {lang === 'fr' ? 'Generation de Rapports' : 'Report Generation'}</h1>
        <p className="page-description">{lang === 'fr' ? 'Generez et exportez vos rapports hebdomadaires et mensuels en PDF ou Excel' : 'Generate and export your weekly and monthly reports as PDF or Excel'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Weekly Report */}
        <div className="chart-card">
          <div className="chart-title">📅 {lang === 'fr' ? 'Rapport Hebdomadaire' : 'Weekly Report'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr'
              ? 'Contenu : KPIs, avancement des activites, couts, qualite, risques, effectifs.'
              : 'Content: KPIs, activity progress, costs, quality, risks, workforce.'}
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
            <button className="btn btn-primary" onClick={() => generatePDF('weekly')} disabled={generating !== null}>
              {generating === 'weekly-pdf' ? '⏳...' : '📥 PDF'}
            </button>
            <button className="btn btn-secondary" onClick={() => generateExcel('weekly')} disabled={generating !== null}>
              {generating === 'weekly-excel' ? '⏳...' : '📊 Excel'}
            </button>
          </div>
        </div>

        {/* Monthly Report */}
        <div className="chart-card">
          <div className="chart-title">📊 {lang === 'fr' ? 'Rapport Mensuel' : 'Monthly Report'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr'
              ? 'Contenu : KPIs PMBOK complets, courbe en S, analyse EVM (SPI, CPI), risques, qualite, recommandations.'
              : 'Content: Complete PMBOK KPIs, S-curve, EVM analysis (SPI, CPI), risks, quality, recommendations.'}
          </p>
          <div className="form-group">
            <label className="form-label">{lang === 'fr' ? 'Mois' : 'Month'}</label>
            <input className="form-input" type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => generatePDF('monthly')} disabled={generating !== null}>
              {generating === 'monthly-pdf' ? '⏳...' : '📥 PDF'}
            </button>
            <button className="btn btn-secondary" onClick={() => generateExcel('monthly')} disabled={generating !== null}>
              {generating === 'monthly-excel' ? '⏳...' : '📊 Excel'}
            </button>
          </div>
        </div>

        {/* Custom Export */}
        <div className="chart-card">
          <div className="chart-title">⚙️ {lang === 'fr' ? 'Export Personnalise' : 'Custom Export'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            {lang === 'fr' ? 'Selectionnez les modules a inclure.' : 'Select modules to include.'}
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
            <button className="btn btn-primary" onClick={() => generatePDF('custom')} disabled={generating !== null}>
              {generating === 'custom-pdf' ? '⏳...' : '📥 PDF'}
            </button>
            <button className="btn btn-secondary" onClick={() => generateExcel('custom')} disabled={generating !== null}>
              {generating === 'custom-excel' ? '⏳...' : '📊 Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* History */}
      {generated.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div className="toolbar">
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>✅ {lang === 'fr' ? 'Rapports Generes' : 'Generated Reports'}</h2>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr><th>Type</th><th>Format</th><th>{lang === 'fr' ? 'Heure' : 'Time'}</th></tr></thead>
              <tbody>
                {generated.map((g, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{g.type === 'weekly' ? (lang === 'fr' ? 'Hebdomadaire' : 'Weekly') : g.type === 'monthly' ? (lang === 'fr' ? 'Mensuel' : 'Monthly') : (lang === 'fr' ? 'Personnalise' : 'Custom')}</td>
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
