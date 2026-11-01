import React from 'react';
import { Heart, Sparkles, MessageCircle, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateAffinity } from '../utils/matching';

export const MatchCelebrationModal: React.FC = () => {
  const {
    matchModalTarget,
    setMatchModalTarget,
    currentUser,
    setActiveTab,
    setActiveConversationId,
    conversations,
    t,
  } = useApp();

  if (!matchModalTarget || !currentUser) return null;

  const affinity = calculateAffinity(currentUser, matchModalTarget);

  const handleStartChat = () => {
    // Find the mutual conversation
    const conv = conversations.find(
      (c) =>
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(matchModalTarget.id)
    );
    if (conv) {
      setActiveConversationId(conv.id);
    }
    setMatchModalTarget(null);
    setActiveTab('messages');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-purple-900 via-purple-950 to-black text-white rounded-3xl p-8 text-center shadow-2xl border border-purple-500/30 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setMatchModalTarget(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Sparks */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
            {t.matchModal.affinityText.replace('{percent}', String(affinity))}
          </span>
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          {t.matchModal.title}
        </h2>
        <p className="text-xs sm:text-sm text-purple-200 mb-8 max-w-xs mx-auto">
          {t.matchModal.subtitle.replace('{name}', matchModalTarget.name)}
        </p>

        {/* Entwined Avatars */}
        <div className="relative flex items-center justify-center mb-8">
          {/* User Avatar */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-purple-600 shadow-2xl -mr-4 transform hover:scale-105 transition-transform">
            <img
              src={currentUser.photos[currentUser.primaryPhotoIndex || 0]}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Glowing Center Heart */}
          <div className="relative z-20 w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 animate-pulse">
            <Heart className="w-6 h-6 fill-current" />
          </div>

          {/* Matched Avatar */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-rose-500 shadow-2xl -ml-4 transform hover:scale-105 transition-transform">
            <img
              src={matchModalTarget.photos[0]}
              alt={matchModalTarget.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-xs mx-auto">
          <button
            onClick={handleStartChat}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t.matchModal.sendMessage}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMatchModalTarget(null)}
            className="w-full py-2.5 text-xs font-semibold text-purple-300 hover:text-white transition cursor-pointer"
          >
            {t.matchModal.keepBrowsing}
          </button>
        </div>
      </div>
    </div>
  );
};
