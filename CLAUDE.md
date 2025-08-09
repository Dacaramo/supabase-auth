# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application demonstrating comprehensive Supabase authentication patterns. It's built as an educational "masterclass" project covering various auth methods including email/password, OAuth, magic links, MFA, and OTP verification via email and SMS.

## Development Commands

- **Development**: `npm run dev --turbopack` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Linting**: `npm run lint`

## Architecture

### Authentication Flow
The app uses Supabase Auth with a three-layer client setup:
- `src/supabase/client.ts` - Browser client for client components
- `src/supabase/server.ts` - Server client for server components/actions
- `src/supabase/middleware.ts` - Middleware client for session management

### Key Components
- **Middleware**: `src/middleware.ts` handles session updates on every request
- **Route Handlers**: `src/app/api/callback/route.ts` processes OAuth callbacks
- **Auth Pages**: Complete set of auth flows in `src/app/` (login, register, mfa, oauth, etc.)
- **Forms**: Dedicated components in `src/components/` for each auth method
- **Dashboard**: Comprehensive user session display with JWT token parsing

### Environment Variables
Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Authentication**: Supabase Auth (@supabase/ssr v0.6.1)
- **Styling**: Tailwind CSS 4 with DaisyUI 5
- **State**: TanStack React Query v5
- **TypeScript**: Strict mode enabled

### Code Patterns
- All auth forms are client components using the browser client
- Server components use the server client with cookie handling
- Spanish UI text throughout the application
- Comprehensive error handling and loading states
- JWT token parsing utilities in `src/utils/strings.ts`