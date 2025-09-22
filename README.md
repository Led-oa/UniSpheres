```markdown
# UniSpheres - Plateforme Éducative Collaborative

UniSpheres est une plateforme éducative complète développée avec une architecture moderne, comprenant un backend Node.js/Express et un frontend Vue.js. La plateforme facilite la communication, le partage de ressources et la gestion académique entre étudiants, enseignants et administrateurs.

## 🏗️ Architecture du Projet

Le projet est structuré en deux parties principales :

### Backend (`/backend`)
- **Framework**: Node.js avec Express.js
- **Base de données**: MySQL
- **Authentification**: JWT (JSON Web Tokens)
- **Upload de fichiers**: Multer avec validation
- **Communication temps réel**: Socket.IO

### Frontend (`/frontend`)
- **Framework**: Vue.js 3 avec Composition API
- **Build tool**: Vite
- **State management**: Pinia
- **Routing**: Vue Router

## 🚀 Fonctionnalités Principales

### 👥 Gestion des Utilisateurs
- **Rôles**: Administrateur, Enseignant, Étudiant
- **Inscription/Connexion** avec JWT
- **Gestion des profils** avec photos
- **Activation/Désactivation** des comptes

### 🎓 Gestion Académique
- **Filieres, Parcours, Années** académiques
- **Classes** avec étudiants et enseignants
- **Cours** avec documents partagés
- **Système de notes** complet

### 💬 Communication
- **Messagerie instantanée** avec Socket.IO
- **Conversations privées et de groupe**
- **Partage de fichiers** dans les messages
- **Notifications en temps réel**

### 📢 Annonces
- **Annonces ciblées** (par classe, filière, année)
- **Pièces jointes** multiples
- **Visibilité contrôlée**
- **Priorités et délais**

### 📚 Gestion des Cours
- **Création et partage** de cours
- **Documents de cours** (PDF, Word, Excel, etc.)
- **Assignation** aux classes
- **Gestion par enseignant**

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL2** - Driver MySQL
- **JWT** - Authentification
- **Multer** - Gestion des uploads
- **Socket.IO** - Communication temps réel
- **bcrypt** - Hashage des mots de passe

### Frontend
- **Vue.js 3** - Framework frontend
- **Vite** - Build tool et dev server
- **Pinia** - State management
- **Vue Router** - Navigation
- **Axios** - Client HTTP

## ⚙️ Installation et Démarrage

### Prérequis
- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### Installation Backend

1. **Cloner le repository**
```bash
git clone <repository-url>
cd UniSpheres/backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de la base de données**
- Créer une base de données MySQL
- Configurer les variables d'environnement dans `.env`

4. **Démarrer le serveur**
```bash
# Development
npm run dev

# Production
npm start
```

### Installation Frontend

1. **Accéder au dossier frontend**
```bash
cd ../frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application**
```bash
npm run dev
```

## 🔧 Configuration

### Variables d'Environnement (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=unisphere
PORT=8000
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=24h
```

### Base de Données

Le projet utilise les tables suivantes principales :
- `user` - Utilisateurs de la plateforme
- `classe` - Classes académiques
- `filiere` - Filières d'étude
- `parcours` - Parcours académiques
- `year` - Années académiques
- `course` - Cours et matières
- `annonce` - Annonces et communications
- `conversation` - Conversations de messagerie
- `message` - Messages individuels
- `file` - Fichiers uploadés
- `note` - Notes des étudiants

## 📡 API Endpoints

### Authentification
- `POST /api/user/register` - Inscription
- `POST /api/user/login` - Connexion
- `GET /api/user/me` - Profil utilisateur

### Gestion Utilisateurs
- `GET /api/user` - Liste des utilisateurs
- `GET /api/user/:id` - Détails utilisateur
- `PATCH /api/user/:id` - Mise à jour utilisateur

### Annonces
- `GET /api/annonce` - Liste des annonces
- `POST /api/annonce` - Créer une annonce
- `GET /api/annonce/:id` - Détails annonce

### Cours
- `GET /api/course` - Liste des cours
- `POST /api/course` - Créer un cours
- `GET /api/course/class/:id` - Cours par classe

### Messagerie
- `GET /api/conversations` - Conversations utilisateur
- `POST /api/conversations` - Créer conversation
- `POST /api/messages` - Envoyer message

## 🔒 Sécurité

- **Authentification JWT** avec expiration
- **Validation des fichiers** uploadés
- **Hashage bcrypt** pour les mots de passe
- **Middleware d'authentification** sur toutes les routes protégées
- **CORS configuré** pour le frontend spécifique

## 📊 Gestion des Fichiers

Le système supporte l'upload de :
- **Images** (JPEG, PNG, GIF, WebP, HEIC)
- **Documents** (PDF, Word, Excel, PowerPoint)
- **Archives** (ZIP, RAR)

Limites de taille :
- Profils : 5MB
- Messages : 10MB
- Cours/Annonces : 20MB

## 🚦 Scripts Disponibles

### Backend
```bash
npm start      # Démarrer en production
npm run dev    # Démarrer en développement avec nodemon
```

### Frontend
```bash
npm run dev    # Démarrer le serveur de développement
npm run build  # Build pour production
npm run preview # Preview du build production
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changes (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème, veuillez contacter l'équipe de développement ou ouvrir une issue sur le repository.

---

**UniSpheres** - Révolutionnez l'éducation collaborative ! 🎓✨
```
