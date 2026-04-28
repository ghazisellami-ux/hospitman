'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { Target, FileEdit } from 'lucide-react';

const demoLots = [
  { id: 1, name: 'Gros Œuvre', description: 'Structure béton armé, fondations', contractor: 'BTP STAR', status: 'in_progress' },
  { id: 2, name: 'VRD', description: 'Voirie et Réseaux Divers', contractor: 'VRD Tunisie', status: 'in_progress' },
  { id: 3, name: 'Électricité Courant Fort', description: 'Distribution électrique, TGBT', contractor: 'ElecPro', status: 'planned' },
  { id: 4, name: 'Électricité Courant Faible', description: 'Réseau informatique, sécurité', contractor: 'ElecPro', status: 'planned' },
  { id: 5, name: 'Plomberie Sanitaire', description: 'Alimentation eau, évacuation', contractor: 'HydroTech', status: 'not_started' },
  { id: 6, name: 'CVC', description: 'Chauffage, Ventilation, Climatisation', contractor: 'ClimaPro', status: 'not_started' },
  { id: 7, name: 'Menuiserie Aluminium', description: 'Portes, fenêtres, mur rideau', contractor: 'AluDesign', status: 'planned' },
  { id: 8, name: 'Étanchéité', description: 'Étanchéité toiture et sous-sol', contractor: 'WaterStop', status: 'not_started' },
];

const demoCRs = [
  { id: 1, title: 'Modification emplacement bloc opératoire', cost_impact: 150000, schedule_impact_days: 15, status: 'pending' },
  { id: 2, title: 'Ajout système gaz médicaux supplémentaire', cost_impact: 85000, schedule_impact_days: 7, status: 'approved' },
];

export default function ScopePage() {
  const { lang } = useLanguage();
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
              <th>{lang === 'fr' ? 'Entrepreneur' : 'Contractor'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {demoLots.map((lot) => (
              <tr key={lot.id}>
                <td style={{ color: 'var(--text-muted)' }}>{lot.id}</td>
                <td style={{ fontWeight: 600 }}>{lot.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{lot.description}</td>
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
        <button className="btn btn-secondary btn-sm">+ {lang === 'fr' ? 'Nouvelle demande' : 'New request'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{lang === 'fr' ? 'Titre' : 'Title'}</th>
              <th>{lang === 'fr' ? 'Impact Coût' : 'Cost Impact'}</th>
              <th>{lang === 'fr' ? 'Impact Délai' : 'Schedule Impact'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {demoCRs.map((cr) => (
              <tr key={cr.id}>
                <td style={{ color: 'var(--text-muted)' }}>CR-{cr.id}</td>
                <td style={{ fontWeight: 600 }}>{cr.title}</td>
                <td style={{ color: '#f59e0b' }}>+{cr.cost_impact.toLocaleString()} TND</td>
                <td style={{ color: '#ef4444' }}>+{cr.schedule_impact_days}j</td>
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
                <input className="form-input" placeholder="Ex: Gros Œuvre" />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Entrepreneur' : 'Contractor'}</label>
                <select className="form-select">
                  <option>-- Sélectionner --</option>
                  <option>BTP STAR</option>
                  <option>ElecPro</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder="Description du lot..." />
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
