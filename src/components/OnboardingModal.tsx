import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Calendar,
  User,
  Heart,
  Camera,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Gender, LookingFor, Profile, RelationshipGoal } from '../types';
import { calculateAge } from '../utils/matching';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=800&q=80',
];

const INTERESTS_POOL = [
  'Afrobeat & Amapiano',
  'Rumba congolaise',
  'Gastronomie africaine',
  'Entrepreneuriat',
  'Tech & Innovation',
  'Voyages & Escapades',
  'Mode & Sapologie',
  'Fitness & Bien-être',
  'Cinéma & Séries',
  'Littérature & Poésie',
  'Art contemporain',
  'Musique acoustique',
  'Danse & Kizomba',
  'Photographie',
  'Développement personnel',
];

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setOnboardingOpen, completeOnboarding, t } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 9;

  // Onboarding Form State
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('1999-06-15');
  const [gender, setGender] = useState<Gender>('woman');
  const [lookingFor, setLookingFor] = useState<LookingFor>('men');
  const [country, setCountry] = useState('RDC');
  const [city, setCity] = useState('Kinshasa');
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_AVATARS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Afrobeat & Amapiano',
    'Gastronomie africaine',
    'Entrepreneuriat',
  ]);
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal>('serious');
  const [minAgePref, setMinAgePref] = useState(22);
  const [maxAgePref, setMaxAgePref] = useState(38);
  const [error, setError] = useState<string | null>(null);

  if (!isOnboardingOpen) return null;

  const calculatedAge = calculateAge(birthDate);

  const handleNext = () => {
    setError(null);

    if (step === 1) {
      if (!firstName.trim()) {
        setError('Veuillez renseigner votre prénom.');
        return;
      }
      if (calculatedAge < 18) {
        setError('Vous devez avoir au moins 18 ans pour vous inscrire.');
        return;
      }
    } else if (step === 3) {
      if (!city.trim() || !country.trim()) {
        setError('Veuillez indiquer votre ville et pays.');
        return;
      }
    } else if (step === 5) {
      if (!bio.trim() || bio.trim().length < 10) {
        setError('Veuillez écrire au moins 10 caractères pour vous présenter.');
        return;
      }
    } else if (step === 6) {
      if (selectedInterests.length < 3) {
        setError('Veuillez sélectionner au moins 3 centres d’intérêt.');
        return;
      }
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Step 9: Finalize
      const newProfile: Partial<Profile> = {
        name: firstName.trim(),
        birthDate,
        age: calculatedAge,
        gender,
        lookingFor,
        country,
        city,
        photos: [customPhotoUrl.trim() || selectedPhoto],
        bio: bio.trim(),
        interests: selectedInterests,
        languages: ['Français', 'Anglais'],
        relationshipGoal,
        ageRangeMin: minAgePref,
        ageRangeMax: maxAgePref,
      };
      completeOnboarding(newProfile);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with progress */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 via-rose-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              {t.onboarding.stepOf.replace('{step}', String(step)).replace('{total}', String(totalSteps))}
            </span>
            <button
              onClick={() => setOnboardingOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-700 to-rose-500 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          {/* Step 1: Prénom & Date de naissance */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step1}</h3>
                <p className="text-xs text-gray-500">Commençons par votre identité de base.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.onboarding.firstName}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: David, Amina, Patrick..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs text-gray-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>{t.onboarding.birthDate}</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs text-gray-900 outline-hidden"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Âge calculé : <span className="font-bold text-purple-700">{calculatedAge} ans</span>
                  {calculatedAge < 18 && (
                    <span className="text-rose-600 ml-2 font-semibold">
                      (Minimum 18 ans obligatoire)
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Genre & Préférences */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step2}</h3>
                <p className="text-xs text-gray-500">Pour vous présenter des profils pertinents.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {t.onboarding.genderLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['woman', 'man'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition cursor-pointer ${
                        gender === g
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {g === 'woman' ? 'Femme' : 'Homme'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {t.onboarding.lookingLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['men', 'women', 'everyone'] as LookingFor[]).map((lf) => (
                    <button
                      key={lf}
                      type="button"
                      onClick={() => setLookingFor(lf)}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition cursor-pointer ${
                        lookingFor === lf
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {lf === 'men' ? 'Des Hommes' : lf === 'women' ? 'Des Femmes' : 'Tous'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Localisation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step3}</h3>
                <p className="text-xs text-gray-500">Pour vous connecter localement ou dans la diaspora.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.onboarding.countryLabel}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-600 text-xs text-gray-900 outline-hidden"
                >
                  <option value="RDC">République Démocratique du Congo (RDC)</option>
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Royaume-Uni">Royaume-Uni</option>
                  <option value="Canada">Canada</option>
                  <option value="Côte d’Ivoire">Côte d’Ivoire</option>
                  <option value="Cameroun">Cameroun</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="États-Unis">États-Unis</option>
                  <option value="Suisse">Suisse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.onboarding.cityLabel}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Kinshasa, Paris, Bruxelles, Montréal, Abidjan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-600 text-xs text-gray-900 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Step 4: Photos de profil */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step4}</h3>
                <p className="text-xs text-gray-500">{t.onboarding.photosNotice}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Sélectionnez votre avatar démo ou saisissez une URL
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {SAMPLE_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(url);
                        setCustomPhotoUrl('');
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                        selectedPhoto === url && !customPhotoUrl
                          ? 'border-purple-600 ring-2 ring-purple-600/30'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={url} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                      {selectedPhoto === url && !customPhotoUrl && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ou URL d’une photo personnelle :
                </label>
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Step 5: Biographie */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step5}</h3>
                <p className="text-xs text-gray-500">{t.onboarding.bioLabel}</p>
              </div>

              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.onboarding.bioPlaceholder}
                className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-purple-600 text-xs text-gray-900 outline-hidden leading-relaxed"
              />
              <p className="text-[11px] text-gray-400 text-right">
                {bio.length} caractères (minimum 10)
              </p>
            </div>
          )}

          {/* Step 6: Centres d’intérêt */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step6}</h3>
                <p className="text-xs text-gray-500">{t.onboarding.interestsTitle}</p>
              </div>

              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
                {INTERESTS_POOL.map((tag) => {
                  const isChecked = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-purple-700 text-white shadow-xs font-semibold'
                          : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-purple-800 font-semibold text-center">
                {selectedInterests.length} centres d’intérêt sélectionnés (minimum 3)
              </p>
            </div>
          )}

          {/* Step 7: Type de relation recherchée */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step7}</h3>
                <p className="text-xs text-gray-500">{t.onboarding.relationshipGoalTitle}</p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'marriage', label: t.onboarding.goalMarriage },
                  { id: 'serious', label: t.onboarding.goalSerious },
                  { id: 'dating', label: t.onboarding.goalDating },
                  { id: 'friendship', label: t.onboarding.goalFriendship },
                  { id: 'open', label: t.onboarding.goalOpen },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setRelationshipGoal(g.id as RelationshipGoal)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      relationshipGoal === g.id
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span>{g.label}</span>
                    {relationshipGoal === g.id && (
                      <Check className="w-4 h-4 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Préférences de découverte */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t.onboarding.step8}</h3>
                <p className="text-xs text-gray-500">Ajustez vos filtres initiaux de recherche.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>{t.onboarding.agePref}</span>
                    <span className="text-purple-700 font-extrabold">{minAgePref} - {maxAgePref} ans</span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min={18}
                      max={60}
                      value={minAgePref}
                      onChange={(e) => setMinAgePref(Math.min(Number(e.target.value), maxAgePref - 1))}
                      className="w-full accent-purple-600"
                    />
                    <input
                      type="range"
                      min={18}
                      max={65}
                      value={maxAgePref}
                      onChange={(e) => setMaxAgePref(Math.max(Number(e.target.value), minAgePref + 1))}
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Confirmation finale */}
          {step === 9 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t.onboarding.welcomeCongrat}</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                {t.onboarding.welcomeSubtitle}
              </p>

              <div className="p-4 bg-purple-50 rounded-2xl text-left border border-purple-100 max-w-xs mx-auto space-y-1.5">
                <div className="text-xs font-bold text-purple-950 flex items-center gap-2">
                  <img
                    src={customPhotoUrl.trim() || selectedPhoto}
                    alt={firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{firstName}, {calculatedAge} ans</span>
                </div>
                <div className="text-[11px] text-gray-600">
                  📍 {city}, {country}
                </div>
                <div className="text-[11px] text-gray-600">
                  🎯 {relationshipGoal}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/70">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 hover:text-purple-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.onboarding.previous}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-rose-500 hover:from-purple-800 hover:to-rose-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <span>{step === totalSteps ? t.onboarding.finish : t.onboarding.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
