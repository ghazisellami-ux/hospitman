'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { scopeLots, scopeCRs, type Language } from '@/lib/demoData';
import { useProjectSettings } from '@/lib/useProjectSettings';
import { autoTranslate } from '@/lib/autoTranslate';
import { Target, FileEdit, X, Users, Plus, Building2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────
interface Contractor { id: number; name: string; speciality_fr: string; speciality_en: string; contact: string; }
interface LotItem { id: number; name_fr: string; name_en: string; desc_fr: string; desc_en: string; contractor: string; status: string; }
interface CRItem { id: number; title_fr: string; title_en: string; cost_impact: number; schedule_impact_days: number; status: string; }

// ── Spécialités pré-remplies pour chantier hôpital/clinique ──
const specialities: { fr: string; en: string }[] = [
  // Gros œuvre & Structure
  { fr: 'Gros Œuvre / Structure', en: 'Structural Work' },
  { fr: 'Fondations spéciales', en: 'Special Foundations' },
  { fr: 'Charpente métallique', en: 'Steel Framework' },
  { fr: 'Béton armé', en: 'Reinforced Concrete' },
  // VRD & Terrassement
  { fr: 'VRD (Voirie et Réseaux Divers)', en: 'Roads & Utilities' },
  { fr: 'Terrassement', en: 'Earthworks' },
  { fr: 'Assainissement', en: 'Drainage & Sewage' },
  { fr: 'Aménagement extérieur / Espaces verts', en: 'Landscaping' },
  // Enveloppe
  { fr: 'Étanchéité', en: 'Waterproofing' },
  { fr: 'Isolation thermique & phonique', en: 'Thermal & Acoustic Insulation' },
  { fr: 'Toiture / Couverture', en: 'Roofing' },
  { fr: 'Façades / Mur rideau', en: 'Facades / Curtain Wall' },
  // Menuiserie
  { fr: 'Menuiserie aluminium', en: 'Aluminum Joinery' },
  { fr: 'Menuiserie bois', en: 'Wood Joinery' },
  { fr: 'Menuiserie métallique / Serrurerie', en: 'Metal Joinery / Ironwork' },
  // Électricité
  { fr: 'Électricité Courant Fort (HTA/BT)', en: 'High Voltage Electrical (HV/LV)' },
  { fr: 'Électricité Courant Faible', en: 'Low Voltage / IT Networks' },
  { fr: 'Groupe électrogène', en: 'Generator Set' },
  { fr: 'Onduleur / ASI', en: 'UPS / Uninterruptible Power' },
  // Fluides
  { fr: 'Plomberie sanitaire', en: 'Plumbing' },
  { fr: 'CVC (Chauffage, Ventilation, Climatisation)', en: 'HVAC' },
  { fr: 'Traitement d\'air / Salle blanche', en: 'Air Handling / Cleanroom' },
  { fr: 'Protection incendie / Sprinkler', en: 'Fire Protection / Sprinkler' },
  // Spécialités médicales
  { fr: 'Gaz médicaux (O₂, N₂O, air, vide)', en: 'Medical Gases (O₂, N₂O, Air, Vacuum)' },
  { fr: 'Fluides médicaux spéciaux', en: 'Special Medical Fluids' },
  { fr: 'Équipements biomédicaux', en: 'Biomedical Equipment' },
  { fr: 'Radiologie / Imagerie médicale', en: 'Radiology / Medical Imaging' },
  { fr: 'Bloc opératoire (aménagement)', en: 'Operating Theater (fit-out)' },
  { fr: 'Stérilisation', en: 'Sterilization' },
  { fr: 'Laboratoire', en: 'Laboratory' },
  // Sécurité & Systèmes
  { fr: 'Sécurité incendie (SSI / CMSI)', en: 'Fire Safety (Detection & Alarm)' },
  { fr: 'Contrôle d\'accès / Vidéosurveillance', en: 'Access Control / CCTV' },
  { fr: 'Appel malade / Interphonie', en: 'Nurse Call / Intercom' },
  { fr: 'Réseau informatique / Câblage', en: 'IT Network / Cabling' },
  { fr: 'Système de gestion technique (GTC/GTB)', en: 'Building Management System (BMS)' },
  // Transport vertical
  { fr: 'Ascenseurs / Monte-charges', en: 'Elevators / Freight Lifts' },
  { fr: 'Transport pneumatique', en: 'Pneumatic Tube System' },
  // Finitions
  { fr: 'Peinture', en: 'Painting' },
  { fr: 'Revêtement de sol (carrelage, vinyle)', en: 'Flooring (Tiles, Vinyl)' },
  { fr: 'Faux plafond', en: 'False Ceiling' },
  { fr: 'Cloisons / Doublage', en: 'Partitions / Lining' },
  { fr: 'Revêtement mural (faïence, HPL)', en: 'Wall Cladding (Tiles, HPL)' },
  // Cuisine & Buanderie
  { fr: 'Cuisine hospitalière', en: 'Hospital Kitchen' },
  { fr: 'Buanderie / Lingerie', en: 'Laundry' },
  // Divers
  { fr: 'Signalétique', en: 'Signage / Wayfinding' },
  { fr: 'Mobilier médical & technique', en: 'Medical & Technical Furniture' },
  { fr: 'Panneaux solaires / Énergie renouvelable', en: 'Solar Panels / Renewable Energy' },
];

// ── Demo contractors ───────────────────────────────────────
const demoContractors: Contractor[] = [
  { id: 1, name: 'BTP STAR', speciality_fr: 'Gros Œuvre / Structure', speciality_en: 'Structural Work', contact: 'contact@btpstar.tn' },
  { id: 2, name: 'VRD Tunisie', speciality_fr: 'Voirie et Réseaux', speciality_en: 'Roads & Utilities', contact: 'info@vrdtunisie.tn' },
  { id: 3, name: 'ElecPro', speciality_fr: 'Électricité', speciality_en: 'Electrical', contact: 'direction@elecpro.tn' },
  { id: 4, name: 'HydroTech', speciality_fr: 'Plomberie Sanitaire', speciality_en: 'Plumbing', contact: 'info@hydrotech.tn' },
  { id: 5, name: 'ClimaPro', speciality_fr: 'CVC / Climatisation', speciality_en: 'HVAC', contact: 'contact@climapro.tn' },
  { id: 6, name: 'AluDesign', speciality_fr: 'Menuiserie Aluminium', speciality_en: 'Aluminum Joinery', contact: 'devis@aludesign.tn' },
  { id: 7, name: 'WaterStop', speciality_fr: 'Étanchéité', speciality_en: 'Waterproofing', contact: 'info@waterstop.tn' },
];

export default function ScopePage() {
  const { lang } = useLanguage();
  const l = lang as Language;
  const { currency } = useProjectSettings();

  // ── Contractors ────────────────────────────────────────
  const [contractors, setContractors] = useState<Contractor[]>(demoContractors);
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [ctrForm, setCtrForm] = useState({ name: '', specialityIdx: -1, contact: '' });

  const handleAddContractor = () => {
    if (!ctrForm.name.trim() || ctrForm.specialityIdx < 0) return;
    const spec = specialities[ctrForm.specialityIdx];
    setContractors(prev => [...prev, {
      id: prev.length + 1,
      name: ctrForm.name,
      speciality_fr: spec.fr,
      speciality_en: spec.en,
      contact: ctrForm.contact,
    }]);
    setShowContractorModal(false);
    setCtrForm({ name: '', specialityIdx: -1, contact: '' });
  };

  // ── Lots ───────────────────────────────────────────────
  const [userLots, setUserLots] = useState<LotItem[]>([]);
  const [showLotModal, setShowLotModal] = useState(false);
  const [lotForm, setLotForm] = useState({ name: '', desc: '', contractor: '', status: 'not_started' });

  const displayLots: LotItem[] = [
    ...scopeLots.map(lot => ({ ...lot })),
    ...userLots,
  ];

  const handleAddLot = () => {
    if (!lotForm.name.trim()) return;
    setUserLots(prev => [...prev, {
      id: displayLots.length + 1,
      name_fr: lotForm.name,
      name_en: autoTranslate(lotForm.name),
      desc_fr: lotForm.desc,
      desc_en: autoTranslate(lotForm.desc),
      contractor: lotForm.contractor,
      status: lotForm.status,
    }]);
    setShowLotModal(false);
    setLotForm({ name: '', desc: '', contractor: '', status: 'not_started' });
  };

  // ── Change Requests ────────────────────────────────────
  const [userCRs, setUserCRs] = useState<CRItem[]>([]);
  const [showCRModal, setShowCRModal] = useState(false);
  const [crForm, setCRForm] = useState({ title: '', cost_impact: 0, schedule_impact_days: 0 });

  const displayCRs: CRItem[] = [
    ...scopeCRs.map(cr => ({
      id: cr.id, title_fr: cr.title_fr, title_en: cr.title_en,
      cost_impact: cr.cost_impact, schedule_impact_days: cr.schedule_impact_days, status: cr.status,
    })),
    ...userCRs,
  ];

  const handleAddCR = () => {
    if (!crForm.title.trim()) return;
    setUserCRs(prev => [...prev, {
      id: displayCRs.length + 1,
      title_fr: crForm.title,
      title_en: autoTranslate(crForm.title),
      cost_impact: crForm.cost_impact,
      schedule_impact_days: crForm.schedule_impact_days,
      status: 'pending',
    }]);
    setShowCRModal(false);
    setCRForm({ title: '', cost_impact: 0, schedule_impact_days: 0 });
  };

  // ── Helpers ────────────────────────────────────────────
  const badge = (status: string) => {
    const m: Record<string, string> = { in_progress: 'badge-info', planned: 'badge-neutral', completed: 'badge-success', not_started: 'badge-neutral', pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
    return m[status] || 'badge-neutral';
  };

  const statusOptions = [
    { value: 'not_started', label: l === 'fr' ? 'Non démarré' : 'Not Started' },
    { value: 'planned', label: l === 'fr' ? 'Planifié' : 'Planned' },
    { value: 'in_progress', label: l === 'fr' ? 'En cours' : 'In Progress' },
    { value: 'completed', label: l === 'fr' ? 'Terminé' : 'Completed' },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('scope.title', lang)}</h1>
      </div>

      {/* ═══ ENTREPRENEURS ═══ */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Building2 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{l === 'fr' ? 'Entrepreneurs' : 'Contractors'}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowContractorModal(true)}><Plus size={14} style={{ marginRight: 4 }} />{l === 'fr' ? 'Ajouter' : 'Add'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th>
            <th>{l === 'fr' ? 'Nom' : 'Name'}</th>
            <th>{l === 'fr' ? 'Spécialité' : 'Speciality'}</th>
            <th>Contact</th>
            <th>{l === 'fr' ? 'Lots Associés' : 'Assigned Lots'}</th>
          </tr></thead>
          <tbody>
            {contractors.map(c => {
              const assigned = displayLots.filter(lot => lot.contractor === c.name).map(lot => lot[`name_${l}`]);
              return (
                <tr key={c.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{l === 'fr' ? c.speciality_fr : c.speciality_en}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.contact}</td>
                  <td>{assigned.length > 0
                    ? assigned.map(n => <span key={n} className="badge badge-info" style={{ marginRight: 4, marginBottom: 2 }}>{n}</span>)
                    : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>{l === 'fr' ? 'Aucun lot' : 'No lots'}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ═══ LOTS ═══ */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Target size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.lots', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowLotModal(true)}>+ {t('scope.addLot', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th><th>{t('common.name', lang)}</th><th>{t('common.description', lang)}</th><th>{l === 'fr' ? 'Entrepreneur' : 'Contractor'}</th><th>{t('common.status', lang)}</th>
          </tr></thead>
          <tbody>
            {displayLots.map(lot => (
              <tr key={lot.id}>
                <td style={{ color: 'var(--text-muted)' }}>{lot.id}</td>
                <td style={{ fontWeight: 600 }}>{lot[`name_${l}`]}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{lot[`desc_${l}`]}</td>
                <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={14} style={{ color: 'var(--text-muted)' }} />{lot.contractor || '—'}</span></td>
                <td><span className={`badge ${badge(lot.status)}`}>{t(`status.${lot.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ CHANGE REQUESTS ═══ */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><FileEdit size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.changeRequests', lang)}</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowCRModal(true)}>+ {l === 'fr' ? 'Nouvelle demande' : 'New request'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th><th>{l === 'fr' ? 'Titre' : 'Title'}</th><th>{l === 'fr' ? 'Impact Coût' : 'Cost Impact'}</th><th>{l === 'fr' ? 'Impact Délai' : 'Schedule Impact'}</th><th>{t('common.status', lang)}</th>
          </tr></thead>
          <tbody>
            {displayCRs.map(cr => (
              <tr key={cr.id}>
                <td style={{ color: 'var(--text-muted)' }}>CR-{cr.id}</td>
                <td style={{ fontWeight: 600 }}>{l === 'fr' ? cr.title_fr : cr.title_en}</td>
                <td style={{ color: '#f59e0b' }}>+{cr.cost_impact.toLocaleString()} {currency}</td>
                <td style={{ color: '#ef4444' }}>+{cr.schedule_impact_days}{l === 'fr' ? 'j' : 'd'}</td>
                <td><span className={`badge ${badge(cr.status)}`}>{t(`status.${cr.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ MODAL: Ajouter Entrepreneur ═══ */}
      {showContractorModal && (
        <div className="modal-overlay" onClick={() => setShowContractorModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{l === 'fr' ? 'Ajouter un Entrepreneur' : 'Add Contractor'}</h3>
              <button className="modal-close" onClick={() => setShowContractorModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? "Nom de l'entreprise" : 'Company Name'} *</label>
              <input className="form-input" placeholder="Ex: SociétéBTP" value={ctrForm.name} onChange={e => setCtrForm({ ...ctrForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Spécialité' : 'Speciality'} *</label>
              <select className="form-select" value={ctrForm.specialityIdx} onChange={e => setCtrForm({ ...ctrForm, specialityIdx: parseInt(e.target.value) })}>
                <option value={-1}>{l === 'fr' ? '-- Choisir une spécialité --' : '-- Choose a speciality --'}</option>
                {specialities.map((s, i) => <option key={i} value={i}>{l === 'fr' ? s.fr : s.en}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Contact (email/tél)' : 'Contact (email/phone)'}</label>
              <input className="form-input" placeholder="contact@company.tn" value={ctrForm.contact} onChange={e => setCtrForm({ ...ctrForm, contact: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowContractorModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddContractor}>{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: Ajouter Lot ═══ */}
      {showLotModal && (
        <div className="modal-overlay" onClick={() => setShowLotModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('scope.addLot', lang)}</h3>
              <button className="modal-close" onClick={() => setShowLotModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Nom du lot' : 'Lot Name'} *</label>
              <input className="form-input" placeholder={l === 'fr' ? 'Ex: Peinture' : 'Ex: Painting'} value={lotForm.name} onChange={e => setLotForm({ ...lotForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder={l === 'fr' ? 'Ex: Peinture intérieure et extérieure des bâtiments' : 'Ex: Interior and exterior building painting'} value={lotForm.desc} onChange={e => setLotForm({ ...lotForm, desc: e.target.value })} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                {l === 'fr' ? '💡 Saisissez en français — la traduction anglaise est automatique' : '💡 Enter in French — English translation is automatic'}
              </span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Entrepreneur' : 'Contractor'} *</label>
                <select className="form-select" value={lotForm.contractor} onChange={e => setLotForm({ ...lotForm, contractor: e.target.value })}>
                  <option value="">{l === 'fr' ? '-- Sélectionner --' : '-- Select --'}</option>
                  {contractors.map(c => <option key={c.id} value={c.name}>{c.name} — {l === 'fr' ? c.speciality_fr : c.speciality_en}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.status', lang)}</label>
                <select className="form-select" value={lotForm.status} onChange={e => setLotForm({ ...lotForm, status: e.target.value })}>
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowLotModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddLot}>{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: Nouvelle Demande CR ═══ */}
      {showCRModal && (
        <div className="modal-overlay" onClick={() => setShowCRModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{l === 'fr' ? 'Nouvelle Demande de Modification' : 'New Change Request'}</h3>
              <button className="modal-close" onClick={() => setShowCRModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Titre' : 'Title'} *</label>
              <input className="form-input" placeholder={l === 'fr' ? 'Ex: Modification emplacement bloc opératoire' : 'Ex: Operating theater location change'} value={crForm.title} onChange={e => setCRForm({ ...crForm, title: e.target.value })} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                {l === 'fr' ? '💡 Saisissez en français — la traduction anglaise est automatique' : '💡 Enter in French — English translation is automatic'}
              </span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Impact Coût' : 'Cost Impact'} ({currency})</label>
                <input className="form-input" type="number" placeholder="0" value={crForm.cost_impact || ''} onChange={e => setCRForm({ ...crForm, cost_impact: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Impact Délai (jours)' : 'Schedule Impact (days)'}</label>
                <input className="form-input" type="number" placeholder="0" value={crForm.schedule_impact_days || ''} onChange={e => setCRForm({ ...crForm, schedule_impact_days: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Lot</label>
              <select className="form-select">
                {displayLots.map(lot => <option key={lot.id} value={lot[`name_${l}`]}>{lot[`name_${l}`]}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCRModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddCR}>{l === 'fr' ? 'Soumettre' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
