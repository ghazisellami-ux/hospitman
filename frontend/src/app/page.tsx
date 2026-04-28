'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from './layout';
import { t } from '@/lib/i18n';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TrendingUp, Clock, Coins, BarChart3, CalendarDays, ShieldAlert, ClipboardList, Users, CheckSquare, AlertTriangle } from 'lucide-react';

// Demo data for when API is not available
const demoKPIs = {
  overall_progress_planned: 45.0,
  overall_progress_actual: 38.5,
  spi: 0.86,
  cpi: 0.92,
  budget_consumed_pct: 32.5,
  days_remaining: 485,
  total_budget: 85000000,
  total_actual_cost: 27625000,
  active_critical_risks: 3,
  open_ncrs: 7,
  pending_change_requests: 2,
  total_personnel_today: 245,
};

const demoSCurve = [
  { week_date: 'S1', planned_progress: 2, actual_progress: 1.5, planned_value: 1700, earned_value: 1275, actual_cost: 1400 },
  { week_date: 'S4', planned_progress: 8, actual_progress: 7, planned_value: 6800, earned_value: 5950, actual_cost: 6500 },
  { week_date: 'S8', planned_progress: 16, actual_progress: 14, planned_value: 13600, earned_value: 11900, actual_cost: 13000 },
  { week_date: 'S12', planned_progress: 24, actual_progress: 21, planned_value: 20400, earned_value: 17850, actual_cost: 19500 },
  { week_date: 'S16', planned_progress: 32, actual_progress: 27, planned_value: 27200, earned_value: 22950, actual_cost: 25000 },
  { week_date: 'S20', planned_progress: 40, actual_progress: 34, planned_value: 34000, earned_value: 28900, actual_cost: 31500 },
  { week_date: 'S24', planned_progress: 45, actual_progress: 38.5, planned_value: 38250, earned_value: 32725, actual_cost: 35500 },
];

const demoBudget = [
  { name: 'Gros Œuvre', initial: 25000, committed: 22000, actual: 18000 },
  { name: 'VRD', initial: 8000, committed: 7500, actual: 5200 },
  { name: 'Électricité', initial: 12000, committed: 10000, actual: 3500 },
  { name: 'Plomberie', initial: 9000, committed: 8000, actual: 2800 },
  { name: 'CVC', initial: 15000, committed: 12000, actual: 4000 },
  { name: 'Menuiserie', initial: 6000, committed: 4500, actual: 1200 },
];

