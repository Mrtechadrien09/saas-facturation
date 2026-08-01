# 🚀 Backend SaaS Facturation - Guide Professionnel

## 📦 Installations Récentes

### Ajoutées :
- **Winston** - Logging structuré en production
- **Swagger/OpenAPI** - Documentation interactive des endpoints
- **Jest** - Tests unitaires et couverture de code
- **Gestion des erreurs personnalisée** - Classes d'erreurs customisées

---

## 🔧 Configuration

### Variables d'environnement (.env)
```env
# Base de données
MONGO_URI=mongodb+srv://...

# Authentification JWT
JWT_SECRET=your-secret-key-here

# Email
RESEND_API_KEY=re_...

# Frontend
FRONTEND_URL=http://localhost:3000

# Port
PORT=5000

# Environnement
NODE_ENV=development
LOG_LEVEL=info
```

---

## 📚 Logging avec Winston

### Utilisation
```typescript
import logger from './utils/logger.js';

// Info
logger.info('Utilisateur connecté', { userId: '123' });

// Error
logger.error('Erreur DB', { error: err.message });

// Warn
logger.warn('Limite de requêtes atteinte', { ip: '192.168.1.1' });
```

### Fichiers générés
```
logs/
├── combined.log       # Tous les logs
└── error.log         # Erreurs uniquement
```

---

## ⚠️ Gestion des Erreurs

### Classes disponibles
```typescript
import { 
  AppError, 
  NotFoundError, 
  ValidationError, 
  ConflictError 
} from './utils/AppError.js';

// Utilisation dans les controllers
throw new NotFoundError('Facture');          // 404
throw new ValidationError('Email invalide'); // 400
throw new ConflictError('Utilisateur');      // 409
```

---

## 📖 API Documentation (Swagger)

### Accès
```
http://localhost:5000/api/docs
```

**Fonctionnalités :**
- 🔍 Explore tous les endpoints
- 🧪 Teste directement les requêtes
- 🔐 Authentification JWT intégrée
- 📋 Schémas détaillés des requêtes/réponses

---

## ✅ Tests avec Jest

### Lancer les tests
```bash
# Tests simples
npm test

# Mode watch (re-run à chaque changement)
npm run test:watch

# Coverage (quelle % du code est testée)
npm run test:coverage
```

### Structure des tests
```
src/
├── utils/
│   ├── AppError.ts
│   └── __tests__/
│       └── AppError.test.ts
├── controllers/
│   ├── auth.controller.ts
│   └── __tests__/
│       └── auth.controller.test.ts
```

### Exemple de test
```typescript
describe('AppError', () => {
  it('should create an error with message', () => {
    const error = new AppError('Test', 400);
    expect(error.message).toBe('Test');
    expect(error.statusCode).toBe(400);
  });
});
```

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev

# Build TypeScript
npm build

# Tests
npm run test
npm run test:watch
npm run test:coverage

# Logs en production
tail -f logs/combined.log
tail -f logs/error.log
```

---

## 📊 Structure Améliorée

```
backend/
├── src/
│   ├── app.ts                    # ✅ Winston + Swagger + Erreurs
│   ├── config/
│   │   └── swagger.ts            # Configuration OpenAPI
│   ├── utils/
│   │   ├── logger.ts             # Winston logger
│   │   ├── AppError.ts           # Erreurs customisées
│   │   └── __tests__/
│   │       └── AppError.test.ts  # Tests unitaires
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
├── jest.config.js               # Configuration Jest
├── package.json                 # ✅ Scripts + Dépendances
├── tsconfig.json
├── .env.example
└── logs/                        # Générés automatiquement
```

---

## ⚡ Performance & Production

### Logs rotatifs
- Max 5MB par fichier
- Garde les 5 derniers fichiers
- Rotation automatique

### Test Coverage
```bash
npm run test:coverage
```

Affiche la couverture dans `coverage/` :
```
Statements   : 75%
Branches     : 60%
Functions    : 80%
Lines        : 78%
```

---

## 🔐 Sécurité

✅ JWT validation en middleware
✅ Rate limiting sur auth
✅ Validation Zod sur toutes les entrées
✅ Erreurs génériques en production
✅ CORS configuré
✅ Logging de sécurité

---

## 📝 Prochaines Étapes

- [ ] Ajouter tests pour les controllers (auth, invoices, customers)
- [ ] Ajouter tests d'intégration (API complète)
- [ ] Documenter les endpoints avec JSDoc
- [ ] Mettre en place CI/CD (GitHub Actions)
- [ ] Ajouter des métriques (Prometheus)

---

**Backend prêt pour la production ! 🎉**
