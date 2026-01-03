# Social Network App

A production-ready Twitter-like social network built with the MERN stack (MongoDB, Express, React, Node.js) with TypeScript, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication (access + refresh tokens)
- Protected routes
- Secure password hashing with bcrypt
- Token refresh mechanism

### User Features
- View public user profiles
- Follow/unfollow users
- User profile with followers/following counts

### Post Features
- Create posts (max 280 characters)
- Delete own posts
- Like/unlike posts
- View single post
- Home feed with posts from followed users
- Infinite scroll pagination
- Real-time like updates

### UI/UX
- Modern, responsive design (mobile-first)
- Loading states and error handling
- Clean, intuitive interface
- Tailwind CSS styling

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Validation
- **Helmet** - Security
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

## 📁 Project Structure

```
web-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── features/       # Feature-based modules
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   └── users/
│   │   ├── components/     # Reusable components
│   │   │   ├── ui/         # UI primitives
│   │   │   ├── layout/     # Layout components
│   │   │   └── common/     # Common components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── models/         # Mongoose models
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Express middlewares
│   │   ├── utils/          # Utilities
│   │   ├── app.ts          # Express app
│   │   └── index.ts        # Entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

### Why This Structure?

- **Monorepo**: Single repository for easier dependency management and code sharing
- **Feature-based frontend**: `/features` organizes code by domain (auth, posts, users) for better maintainability
- **Layered backend**: Clear separation between routes, controllers, services, and models enables testability and maintainability
- **Type safety**: TypeScript across the stack ensures consistency and catches errors early

## 🗄️ Database Schema

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

### Indexes
- User: `username`, `email` (unique indexes)
- Post: `author`, `createdAt` (compound index for feed queries)

## 🔌 API Routes

### Authentication
```
POST   /api/auth/register     - User registration
POST   /api/auth/login        - User login
POST   /api/auth/refresh      - Refresh access token
POST   /api/auth/logout       - User logout
```

### Users
```
GET    /api/users/:id         - Get user profile
POST   /api/users/:id/follow  - Follow user
DELETE /api/users/:id/follow  - Unfollow user
```

### Posts
```
GET    /api/posts             - Get feed (paginated)
GET    /api/posts/:id         - Get single post
POST   /api/posts             - Create post
DELETE /api/posts/:id         - Delete own post
POST   /api/posts/:id/like    - Like/unlike post
```

## 🚦 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/social-network
   JWT_ACCESS_SECRET=your-access-secret-key-change-in-production
   JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**

   Development mode (runs both client and server):
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Server
   npm run dev:server

   # Terminal 2 - Client
   npm run dev:client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Architecture Overview

### Request Flow

```
Client (React)
  ↓
Redux Store (State Management)
  ↓
API Service (Axios with interceptors)
  ↓
Express Routes
  ↓
Auth Middleware (JWT verification)
  ↓
Controllers
  ↓
Services (Business Logic)
  ↓
Mongoose Models
  ↓
MongoDB Database
```

### Authentication Flow

1. User registers/logs in
2. Server generates access token (15min) and refresh token (7 days)
3. Refresh token stored in httpOnly cookie
4. Access token stored in localStorage and Redux
5. Access token sent in Authorization header for protected routes
6. On token expiry, Axios interceptor automatically refreshes token
7. On refresh failure, user is logged out

### State Management

- **Redux Toolkit** for global state
- **Auth Slice**: User data, access token, authentication status
- **UI Slice**: Loading states, error messages

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with expiration
- httpOnly cookies for refresh tokens
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation with Zod
- SQL injection prevention (MongoDB)
- XSS protection

## 📝 Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Clean architecture principles
- Separation of concerns
- Error handling
- No unused code
- Meaningful variable names

## 🧪 Testing

Manual testing recommended for:
- Authentication flow (register, login, logout, refresh)
- CRUD operations (create, read, update, delete posts)
- Follow/unfollow functionality
- Like/unlike posts
- Error scenarios
- Responsive design

## 📸 Screenshots

_Add screenshots of your application here_

## 🚀 Future Improvements

- [ ] Comments on posts
- [ ] Image upload (Cloudinary integration)
- [ ] Dark mode toggle
- [ ] User search functionality
- [ ] Real-time updates (WebSockets)
- [ ] Unit and integration tests
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Notifications system
- [ ] Hashtags and mentions
- [ ] Post editing
- [ ] User settings page

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built as a portfolio project demonstrating full-stack MERN development skills.

---

**Note**: This is a production-ready template suitable for HR recruiters evaluating junior/mid-level web developer candidates. The code follows best practices, clean architecture principles, and production-ready patterns.

