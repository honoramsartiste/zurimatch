import React, { useState } from 'react';
import {
  Heart,
  Compass,
  MessageCircle,
  User,
  Crown,
  Shield,
  Bell,
  Globe,
  Menu,
  X,
  LogOut,
  Sparkles,
  Users,
} from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    currentUser,
    matches,
    conversations,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setAuthModalOpen,
    setAuthModalMode,
    switchDemoUser,
    profiles,
    logout,
    setPremiumModalOpen,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'landing', label: t.nav.home, icon: <Heart className="w-4 h-4" /> },
    { id: 'discover', label: t.nav.discover, icon: <Compass className="w-4 h-4" /> },
    {
      id: 'matches',
      label: t.nav.matches,
      icon: <Users className="w-4 h-4" />,
      badge: matches.length > 0 ? matches.length : undefined,
    },
    {
      id: 'messages',
      label: t.nav.messages,
      icon: <MessageCircle className="w-4 h-4" />,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { id: 'profile', label: t.nav.profile, icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Slogan */}
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform duration-200">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-950 via-purple-800 to-rose-600 bg-clip-text text-transparent">
                  ZuriMatch
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-600 rounded-md border border-rose-200/60">
                  Africa & Global
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block -mt-0.5">
                {t.slogan}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-purple-900 bg-purple-50 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Premium CTA */}
            <button
              onClick={() => setPremiumModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-300 text-amber-800 hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer ml-1"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30" />
              <span>{t.nav.premium}</span>
              {currentUser?.isPremium && (
                <span className="px-1 py-0.2 text-[9px] bg-amber-500 text-white rounded-sm font-bold">
                  VIP
                </span>
              )}
            </button>

            {/* Admin toggle if authorized */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Accès Administration"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.nav.admin}</span>
            </button>
          </nav>

          {/* Right Action Icons: Language, Notifications, Demo User, Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-purple-300 bg-white text-xs font-semibold text-gray-700 hover:text-purple-700 transition cursor-pointer"
              title="Changer de langue / Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-purple-600" />
              <span className="uppercase">{language}</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer focus:outline-hidden"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-semibold text-sm text-gray-900">
                      Notifications ({unreadNotifs})
                    </span>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium cursor-pointer"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 py-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">
                        Aucune notification
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.targetId) {
                              setActiveTab('messages');
                            }
                          }}
                          className={`p-2.5 rounded-xl transition cursor-pointer ${
                            !n.isRead ? 'bg-purple-50/70' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-900 mb-0.5">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-snug">{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50/60 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition cursor-pointer"
                title="Tester avec un autre profil démo"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="max-w-[100px] truncate">
                  {currentUser?.name || 'Démo'}
                </span>
              </button>

              {isDemoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-100 p-2 z-50">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                    {t.auth.quickDemoTitle}
                  </div>
                  <div className="space-y-1">
                    {profiles.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchDemoUser(p.id);
                          setIsDemoMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-left transition cursor-pointer ${
                          currentUser?.id === p.id
                            ? 'bg-purple-600 text-white font-semibold'
                            : 'hover:bg-purple-50 text-gray-800'
                        }`}
                      >
                        <img
                          src={p.photos[0]}
                          alt={p.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="truncate">
                          <div className="font-medium truncate">
                            {p.name}, {p.age} ans
                          </div>
                          <div
                            className={`text-[10px] ${
                              currentUser?.id === p.id ? 'text-purple-100' : 'text-gray-400'
                            }`}
                          >
                            {p.city}, {p.country}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Join/Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-purple-300 bg-white transition cursor-pointer"
                >
                  <img
                    src={currentUser.photos[currentUser.primaryPhotoIndex || 0]}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-600"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    {currentUser.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title={t.nav.logout}
                  aria-label={t.nav.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-purple-800 transition cursor-pointer"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-700 via-purple-600 to-rose-500 rounded-xl shadow-md shadow-purple-600/20 hover:opacity-95 transition cursor-pointer"
                >
                  {t.nav.join}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="px-2 py-1 text-xs font-bold text-purple-700 border border-purple-200 rounded-lg uppercase"
            >
              {language}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-purple-50 transition"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white/95 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50/50 text-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-auto px-1.5 py-0.2 text-[9px] bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => {
                setPremiumModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-amber-100 text-amber-900"
            >
              <Crown className="w-4 h-4 text-amber-600" />
              <span>ZuriMatch Premium</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl bg-gray-100 text-gray-800"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {currentUser && (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.photos[0]}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-gray-800">
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-medium text-rose-600 hover:underline"
              >
                {t.nav.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
