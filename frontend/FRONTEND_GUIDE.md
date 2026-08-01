# 🎨 Frontend SaaS Facturation - Guide Complet

## 📦 Tech Stack

- **Next.js 16** - App Router (React 19)
- **TypeScript** - Typage fort
- **TailwindCSS** - Styling moderne
- **Shadcn/UI** - Composants de qualité
- **Framer Motion** - Animations fluides
- **React Query** - Gestion du cache API
- **Zustand** - État global
- **Zod** - Validation des données
- **React Hook Form** - Gestion des formulaires
- **Sonner** - Toast notifications

---

## ✅ Corrections Appliquées

### 🐛 Bugs Critiques (FIXED)
✅ Register API doublon → Une seule requête  
✅ Typo `respone` → `response`  
✅ Route PATCH incorrecte → `/invoices/{id}`  

### 🆕 Nouvelles Fonctionnalités
✅ **Pagination** - useInvoices(page, limit)  
✅ **Validation Zod** - src/lib/validations.ts  
✅ **Page création facture** - /invoices/new  
✅ **Gestion erreurs réseau** - use-network.ts  
✅ **Meilleur interceptor API** - Gestion complète des erreurs  

---

## 🎯 Architecture des Hooks

### useAuth (Zustand)
```typescript
const { user, isAuthenticated, login, register, logout } = useAuth();

// Login
await useAuth.getState().login("email@test.com", "password");

// Register
await useAuth.getState().register("Jean", "jean@test.com", "pwd", "Ma Boîte");
```

### useInvoices (React Query)
```typescript
// Avec pagination
const { data: response, isLoading } = useInvoices(page, limit);
const { data: invoices, pagination } = response || {};

// Créer une facture
const { mutateAsync } = useCreateInvoice();
await mutateAsync({ customerId, dueDate, items, status });

// Mettre à jour le statut
const { mutateAsync } = useUpdateInvoiceStatus();
await mutateAsync({ id, status: "PAID" });
```

### useCustomers (React Query)
```typescript
const { data: customers } = useCustomers();
const { mutateAsync } = useCreateCustomer();
const { mutateAsync: deleteCustomer } = useDeleteCustomer();
```

---

## 📝 Validation avec Zod

```typescript
import { 
  loginSchema, 
  registerSchema, 
  createInvoiceSchema,
  customerSchema 
} from "@/lib/validations";

// Validation
const payload = { customerId, dueDate, items, status };
createInvoiceSchema.parse(payload);

// Types
import type { CreateInvoiceInput } from "@/lib/validations";
const invoice: CreateInvoiceInput = { ... };
```

### Schémas Disponibles
- `loginSchema` - Email + mot de passe
- `registerSchema` - Nom + email + mot de passe + companyName
- `customerSchema` - Infos client
- `invoiceItemSchema` - Article de facture
- `createInvoiceSchema` - Facture complète
- `updateInvoiceStatusSchema` - Changement de statut

---

## 🖼️ Pages Disponibles

```
(auth)/
├── login/ - Connexion
├── register/ - Inscription
├── verify-email/ - Vérification email
├── forgot-password/ - Réinitialisation
├── reset-password/ - Nouveau mot de passe
└── check-email/ - Vérification en attente

(dashboard)/
├── dashboard/ - Accueil avec stats
├── invoices/
│   ├── page.tsx - Liste des factures (avec pagination)
│   ├── create/ - Créer une facture ✨ NEW
│   ├── [id]/ - Détails d'une facture
│   └── new/ - DEPRECATED (utiliser /create)
├── customers/
│   ├── page.tsx - Liste clients
│   └── [id]/ - Détails client
└── settings/ - Paramètres
```

---

## 🔧 Gestion des Erreurs Réseau

### Hook useNetworkError()
```typescript
import { useNetworkError } from "@/hooks/use-network";

const { handleNetworkError, retryFailedQueries } = useNetworkError();

// Dans un catch
try {
  // ...
} catch (error) {
  if (handleNetworkError(error)) {
    // Erreur réseau gérée
  }
}

// Réessayer après reconnexion
retryFailedQueries();
```

### Interceptor API Amélioré
- Ajoute le JWT automatiquement
- Gère les 401 (redirection /login)
- Détecte les erreurs réseau
- Logs erreurs serveur
- Messages d'erreur contextuels

---

## 📊 Types Utilisés

```typescript
// Customer
interface Customer {
  _id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: string;
}

// Invoice
interface Invoice {
  _id: string;
  companyId: string;
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subTotal: number;   // en centimes
  vatTotal: number;   // en centimes
  total: number;      // en centimes
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
  createdAt: string;
  updatedAt: string;
}

// Pagination
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
```

---

## 🎬 Composants Utilisés

### Layout
- **Header** - Avatar + dropdown déconnexion
- **Sidebar** - Navigation (dans la dashboard)
- **GradientBlobs** - Fond décoratif

### UI
- **Card/CardContent** - Conteneurs
- **Button** - Boutons génériques
- **Input** - Champs texte
- **Select** - Sélecteurs
- **Badge** - Status badges
- **Dialog** - Modales
- **Skeleton** - Loaders
- **Table** - Tableaux

### Animations
- **Framer Motion** - Transitions fluides
- **Recharts** - Graphiques
- **Lucide Icons** - 1500+ icônes

---

## 🚀 Commandes

```bash
# Développement
npm run dev          # http://localhost:3000

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

---

## 🎯 Page Création Facture (NEW)

```
/invoices/new
```

**Fonctionnalités :**
- Sélection du client (dropdown)
- Date d'échéance
- Articles multiples (ajouter/supprimer)
- Calcul auto HT + TVA + TTC
- Validation Zod complète
- Toast de succès/erreur
- Redirection vers /invoices après création

---

## ⚡ Performance

### Code Splitting
✅ Routes lazy loaded automatiquement par Next.js  
✅ Images optimisées avec next/image  
✅ CSS-in-JS mit Tailwind  

### Caching
✅ React Query cache 5 minutes par défaut  
✅ Invalidation intelligente sur mutations  
✅ Pagination pour limiter les données  

### Bundle Size
- Next.js + React: ~100KB (gzipped)
- TailwindCSS: ~15KB (gzipped)
- Dépendances: ~150KB (gzipped)
- **Total: ~260KB**

---

## 🔐 Sécurité

✅ JWT stocké en localStorage  
✅ Token auto-inclus via interceptor  
✅ Authentification vérifiée sur routes protégées  
✅ Validation côté client (Zod)  
✅ XSS protection via React (pas de dangerouslySetInnerHTML)  

---

## 📝 Prochaines Étapes

- [ ] Ajouter page "éditer une facture"
- [ ] Téléchargement PDF des factures
- [ ] Envoi email des factures depuis le frontend
- [ ] Intégration Stripe pour les paiements
- [ ] Tests E2E (Cypress/Playwright)
- [ ] Analytics (mixpanel/amplitude)
- [ ] Dark mode complet

---

## 🐛 Debugging

### Chrome DevTools
```javascript
// Dans la console
localStorage.getItem('token')
localStorage.getItem('user')

// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Ajouter à Providers
```

### Network Tab
- Vérifier les requêtes API
- Vérifier les headers (Authorization)
- Voir les réponses 200/400/500

---

**Frontend prêt pour la production ! 🎉**
