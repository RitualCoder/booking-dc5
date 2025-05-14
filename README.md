# Application de Réservation de Salles de Classe

Application mobile développée avec Expo et TypeScript pour la gestion des réservations de salles de classe.

## Dépendances à installer

```bash
# Navigation
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# UI Components
npm install @rneui/themed @rneui/base
npm install react-native-vector-icons

# Gestion d'état et API
npm install @tanstack/react-query
npm install axios

# Stockage local
npm install @react-native-async-storage/async-storage

# Formulaires
npm install react-hook-form
npm install yup @hookform/resolvers
```

## Tâches à réaliser

### Niveau 1 - Configuration des écrans et de la navigation

- [x] Configuration du projet et installation des dépendances
- [x] Mise en place de la navigation (Stack et Tab)

### Niveau 2 - Premier appel API

- [x] Configuration des appels API pour les salles de classe
- [x] Affichage de la liste des classes

### Niveau 3 - Authentification

- [x] Création des écrans de base (Login, Register)
- [x] Implémentation de l'authentification (login/register)

### Niveau 4 - Context

- [x] Création d'un context pour l'authentification
- [x] Gestion du stockage du token avec AsyncStorage

### Niveau 5 - Profil utilisateur

- [x] Création de l'écran de profil
- [x] Affichage des informations de l'utilisateur
- [x] Possibilité de modifier ses informations

### Niveau 6 - Apparence et fonctionnalités avancées

- [x] Création du composant Card pour les salles
- [x] Création de l'écran de détails d'une salle
- [x] Afficher la liste des réservations pour une salle
- [x] Ajouter un bouton pour réserver une salle

### Niveau 7 - Gestion des réservations pour l'utilisateur

- [ ] Création de l'écran de gestion des réservations
- [ ] Affichage des réservations en cours et passées
- [ ] Possibilité de supprimer une réservation

### Niveau 8 - Amélioration de l'expérience utilisateur

- [ ] Ajout de la possibilité de filtrer les salles (par nom, par capacité, etc.)
- [ ] Ajout la possibilité de réordonner les salles dans la liste (par nom, par capacité, etc.)

## Endpoints d'API

### Authentification

- POST /auth/signup
- POST /auth/signin

### Utilisateurs

- GET /users/me
- GET /users/:id
- POST /users

### Salles de classe

- GET /classrooms
- GET /classrooms/search
- GET /classrooms/:id
- POST /classrooms (middleware: admin)
- PUT /classrooms/:id
- DELETE /classrooms/:id (middleware: admin)

### Réservations

- POST /reservations
- GET /reservations/me
- GET /reservations/classroom/:classroomId
- GET /reservations/:id
- DELETE /reservations/:id

### Profil

- GET /profile
- PUT /profile

# Installation

```sh
cd api
npm install
docker compose up -d
npx prisma db push
npx prisma generate
# Generate fake data
npm run seed
# Run Prisma Studio
npx prisma studio
# Run the api
cd api
npm run dev
```

```sh
cd app
npm install
npx expo start
```
