'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { commMeetings, commActions, commTypeLabels, type Language } from '@/lib/demoData';
import { MessageSquare, CheckCircle, X } from 'lucide-react';

interface CommItem {
  id: number;
  type: string;
  date: string;
  subject: string;
  participants: string;
}

interface ActionItem {
  id: number;
  desc: string;
  assigned: string;
  deadline: string;
  status: string;
}

const commTypes = ['meeting', 'rfi', 'correspondence', 'minutes'];
const assignees = ['BTP STAR', 'Direction', 'ClimaPro', 'ElecPro', 'HydroTech', 'VRD Tunisie', 'BET Structure'];

export default function CommunicationPage() {
  const { lang } = useLanguage();
  const l = lang as Language;

  const [comms, setComms] = useState<CommItem[]>(
    commMeetings.map(c => ({ id: c.id, type: c.type, date: c.date, subject: c[`subject_${l}`], participants: c.participants }))
  );
  const [actions, setActions] = useState<ActionItem[]>(
    commActions.map(a => ({ id: a.id, desc: a[`desc_${l}`], assigned: a.assigned, deadline: a.deadline, status: a.status }))
  );

  const [showCommModal, setShowCommModal] = useState(false);
  const [commForm, setCommForm] = useState({ type: 'meeting', date: '', subject: '', participants: '' });

  const [showActionModal, setShowActionModal] = useState(false);
  const [actionForm, setActionForm] = useState({ desc: '', assigned: assignees[0], deadline: '' });

  const handleAddComm = () => {
    if (!commForm.subject.trim() || !commForm.date) return;
    const newComm: CommItem = { id: comms.length + 1, type: commForm.type, date: commForm.date, subject: commForm.subject, participants: commForm.participants };
    setComms([...comms, newComm]);
    setShowCommModal(false);
    setCommForm({ type: 'meeting', date: '', subject: '', participants: '' });
  };

  const handleAddAction = () => {
    if (!actionForm.desc.trim() || !actionForm.deadline) return;
    const newAction: ActionItem = { id: actions.length + 1, desc: actionForm.desc, assigned: actionForm.assigned, deadline: actionForm.deadline, status: 'open' };
    setActions([...actions, newAction]);
    setShowActionModal(false);
    setActionForm({ desc: '', assigned: assignees[0], deadline: '' });
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('comm.title', lang)}</h1>
      </div>

      {/* Meetings & Correspondence */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><MessageSquare size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('comm.meetings', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCommModal(true)}>+ {t('comm.add', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Type</th><th>{t('common.date', lang)}</th><th>{l === 'fr' ? 'Objet' : 'Subject'}</th><th>{l === 'fr' ? 'Participants' : 'Participants'}</th></tr></thead>
          <tbody>
            {comms.map((c) => (
              <tr key={c.id}>
                <td><span className="badge badge-info">{commTypeLabels[c.type]?.[l] || c.type}</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.date}</td>
                <td style={{ fontWeight: 600 }}>{c.subject}</td>
                <td style={{ fontSize: 13 }}>{c.participants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Items */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('comm.actions', lang)}</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowActionModal(true)}>+ {l === 'fr' ? 'Nouvelle action' : 'New Action'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>#</th><th>{t('common.description', lang)}</th><th>{l === 'fr' ? 'Assigné à' : 'Assigned To'}</th><th>Deadline</th><th>{t('common.status', lang)}</th></tr></thead>
          <tbody>
            {actions.map((a) => (
              <tr key={a.id}>
                <td style={{ color: 'var(--text-muted)' }}>{a.id}</td>
                <td style={{ fontWeight: 600 }}>{a.desc}</td>
                <td>{a.assigned}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{a.deadline}</td>
                <td><span className={`badge ${a.status === 'open' ? 'badge-warning' : a.status === 'in_progress' ? 'badge-info' : 'badge-success'}`}>{t(`status.${a.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Communication Modal */}
      {showCommModal && (
        <div className="modal-overlay" onClick={() => setShowCommModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('comm.add', lang)}</h3>
              <button className="modal-close" onClick={() => setShowCommModal(false)}><X size={20} /></button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={commForm.type} onChange={(e) => setCommForm({ ...commForm, type: e.target.value })}>
                  {commTypes.map(ct => <option key={ct} value={ct}>{commTypeLabels[ct]?.[l] || ct}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.date', lang)}</label>
                <input className="form-input" type="date" value={commForm.date} onChange={(e) => setCommForm({ ...commForm, date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Objet' : 'Subject'}</label>
              <input className="form-input" placeholder={l === 'fr' ? 'Objet de la communication' : 'Communication subject'} value={commForm.subject} onChange={(e) => setCommForm({ ...commForm, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Participants' : 'Participants'}</label>
              <input className="form-input" placeholder={l === 'fr' ? 'Ex: Direction, BTP STAR...' : 'Ex: Management, BTP STAR...'} value={commForm.participants} onChange={(e) => setCommForm({ ...commForm, participants: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCommModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddComm}>{l === 'fr' ? 'Ajouter' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="modal-overlay" onClick={() => setShowActionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{l === 'fr' ? 'Nouvelle Action' : 'New Action'}</h3>
              <button className="modal-close" onClick={() => setShowActionModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder={l === 'fr' ? "Description de l'action..." : 'Action description...'} value={actionForm.desc} onChange={(e) => setActionForm({ ...actionForm, desc: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Assigné à' : 'Assigned To'}</label>
                <select className="form-select" value={actionForm.assigned} onChange={(e) => setActionForm({ ...actionForm, assigned: e.target.value })}>
                  {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={actionForm.deadline} onChange={(e) => setActionForm({ ...actionForm, deadline: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowActionModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddAction}>{l === 'fr' ? 'Ajouter' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
