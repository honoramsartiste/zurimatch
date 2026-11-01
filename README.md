# ZuriMatch — « Deux cœurs, une connexion. »
Plateforme internationale de rencontres premium et sociale pour les célibataires africains, la diaspora et le monde entier.

---

## 🌟 Présentation du projet
**ZuriMatch** est conçue pour connecter les célibataires de Kinshasa, Paris, Bruxelles, Londres, Montréal, Abidjan, Douala et du monde entier, dans un environnement élégant, bienveillant, sécurisé et inclusif.

---

## 🚀 Fonctionnalités Implémentées (PHASE 1 : MVP Complet)

### 1. Landing Page Startup Internationale
- **Hero Section romantique** avec accroche mémorable, statistiques d'impact communautaire et mise en avant visuelle de profils.
- **10 Sections complètes** :
  1. Comment fonctionne ZuriMatch (Profil raffiné, Affinité intelligente, Connexion & Magie).
  2. Découvrir des profils compatibles (Aperçu interactif des célibataires).
  3. Rencontrer selon ses intérêts (Nuage de tags cliquables).
  4. Tableau comparatif ZuriMatch Gratuit vs. ZuriMatch Premium.
  5. Avantages ZuriMatch Premium (Passeport mondial, likes illimités, qui vous a liké).
  6. Sécurité, vérification par selfie et conformité RGPD.
  7. Témoignages de démonstration (clairement identifiés comme fictifs).
  8. FAQ interactive avec accordéons dépliables.
  9. Appel final à l'action.
  10. Footer complet avec liens légaux (Confidentialité, Conditions d'utilisation, Conseils de sécurité) et sélecteur de langue.

### 2. Authentification & Onboarding Guidé en 9 Étapes
- **Système d'authentification** : Inscription, Connexion, Réinitialisation de mot de passe, Vérification de l'âge minimum de 18 ans obligatoire, et acceptation des conditions d'utilisation.
- **Sélecteur rapide de profils démo (1 clic)** : Permet de basculer instantanément entre Jean-Luc (Kinshasa/Paris), Amina (Kinshasa), Sarah (Montréal) et David (Londres).
- **Onboarding pas à pas (9 étapes avec barre de progression)** :
  - Étape 1 : Prénom et calcul automatique de l'âge (minimum 18 ans contrôlé).
  - Étape 2 : Genre et orientation de rencontre.
  - Étape 3 : Pays et ville de résidence.
  - Étape 4 : Galerie de photos et sélection d'avatar.
  - Étape 5 : Biographie personnelle (minimum 10 caractères).
  - Étape 6 : Centres d'intérêt (sélection d'au moins 3 passions).
  - Étape 7 : Intention relationnelle (Mariage, sérieux, rencontres, amitié, ouvert).
  - Étape 8 : Préférences d'âge et filtres de découverte.
  - Étape 9 : Confirmation et mise en ligne du profil.

### 3. Découverte Intelligente & Algorithme d'Affinité
- **Double Mode** :
  - **Mode Cartes (Deck Swipe)** avec carrousel photo, badges d'authenticité, calcul du % d'affinité, boutons Passer, Superlike, Liker et voir le profil complet.
  - **Mode Galerie (Grid)** pour parcourir l'ensemble des célibataires.
- **Algorithme d'affinité** (`calculateAffinity`) : Calcule un score 0-100% basé sur les intérêts partagés, la ville/pays, l'intention relationnelle et les langues parlées.
- **Filtres avancés** : Tranche d'âge, pays, intention relationnelle, profils vérifiés uniquement.

