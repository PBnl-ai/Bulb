# Perfect Moods Canteen Radio Controller

## Overview

This application is an automated radio controller for the Perfect Moods web radio station, designed specifically for canteen/cafeteria environments. It provides a touch-optimized iPad interface that automatically plays the Perfect Moods radio stream during weekday working hours (8:00 AM - 5:30 PM by default), with manual override capabilities.

The application features:
- Automatic scheduling based on weekday/weekend detection and time ranges
- Real-time clock and status displays
- Manual play/pause controls with temporary override functionality
- Spinning LP disc button displaying current album artwork
- Live track information display (title, artist, album) from RadioKing API
- Audio wave visualization for playback feedback
- Configurable schedule times stored in browser localStorage
- Brand-consistent design matching Perfect Moods visual identity
- Full keyboard accessibility with semantic HTML and ARIA labels

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server

**Routing**: Wouter for client-side routing (lightweight React Router alternative)

**UI Components**: Radix UI primitives with shadcn/ui styling system
- Component library follows the "New York" style variant
- Comprehensive set of pre-built accessible components (accordion, alert, button, card, dialog, dropdown, form, input, select, tabs, toast, tooltip, etc.)
- Custom components built on Radix primitives for accessibility

**Styling**: 
- Tailwind CSS with custom configuration for Perfect Moods brand colors
- Phone-frame UI design with centered white container and gradient background
- Container with rounded corners (3xl on mobile, 2.5rem on desktop) and large shadow
- Maximum width: md (448px) on mobile, lg (512px) on desktop
- Custom color palette centered on Perfect Moods beige (#c9c4c0) and dark gray (#444444)
- Supporting colors include success green, neutral grays, and slate tones for backgrounds
- Typography using Inter font family with specific type scales for different content types
- Responsive layout with maximum 2 columns on desktop for better mobile-like experience

**State Management**: 
- React hooks (useState, useEffect, useRef) for local component state
- TanStack Query (React Query) for server state management
- localStorage for persisting schedule configuration (start/end times)

**Key Components**:
- `RadioController`: Main controller component managing audio playback, scheduling logic, track info fetching, and user interactions
- `TimeDisplay`: Real-time clock with Dutch locale formatting
- `StatusIndicator`: Visual status cards showing radio, day type, and schedule states
- `AudioWaveVisualizer`: Animated wave visualization responding to playback state
- `NowPlayingTrack`: Track information display component showing current song details

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Architecture Pattern**: RESTful API structure (though currently minimal routes)

**Build System**: 
- Development: tsx for TypeScript execution
- Production: esbuild for server bundling, Vite for client bundling

**Server Features**:
- Request logging middleware with timing and response capture
- Vite middleware integration in development for HMR
- Static file serving in production
- Error handling middleware

**Storage Interface**: 
- Abstract `IStorage` interface for CRUD operations
- `MemStorage` in-memory implementation (default)
- Designed to be swapped with database-backed storage (e.g., PostgreSQL with Drizzle ORM)

### Data Storage Solutions

**Current**: In-memory storage via `MemStorage` class for user data

**Configured (Not Active)**: 
- PostgreSQL via Neon Database serverless driver
- Drizzle ORM for type-safe database queries and migrations
- Schema defined with users table (id, username, password)
- Migration configuration pointing to PostgreSQL

**Client-Side Storage**: 
- localStorage for schedule preferences (radio-start-hour, radio-start-minute, radio-end-hour, radio-end-minute)

**Design Decision**: The application currently uses in-memory storage for simplicity, but includes full configuration for PostgreSQL migration. This allows easy transition to persistent storage when needed without architectural changes.

### External Dependencies

**Third-Party Services**:
- Perfect Moods Radio Stream: `https://play.radioking.io/perfectmoods/104227` (external audio stream)
- RadioKing API: `https://api.radioking.io/widget/radio/perfectmoods/track/current` (track metadata)
- Google Fonts: Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono font families

**Database** (Configured):
- Neon Database (PostgreSQL serverless)
- Connection via `@neondatabase/serverless` driver
- Requires `DATABASE_URL` environment variable

**UI Component Libraries**:
- Radix UI: Comprehensive set of unstyled, accessible component primitives
- Embla Carousel: Carousel/slider functionality
- cmdk: Command palette component
- Vaul: Drawer component
- React Day Picker: Calendar/date picker

**Utilities**:
- class-variance-authority: Type-safe variant API for components
- clsx & tailwind-merge: Conditional className handling
- date-fns: Date manipulation and formatting
- Zod: Schema validation (with drizzle-zod integration)
- React Hook Form with Zod resolvers: Form state management

**Development Tools**:
- Replit-specific plugins for Vite (runtime error overlay, cartographer, dev banner)
- Drizzle Kit for database migrations
- PostCSS with Tailwind CSS and Autoprefixer

**Design Rationale**: The architecture separates concerns clearly between frontend presentation, backend API structure, and data persistence. The use of shadcn/ui provides a consistent, accessible component library while maintaining flexibility. The storage abstraction allows swapping implementations without changing application logic. TanStack Query handles server state efficiently with caching and invalidation strategies built-in.