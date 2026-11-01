import React, { useState } from 'react';
import {
  X,
  Crown,
  Check,
  CreditCard,
  Smartphone,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/seedData';
import { Currency } from '../types';

export const PremiumModal: React.FC = () => {
  const {
    isPremiumModalOpen,
    setPremiumModalOpen,
    purchasePremium,
    currency,
    setCurrency,
    t,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('quarterly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [momoProvider, setMomoProvider] = useState<'mpesa' | 'orange' | 'airtel' | 'mtn'>('mpesa');
  const [momoPhone, setMomoPhone] = useState('+243 812 345 678');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPremiumModalOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const getPrice = (plan: typeof currentPlan) => {
    switch (currency) {
      case 'EUR':
        return `${plan.priceEUR.toFixed(2)} €`;
      case 'CDF':
        return `${plan.priceCDF.toLocaleString()} CDF`;
      case 'XOF':
        return `${plan.priceXOF.toLocaleString()} FCFA`;
      case 'USD':
      default:
        return `$${plan.priceUSD.toFixed(2)}`;
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        purchasePremium(selectedPlanId);
        setIsSuccess(false);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-amber-900 text-white p-6 relative">
          <button
            onClick={() => setPremiumModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>{t.premiumModal.badge}</span>
            </span>
          </div>

          <h2 className="text-2xl font-black">{t.premiumModal.title}</h2>
          <p className="text-xs text-purple-200 mt-1 max-w-lg">
            {t.premiumModal.subtitle}
          </p>

          {/* Currency Switcher */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-200">
              {t.premiumModal.currency}
            </span>
            {(['USD', 'EUR', 'CDF', 'XOF'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currency === c
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSuccess ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900">
                Paiement Confirmé !
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                {t.premiumModal.activatedSuccess}
              </p>
            </div>
          ) : (
            <>
              {/* Plans Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SUBSCRIPTION_PLANS.slice(0, 3).map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/60 shadow-md ring-2 ring-purple-600/20'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                          Populaire
                        </div>
                      )}

                      <div>
                        <div className="font-bold text-xs text-gray-900">{plan.name}</div>
                        <div className="text-lg font-black text-purple-900 mt-1">
                          {getPrice(plan)}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {plan.durationMonths === 1
                            ? 'Facturation mensuelle'
                            : `Soit ${(plan.priceUSD / (plan.durationMonths || 1)).toFixed(2)} $/mois`}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-600 space-y-1">
                        {plan.perks.slice(0, 2).map((perk, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handlePay} className="p-5 bg-[#FAF7FC] rounded-3xl border border-purple-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-purple-900">
                    {t.premiumModal.checkoutTitle}
                  </h3>
                  <span className="font-black text-base text-purple-950">
                    Total : {getPrice(currentPlan)}
                  </span>
                </div>

                {/* Payment Method Switcher */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {t.premiumModal.paymentMethod}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-purple-600 bg-white text-purple-900 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span>{t.premiumModal.cardOption}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        paymentMethod === 'momo'
                          ? 'border-purple-600 bg-white text-purple-900 shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-rose-600" />
                      <span>Mobile Money (Afrique)</span>
                    </button>
                  </div>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {t.premiumModal.cardNumLabel}
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 outline-hidden font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Expiration</label>
                        <input
                          type="text"
                          defaultValue="12 / 28"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 outline-hidden text-center font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">CVC (Test)</label>
                        <input
                          type="text"
                          defaultValue="888"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 outline-hidden text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mobile Money Fields */
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'mpesa', label: 'M-Pesa' },
                        { id: 'orange', label: 'Orange Money' },
                        { id: 'airtel', label: 'Airtel Money' },
                        { id: 'mtn', label: 'MTN MoMo' },
                      ].map((prov) => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => setMomoProvider(prov.id as any)}
                          className={`p-2 rounded-xl border text-[11px] font-bold text-center cursor-pointer transition ${
                            momoProvider === prov.id
                              ? 'border-purple-600 bg-white text-purple-900 shadow-2xs'
                              : 'border-gray-200 text-gray-600 bg-gray-50'
                          }`}
                        >
                          {prov.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {t.premiumModal.momoPhoneLabel}
                      </label>
                      <input
                        type="text"
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                        placeholder="+243 81 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 outline-hidden font-mono"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Une demande de confirmation USSD Push sera instantanément envoyée sur votre téléphone.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.premiumModal.simulatedNotice}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validation du paiement en cours...</span>
                    </div>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 fill-current" />
                      <span>{t.premiumModal.btnPay} ({getPrice(currentPlan)})</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