### 4. Likes, Matchs et Célébration
- Détection des likes réciproques en temps réel.
- **Animation de Match (« C'est un Match ! »)** : Affiche les deux avatars réunis, le pourcentage d'affinité, avec bouton direct « Envoyer un message ».
- Page dédiée « Matchs & Connexions » avec 3 onglets :
  - *Matchs Mutuels* (échange direct).
  - *Qui vous a liké* (aperçu flouté pour les comptes gratuits avec invitation Premium, déflouté pour les membres Premium).
  - *Favoris & Superlikes*.

### 5. Messagerie Privée en Temps Réel
- Liste des conversations avec pastille de messages non lus, statut en ligne et horodatage.
- Suggestions de brise-glace (« Icebreakers ») en 1 clic.
- Simulation de réponse automatique et instantanée du profil démo pour tester les échanges de messages.
- Signalement et blocage directement accessibles depuis le chat.

### 6. Profil Utilisateur & Paramètres
- Modification des informations (prénom, ville, bio, intention relationnelle).
- Gestion de la galerie de photos (ajouter une photo, définir la photo principale, supprimer).
- Demande de badge officiel de vérification.
- Mettre son compte en pause (mode invisible temporaire).
- Exportation des données personnelles au format JSON (Conformité RGPD).
- Suppression définitive du compte.

### 7. Monétisation & ZuriMatch Premium
- Formules configurables : 1 Mois, 3 Mois (Populaire), 12 Mois (Meilleure valeur), Boost 24h.
- Sélecteur multi-devises en temps réel : USD ($), EUR (€), CDF (Franc Congolais) et XOF (Franc CFA).
- Simulateur de paiement sécurisé bac à sable :
  - Carte bancaire internationale (Simulation Stripe).
  - Mobile Money panafricain (M-Pesa Vodacom, Orange Money, Airtel Money, MTN MoMo) avec numéro de téléphone et simulation du Push USSD.

### 8. Espace Administration & Modération Professionnel
- **KPIs en direct** : Membres inscrits, Célibataires actifs, Matchs créés, Revenus confirmés, Taux de conversion VIP.
- **Gestion des membres** : Recherche multi-critères, suspension, bannissement, attribution du badge vérifié.
- **File de modération** : Examen des profils signalés avec motif et notes, rejet ou bannissement en 1 clic.
- **Configuration** : Réglage du quota quotidien de likes gratuits, consultation des langues actives.

### 9. Internationalisation (i18n)
- Support complet du Français (FR) et de l'Anglais (EN) commutable instantanément sans recharger l'application.

---

## 🧪 Comment tester l'application pas à pas

1. **Explorer la page d'accueil** : Naviguez dans les 10 sections pour voir le design system violet & rose, la comparaison gratuit/premium et la FAQ.
2. **Tester le swipe et déclencher un Match** :
   - Rendez-vous sur **Découvrir**.
   - Vous voyez le profil de **Sarah (Montréal)** qui vous a déjà envoyé un like dans les données démo.
   - Cliquez sur le cœur **Liker**.
   - La fenêtre animée **« C'est un Match ! »** s'ouvre avec 73% d'affinité.
3. **Tester la messagerie** :
   - Cliquez sur **« Envoyer un message »**.
   - Cliquez sur l'une des suggestions de brise-glace (ex: *« Bonjour ! Qu'est-ce qui t'a le plus marqué... »*).
   - Le message est envoyé, et Sarah vous répond automatiquement après 2 secondes !
4. **Tester l'onboarding en 9 étapes** :
   - Cliquez sur **Déconnexion** ou ouvrez la fenêtre d'inscription.
   - Suivez les 9 étapes en observant la barre de progression, la validation de l'âge (18 ans min) et le choix des centres d'intérêt.
5. **Tester le sélecteur rapide de profil** :
   - Cliquez sur le menu violet en haut à droite avec le nom du profil.
   - Choisissez **Amina (Kinshasa)** ou **David (Londres)** pour voir l'application depuis la perspective d'un autre utilisateur.
6. **Tester ZuriMatch Premium** :
   - Cliquez sur le bouton **Premium VIP**.
   - Changez la devise en **CDF** ou **EUR**.
   - Sélectionnez **Mobile Money**, entrez un numéro et confirmez pour activer instantanément le statut VIP.
7. **Accéder à l'Administration** :
   - Cliquez sur **Administration** dans la barre de navigation.
   - Consultez les statistiques, filtrez les membres, et traitez la file des signalements.

---

## 🛠️ Guide pour connecter Firebase (Phase 2)

Pour faire évoluer ZuriMatch vers une base de données cloud Firebase :

1. **Créer un projet Firebase gratuit** :
   - Rendez-vous sur [console.firebase.google.com](https://console.firebase.google.com/).
   - Cliquez sur *Ajouter un projet* (ex: `zurimatch-app`).
   - Le plan gratuit Spark de Firebase offre une généreuse limite sans aucun coût.
2. **Activer Firebase Authentication** :
   - Dans le menu latéral, cliquez sur *Authentication* > *Commencer*.
   - Activez les modes de connexion *Email/Mot de passe* et *Google*.
3. **Activer Cloud Firestore** :
   - Cliquez sur *Firestore Database* > *Créer une base de données* en mode Production.
   - Les collections prêtes à l'emploi sont : `users`, `likes`, `matches`, `conversations`, `messages`, `reports`.
4. **Configurer Firebase Storage** :
   - Permet d'héberger les photos de profil téléversées par les utilisateurs.
5. **Remplacer les clés dans `.env`** :
   - Ajoutez `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.
