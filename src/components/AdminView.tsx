import React, { useState } from 'react';
import {
  Shield,
  Users,
  Heart,
  TrendingUp,
  DollarSign,
  Search,
  CheckCircle,
  AlertTriangle,
  Ban,
  RotateCcw,
  Sliders,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminView: React.FC = () => {
  const {
    t,
    profiles,
    matches,
    conversations,
    reports,
    adminVerifyUser,
    adminSuspendUser,
    adminBanUser,
    adminRestoreUser,
    adminReviewReport,
    adminUpdateDailyLikeLimit,
    dailyLikeLimit,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'config'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempLikeLimit, setTempLikeLimit] = useState(dailyLikeLimit);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // KPIs
  const totalMembers = profiles.length;
  const activeMembers = profiles.filter((p) => !p.isBanned && !p.isSuspended).length;
  const totalMatches = matches.length;
  const premiumMembers = profiles.filter((p) => p.isPremium).length;
  const estimatedRevenue = premiumMembers * 44.99; // approx
  const conversionRate = totalMembers > 0 ? ((premiumMembers / totalMembers) * 100).toFixed(1) : '0';

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-950 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/80 text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.admin.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{t.admin.title}</h1>
          <p className="text-xs text-purple-200 mt-1">
            Supervision globale, contrôle de sécurité, modération et monétisation de ZuriMatch.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: t.admin.tabOverview, icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'users', label: t.admin.tabUsers, icon: <Users className="w-4 h-4" /> },
            {
              id: 'moderation',
              label: `${t.admin.tabModeration} (${pendingReports.length})`,
              icon: <AlertTriangle className="w-4 h-4" />,
            },
            { id: 'config', label: t.admin.tabConfig, icon: <Sliders className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-purple-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  {t.admin.statsMembers}
                </p>
                <div className="text-3xl font-black text-gray-900 mt-1">{totalMembers}</div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  100% profils fonctionnels
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  {t.admin.statsActive}
                </p>
                <div className="text-3xl font-black text-purple-900 mt-1">{activeMembers}</div>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">
                  En règle avec la charte
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  {t.admin.statsMatches}
                </p>
                <div className="text-3xl font-black text-rose-600 mt-1">{totalMatches}</div>
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {conversations.length} conversations ouvertes
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-current" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  {t.admin.statsRevenue}
                </p>
                <div className="text-3xl font-black text-emerald-700 mt-1">
                  ${estimatedRevenue.toFixed(0)}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {conversionRate}% taux de conversion VIP
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Security & Integrity Summary */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-700" />
              <span>Garanties d’intégrité et de sécurité ZuriMatch</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <div className="font-bold text-purple-900">Vérification 18+ stricte</div>
                <p>Aucun utilisateur mineur n’est admis lors de l’onboarding ou des sessions.</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <div className="font-bold text-purple-900">Isolation des données privées</div>
                <p>Les emails et numéros de téléphone sont protégés et jamais transmis publiquement.</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <div className="font-bold text-purple-900">Paiements cloisonnés</div>
                <p>Intégration Stripe Sandbox et passerelles Mobile Money sécurisées sans stockage de cartes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER DIRECTORY & MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden space-y-4 animate-in fade-in">
          {/* Search bar */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.admin.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-purple-600"
              />
            </div>
            <span className="text-xs text-gray-500 font-semibold whitespace-nowrap">
              {filteredProfiles.length} résultat{filteredProfiles.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7FC] text-gray-600 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-3.5">Membre</th>
                  <th className="p-3.5">Localisation</th>
                  <th className="p-3.5">Rôle & Statut</th>
                  <th className="p-3.5">Vérifié</th>
                  <th className="p-3.5">Formule</th>
                  <th className="p-3.5 text-right">Actions Modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/30 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.photos[0]}
                          alt={p.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{p.name}, {p.age}</div>
                          <div className="text-[10px] text-gray-400">{p.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-gray-700">{p.city}, {p.country}</span>
                    </td>

                    <td className="p-3.5">
                      {p.isBanned ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Banni
                        </span>
                      ) : p.isSuspended ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Suspendu
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Actif
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {p.isVerified ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" />
                          <span>Oui</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            adminVerifyUser(p.id);
                            showToast(`Profil de ${p.name} vérifié.`);
                          }}
                          className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-[10px] font-bold cursor-pointer"
                        >
                          {t.admin.actionVerify}
                        </button>
                      )}
                    </td>

                    <td className="p-3.5">
                      {p.isPremium ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                          VIP Premium
                        </span>
                      ) : (
                        <span className="text-gray-400">Gratuit</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      {p.isBanned ? (
                        <button
                          onClick={() => {
                            adminRestoreUser(p.id);
                            showToast(`Compte de ${p.name} rétabli.`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] font-bold cursor-pointer"
                        >
                          {t.admin.actionRestore}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              adminSuspendUser(p.id);
                              showToast(`Statut suspension modifié pour ${p.name}.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] font-bold cursor-pointer"
                          >
                            {p.isSuspended ? 'Réactiver' : t.admin.actionSuspend}
                          </button>
                          <button
                            onClick={() => {
                              adminBanUser(p.id);
                              showToast(`Membre ${p.name} banni.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] font-bold cursor-pointer"
                          >
                            {t.admin.actionBan}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MODERATION REPORTS */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t.admin.reportsQueue}</h2>
              <p className="text-xs text-gray-500">
                Traitez les signalements des membres pour garantir un espace bienveillant.
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
              {pendingReports.length} en attente
            </span>
          </div>

          {pendingReports.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              {t.admin.noReports}
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReports.map((r) => {
                const reportedUser = profiles.find((p) => p.id === r.reportedUserId);
                return (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 text-[10px] font-black uppercase">
                          Signalement
                        </span>
                        <span className="font-bold text-xs text-gray-900">
                          Membre signalé : {reportedUser?.name || r.reportedUserId} ({reportedUser?.city})
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 font-semibold">
                        Motif : {r.reason}
                      </p>
                      {r.details && (
                        <p className="text-[11px] text-gray-500 italic">
                          Détails : « {r.details} »
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          adminReviewReport(r.id, 'dismiss');
                          showToast('Signalement classé sans suite.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold cursor-pointer"
                      >
                        Rejeter
                      </button>
                      <button
                        onClick={() => {
                          adminReviewReport(r.id, 'ban');
                          showToast(`Utilisateur banni.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Bannir le compte</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PLATFORM CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6 animate-in fade-in">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            {t.admin.tabConfig}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily like limit config */}
            <div className="p-5 rounded-2xl bg-[#FAF7FC] border border-purple-100 space-y-3">
              <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                {t.admin.configLikesTitle}
              </h3>
              <p className="text-xs text-gray-500">
                Nombre de profils qu’un membre gratuit peut liker par période de 24 heures.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={tempLikeLimit}
                  onChange={(e) => setTempLikeLimit(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-white"
                />
                <button
                  onClick={() => {
                    adminUpdateDailyLikeLimit(tempLikeLimit);
                    showToast(`Limite mise à jour : ${tempLikeLimit} likes/jour.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {t.admin.saveConfig}
                </button>
              </div>
            </div>

            {/* Language Availability */}
            <div className="p-5 rounded-2xl bg-[#FAF7FC] border border-purple-100 space-y-3">
              <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                Langues disponibles sur la plateforme
              </h3>
              <p className="text-xs text-gray-500">
                Gérez les langues supportées. Le système est conçu pour l’ajout aisé de nouvelles langues.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Français (Actif)</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>English (Active)</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-semibold">
                  Lingala (Bientôt)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