const demoQuality = [
  { name: 'Conforme', value: 42, color: '#10b981' },
  { name: 'Non-conforme', value: 7, color: '#ef4444' },
  { name: 'En attente', value: 5, color: '#f59e0b' },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

export default function DashboardPage() {
  const { lang } = useLanguage();
  const [kpis] = useState(demoKPIs);

  const getProgressColor = (planned: number, actual: number) => {
    const ratio = actual / (planned || 1);
    if (ratio >= 0.95) return 'green';
    if (ratio >= 0.8) return 'orange';
    return 'red';
  };

  const getSPIColor = (spi: number) => spi >= 1 ? '#10b981' : spi >= 0.9 ? '#f59e0b' : '#ef4444';
  const getCPIColor = (cpi: number) => cpi >= 1 ? '#10b981' : cpi >= 0.9 ? '#f59e0b' : '#ef4444';

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('dashboard.title', lang)}</h1>
        <p className="page-description">{t('dashboard.subtitle', lang)}</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className={`kpi-card ${getProgressColor(kpis.overall_progress_planned, kpis.overall_progress_actual) === 'green' ? 'success' : getProgressColor(kpis.overall_progress_planned, kpis.overall_progress_actual) === 'orange' ? 'warning' : 'danger'}`}>
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.progress', lang)}</span>
            <div className={`kpi-icon ${kpis.overall_progress_actual >= kpis.overall_progress_planned * 0.95 ? 'success' : 'warning'}`}><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">{kpis.overall_progress_actual}%</div>
          <div className="kpi-sub">{t('common.planned', lang)}: {kpis.overall_progress_planned}%</div>
          <div style={{ marginTop: 8 }}>
            <div className="progress-bar">
              <div className={`progress-bar-fill ${getProgressColor(kpis.overall_progress_planned, kpis.overall_progress_actual)}`} style={{ width: `${kpis.overall_progress_actual}%` }} />
            </div>
          </div>
        </div>

        <div className={`kpi-card ${kpis.spi >= 1 ? 'success' : kpis.spi >= 0.9 ? 'warning' : 'danger'}`}>
          <div className="kpi-header">
            <span className="kpi-label">SPI</span>
            <div className={`kpi-icon ${kpis.spi >= 1 ? 'success' : 'warning'}`}><Clock size={18} /></div>
          </div>
          <div className="kpi-value" style={{ color: getSPIColor(kpis.spi) }}>{kpis.spi}</div>
          <div className="kpi-sub">{t('dashboard.spi', lang)}</div>
        </div>

        <div className={`kpi-card ${kpis.cpi >= 1 ? 'success' : kpis.cpi >= 0.9 ? 'warning' : 'danger'}`}>
          <div className="kpi-header">
            <span className="kpi-label">CPI</span>
            <div className={`kpi-icon ${kpis.cpi >= 1 ? 'success' : 'warning'}`}><Coins size={18} /></div>
          </div>
          <div className="kpi-value" style={{ color: getCPIColor(kpis.cpi) }}>{kpis.cpi}</div>
          <div className="kpi-sub">{t('dashboard.cpi', lang)}</div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.budget', lang)}</span>
            <div className="kpi-icon info"><BarChart3 size={18} /></div>
          </div>
          <div className="kpi-value">{kpis.budget_consumed_pct}%</div>
          <div className="kpi-sub">{formatNumber(kpis.total_actual_cost)} / {formatNumber(kpis.total_budget)} TND</div>
          <div style={{ marginTop: 8 }}>
            <div className="progress-bar">
              <div className="progress-bar-fill blue" style={{ width: `${kpis.budget_consumed_pct}%` }} />
            </div>
          </div>
        </div>

        <div className="kpi-card purple">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.days', lang)}</span>
            <div className="kpi-icon info"><CalendarDays size={18} /></div>
          </div>
          <div className="kpi-value">{kpis.days_remaining}</div>
          <div className="kpi-sub">{lang === 'fr' ? 'jours' : 'days'}</div>
        </div>

        <div className={`kpi-card ${kpis.active_critical_risks > 0 ? 'danger' : 'success'}`}>
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.risks', lang)}</span>
            <div className="kpi-icon danger"><ShieldAlert size={18} /></div>
          </div>
          <div className="kpi-value" style={{ color: kpis.active_critical_risks > 0 ? '#ef4444' : '#10b981' }}>
            {kpis.active_critical_risks}
          </div>
          <div className="kpi-sub">{lang === 'fr' ? 'actifs' : 'active'}</div>
        </div>

        <div className={`kpi-card ${kpis.open_ncrs > 5 ? 'warning' : 'success'}`}>
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.ncrs', lang)}</span>
            <div className="kpi-icon warning"><ClipboardList size={18} /></div>
          </div>
          <div className="kpi-value">{kpis.open_ncrs}</div>
          <div className="kpi-sub">{lang === 'fr' ? 'ouvertes' : 'open'}</div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.personnel', lang)}</span>
            <div className="kpi-icon info"><Users size={18} /></div>
          </div>
          <div className="kpi-value">{kpis.total_personnel_today}</div>
          <div className="kpi-sub">{lang === 'fr' ? 'personnes sur site' : 'on-site'}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        {/* S-Curve */}
        <div className="chart-card full-width">
          <div className="chart-title"><TrendingUp size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('dashboard.scurve', lang)}</div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={demoSCurve}>
              <defs>
                <linearGradient id="gradPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week_date" stroke="#5c6478" fontSize={12} />
              <YAxis stroke="#5c6478" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{ background: '#1a2236', border: '1px solid #334155', borderRadius: 8, color: '#f0f4fc' }}
              />
              <Legend />
              <Area type="monotone" dataKey="planned_progress" name={lang === 'fr' ? 'Planifié' : 'Planned'} stroke="#3b82f6" fill="url(#gradPlanned)" strokeWidth={2} />
              <Area type="monotone" dataKey="actual_progress" name={lang === 'fr' ? 'Réel' : 'Actual'} stroke="#10b981" fill="url(#gradActual)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Breakdown */}
        <div className="chart-card">
          <div className="chart-title"><Coins size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('dashboard.budgetBreakdown', lang)}</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={demoBudget} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#5c6478" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#5c6478" fontSize={11} width={80} />
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #334155', borderRadius: 8, color: '#f0f4fc' }} />
              <Legend />
              <Bar dataKey="initial" name="Budget" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="committed" name={lang === 'fr' ? 'Engagé' : 'Committed'} fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name={lang === 'fr' ? 'Réel' : 'Actual'} fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Pie */}
        <div className="chart-card">
          <div className="chart-title"><CheckSquare size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('dashboard.qualityOverview', lang)}</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={demoQuality}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {demoQuality.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #334155', borderRadius: 8, color: '#f0f4fc' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Heatmap */}
        <div className="chart-card">
          <div className="chart-title"><AlertTriangle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('dashboard.riskMatrix', lang)}</div>
          <div style={{ padding: '12px 0' }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4, fontSize: 10, color: '#5c6478' }}>
              <div style={{ width: 60 }}></div>
              <div style={{ flex: 1, textAlign: 'center' }}>{lang === 'fr' ? 'Mineur' : 'Minor'}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>{lang === 'fr' ? 'Modéré' : 'Moderate'}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>{lang === 'fr' ? 'Majeur' : 'Major'}</div>
              <div style={{ flex: 1, textAlign: 'center' }}>{lang === 'fr' ? 'Critique' : 'Critical'}</div>
            </div>
            {['very_high', 'high', 'medium', 'low', 'very_low'].map((prob) => (
              <div key={prob} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
                <div style={{ width: 60, fontSize: 10, color: '#5c6478', textAlign: 'right', paddingRight: 8 }}>
                  {prob === 'very_high' ? (lang === 'fr' ? 'T.Élevé' : 'V.High') : prob === 'high' ? (lang === 'fr' ? 'Élevé' : 'High') : prob === 'medium' ? (lang === 'fr' ? 'Moyen' : 'Med') : prob === 'low' ? (lang === 'fr' ? 'Faible' : 'Low') : (lang === 'fr' ? 'T.Faible' : 'V.Low')}
                </div>
                {['minor', 'moderate', 'major', 'critical'].map((imp) => {
                  const pScore = { very_low: 1, low: 2, medium: 3, high: 4, very_high: 5 }[prob] || 0;
                  const iScore = { minor: 1, moderate: 2, major: 3, critical: 4 }[imp] || 0;
                  const score = pScore * iScore;
                  const riskCount = (prob === 'high' && imp === 'major') ? 2 : (prob === 'medium' && imp === 'moderate') ? 3 : (prob === 'very_high' && imp === 'critical') ? 1 : 0;
                  const cellClass = score >= 15 ? 'critical' : score >= 10 ? 'high' : score >= 5 ? 'medium' : 'low';
                  return (
                    <div key={`${prob}-${imp}`} className={`risk-cell ${cellClass}`} style={{ flex: 1, height: 44 }}>
                      {riskCount > 0 ? riskCount : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
