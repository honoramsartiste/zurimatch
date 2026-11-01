import React, { useState } from 'react';
import { X, Heart, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    t,
    isAuthModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    startRegistration,
    profiles,
    switchDemoUser,
    setActiveTab,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAgeChecked, setIsAgeChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (authModalMode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Veuillez remplir votre email et mot de passe.');
        return;
      }
      login(email);
    } else if (authModalMode === 'register') {
      if (!email.trim() || !password.trim()) {
        setError('Veuillez renseigner un email et un mot de passe.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
      if (!isAgeChecked) {
        setError('Vous devez attester avoir au moins 18 ans pour vous inscrire.');
        return;
      }
      if (!isTermsChecked) {
        setError('Veuillez accepter les conditions d’utilisation.');
        return;
      }
      // Start 9-step guided onboarding
      startRegistration();
    } else if (authModalMode === 'forgot') {
      if (!email.trim()) {
        setError('Veuillez renseigner votre email.');
        return;
      }
      setSuccessMsg('Un lien de réinitialisation sécurisé a été simulé et envoyé à votre adresse.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-rose-600 p-6 text-white text-center relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-xl font-bold">
            {authModalMode === 'login'
              ? t.auth.loginTitle
              : authModalMode === 'register'
              ? t.auth.registerTitle
              : t.auth.forgotTitle}
          </h2>
          <p className="text-xs text-purple-200 mt-1">{t.slogan}</p>
        </div>

        {/* Quick Demo Switcher Banner */}
        <div className="bg-purple-50/80 p-3.5 border-b border-purple-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{t.auth.quickDemoTitle}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {profiles.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  switchDemoUser(p.id);
                  setAuthModalOpen(false);
                  setActiveTab('discover');
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-purple-200 hover:border-purple-400 text-left transition cursor-pointer"
              >
                <img
                  src={p.photos[0]}
                  alt={p.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {p.name} ({p.city})
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jeanluc@exemple.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs text-gray-900 outline-hidden transition"
                required
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  {t.auth.passwordLabel}
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-[11px] text-purple-700 hover:underline cursor-pointer"
                  >
                    {t.auth.forgotLink}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs text-gray-900 outline-hidden transition"
                  required
                />
              </div>
            </div>
          )}

          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.auth.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs text-gray-900 outline-hidden transition"
                    required
                  />
                </div>
              </div>

              {/* Age verification and terms acceptance */}
              <div className="space-y-2 pt-1 text-xs text-gray-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAgeChecked}
                    onChange={(e) => setIsAgeChecked(e.target.checked)}
                    className="mt-0.5 rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{t.auth.ageCheck}</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTermsChecked}
                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                    className="mt-0.5 rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>{t.auth.termsCheck}</span>
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-rose-500 hover:from-purple-800 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
          >
            {authModalMode === 'login'
              ? t.auth.submitLogin
              : authModalMode === 'register'
              ? t.auth.submitRegister
              : t.auth.submitForgot}
          </button>

          {/* Toggle between login / register */}
          <div className="text-center pt-2 text-xs text-gray-600">
            {authModalMode === 'login' ? (
              <p>
                {t.auth.noAccount}{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  {t.auth.submitRegister}
                </button>
              </p>
            ) : (
              <p>
                {t.auth.haveAccount}{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="font-bold text-purple-700 hover:underline cursor-pointer"
                >
                  {t.auth.submitLogin}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
