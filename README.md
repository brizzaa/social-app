# Social Network App

Un'app social stile Twitter costruita con il MERN stack (MongoDB, Express, React, Node.js) usando TypeScript, Redux Toolkit e Tailwind CSS.

### Autenticazione
- Registrazione e login utenti
- Autenticazione JWT con access token e refresh token
- Route protette
- Password hashate con bcrypt
- Refresh automatico dei token

### Funzionalità Utenti
- Visualizza profili pubblici
- Segui/smetti di seguire utenti
- Profilo con contatori follower/seguendo

### Funzionalità Post
- Crea post (max 280 caratteri)
- Elimina i tuoi post
- Metti/togli like ai post
- Visualizza singolo post
- Feed home con post degli utenti seguiti
- Scroll infinito con paginazione
- Aggiornamenti like in tempo reale

### UI/UX
- Design moderno e responsive (mobile-first)
- Stati di caricamento e gestione errori
- Interfaccia pulita e intuitiva
- Styling con Tailwind CSS
- Interfaccia completamente in italiano 🇮🇹


### Frontend
- **React 18** - Libreria UI
- **TypeScript** - Type safety
- **Redux Toolkit** - Gestione stato
- **React Router** - Routing
- **Axios** - Client HTTP
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Autenticazione
- **bcrypt** - Hash password
- **Zod** - Validazione
- **Helmet** - Sicurezza
- **CORS** - Cross-origin
- **express-rate-limit** - Rate limiting

## Struttura Progetto

```
web-app/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── features/       # Moduli per feature
│   │   │   ├── posts/
│   │   │   └── users/
│   │   ├── components/     # Componenti riutilizzabili
│   │   │   ├── ui/         # Componenti UI base
│   │   │   ├── layout/     # Componenti layout
│   │   │   └── common/     # Componenti comuni
│   │   ├── pages/          # Pagine
│   │   ├── services/       # Servizi API
│   │   ├── store/          # Redux store
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/            # Tipi TypeScript
│   │   └── utils/          # Utilities
│   └── package.json
├── server/                 # Backend Express
│   ├── src/
│   │   ├── config/         # Configurazione
│   │   ├── models/         # Modelli Mongoose
│   │   ├── controllers/    # Controller route
│   │   ├── services/       # Logica business
│   │   ├── routes/         # Route API
│   │   ├── middlewares/    # Middleware Express
│   │   ├── utils/          # Utilities
│   │   ├── app.ts          # App Express
│   │   └── index.ts        # Entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🗄️ Schema Database

### User Model
```typescript
{
  username: string (unique, required, indexed)
  email: string (unique, required, indexed)
  password: string (hashed, required)
  avatar?: string (URL)
  followers: ObjectId[] (ref: User)
  following: ObjectId[] (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Post Model
```typescript
{
  author: ObjectId (ref: User, required, indexed)
  content: string (required, max 280 chars)
  likes: ObjectId[] (ref: User)
  createdAt: Date (indexed for sorting)
  updatedAt: Date
}
```

### Indici
- User: `username`, `email` (indici unici)
- Post: `author`, `createdAt` (indice composto per query feed)

## 🔌 API Routes

### Autenticazione
```
POST   /api/auth/register     - Registrazione utente
POST   /api/auth/login        - Login utente
POST   /api/auth/refresh      - Refresh access token
POST   /api/auth/logout       - Logout utente
```

### Utenti
```
GET    /api/users/:id         - Ottieni profilo utente
POST   /api/users/:id/follow  - Segui utente
DELETE /api/users/:id/follow  - Smetti di seguire utente
```

### Post
```
GET    /api/posts             - Ottieni feed (paginato)
GET    /api/posts/:id         - Ottieni singolo post
POST   /api/posts             - Crea post
DELETE /api/posts/:id         - Elimina tuo post
POST   /api/posts/:id/like    - Like/unlike post
```

## 🚦 Come iniziare

### Prerequisiti
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (locale o MongoDB Atlas)

### Installazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/brizzaa/social-app.git
   cd web-app
   ```

2. **Installa le dipendenze**
   ```bash
   npm run install:all
   ```

3. **Configura le variabili d'ambiente**

   Crea `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/social-network
   JWT_ACCESS_SECRET=your-access-secret-key-change-in-production
   JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

   Crea `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Avvia MongoDB**
   ```bash
   # Se usi MongoDB locale
   mongod
   ```

5. **Avvia l'applicazione**

   Modalità sviluppo (avvia sia client che server):
   ```bash
   npm run dev
   ```

   Oppure avvia separatamente:
   ```bash
   # Terminale 1 - Server
   npm run dev:server

   # Terminale 2 - Client
   npm run dev:client
   ```

6. **Accedi all'applicazione**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Architettura

### Flusso Richieste

```
Client (React)
  ↓
Redux Store (Gestione stato)
  ↓
API Service (Axios con interceptors)
  ↓
Express Routes
  ↓
Auth Middleware (Verifica JWT)
  ↓
Controllers
  ↓
Services (Logica business)
  ↓
Mongoose Models
  ↓
MongoDB Database
```

### Flusso Autenticazione

1. Utente si registra/fa login
2. Server genera access token (15min) e refresh token (7 giorni)
3. Refresh token salvato in cookie httpOnly
4. Access token salvato in localStorage e Redux
5. Access token inviato nell'header Authorization per route protette
6. Alla scadenza, l'interceptor Axios aggiorna automaticamente il token
7. Se il refresh fallisce, l'utente viene disconnesso

### Gestione Stato

- **Redux Toolkit** per stato globale
- **Auth Slice**: Dati utente, access token, stato autenticazione
- **UI Slice**: Stati di caricamento, messaggi di errore

## 🔒 Sicurezza

- Password hashate con bcrypt (10 salt rounds)
- Token JWT con scadenza
- Cookie httpOnly per refresh token
- Helmet.js per header di sicurezza
- Configurazione CORS
- Rate limiting (100 richieste per 15 minuti per IP)
- Validazione input con Zod
- Prevenzione SQL injection (MongoDB)
- Protezione XSS

## 📝 Qualità Codice

- TypeScript per type safety
- ESLint per linting
- Prettier per formattazione
- Principi di clean architecture
- Separazione delle responsabilità
- Gestione errori
- Codice pulito e significativo

## 🧪 Testing

Test manuali consigliati per:
- Flusso autenticazione (registrazione, login, logout, refresh)
- Operazioni CRUD (crea, leggi, aggiorna, elimina post)
- Funzionalità follow/unfollow
- Like/unlike post
- Scenari di errore
- Design responsive

## 🚀 Miglioramenti Futuri

- [ ] Commenti sui post
- [ ] Upload immagini (integrazione Cloudinary)
- [ ] Toggle dark mode
- [ ] Ricerca utenti
- [ ] Aggiornamenti real-time (WebSockets)
- [ ] Test unitari e di integrazione
- [ ] Verifica email
- [ ] Reset password
- [ ] Sistema notifiche
- [ ] Hashtag e menzioni
- [ ] Modifica post
- [ ] Pagina impostazioni utente

## 📄 License

Questo progetto è open source e disponibile sotto la MIT License.

## 👤 Autore
Progetto personale per imparare e mettere in pratica le competenze full-stack con MERN.
