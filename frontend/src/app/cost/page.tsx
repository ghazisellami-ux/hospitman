'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { Coins, Receipt } from 'lucide-react';

const demoBudgets = [
  { lot: 'Gros Œuvre', initial: 25000000, committed: 22000000, actual: 18000000, eac: 26500000 },
  { lot: 'VRD', initial: 8000000, committed: 7500000, actual: 5200000, eac: 8200000 },
  { lot: 'Électricité CF', initial: 12000000, committed: 10000000, actual: 3500000, eac: 12500000 },
  { lot: 'Plomberie', initial: 9000000, committed: 8000000, actual: 2800000, eac: 9100000 },
  { lot: 'CVC', initial: 15000000, committed: 12000000, actual: 4000000, eac: 15800000 },
  { lot: 'Menuiserie', initial: 6000000, committed: 4500000, actual: 1200000, eac: 6000000 },
];

const demoInvoices = [
  { id: 'DEC-001', lot: 'Gros Œuvre', amount: 3500000, date: '2026-04-15', status: 'paid' },
  { id: 'DEC-002', lot: 'VRD', amount: 1200000, date: '2026-04-20', status: 'approved' },
  { id: 'DEC-003', lot: 'Gros Œuvre', amount: 4200000, date: '2026-04-25', status: 'pending' },
];

const fmt = (n: number) => (n / 1000000).toFixed(2) + 'M';

export default function CostPage() {
  const { lang } = useLanguage();
  const totalInitial = demoBudgets.reduce((s, b) => s + b.initial, 0);
  const totalActual = demoBudgets.reduce((s, b) => s + b.actual, 0);
  const totalEAC = demoBudgets.reduce((s, b) => s + b.eac, 0);

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('cost.title', lang)}</h1>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi-card info">
          <div className="kpi-label">{lang === 'fr' ? 'Budget Total' : 'Total Budget'}</div>
          <div className="kpi-value" style={{ fontSize: 24 }}>{fmt(totalInitial)}</div>
          <div className="kpi-sub">TND</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">{lang === 'fr' ? 'Dépenses Réelles' : 'Actual Cost'}</div>
          <div className="kpi-value" style={{ fontSize: 24 }}>{fmt(totalActual)}</div>
          <div className="kpi-sub">{((totalActual / totalInitial) * 100).toFixed(1)}%</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">EAC</div>
          <div className="kpi-value" style={{ fontSize: 24 }}>{fmt(totalEAC)}</div>
          <div className="kpi-sub">{lang === 'fr' ? 'Prévision' : 'Forecast'}</div>
        </div>
        <div className={`kpi-card ${totalEAC > totalInitial ? 'danger' : 'success'}`}>
          <div className="kpi-label">{lang === 'fr' ? 'Variance' : 'Variance'}</div>
          <div className="kpi-value" style={{ fontSize: 24, color: totalEAC > totalInitial ? '#ef4444' : '#10b981' }}>
            {totalEAC > totalInitial ? '+' : ''}{fmt(totalEAC - totalInitial)}
          </div>
          <div className="kpi-sub">{totalEAC > totalInitial ? (lang === 'fr' ? 'Dépassement' : 'Overrun') : 'OK'}</div>
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
              <th>{lang === 'fr' ? 'Budget Initial' : 'Initial Budget'}</th>
              <th>{lang === 'fr' ? 'Engagé' : 'Committed'}</th>
              <th>{lang === 'fr' ? 'Réel' : 'Actual'}</th>
              <th>EAC</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {demoBudgets.map((b, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{b.lot}</td>
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
              <th>{lang === 'fr' ? 'Montant' : 'Amount'}</th>
              <th>{t('common.date', lang)}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {demoInvoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600 }}>{inv.id}</td>
                <td>{inv.lot}</td>
                <td style={{ fontWeight: 600 }}>{(inv.amount / 1000000).toFixed(2)}M TND</td>
                <td style={{ color: 'var(--text-secondary)' }}>{inv.date}</td>
                <td>
                  <span className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'approved' ? 'badge-info' : 'badge-warning'}`}>
                    {inv.status === 'paid' ? (lang === 'fr' ? 'Payé' : 'Paid') : inv.status === 'approved' ? (lang === 'fr' ? 'Approuvé' : 'Approved') : (lang === 'fr' ? 'En attente' : 'Pending')}
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
