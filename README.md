# Gestion des Articles - CRUD App

Application web simple pour gérer une collection d'articles avec NestJS, Mongoose et MongoDB.

## Fonctionnalités

- **CRUD complet** : Créer, lire, mettre à jour, supprimer des articles
- **Recherche** : Rechercher par titre, résumé ou contenu
- **Filtrage** : Filtrer par statut (brouillon, publié, archivé) et date
- **Interface simple** : UI responsive avec Bootstrap 5
- **API REST** : Endpoints JSON pour tous les opérations

## Structure des données

### Article
- **id** : Identifiant unique (MongoDB ObjectId)
- **titre** : Titre de l'article (requis)
- **resume** : Résumé court (requis)
- **contenu** : Contenu complet (requis)
- **extract** : Extrait optionnel
- **datePublication** : Date de publication (requis)
- **statut** : brouillon | publié | archivé (défaut: brouillon)
- **dateCreation** : Date de création automatique

## Installation et démarrage

### Avec Docker (recommandé)

```bash
docker-compose up --build
```

L'application sera accessible à `http://localhost:3000`

### Sans Docker

#### Prérequis
- Node.js 20+
- MongoDB 7.0+

#### Installation
```bash
npm install
```

#### Configuration
Créer un fichier `.env` :
```
MONGODB_URI=mongodb://localhost:27017/crud-dev
PORT=3000
NODE_ENV=development
```

#### Démarrage
```bash
npm run start:dev
```

L'application sera accessible à `http://localhost:3000`

## Commandes disponibles

```bash
npm run build          # Compiler le projet
npm run start          # Démarrer en production
npm run start:dev      # Démarrer en développement (watch mode)
npm run start:prod     # Démarrer depuis la build compilée
npm run lint           # Vérifier et corriger le code
npm test               # Lancer les tests
```

## API Endpoints

### Articles

- **GET** `/api/articles` - Récupérer tous les articles
  - Query params: `search`, `statut`, `dateDebut`, `dateFin`
  
- **POST** `/api/articles` - Créer un nouvel article
  
- **GET** `/api/articles/:id` - Récupérer un article
  
- **PATCH** `/api/articles/:id` - Mettre à jour un article
  
- **DELETE** `/api/articles/:id` - Supprimer un article

### Exemples

```bash
# Récupérer tous les articles
curl http://localhost:3000/api/articles

# Rechercher des articles
curl "http://localhost:3000/api/articles?search=javascript"

# Filtrer par statut
curl "http://localhost:3000/api/articles?statut=publie"

# Créer un article
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Mon Article",
    "resume": "Un résumé court",
    "contenu": "Le contenu complet...",
    "datePublication": "2025-01-15",
    "statut": "publie"
  }'
```

## Architecture

```
src/
├── main.ts                 # Point d'entrée
├── app.module.ts          # Module principal
├── app.controller.ts      # Contrôleur principal
├── app.service.ts         # Service principal
└── articles/              # Module Articles
    ├── articles.module.ts
    ├── articles.controller.ts
    ├── articles.service.ts
    ├── article.schema.ts
    └── dto/
        ├── create-article.dto.ts
        └── update-article.dto.ts

public/
└── index.html            # Interface web
```

## Développement

### Structure du projet
- Backend : NestJS avec TypeScript
- Base de données : MongoDB avec Mongoose
- Frontend : HTML5 + Bootstrap 5 + Vanilla JavaScript
- Containerisation : Docker + Docker Compose

### Technologies
- **NestJS** 11.0 - Framework Node.js
- **Mongoose** 8.0 - ODM MongoDB
- **Bootstrap** 5.3 - Framework CSS
- **TypeScript** 5.7 - Langage de programmation

## Troubleshooting

### La connexion MongoDB échoue
- Vérifier que MongoDB est en cours d'exécution
- Vérifier la variable `MONGODB_URI` dans `.env`
- Avec Docker, s'assurer que les services sont sur le même réseau

### Port 3000 déjà utilisé
- Changer le port dans `.env` ou via la variable d'environnement `PORT`
- Avec Docker, modifier le port dans `docker-compose.yml`

### Erreurs de build
- Supprimer `node_modules` et `package-lock.json`
- Réinstaller : `npm install`
- Recompiler : `npm run build`

## License

UNLICENSED
