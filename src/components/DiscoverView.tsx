import React, { useState } from 'react';
import {
  Heart,
  X,
  Star,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  Info,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
  RotateCcw,
  Check,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Profile } from '../types';
import { calculateAffinity, filterProfiles } from '../utils/matching';

export const DiscoverView: React.FC = () => {
  const {
    t,
    profiles,
    currentUser,
    likes,
    passedUserIds,
    blockedUserIds,
    likeProfile,
    passProfile,
    setReportingUser,
    blockUser,
    filterCriteria,
    setFilterCriteria,
    setPremiumModalOpen,
  } = useApp();

  const [mode, setMode] = useState<'deck' | 'grid'>('deck');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [selectedProfileModal, setSelectedProfileModal] = useState<Profile | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // List of IDs currentUser has already liked
  const likedTargetIds = likes
    .filter((l) => l.fromUserId === currentUser?.id)
    .map((l) => l.toUserId);

  // Filtered profiles
  const eligibleProfiles = filterProfiles(
    profiles,
    currentUser?.id || '',
    filterCriteria,
    blockedUserIds,
    [...likedTargetIds, ...passedUserIds]
  );

  // Sort by affinity score descending
  const sortedProfiles = [...eligibleProfiles].sort((a, b) => {
    if (!currentUser) return 0;
    return calculateAffinity(currentUser, b) - calculateAffinity(currentUser, a);
  });

  const currentCard = sortedProfiles[0] || null;
  const currentAffinity = currentUser && currentCard ? calculateAffinity(currentUser, currentCard) : 85;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLike = (targetId: string, isSuperLike = false) => {
    likeProfile(targetId, isSuperLike);
    setActivePhotoIndex(0);
    showToast(isSuperLike ? t.discover.superlikedSuccess : t.discover.likedSuccess);
  };

  const handlePass = (targetId: string) => {
    passProfile(targetId);
    setActivePhotoIndex(0);
  };

  const nextPhoto = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % max);
  };

  const prevPhoto = (e: React.MouseEvent, max: number) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + max) % max);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Bar: Title, Filters toggle, View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-purple-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {t.discover.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              {sortedProfiles.length} profils disponibles
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Classés selon vos affinités de valeurs, localisation et centres d’intérêt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-white border border-gray-200 rounded-xl shadow-2xs">
            <button
              onClick={() => setMode('deck')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'deck'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.discover.modeSwipe}</span>
            </button>
            <button
              onClick={() => setMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'grid'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.discover.modeGrid}</span>
            </button>
          </div>

          {/* Filter Trigger Button */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
            <span>{t.discover.filters}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-950 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Heart className="w-4 h-4 text-rose-400 fill-current" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Empty State */}
      {sortedProfiles.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t.discover.emptyTitle}</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t.discover.emptySubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() =>
                setFilterCriteria({
                  minAge: 18,
                  maxAge: 60,
                  country: 'all',
                  city: 'all',
                  relationshipGoal: 'all',
                  verifiedOnly: false,
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.discover.resetFilters}</span>
            </button>

            <button
              onClick={() => setPremiumModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <span>Activer Passeport Mondial VIP</span>
            </button>
          </div>
        </div>
      ) : mode === 'deck' ? (
        /* DECK / SWIPE CARD VIEW */
        <div className="py-6 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Background card preview effect */}
            {sortedProfiles.length > 1 && (
              <div className="absolute top-3 inset-x-3 h-full bg-purple-200/50 rounded-3xl -z-10 scale-98 transform" />
            )}
            {sortedProfiles.length > 2 && (
              <div className="absolute top-6 inset-x-6 h-full bg-purple-100/40 rounded-3xl -z-20 scale-96 transform" />
            )}

            {/* Foreground Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col">
              {/* Photo Area with Carousel */}
              <div className="relative h-[440px] bg-gray-900 overflow-hidden select-none">
                <img
                  src={currentCard.photos[activePhotoIndex] || currentCard.photos[0]}
                  alt={currentCard.name}
                  className="w-full h-full object-cover transition-opacity duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Progress indicators for multiple photos */}
                {currentCard.photos.length > 1 && (
                  <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10">
                    {currentCard.photos.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          idx === activePhotoIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Left/Right Photo Tap Zones */}
                {currentCard.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => prevPhoto(e, currentCard.photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer z-10"
                      aria-label="Photo précédente"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => nextPhoto(e, currentCard.photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer z-10"
                      aria-label="Photo suivante"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Top Badges */}
                <div className="absolute top-8 left-4 flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/85 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>{currentAffinity}% {t.discover.affinity}</span>
                  </div>

                  {currentCard.isVerified && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-semibold backdrop-blur-md">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>{t.discover.verified}</span>
                    </div>
                  )}
                </div>

                {/* More Details Trigger */}
                <button
                  onClick={() => setSelectedProfileModal(currentCard)}
                  className="absolute top-8 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md cursor-pointer z-10"
                  title={t.discover.viewProfile}
                  aria-label={t.discover.viewProfile}
                >
                  <Info className="w-4 h-4" />
                </button>

                {/* Bottom Card Summary */}
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black">{currentCard.name}, {currentCard.age}</h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{currentCard.city}, {currentCard.country}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/80">{currentCard.lastActive}</span>
                  </div>

                  <p className="text-xs text-white/90 line-clamp-2 mt-2 leading-relaxed">
                    {currentCard.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {currentCard.interests.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="p-4 bg-white flex items-center justify-center gap-4">
                {/* Pass */}
                <button
                  onClick={() => handlePass(currentCard.id)}
                  className="w-14 h-14 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
                  title={t.discover.pass}
                  aria-label={t.discover.pass}
                >
                  <X className="w-7 h-7" />
                </button>

                {/* Superlike */}
                <button
                  onClick={() => handleLike(currentCard.id, true)}
                  className="w-12 h-12 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
                  title={t.discover.superlike}
                  aria-label={t.discover.superlike}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>

                {/* Like */}
                <button
                  onClick={() => handleLike(currentCard.id, false)}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-rose-500 hover:from-purple-800 hover:to-rose-600 text-white flex items-center justify-center shadow-xl shadow-purple-600/30 hover:scale-105 transition-all cursor-pointer"
                  title={t.discover.like}
                  aria-label={t.discover.like}
                >
                  <Heart className="w-8 h-8 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GRID / GALLERY VIEW */
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProfiles.map((p) => {
            const affinity = currentUser ? calculateAffinity(currentUser, p) : 80;
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                <div
                  className="relative h-72 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedProfileModal(p)}
                >
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span>{affinity}%</span>
                  </div>

                  {p.isVerified && (
                    <div className="absolute top-3 right-3 p-1 rounded-full bg-emerald-500 text-white">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-bold text-lg">{p.name}, {p.age}</div>
                    <div className="text-xs text-white/80 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-300" />
                      {p.city}, {p.country}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{p.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {p.interests.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePass(p.id)}
                      className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>{t.discover.pass}</span>
                    </button>

                    <button
                      onClick={() => handleLike(p.id, false)}
                      className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>{t.discover.like}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FILTER DRAWER / MODAL */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-purple-700" />
                  <h3 className="font-bold text-base text-gray-900">{t.discover.filters}</h3>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Age Range */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-800 mb-2">
                  <span>Tranche d’âge</span>
                  <span className="text-purple-700">
                    {filterCriteria.minAge} - {filterCriteria.maxAge} ans
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="range"
                    min={18}
                    max={65}
                    value={filterCriteria.minAge}
                    onChange={(e) =>
                      setFilterCriteria((prev) => ({
                        ...prev,
                        minAge: Math.min(Number(e.target.value), prev.maxAge - 1),
                      }))
                    }
                    className="w-full accent-purple-700"
                  />
                  <input
                    type="range"
                    min={18}
                    max={65}
                    value={filterCriteria.maxAge}
                    onChange={(e) =>
                      setFilterCriteria((prev) => ({
                        ...prev,
                        maxAge: Math.max(Number(e.target.value), prev.minAge + 1),
                      }))
                    }
                    className="w-full accent-purple-700"
                  />
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Pays
                </label>
                <select
                  value={filterCriteria.country || 'all'}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 outline-hidden focus:border-purple-600"
                >
                  <option value="all">Tous les pays (Diaspora & Global)</option>
                  <option value="RDC">RDC (Kinshasa, Lubumbashi...)</option>
                  <option value="France">France (Paris, Lyon...)</option>
                  <option value="Belgique">Belgique (Bruxelles...)</option>
                  <option value="Canada">Canada (Montréal...)</option>
                  <option value="Royaume-Uni">Royaume-Uni (Londres...)</option>
                  <option value="Côte d’Ivoire">Côte d’Ivoire (Abidjan...)</option>
                  <option value="Cameroun">Cameroun (Douala...)</option>
                </select>
              </div>

              {/* Relationship Goal */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Intention relationnelle
                </label>
                <select
                  value={filterCriteria.relationshipGoal || 'all'}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({
                      ...prev,
                      relationshipGoal: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 outline-hidden focus:border-purple-600"
                >
                  <option value="all">Toutes intentions</option>
                  <option value="marriage">Mariage & Foyer</option>
                  <option value="serious">Relation sérieuse et engagée</option>
                  <option value="dating">Rencontres intentionnelles</option>
                  <option value="friendship">Amitié & Réseau</option>
                </select>
              </div>

              {/* Verified Only Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={filterCriteria.verifiedOnly || false}
                    onChange={(e) =>
                      setFilterCriteria((prev) => ({
                        ...prev,
                        verifiedOnly: e.target.checked,
                      }))
                    }
                    className="rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Uniquement les profils vérifiés</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Appliquer les filtres
              </button>
              <button
                onClick={() => {
                  setFilterCriteria({
                    minAge: 18,
                    maxAge: 55,
                    country: 'all',
                    city: 'all',
                    relationshipGoal: 'all',
                    verifiedOnly: false,
                  });
                }}
                className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-purple-700 cursor-pointer"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PROFILE DETAIL MODAL */}
      {selectedProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-purple-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-72 bg-black shrink-0">
              <img
                src={selectedProfileModal.photos[0]}
                alt={selectedProfileModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black">{selectedProfileModal.name}, {selectedProfileModal.age}</h3>
                  {selectedProfileModal.isVerified && (
                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {selectedProfileModal.city}, {selectedProfileModal.country}
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">À propos</h4>
                <p className="leading-relaxed text-gray-600">{selectedProfileModal.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Centres d’intérêt</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileModal.interests.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 font-semibold border border-purple-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Langues parlées</span>
                  <div className="font-semibold text-gray-900 mt-0.5">
                    {selectedProfileModal.languages.join(', ')}
                  </div>
                </div>

                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Intention</span>
                  <div className="font-semibold text-rose-950 mt-0.5 capitalize">
                    {selectedProfileModal.relationshipGoal}
                  </div>
                </div>
              </div>

              {/* Safety Action Options */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-gray-500">
                <button
                  onClick={() => {
                    setReportingUser(selectedProfileModal);
                    setSelectedProfileModal(null);
                  }}
                  className="flex items-center gap-1.5 hover:text-rose-600 font-semibold cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>{t.discover.report} ce profil</span>
                </button>

                <button
                  onClick={() => {
                    blockUser(selectedProfileModal.id);
                    setSelectedProfileModal(null);
                  }}
                  className="hover:text-gray-900 font-semibold cursor-pointer"
                >
                  {t.discover.block}
                </button>
              </div>
            </div>

            {/* Quick Action in Modal */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
              <button
                onClick={() => {
                  handlePass(selectedProfileModal.id);
                  setSelectedProfileModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
              >
                Passer
              </button>
              <button
                onClick={() => {
                  handleLike(selectedProfileModal.id, false);
                  setSelectedProfileModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-rose-500 text-white font-bold text-xs shadow-md hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Liker ce profil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
