import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Camera,
  Check,
  Crown,
  Shield,
  Download,
  PauseCircle,
  PlayCircle,
  Plus,
  Trash2,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RelationshipGoal } from '../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    requestVerification,
    setPremiumModalOpen,
    logout,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [country, setCountry] = useState(currentUser?.country || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal>(
    currentUser?.relationshipGoal || 'serious'
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  if (!currentUser) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    updateProfile({
      name: name.trim(),
      city: city.trim(),
      country: country.trim(),
      bio: bio.trim(),
      relationshipGoal,
    });
    setIsEditing(false);
    showToast('Profil mis à jour avec succès !');
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    updateProfile({
      photos: [...currentUser.photos, newPhotoUrl.trim()],
    });
    setNewPhotoUrl('');
    showToast('Photo ajoutée à votre galerie.');
  };

  const handleSetPrimaryPhoto = (index: number) => {
    updateProfile({ primaryPhotoIndex: index });
    showToast('Photo principale modifiée.');
  };

  const handleDeletePhoto = (index: number) => {
    if (currentUser.photos.length <= 1) {
      showToast('Vous devez conserver au moins une photo.');
      return;
    }
    const updated = currentUser.photos.filter((_, i) => i !== index);
    updateProfile({
      photos: updated,
      primaryPhotoIndex: 0,
    });
    showToast('Photo supprimée.');
  };

  const togglePauseAccount = () => {
    updateProfile({ isPaused: !currentUser.isPaused });
    showToast(
      currentUser.isPaused
        ? 'Votre compte est à nouveau actif et visible !'
        : 'Votre compte est maintenant en pause (invisible pour les autres).'
    );
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentUser, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `zurimatch-profile-${currentUser.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Données exportées au format JSON (Conformité RGPD).');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-950 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 relative overflow-hidden">
        {currentUser.isPaused && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <PauseCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Compte en pause : votre profil est masqué dans la découverte.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar / Main Photo */}
          <div className="relative">
            <img
              src={currentUser.photos[currentUser.primaryPhotoIndex || 0]}
              alt={currentUser.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-purple-100 shadow-md"
            />
            {currentUser.isVerified && (
              <div
                className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-white rounded-full shadow-md"
                title="Profil vérifié"
              >
                <BadgeCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-gray-900">
                  {currentUser.name}, {currentUser.age} ans
                </h1>
                {currentUser.isPremium && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-600 fill-current" />
                    <span>PREMIUM VIP</span>
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition cursor-pointer self-center sm:self-auto"
              >
                {isEditing ? 'Annuler' : 'Modifier mon profil'}
              </button>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-500">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{currentUser.city}, {currentUser.country}</span>
              <span>•</span>
              <span className="capitalize">{currentUser.relationshipGoal}</span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed pt-1">
              {currentUser.bio}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-2">
              {currentUser.interests.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 text-[10px] font-semibold border border-purple-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-rose-900 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">Badge de Vérification Officiel</h3>
            <p className="text-xs text-purple-200 mt-0.5">
              {currentUser.isVerified
                ? 'Votre profil est vérifié et certifié authentique.'
                : 'Prouvez votre authenticité pour multiplier par 3 vos matchs.'}
            </p>
          </div>
        </div>

        {!currentUser.isVerified ? (
          <button
            onClick={requestVerification}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md transition cursor-pointer whitespace-nowrap"
          >
            Demander la vérification
          </button>
        ) : (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/30 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>Vérifié</span>
          </span>
        )}
      </div>

      {/* Edit Form (if toggled) */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6 animate-in fade-in">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Modifier mes informations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Pays</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Intention relationnelle
              </label>
              <select
                value={relationshipGoal}
                onChange={(e) => setRelationshipGoal(e.target.value as RelationshipGoal)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-purple-600"
              >
                <option value="marriage">Relation sérieuse vers mariage</option>
                <option value="serious">Amour durable & engagement</option>
                <option value="dating">Rencontres intentionnelles</option>
                <option value="friendship">Amitié & Réseau</option>
                <option value="open">Ouvert(e) aux surprises</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Biographie personnelle
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-purple-600 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Photos Gallery Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Mes Photos</h2>
            <p className="text-xs text-gray-500">
              Gérez votre galerie, réorganisez ou définissez votre photo principale.
            </p>
          </div>
          <Camera className="w-5 h-5 text-purple-600" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {currentUser.photos.map((url, idx) => {
            const isPrimary = idx === (currentUser.primaryPhotoIndex || 0);
            return (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden aspect-square border-2 border-purple-100 group shadow-xs"
              >
                <img src={url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                {isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-bold">
                    Principale
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {!isPrimary && (
                    <button
                      onClick={() => handleSetPrimaryPhoto(idx)}
                      className="px-2.5 py-1 rounded-lg bg-white text-purple-900 text-[10px] font-bold shadow-xs hover:bg-purple-50 cursor-pointer"
                    >
                      Définir principale
                    </button>
                  )}
                  {currentUser.photos.length > 1 && (
                    <button
                      onClick={() => handleDeletePhoto(idx)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add photo URL */}
        <div className="pt-2 flex gap-2">
          <input
            type="url"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder="URL d'une nouvelle photo (ex: https://images.unsplash.com/...)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-purple-600"
          />
          <button
            onClick={handleAddPhoto}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Account Settings & Compliance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Confidentialité & Paramètres du compte
        </h2>

        <div className="divide-y divide-gray-100 space-y-3">
          {/* Pause Account */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-gray-900">
                {currentUser.isPaused ? 'Réactiver mon compte' : 'Mettre mon compte en pause'}
              </div>
              <div className="text-[11px] text-gray-500">
                Masquez temporairement votre profil de la recherche sans perdre vos matchs ni vos conversations.
              </div>
            </div>
            <button
              onClick={togglePauseAccount}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                currentUser.isPaused
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              {currentUser.isPaused ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Réactiver</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Mettre en pause</span>
                </>
              )}
            </button>
          </div>

          {/* Export Data */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-gray-900">Exporter mes données (RGPD)</div>
              <div className="text-[11px] text-gray-500">
                Téléchargez une copie complète et lisible de vos données personnelles au format JSON.
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-rose-600">Supprimer définitivement mon compte</div>
              <div className="text-[11px] text-gray-500">
                Toutes vos données, photos, likes et conversations seront irrévocablement effacées.
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte ZuriMatch ?')) {
                  logout();
                  showToast('Votre compte a été supprimé.');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition cursor-pointer"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
