import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportModal: React.FC = () => {
  const { reportingUser, setReportingUser, submitReport } = useApp();

  const [reason, setReason] = useState('Faux profil / Usurpation');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportingUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reportingUser.id, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportingUser(null);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-base">Signaler un profil</h3>
          </div>
          <button
            onClick={() => setReportingUser(null)}
            className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-gray-900">Signalement reçu</h4>
            <p className="text-xs text-gray-600">
              Merci de préserver la bienveillance de la communauté ZuriMatch. Notre équipe de modération traite ce cas en priorité.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-xs text-gray-600">
              Vous signalez le membre <span className="font-bold text-gray-900">{reportingUser.name}</span> ({reportingUser.city}).
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Motif principal :
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 outline-hidden focus:border-rose-500"
              >
                <option value="Faux profil / Usurpation">Faux profil / Usurpation d’identité</option>
                <option value="Harcèlement ou propos déplacés">Harcèlement ou propos déplacés</option>
                <option value="Photos non conformes ou explicites">Photos non conformes ou explicites</option>
                <option value="Demande d'argent / Arnaque financière">Demande d’argent / Tentative d’escroquerie</option>
                <option value="Utilisateur suspecté d'être mineur (-18 ans)">Utilisateur suspecté d’être mineur (-18 ans)</option>
                <option value="Autre comportement suspect">Autre comportement suspect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Précisions supplémentaires (facultatif) :
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Décrivez ce qui s'est produit pour aider les modérateurs..."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportingUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Envoyer le signalement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
