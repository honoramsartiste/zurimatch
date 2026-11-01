import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Globe2,
  Users,
  Compass,
  Crown,
  Check,
  ChevronDown,
  ArrowRight,
  MapPin,
  Lock,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const {
    t,
    setActiveTab,
    setAuthModalOpen,
    setAuthModalMode,
    setPremiumModalOpen,
    profiles,
    currentUser,
  } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const previewProfiles = profiles.slice(0, 4);

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7FC]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-purple-100/60 bg-radial-[at_top_right] from-purple-100/50 via-rose-50/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mission & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-purple-200/80 shadow-xs text-xs font-semibold text-purple-900">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E1B2E] leading-[1.12]">
                Là où les cœurs d’Afrique et du monde se rencontrent{' '}
                <span className="bg-gradient-to-r from-purple-700 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                  avec élégance.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (currentUser) {
                      setActiveTab('discover');
                    } else {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-rose-500 hover:from-purple-800 hover:to-rose-600 text-white font-bold text-base shadow-lg shadow-purple-600/25 hover:shadow-xl transition-all cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span>{t.hero.ctaFind}</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-purple-50/60 border border-purple-200 text-purple-900 font-semibold text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span>{t.hero.ctaHow}</span>
                </button>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-100">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-purple-900">12 500+</div>
                  <div className="text-xs text-gray-500 font-medium">Célibataires vérifiés</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-rose-600">45 000+</div>
                  <div className="text-xs text-gray-500 font-medium">Connexions créées</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">4.9 / 5</div>
                  <div className="text-xs text-gray-500 font-medium">Satisfaction membres</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Collage of Real Profiles */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Background decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-400/20 to-rose-400/20 rounded-3xl blur-2xl -z-10" />

                {/* Primary Spotlight Card */}
                <div className="bg-white rounded-3xl p-3 shadow-2xl border border-purple-100 overflow-hidden transform hover:-translate-y-1 transition-transform">
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <img
                      src={previewProfiles[1]?.photos[0]}
                      alt={previewProfiles[1]?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-purple-900">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>96% Compatibilité</span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>Vérifiée</span>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{previewProfiles[1]?.name}, {previewProfiles[1]?.age}</h2>
                      </div>
                      <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-300" />
                        {previewProfiles[1]?.city}, {previewProfiles[1]?.country}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {previewProfiles[1]?.interests.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-medium rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Preview */}
                  <div className="flex items-center justify-between p-3 mt-1 bg-purple-50/50 rounded-2xl">
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-purple-900">Amina</span> est actuellement en ligne à Kinshasa
                    </div>
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="px-3 py-1.5 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-xs transition"
                    >
                      Découvrir
                    </button>
                  </div>
                </div>

                {/* Floating mini badge: Paris & London diaspora */}
                <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div className="text-left pr-2">
                    <div className="text-xs font-bold text-gray-900">Diaspora Connectée</div>
                    <div className="text-[10px] text-gray-500">Paris • Bruxelles • Montréal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMENT FONCTIONNE ZURIMATCH */}
      <section id="how-it-works-section" className="py-16 md:py-24 bg-white border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Expérience Pensée Pour Vous
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B2E]">
              {t.howItWorks.title}
            </h2>
            <p className="text-base text-gray-600">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Step 1 */}
            <div className="bg-[#FAF7FC] p-7 rounded-3xl border border-purple-100/80 hover:border-purple-300 transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.howItWorks.step1Title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.howItWorks.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF7FC] p-7 rounded-3xl border border-purple-100/80 hover:border-purple-300 transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.howItWorks.step2Title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.howItWorks.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF7FC] p-7 rounded-3xl border border-purple-100/80 hover:border-purple-300 transition-all shadow-xs group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform mb-5">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.howItWorks.step3Title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.howItWorks.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DÉCOUVRIR DES PROFILS COMPATIBLES */}
      <section className="py-16 md:py-24 bg-[#FAF7FC] border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Membres Actifs
              </span>
              <h2 className="text-3xl font-extrabold text-[#1E1B2E] mt-2">
                {t.discoveryPreview.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t.discoveryPreview.subtitle}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('discover')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition self-start md:self-auto cursor-pointer"
            >
              <span>{t.discoveryPreview.exploreCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => setActiveTab('discover')}
                className="group bg-white rounded-3xl overflow-hidden border border-purple-100/80 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base">{profile.name}, {profile.age}</span>
                      {profile.isVerified && <BadgeCheck className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-xs text-white/80 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {profile.city}, {profile.country}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-md border border-purple-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RENCONTRER SELON SES INTÉRÊTS */}
      <section className="py-16 bg-white border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Passions & Affinités
          </span>
          <h2 className="text-3xl font-extrabold text-[#1E1B2E] mt-3">
            {t.interestsSection.title}
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto mt-2">
            {t.interestsSection.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 mt-8 max-w-4xl mx-auto">
            {t.interestsSection.tags.map((tag, idx) => {
              const isSelected = selectedInterest === tag;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedInterest(isSelected ? null : tag)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-700 text-white shadow-md'
                      : 'bg-purple-50/70 hover:bg-purple-100 text-purple-900 border border-purple-200/60'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setActiveTab('discover')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-md transition"
            >
              <span>Explorer les profils correspondants</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. TABLEAU COMPARATIF GRATUIT VS PREMIUM */}
      <section className="py-16 md:py-24 bg-[#FAF7FC] border-b border-purple-100/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Transparence & Valeur
            </span>
            <h2 className="text-3xl font-extrabold text-[#1E1B2E]">
              {t.comparison.title}
            </h2>
            <p className="text-sm text-gray-600">
              {t.comparison.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="grid grid-cols-12 bg-purple-950 text-white p-4 sm:p-5 font-bold text-xs sm:text-sm">
              <div className="col-span-6">{t.comparison.colFeature}</div>
              <div className="col-span-3 text-center text-purple-200">{t.comparison.colFree}</div>
              <div className="col-span-3 text-center text-amber-300 flex items-center justify-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>{t.comparison.colPremium}</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 text-xs sm:text-sm">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f1}</div>
                <div className="col-span-3 text-center text-emerald-600 font-semibold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div className="col-span-3 text-center text-emerald-600 font-semibold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-gray-50/50">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f2}</div>
                <div className="col-span-3 text-center text-emerald-600 font-semibold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div className="col-span-3 text-center text-emerald-600 font-semibold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f3}</div>
                <div className="col-span-3 text-center text-gray-600 font-medium">{t.comparison.f3Free}</div>
                <div className="col-span-3 text-center text-purple-700 font-bold">{t.comparison.f3Premium}</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-gray-50/50">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f4}</div>
                <div className="col-span-3 text-center text-emerald-600 font-semibold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div className="col-span-3 text-center text-emerald-600 font-semibold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f5}</div>
                <div className="col-span-3 text-center text-gray-400">{t.comparison.notIncluded}</div>
                <div className="col-span-3 text-center text-emerald-600 font-bold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-gray-50/50">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f6}</div>
                <div className="col-span-3 text-center text-gray-400">{t.comparison.notIncluded}</div>
                <div className="col-span-3 text-center text-emerald-600 font-bold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f7}</div>
                <div className="col-span-3 text-center text-gray-400">{t.comparison.notIncluded}</div>
                <div className="col-span-3 text-center text-emerald-600 font-bold flex justify-center">
                  <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-purple-50/40">
                <div className="col-span-6 font-medium text-gray-800">{t.comparison.f8}</div>
                <div className="col-span-3 text-center text-gray-400">{t.comparison.notIncluded}</div>
                <div className="col-span-3 text-center text-purple-700 font-bold">5 offerts / mois</div>
              </div>
            </div>

            <div className="p-5 bg-gray-50 text-center border-t border-gray-100">
              <button
                onClick={() => setPremiumModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>{t.comparison.upgradeNow}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SÉCURITÉ ET PROTECTION DES MEMBRES */}
      <section className="py-16 md:py-20 bg-white border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Sérénité & Confiance
            </span>
            <h2 className="text-3xl font-extrabold text-[#1E1B2E]">
              {t.security.title}
            </h2>
            <p className="text-sm text-gray-600">
              {t.security.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF7FC] p-6 rounded-3xl border border-purple-100 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">{t.security.c1Title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t.security.c1Desc}</p>
            </div>

            <div className="bg-[#FAF7FC] p-6 rounded-3xl border border-purple-100 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">{t.security.c2Title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t.security.c2Desc}</p>
            </div>

            <div className="bg-[#FAF7FC] p-6 rounded-3xl border border-purple-100 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">{t.security.c3Title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t.security.c3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TÉMOIGNAGES DE DÉMONSTRATION (CLAIREMENT IDENTIFIÉS COMME FICTIFS) */}
      <section className="py-16 md:py-20 bg-[#FAF7FC] border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <div className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-[11px] font-semibold">
              {t.testimonials.demoNotice}
            </div>
            <h2 className="text-3xl font-extrabold text-[#1E1B2E]">
              {t.testimonials.title}
            </h2>
            <p className="text-sm text-gray-600">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                « {t.testimonials.t1.quote} »
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-purple-900">
                {t.testimonials.t1.author}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                « {t.testimonials.t2.quote} »
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-purple-900">
                {t.testimonials.t2.author}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                « {t.testimonials.t3.quote} »
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-purple-900">
                {t.testimonials.t3.author}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. QUESTIONS FRÉQUENTES (FAQ ACCORDIONS) */}
      <section className="py-16 md:py-20 bg-white border-b border-purple-100/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Assistance & Réponses
            </span>
            <h2 className="text-3xl font-extrabold text-[#1E1B2E]">
              {t.faq.title}
            </h2>
            <p className="text-sm text-gray-600">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-purple-100 rounded-2xl overflow-hidden bg-[#FAF7FC]"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4.5 text-left font-bold text-sm text-gray-900 hover:text-purple-700 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-purple-600 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4.5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-purple-100/40 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. APPEL FINAL À L'ACTION */}
      <section className="py-20 bg-gradient-to-br from-purple-950 via-purple-900 to-rose-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-rose-400 border border-white/10 shadow-lg">
            <Heart className="w-7 h-7 fill-current" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t.finalCta.title}
          </h2>

          <p className="text-base sm:text-lg text-purple-200 max-w-xl mx-auto">
            {t.finalCta.subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                if (currentUser) {
                  setActiveTab('discover');
                } else {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-rose-50 text-purple-950 font-extrabold text-base shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <Heart className="w-5 h-5 text-rose-600 fill-current" />
              <span>{t.finalCta.cta}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
