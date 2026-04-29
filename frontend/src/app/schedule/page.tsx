'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { scheduleActivities, biLot, lotNames, type Language } from '@/lib/demoData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BarChart3, ClipboardList, Upload } from 'lucide-react';
import ChartWrapper from '@/components/ChartWrapper';

export default function SchedulePage() {
  const { lang } = useLanguage();
  const l = lang as Language;
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { completed: 'badge-success', in_progress: 'badge-info', delayed: 'badge-danger', not_started: 'badge-neutral' };
    return map[status] || 'badge-neutral';
  };

  const ganttData = scheduleActivities.map(a => ({
    name: a[`name_${l}`],
    planned: a.planned_progress,
    actual: a.actual_progress,
  }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('schedule.title', lang)}</h1>
      </div>

      {/* Gantt-style bar chart */}
      {mounted && (
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title"><BarChart3 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('schedule.gantt', lang)} — {t('schedule.progress', lang)}</div>
        <ChartWrapper height={280}>
          {(w, h) => (
          <BarChart data={ganttData} layout="vertical" width={w} height={h}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" domain={[0, 100]} stroke="#5c6478" fontSize={11} unit="%" />
            <YAxis type="category" dataKey="name" stroke="#5c6478" fontSize={11} width={160} />
            <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #334155', borderRadius: 8, color: '#f0f4fc' }} />
            <Bar dataKey="planned" name={t('common.planned', lang)} fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
            <Bar dataKey="actual" name={t('common.actual', lang)} fill="#10b981" radius={[0, 4, 4, 0]} barSize={14} />
          </BarChart>
          )}
        </ChartWrapper>
      </div>
      )}

      {/* Activities Table */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><ClipboardList size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('schedule.activities', lang)}</h2>
        <div className="toolbar-right">
          <button className="btn btn-secondary btn-sm"><Upload size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{l === 'fr' ? 'Importer CSV' : 'Import CSV'}</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('schedule.addActivity', lang)}</button>
        </div>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('common.name', lang)}</th>
              <th>Lot</th>
              <th>{l === 'fr' ? 'Début Planifié' : 'Planned Start'}</th>
              <th>{l === 'fr' ? 'Fin Planifiée' : 'Planned End'}</th>
              <th>{t('common.planned', lang)} %</th>
              <th>{t('common.actual', lang)} %</th>
              <th>{l === 'fr' ? 'Écart' : 'Variance'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {scheduleActivities.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a[`name_${l}`]}</td>
                <td><span className="badge badge-info">{biLot(a.lot, l)}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.planned_start}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.planned_end}</td>
                <td>{a.planned_progress}%</td>
                <td style={{ fontWeight: 600 }}>{a.actual_progress}%</td>
                <td style={{ color: a.actual_progress >= a.planned_progress ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {a.actual_progress - a.planned_progress >= 0 ? '+' : ''}{a.actual_progress - a.planned_progress}%
                </td>
                <td><span className={`badge ${getStatusBadge(a.status)}`}>{t(`status.${a.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('schedule.addActivity', lang)}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('common.name', lang)}</label>
                <input className="form-input" placeholder={l === 'fr' ? "Nom de l'activité" : 'Activity name'} />
              </div>
              <div className="form-group">
                <label className="form-label">Lot</label>
                <select className="form-select">
                  {lotNames[l].map(lot => <option key={lot}>{lot}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Date début' : 'Start date'}</label>
                <input className="form-input" type="date" />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Date fin' : 'End date'}</label>
                <input className="form-input" type="date" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary">{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
