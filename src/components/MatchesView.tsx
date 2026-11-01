import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Crown,
  Sparkles,
  MapPin,
  Lock,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateAffinity } from '../utils/matching';

export const MatchesView: React.FC = () => {
  const {
    t,
    matches,
    likes,
    profiles,
    currentUser,
    setActiveTab,
    setActiveConversationId,
    conversations,
    likeProfile,
    setPremiumModalOpen,
  } = useApp();

  const [activeTab, setActiveTabState] = useState<'matches' | 'likes' | 'favorites'>('matches');

  if (!currentUser) return null;

  // 1. Mutual Matches: get profiles of users matched with currentUser
  const matchedUserIds = matches
    .filter((m) => m.userIds.includes(currentUser.id))
    .map((m) => m.userIds.find((id) => id !== currentUser.id))
    .filter(Boolean) as string[];

  const matchedProfiles = profiles.filter((p) => matchedUserIds.includes(p.id));

  // 2. Who Liked Current User
  const whoLikedUserIds = likes
    .filter((l) => l.toUserId === currentUser.id && !matchedUserIds.includes(l.fromUserId))
    .map((l) => l.fromUserId);

  const whoLikedProfiles = profiles.filter((p) => whoLikedUserIds.includes(p.id));

  // 3. User's Superlikes / Favorites
  const userLikesSent = likes.filter((l) => l.fromUserId === currentUser.id);
  const favoriteProfiles = profiles.filter((p) =>
    userLikesSent.some((l) => l.toUserId === p.id && l.isSuperLike)
  );

  const handleOpenConversation = (profileId: string) => {
    const conv = conversations.find(
      (c) => c.participantIds.includes(currentUser.id) && c.participantIds.includes(profileId)
    );
    if (conv) {
      setActiveConversationId(conv.id);
    }
    setActiveTab('messages');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="pb-6 border-b border-purple-100">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {t.matchesView.title}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Vos affinités mutuelles, personnes qui s’intéressent à vous et favoris.
        </p>

        {/* Tab switchers */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTabState('matches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-purple-50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>
              {t.matchesView.tabMatches.replace('{count}', String(matchedProfiles.length))}
            </span>
          </button>

          <button
            onClick={() => setActiveTabState('likes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'likes'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-rose-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {t.matchesView.tabLikes.replace('{count}', String(whoLikedProfiles.length))}
            </span>
          </button>

          <button
            onClick={() => setActiveTabState('favorites')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>
              {t.matchesView.tabFavorites.replace('{count}', String(favoriteProfiles.length))}
            </span>
          </button>
        </div>
      </div>

      {/* CONTENT FOR TAB: MUTUAL MATCHES */}
      {activeTab === 'matches' && (
        <div className="py-8">
          {matchedProfiles.length === 0 ? (
            <div className="text-center py-16 max-w-sm mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">{t.matchesView.noMatchesTitle}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {t.matchesView.noMatchesSubtitle}
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer mt-2"
              >
                <span>Découvrir des profils</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {matchedProfiles.map((p) => {
                const affinity = calculateAffinity(currentUser, p);
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all flex flex-col group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={p.photos[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-purple-300" />
                        <span>{affinity}% match</span>
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
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {p.bio}
                      </p>

                      <button
                        onClick={() => handleOpenConversation(p.id)}
                        className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{t.matchesView.chatNow}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONTENT FOR TAB: WHO LIKED YOU */}
      {activeTab === 'likes' && (
        <div className="py-8">
          {/* If free user, show blur effect with Premium unlock banner */}
          {!currentUser.isPremium && (
            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-rose-900 to-purple-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black uppercase">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Avantage VIP</span>
                </div>
                <h3 className="text-lg font-bold">Débloquez la vue des personnes qui vous aiment</h3>
                <p className="text-xs text-purple-200 max-w-lg">
                  {t.matchesView.blurNotice}
                </p>
              </div>

              <button
                onClick={() => setPremiumModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-lg transition cursor-pointer whitespace-nowrap"
              >
                {t.matchesView.unlockButton}
              </button>
            </div>
          )}

          {whoLikedProfiles.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-xs">
              Aucun nouveau like en attente pour l’instant.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {whoLikedProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm relative flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={p.photos[0]}
                      alt={p.name}
                      className={`w-full h-full object-cover ${
                        !currentUser.isPremium ? 'blur-md scale-110' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {!currentUser.isPremium && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                        <Lock className="w-8 h-8 text-amber-300 mb-2 drop-shadow-md" />
                        <span className="font-bold text-sm">Célibataire intéressé(e)</span>
                        <span className="text-[11px] text-purple-200">
                          {p.city}, {p.country}
                        </span>
                      </div>
                    )}

                    {currentUser.isPremium && (
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="font-bold text-lg">{p.name}, {p.age}</div>
                        <div className="text-xs text-white/80">{p.city}, {p.country}</div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    {currentUser.isPremium ? (
                      <button
                        onClick={() => likeProfile(p.id, false)}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Liker en retour (Match !)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setPremiumModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs border border-purple-200 transition cursor-pointer"
                      >
                        Révéler avec Premium
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENT FOR TAB: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="py-8">
          {favoriteProfiles.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-xs">
              Vous n’avez pas encore de profils enregistrés en favoris ou Superlikés.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm p-4 flex flex-col space-y-3"
                >
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className="w-full h-48 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm text-gray-900">{p.name}, {p.age}</div>
                    <div className="text-xs text-gray-500">{p.city}, {p.country}</div>
                  </div>
                  <button
                    onClick={() => handleOpenConversation(p.id)}
                    className="w-full py-2 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-xs"
                  >
                    Envoyer un message
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
