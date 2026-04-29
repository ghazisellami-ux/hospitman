'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { scopeLots, scopeCRs, lotNames, type Language } from '@/lib/demoData';
import { Target, FileEdit } from 'lucide-react';

export default function ScopePage() {
  const { lang } = useLanguage();
  const l = lang as Language;
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      in_progress: 'badge-info',
      planned: 'badge-neutral',
      completed: 'badge-success',
      not_started: 'badge-neutral',
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
    };
    return map[status] || 'badge-neutral';
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('scope.title', lang)}</h1>
      </div>

      {/* Lots Table */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Target size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.lots', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('scope.addLot', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('common.name', lang)}</th>
              <th>{t('common.description', lang)}</th>
              <th>{l === 'fr' ? 'Entrepreneur' : 'Contractor'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {scopeLots.map((lot) => (
              <tr key={lot.id}>
                <td style={{ color: 'var(--text-muted)' }}>{lot.id}</td>
                <td style={{ fontWeight: 600 }}>{lot[`name_${l}`]}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{lot[`desc_${l}`]}</td>
                <td>{lot.contractor}</td>
                <td><span className={`badge ${getStatusBadge(lot.status)}`}>{t(`status.${lot.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Requests */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><FileEdit size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.changeRequests', lang)}</h2>
        <button className="btn btn-secondary btn-sm">+ {l === 'fr' ? 'Nouvelle demande' : 'New request'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{l === 'fr' ? 'Titre' : 'Title'}</th>
              <th>{l === 'fr' ? 'Impact Coût' : 'Cost Impact'}</th>
              <th>{l === 'fr' ? 'Impact Délai' : 'Schedule Impact'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {scopeCRs.map((cr) => (
              <tr key={cr.id}>
                <td style={{ color: 'var(--text-muted)' }}>CR-{cr.id}</td>
                <td style={{ fontWeight: 600 }}>{cr[`title_${l}`]}</td>
                <td style={{ color: '#f59e0b' }}>+{cr.cost_impact.toLocaleString()} TND</td>
                <td style={{ color: '#ef4444' }}>+{cr.schedule_impact_days}{l === 'fr' ? 'j' : 'd'}</td>
                <td><span className={`badge ${getStatusBadge(cr.status)}`}>{t(`status.${cr.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lot Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('scope.addLot', lang)}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('common.name', lang)}</label>
                <input className="form-input" placeholder={l === 'fr' ? 'Ex: Gros Œuvre' : 'Ex: Structural Work'} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Entrepreneur' : 'Contractor'}</label>
                <select className="form-select">
                  <option>{l === 'fr' ? '-- Sélectionner --' : '-- Select --'}</option>
                  <option>BTP STAR</option>
                  <option>ElecPro</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder={l === 'fr' ? 'Description du lot...' : 'Lot description...'} />
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
