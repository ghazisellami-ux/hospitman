'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { costBudgets, costInvoices, biLot, invoiceStatusLabels, type Language } from '@/lib/demoData';
import { Coins, Receipt } from 'lucide-react';

const fmt = (n: number) => (n / 1000000).toFixed(2) + 'M';

export default function CostPage() {
  const { lang } = useLanguage();
  const l = lang as Language;
  const totalInitial = costBudgets.reduce((s, b) => s + b.initial, 0);
  const totalActual = costBudgets.reduce((s, b) => s + b.actual, 0);
  const totalEAC = costBudgets.reduce((s, b) => s + b.eac, 0);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('cost.title', lang)}</h1>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi-card info">
          <div className="kpi-label">{l === 'fr' ? 'Budget Total' : 'Total Budget'}</div>
          <div className="kpi-value" style={{ fontSize: 24 }}>{fmt(totalInitial)}</div>
          <div className="kpi-sub">TND</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">{l === 'fr' ? 'Dépenses Réelles' : 'Actual Cost'}</div>
          <div className="kpi-value" style={{ fontSize: 24 }}>{fmt(totalActual)}</div>
          <div className="kpi-sub">{((totalActual / totalInitial) * 100).toFixed(1)}%</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">EAC</div>
          <div className="kpi-value" style={{ fontSize: 24 }}>{fmt(totalEAC)}</div>
          <div className="kpi-sub">{l === 'fr' ? 'Prévision' : 'Forecast'}</div>
        </div>
        <div className={`kpi-card ${totalEAC > totalInitial ? 'danger' : 'success'}`}>
          <div className="kpi-label">{l === 'fr' ? 'Variance' : 'Variance'}</div>
          <div className="kpi-value" style={{ fontSize: 24, color: totalEAC > totalInitial ? '#ef4444' : '#10b981' }}>
            {totalEAC > totalInitial ? '+' : ''}{fmt(totalEAC - totalInitial)}
          </div>
          <div className="kpi-sub">{totalEAC > totalInitial ? (l === 'fr' ? 'Dépassement' : 'Overrun') : 'OK'}</div>
        </div>
      </div>

      {/* Budget Table */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Coins size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('cost.budgets', lang)}</h2>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Lot</th>
              <th>{l === 'fr' ? 'Budget Initial' : 'Initial Budget'}</th>
              <th>{l === 'fr' ? 'Engagé' : 'Committed'}</th>
              <th>{l === 'fr' ? 'Réel' : 'Actual'}</th>
              <th>EAC</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {costBudgets.map((b, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{biLot(b.lot, l)}</td>
                <td>{fmt(b.initial)} TND</td>
                <td>{fmt(b.committed)} TND</td>
                <td style={{ fontWeight: 600 }}>{fmt(b.actual)} TND</td>
                <td>{fmt(b.eac)} TND</td>
                <td style={{ color: b.eac > b.initial ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                  {b.eac > b.initial ? '+' : ''}{fmt(b.eac - b.initial)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoices */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Receipt size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('cost.invoices', lang)}</h2>
        <button className="btn btn-primary btn-sm">+ {t('cost.addInvoice', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Lot</th>
              <th>{l === 'fr' ? 'Montant' : 'Amount'}</th>
              <th>{t('common.date', lang)}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {costInvoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600 }}>{inv.id}</td>
                <td>{biLot(inv.lot, l)}</td>
                <td style={{ fontWeight: 600 }}>{(inv.amount / 1000000).toFixed(2)}M TND</td>
                <td style={{ color: 'var(--text-secondary)' }}>{inv.date}</td>
                <td>
                  <span className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'approved' ? 'badge-info' : 'badge-warning'}`}>
                    {invoiceStatusLabels[inv.status]?.[l] || inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
