# Architecture Documentation

## Overview

CodeSathi is a modern React-based web application built with TypeScript, Vite, and Supabase. The architecture follows a modular, component-based design with clear separation of concerns.

## Technology Stack

### Frontend
- **React 19.2.0**: UI framework with latest features
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Fast build tool and dev server
- **Tailwind CSS 3.4.1**: Utility-first CSS framework

### Backend & Services
- **Supabase**: Authentication, database, and real-time features
- **Google Gemini AI**: AI-powered tutoring and content generation
- **OpenRouter (Optional)**: Alternative AI provider

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **PostCSS**: CSS processing
- **Terser**: JavaScript minification

## Architecture Patterns

### Component Architecture

```
┌─────────────────────────────────────────┐
│              App.tsx                    │
│  (Main application orchestrator)        │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼──────────────┐
    │             │              │
    ▼             ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐
│ Auth   │  │ Onboarding│ │ Dashboard│
│ Views  │  │   Flow    │ │  Views   │
└────────┘  └──────────┘  └──────────┘
```

### State Management

We use React hooks for state management:

1. **useAuth**: Manages authentication state
   - Session management
   - User ID tracking
   - Sign in/out operations

2. **useUserData**: Manages user profile and progress
   - Profile data loading
   - Progress tracking
   - Pending profile application

### Data Flow

```
User Action
    ↓
Component Handler
    ↓
Service Layer (API calls)
    ↓
Supabase Backend
    ↓
State Update (hooks)
    ↓
UI Re-render
```

## Module Responsibilities

### /components
Reusable UI components with specific responsibilities:
- `Auth.tsx`: Login/signup forms
- `Onboarding.tsx`: Multi-step onboarding flow
- `LessonPlayer.tsx`: Interactive lesson interface
- `TracksView.tsx`: Learning track selection and progress
- `ProjectsView.tsx`: Project gallery and creation
- `RewardsView.tsx`: Badges and achievements
- `AITutor.tsx`: AI assistant chat interface
- `CodeEditor.tsx`: In-browser code editing

### /hooks
Custom React hooks for shared logic:
- `useAuth.ts`: Authentication state and operations
- `useUserData.ts`: User profile and progress management

### /services
API integration and business logic:
- `userService.ts`: User CRUD operations
- `geminiService.ts`: AI tutoring features
- `sathiApi.ts`: Alternative AI provider

### /lib
Utility libraries and configurations:
- `supabase.ts`: Supabase client initialization
- `errors.ts`: Custom error types and handlers

### /constants.ts
Application constants:
- Lesson definitions
- Project templates
- Badge criteria
- Initial state

### /types.ts
TypeScript type definitions:
- User types
- Lesson types
- Progress types
- API response types

## Security Architecture

### Authentication Flow
```
1. User submits credentials
2. Supabase Auth validates
3. JWT token issued
4. Token stored securely
5. RLS policies enforced on all queries
```

### Data Security
- **Row Level Security (RLS)**: All database tables protected
- **Environment Variables**: Sensitive data isolated
- **HTTPS Only**: SSL/TLS in production
- **XSS Protection**: React's built-in protections
- **CORS**: Restricted to allowed origins

## Build Optimization

### Code Splitting Strategy
```
react-vendor.js      (21.95 kB) - React core
supabase.js         (173.77 kB) - Supabase SDK
ui-icons.js           (9.71 kB) - Lucide icons
index.js            (406.32 kB) - Application code
```

### Optimization Techniques
1. **Tree Shaking**: Removes unused code
2. **Minification**: Terser with aggressive settings
3. **Compression**: Gzip reduces bundle by ~72%
4. **Lazy Loading**: Route-based code splitting
5. **CDN Caching**: Static assets cached at edge

## Performance Considerations

### Bundle Size
- **CSS**: 30.55 kB (5.94 kB gzipped)
- **JavaScript**: 611 kB (167.63 kB gzipped)
- **Total**: 641.55 kB (173.57 kB gzipped)

### Load Time Optimizations
- Font preconnect
- Critical CSS inline
- Async script loading
- Image lazy loading
- Service worker (future)

## Database Schema

### profiles
```sql
- user_id (uuid, PK, FK to auth.users)
- display_name (text)
- learner_type (text)
- age_group (text)
- goals (text[])
- experience (text)
- learning_style (text)
- devices (text[])
- time_per_day (integer)
- parent_report (boolean)
- phone_number (text)
- address (text)
```

### progress
```sql
- user_id (uuid, PK, FK to auth.users)
- current_track (text)
- xp (integer)
- streak (integer)
- completed_lessons (text[])
- badges (text[])
- last_completed_at (timestamp)
```

### lesson_completions
```sql
- user_id (uuid, FK to auth.users)
- lesson_id (text)
- completed_at (timestamp)
- PRIMARY KEY (user_id, lesson_id)
```

## Future Improvements

### Performance
- [ ] Add service worker for offline support
- [ ] Implement virtual scrolling for large lists
- [ ] Add image optimization pipeline
- [ ] Implement CDN for static assets

### Features
- [ ] Real-time collaboration
- [ ] Video lessons
- [ ] Voice-based AI tutor
- [ ] Mobile app (React Native)

### Testing
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Integration tests (Cypress)
- [ ] E2E tests (Playwright)
- [ ] Performance testing (Lighthouse CI)

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated deployments
- [ ] Monitoring and alerting
- [ ] A/B testing infrastructure
