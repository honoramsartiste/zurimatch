import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  Conversation,
  Currency,
  FilterCriteria,
  Language,
  Like,
  Match,
  Message,
  Profile,
  Report,
} from '../types';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_LIKES,
  INITIAL_MATCHES,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILES,
  INITIAL_REPORTS,
} from '../data/seedData';
import { translations } from '../locales/translations';
import { detectMutualMatch } from '../utils/matching';

export type ActiveTab =
  | 'landing'
  | 'discover'
  | 'matches'
  | 'messages'
  | 'profile'
  | 'premium'
  | 'admin'
  | 'how-it-works';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  t: typeof translations.fr;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  currentUser: Profile | null;
  profiles: Profile[];
  likes: Like[];
  matches: Match[];
  conversations: Conversation[];
  messages: Message[];
  notifications: AppNotification[];
  reports: Report[];
  blockedUserIds: string[];
  passedUserIds: string[];

  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  filterCriteria: FilterCriteria;
  setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;

  // Modals
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;

  isOnboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;

  isPremiumModalOpen: boolean;
  setPremiumModalOpen: (open: boolean) => void;

  matchModalTarget: Profile | null;
  setMatchModalTarget: (profile: Profile | null) => void;

  reportingUser: Profile | null;
  setReportingUser: (profile: Profile | null) => void;

  // Actions
  switchDemoUser: (userId: string) => void;
  login: (email: string) => boolean;
  logout: () => void;
  startRegistration: () => void;
  completeOnboarding: (newProfile: Partial<Profile>) => void;
  updateProfile: (updated: Partial<Profile>) => void;

  likeProfile: (targetUserId: string, isSuperLike?: boolean) => void;
  passProfile: (targetUserId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  purchasePremium: (planId: string) => void;
  blockUser: (targetUserId: string) => void;
  submitReport: (reportedUserId: string, reason: string, details?: string) => void;
  requestVerification: () => void;

  // Admin Actions
  adminVerifyUser: (userId: string) => void;
  adminSuspendUser: (userId: string) => void;
  adminBanUser: (userId: string) => void;
  adminRestoreUser: (userId: string) => void;
  adminReviewReport: (reportId: string, action: 'dismiss' | 'ban') => void;
  adminUpdateDailyLikeLimit: (limit: number) => void;
  dailyLikeLimit: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'zm_user_v1',
  PROFILES: 'zm_profiles_v1',
  LIKES: 'zm_likes_v1',
  MATCHES: 'zm_matches_v1',
  CONVERSATIONS: 'zm_convs_v1',
  MESSAGES: 'zm_msgs_v1',
  NOTIFICATIONS: 'zm_notifs_v1',
  REPORTS: 'zm_reports_v1',
  BLOCKED: 'zm_blocked_v1',
  PASSED: 'zm_passed_v1',
  LANG: 'zm_lang_v1',
  CURRENCY: 'zm_currency_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & Currency
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'fr';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CURRENCY) as Currency) || 'USD';
  });

  const t = translations[language] || translations.fr;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  };

  // Profiles & Data
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  // Current User (default to Jean-Luc for rich immediate testing)
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROFILES[0];
      }
    }
    return INITIAL_PROFILES[0]; // Jean-Luc
  });

  const [likes, setLikes] = useState<Like[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIKES);
    return saved ? JSON.parse(saved) : INITIAL_LIKES;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED);
    return saved ? JSON.parse(saved) : [];
  });

  const [passedUserIds, setPassedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PASSED);
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return INITIAL_CONVERSATIONS[0]?.id || null;
  });

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
  const [matchModalTarget, setMatchModalTarget] = useState<Profile | null>(null);
  const [reportingUser, setReportingUser] = useState<Profile | null>(null);
  const [dailyLikeLimit, setDailyLikeLimit] = useState(15);

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    minAge: 18,
    maxAge: 45,
    country: 'all',
    city: 'all',
    relationshipGoal: 'all',
    verifiedOnly: false,
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED, JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PASSED, JSON.stringify(passedUserIds));
  }, [passedUserIds]);

  // Demo user switcher
  const switchDemoUser = (userId: string) => {
    const found = profiles.find((p) => p.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const login = (email: string): boolean => {
    const existing = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setAuthModalOpen(false);
      setActiveTab('discover');
      return true;
    }
    // If not found in seed, create a standard session
    const newDemoUser: Profile = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      birthDate: '1998-05-15',
      age: 28,
      gender: 'man',
      lookingFor: 'women',
      country: 'RDC',
      city: 'Kinshasa',
      bio: 'Nouveau membre sur ZuriMatch, ravi de faire des rencontres enrichissantes.',
      photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'],
      primaryPhotoIndex: 0,
      interests: ['Tech & Innovation', 'Musique', 'Voyages'],
      languages: ['Français', 'Anglais'],
      relationshipGoal: 'serious',
      isVerified: false,
      verificationStatus: 'unverified',
      isPremium: false,
      isSuspended: false,
      isBanned: false,
      isPaused: false,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'À l’instant',
    };
    setProfiles((prev) => [newDemoUser, ...prev]);
    setCurrentUser(newDemoUser);
    setAuthModalOpen(false);
    setActiveTab('discover');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const startRegistration = () => {
    setAuthModalOpen(false);
    setOnboardingOpen(true);
  };

  const completeOnboarding = (profileData: Partial<Profile>) => {
    const newId = `user-${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      email: profileData.email || `membre-${Date.now()}@zurimatch.com`,
      name: profileData.name || 'Nouveau Membre',
      birthDate: profileData.birthDate || '2000-01-01',
      age: profileData.age || 26,
      gender: profileData.gender || 'man',
      lookingFor: profileData.lookingFor || 'women',
      country: profileData.country || 'RDC',
      city: profileData.city || 'Kinshasa',
      bio: profileData.bio || 'Passionné de belles rencontres et de sincérité.',
      photos:
        profileData.photos && profileData.photos.length > 0
          ? profileData.photos
          : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'],
      primaryPhotoIndex: 0,
      interests: profileData.interests || ['Afrobeat & Amapiano', 'Gastronomie africaine', 'Voyages & Escapades'],
      languages: profileData.languages || ['Français', 'Anglais'],
      relationshipGoal: profileData.relationshipGoal || 'serious',
      isVerified: false,
      verificationStatus: 'unverified',
      isPremium: false,
      isSuspended: false,
      isBanned: false,
      isPaused: false,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'À l’instant',
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setCurrentUser(newProfile);
    setOnboardingOpen(false);
    setActiveTab('discover');

    // Welcome notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: newId,
        type: 'system',
        title: 'Bienvenue sur ZuriMatch ✨',
        description: 'Votre profil est en ligne. Partez à la découverte des célibataires de votre région et du monde entier.',
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  const updateProfile = (updated: Partial<Profile>) => {
    if (!currentUser) return;
    const merged: Profile = { ...currentUser, ...updated };
    setCurrentUser(merged);
    setProfiles((prev) => prev.map((p) => (p.id === merged.id ? merged : p)));
  };

  const likeProfile = (targetUserId: string, isSuperLike = false) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const newLike: Like = {
      id: `like-${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId: targetUserId,
      isSuperLike,
      createdAt: new Date().toISOString(),
    };

    const updatedLikes = [...likes, newLike];
    setLikes(updatedLikes);

    // Check if targetUser already liked currentUser (mutual match)
    const isMutual = detectMutualMatch(updatedLikes, currentUser.id, targetUserId);

    if (isMutual) {
      const matchId = `match-${currentUser.id}-${targetUserId}`;
      const newMatch: Match = {
        id: matchId,
        userIds: [currentUser.id, targetUserId],
        createdAt: new Date().toISOString(),
        lastInteractionAt: new Date().toISOString(),
      };
      setMatches((prev) => [newMatch, ...prev]);

      // Create conversation
      const newConv: Conversation = {
        id: `conv-${matchId}`,
        matchId,
        participantIds: [currentUser.id, targetUserId],
        updatedAt: new Date().toISOString(),
        unreadCount: 0,
      };
      setConversations((prev) => [newConv, ...prev]);

      // Notification
      const targetProfile = profiles.find((p) => p.id === targetUserId);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          type: 'match',
          title: 'Nouveau Match !',
          description: `Vous avez matché avec ${targetProfile?.name || 'un membre'}.`,
          createdAt: new Date().toISOString(),
          isRead: false,
          targetId: newConv.id,
        },
        ...prev,
      ]);

      // Show match modal celebration!
      if (targetProfile) {
        setMatchModalTarget(targetProfile);
      }
    }
  };

  const passProfile = (targetUserId: string) => {
    setPassedUserIds((prev) => [...prev, targetUserId]);
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: newMsg,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    // Simulate friendly automatic reply from demo match after 2 seconds if chatting with Amina, Sarah, etc.
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      const otherUserId = conv.participantIds.find((id) => id !== currentUser.id);
      const otherProfile = profiles.find((p) => p.id === otherUserId);
      if (otherProfile && otherUserId?.startsWith('user-')) {
        setTimeout(() => {
          const replies = [
            `Quel plaisir d'échanger avec toi ! 😊 Comment se passe ta journée ?`,
            `C'est une très belle vision. J'apprécie beaucoup ta sincérité ✨`,
            `Absolument ! C'est rare de trouver quelqu'un qui partage cet esprit.`,
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const replyMsg: Message = {
            id: `msg-reply-${Date.now()}`,
            conversationId,
            senderId: otherProfile.id,
            text: randomReply,
            createdAt: new Date().toISOString(),
            isRead: false,
          };
          setMessages((prev) => [...prev, replyMsg]);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: replyMsg,
                    unreadCount: (c.unreadCount || 0) + 1,
                    updatedAt: new Date().toISOString(),
                  }
                : c
            )
          );
        }, 2200);
      }
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const purchasePremium = (_planId: string) => {
    if (!currentUser) return;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    updateProfile({
      isPremium: true,
      premiumExpiresAt: expiresAt.toISOString().split('T')[0],
    });
    setPremiumModalOpen(false);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        type: 'premium',
        title: 'ZuriMatch Premium Activé 👑',
        description: 'Toutes les fonctionnalités exclusives et vos super-pouvoirs de rencontre sont désormais débloqués.',
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  const blockUser = (targetUserId: string) => {
    setBlockedUserIds((prev) => [...prev, targetUserId]);
    // Also remove any existing matches or conversations
    setMatches((prev) => prev.filter((m) => !m.userIds.includes(targetUserId)));
    setConversations((prev) => prev.filter((c) => !c.participantIds.includes(targetUserId)));
  };

  const submitReport = (reportedUserId: string, reason: string, details?: string) => {
    if (!currentUser) return;
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reportedUserId,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    setReportingUser(null);
  };

  const requestVerification = () => {
    if (!currentUser) return;
    updateProfile({
      verificationStatus: 'verified',
      isVerified: true,
    });
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        type: 'verification',
        title: 'Badge de Vérification Activé ✨',
        description: 'Votre identité a été validée. Le badge officiel de confiance est visible sur votre profil.',
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...prev,
    ]);
  };

  // Admin Actions
  const adminVerifyUser = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === userId ? { ...p, isVerified: true, verificationStatus: 'verified' } : p
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, isVerified: true, verificationStatus: 'verified' } : null));
    }
  };

  const adminSuspendUser = (userId: string) => {
    setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, isSuspended: !p.isSuspended } : p)));
  };

  const adminBanUser = (userId: string) => {
    setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, isBanned: true } : p)));
  };

  const adminRestoreUser = (userId: string) => {
    setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, isBanned: false, isSuspended: false } : p)));
  };

  const adminReviewReport = (reportId: string, action: 'dismiss' | 'ban') => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    if (action === 'ban') {
      adminBanUser(report.reportedUserId);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
      );
    } else {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
      );
    }
  };

  const adminUpdateDailyLikeLimit = (limit: number) => {
    setDailyLikeLimit(limit);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        activeTab,
        setActiveTab,
        currentUser,
        profiles,
        likes,
        matches,
        conversations,
        messages,
        notifications,
        reports,
        blockedUserIds,
        passedUserIds,
        activeConversationId,
        setActiveConversationId,
        filterCriteria,
        setFilterCriteria,
        isAuthModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isOnboardingOpen,
        setOnboardingOpen,
        isPremiumModalOpen,
        setPremiumModalOpen,
        matchModalTarget,
        setMatchModalTarget,
        reportingUser,
        setReportingUser,
        switchDemoUser,
        login,
        logout,
        startRegistration,
        completeOnboarding,
        updateProfile,
        likeProfile,
        passProfile,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        purchasePremium,
        blockUser,
        submitReport,
        requestVerification,
        adminVerifyUser,
        adminSuspendUser,
        adminBanUser,
        adminRestoreUser,
        adminReviewReport,
        adminUpdateDailyLikeLimit,
        dailyLikeLimit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
