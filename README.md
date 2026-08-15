# Artsonna

Artsonna is a curated marketplace for discovering and hiring creative professionals across New York City. It combines portfolio publishing, creative discovery, project collaboration, bookings, messaging, and local community experiences in one editorial-first platform.

## Product Overview

Artsonna supports two connected journeys:

- **Creatives** build a public portfolio, publish services, showcase work, join the community, and manage client projects.
- **Clients** discover talent through the House of Creatives, review portfolios, book services, message creatives, and manage active projects.

## Core Features

- **House of Creatives:** Search and filter creative professionals by discipline, location, style, budget, and availability.
- **AI Portfolio Studio:** A guided five-step portfolio builder covering work, identity, online presence, review, and generation.
- **Adaptive portfolios:** Responsive, ratio-preserving masonry galleries for images, video, audio, and project work.
- **Projects workspace:** Unified inquiries, offers, conversations, bookings, deliverables, payments, and completed-project actions.
- **Community:** NYC events, creative boards, circles, weekly prompts, mentorship, and creator spotlights.
- **Profiles and services:** Persistent creative identities, service listings, pricing, availability, reviews, and public portfolio pages.
- **Authentication:** Email, Google sign-in, OTP verification, and password recovery through Base44 authentication.

## Technology

- React 18
- Vite 6
- Tailwind CSS
- React Router
- TanStack Query
- Base44 SDK and backend services
- shadcn/ui and Radix UI
- Framer Motion

## Project Structure

```text
src/
  components/       Reusable interface and feature components
  data/             Curated marketplace and community content
  hooks/            Data and feature state hooks
  lib/              Shared application utilities
  pages/            Route-level screens
base44/
  entities/         Database entity definitions
  functions/        Backend functions
  config.jsonc      Base44 project configuration
```

The main application routes are registered in `src/App.jsx`. Base44 entities provide persistent storage for creative profiles, portfolios, assets, projects, bookings, messages, services, reviews, and community activity.

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm
- A Base44 project with access to this app

### Install

```bash
npm install
```

### Environment

To run the frontend against the hosted Base44 backend, create `.env.local` in the project root:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

Do not commit `.env.local` or any credentials.

### Start the frontend

```bash
npm run dev
```

Vite prints the local development URL in the terminal.

### Start with the Base44 CLI

Install the CLI and run the complete Base44 development environment:

```bash
npm install -g base44@latest
base44 dev
```

## Available Commands

```bash
npm run dev        # Start Vite development server
npm run build      # Create a production build
npm run preview    # Preview the production build
npm run lint       # Run ESLint
npm run lint:fix   # Fix supported lint issues
npm run typecheck  # Run JavaScript type checking
```

## Production Build

```bash
npm run build
```

The production output is generated in `dist/`.

## GitHub and Base44 Sync

Artsonna uses Base44 GitHub two-way repository sync. Changes merged into the repository's `main` branch are reflected in Base44, and changes saved in Base44 are synchronized to the connected repository.

After syncing changes, publish the app from the Base44 dashboard to make them available to users.

Important requirements:

- GitHub sync requires a supported Base44 plan.
- The initial connection must be completed by the app owner.
- The synchronized branch must be named `main`.
- Repository sync is a permanent project configuration.

## Documentation

- [Base44 documentation](https://docs.base44.com/)
- [Base44 CLI overview](https://docs.base44.com/developers/references/cli/get-started/overview)
- [GitHub integration](https://docs.base44.com/Integrations/Using-GitHub)

## Status

Artsonna is under active development.