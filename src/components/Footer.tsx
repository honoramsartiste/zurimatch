import React, { useState } from 'react';
import { Heart, ShieldCheck, Globe, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t, language, setLanguage } = useApp();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'safety' | null>(null);

  return (
    <footer className="bg-[#1E1B2E] text-white pt-14 pb-12 border-t border-purple-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ZuriMatch
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-sm leading-relaxed">
              {t.tagline}
            </p>
            <div className="text-xs text-rose-300 font-semibold italic">
              « {t.slogan} »
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-purple-200/70">
              <li>
                <button
                  onClick={() => setLegalModal('safety')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t.footer.linksSafety}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t.footer.linksTerms}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-white transition cursor-pointer"
                >
                  {t.footer.linksPrivacy}
                </button>
              </li>
            </ul>
          </div>

          {/* International & Language */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Langue & Présence
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                  language === 'fr'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                Français
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                  language === 'en'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                English
              </button>
            </div>
            <p className="text-[11px] text-purple-300/60 leading-normal">
              🇨🇩 Kinshasa • 🇫🇷 Paris • 🇬🇧 Londres • 🇨🇦 Montréal • 🇧🇪 Bruxelles • 🇨🇮 Abidjan
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300/60 gap-4">
          <div>{t.footer.copyright}</div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sécurité certifiée & protection des données RGPD</span>
          </div>
        </div>
      </div>

      {/* Legal & Safety Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white text-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-purple-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {legalModal === 'privacy'
                  ? 'Politique de Confidentialité ZuriMatch'
                  : legalModal === 'terms'
                  ? 'Conditions Générales d’Utilisation'
                  : 'Conseils de Sécurité & Rencontres'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs text-gray-600 leading-relaxed flex-1">
              {legalModal === 'privacy' && (
                <>
                  <p className="font-semibold text-gray-800">
                    1. Collecte Minimale & Respect de la Vie Privée
                  </p>
                  <p>
                    ZuriMatch applique le principe de minimisation des données. Nous ne collectons que les informations indispensables au service de rencontre (prénom, tranche d’âge, photos, centres d’intérêt). Vos coordonnées privées (adresse email, numéro de téléphone, historique de chat privé) ne sont jamais commercialisées ni partagées publiquement.
                  </p>
                  <p className="font-semibold text-gray-800">
                    2. Vos droits RGPD
                  </p>
                  <p>
                    Vous disposez d’un droit absolu d’accès, de rectification, de mise en pause et d’effacement complet de vos données. Une option d’export JSON conforme est disponible en 1 clic dans vos paramètres.
                  </p>
                </>
              )}

              {legalModal === 'terms' && (
                <>
                  <p className="font-semibold text-gray-800">
                    1. Règle absolue des 18 ans et plus
                  </p>
                  <p>
                    L’accès à la plateforme ZuriMatch est strictement réservé aux personnes majeures (18 ans révolus au jour de l’inscription). Tout profil ne respectant pas cette condition fait l’objet d’un bannissement immédiat.
                  </p>
                  <p className="font-semibold text-gray-800">
                    2. Bienveillance et tolérance zéro
                  </p>
                  <p>
                    Tout comportement d’escroquerie financière, harcèlement, usurpation d’identité ou diffusion de contenu explicite non consenti entraîne la résiliation définitive du compte sans préavis.
                  </p>
                </>
              )}

              {legalModal === 'safety' && (
                <>
                  <p className="font-semibold text-gray-800">
                    Nos recommandations pour vos rencontres :
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ne versez jamais d’argent à quelqu’un rencontré en ligne, quel que soit le motif invoqué.</li>
                    <li>Privilégiez les profils arborant le badge de vérification officiel.</li>
                    <li>Pour un premier rendez-vous physique, choisissez toujours un lieu public et fréquenté.</li>
                    <li>Utilisez le bouton de signalement en cas de doute sur la sincérité d’un interlocuteur.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
