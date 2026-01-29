# PortfolAI - AI-Assisted Portfolio Website Builder

## Overview

PortfolAI is a web application that helps students generate clean, professional portfolio websites. Users can upload resumes, provide GitHub/LinkedIn links, and add project details. The app uses AI to extract structured information from uploaded materials and helps generate a multi-section personal website with customizable themes and layouts.

The core workflow is:
1. User uploads resume/provides links on the Home page
2. AI extracts structured data (name, bio, skills, projects)
3. User reviews and edits extracted data on the Review page
4. User customizes their portfolio in the Editor with live preview
5. Portfolio is stored in PostgreSQL and can be viewed/shared

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives with custom styling)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a pages-based architecture:
- `Home.tsx` - Upload resume and input links
- `Review.tsx` - Review/edit AI-extracted data
- `Editor.tsx` - Portfolio builder with live preview
- `ProjectDetail.tsx` - Individual project detail view

Custom hooks abstract API interactions:
- `use-portfolios.ts` - Portfolio CRUD operations
- `use-projects.ts` - Project CRUD operations
- `use-ai.ts` - AI extraction and generation
- `use-upload.ts` - File upload handling

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON API
- **File Uploads**: Multer with disk storage in `/uploads` directory
- **Build**: esbuild for production bundling

The server uses a clean separation:
- `routes.ts` - API endpoint definitions and handlers
- `storage.ts` - Database access layer (repository pattern)
- `db.ts` - Drizzle ORM database connection
- `static.ts` - Production static file serving
- `vite.ts` - Development server with HMR

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push`)

Core tables:
- `users` - Basic user accounts
- `portfolios` - Portfolio metadata (name, bio, theme, links)
- `projects` - Individual projects within portfolios

### API Contract
The API contract is defined in `shared/routes.ts` using Zod schemas. This provides:
- Type-safe request/response definitions
- Shared types between frontend and backend
- Runtime validation

Key endpoints:
- `GET/POST/PUT /api/portfolios/:id` - Portfolio CRUD
- `POST /api/portfolios/:portfolioId/projects` - Create project
- `PUT/DELETE /api/projects/:id` - Project update/delete
- `POST /api/upload` - File upload with text extraction
- `POST /api/ai/extract` - AI data extraction
- `POST /api/ai/generate-description` - AI project description generation

### AI Integration
Uses OpenAI via Replit AI Integrations:
- Text extraction from uploaded resumes
- Structured data parsing (name, skills, experience)
- Project description generation from rough notes

The AI client is configured in `server/replit_integrations/image/client.ts` and uses environment variables:
- `AI_INTEGRATIONS_OPENAI_API_KEY`
- `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Theme System
Portfolio themes are defined in `LivePreview.tsx` and exported via `themeConfigs` for use across pages:
- Clean Light, Modern Dark, Corporate Blue, Minimalist
- Warm Sunset, Forest Green, Ocean Deep, Soft Lavender
- Elegant Noir, Fresh Mint
- Pixel (retro dark), Watercolor (soft pastels), Dreamy (purple/pink), Business (professional blue)
- Frosted Glass (low saturation with orange accents), Sand Blue (blue gradient), Apple Minimal (clean white)

Each theme includes:
- Color schemes with proper contrast
- Font styles (sans, serif, mono)
- Gradient backgrounds and decorative elements
- Card styling with consistent accent colors
- isDark flag for conditional dark/light styling

Custom Color Support:
- Users can override theme accent colors with customPrimaryColor and customAccentColor
- ColorPicker component with 8 preset color combinations
- Manual hex color inputs for precise customization
- Custom colors are stored in portfolio database and applied via CSS variables

CSS variables in `index.css` provide the design token foundation.

### Project Detail System
Projects have dedicated detail pages with:
- Cover images (uploaded via `/api/upload`)
- Multiple link types (GitHub, Demo, Video)
- Highlights list, challenges, and outcome sections
- Navigation back to portfolio editor
- Theme consistency: ProjectDetail uses the same themeConfigs as LivePreview
- All UI elements (buttons, badges, cards, sections) use theme classes dynamically

Project cards in LivePreview are clickable with visual feedback and keyboard accessibility.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store
- **Connection**: `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation

### AI Services
- **OpenAI API**: Via Replit AI Integrations proxy
- **Environment Variables**:
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`
- **Features Used**: Chat completions for text extraction and generation

### File Storage
- **Local Storage**: Uploaded files stored in `/uploads` directory
- **Served At**: `/uploads/*` static route
- **Supported Formats**: PDF, images for resume and project files

### Third-Party Libraries
- **UI**: Radix UI primitives, Lucide icons
- **Forms**: React Hook Form, Zod validation
- **Styling**: Tailwind CSS, class-variance-authority
- **Data Fetching**: TanStack Query
- **Date Handling**: date-fns

### Development Tools
- **Vite Plugins**: Replit-specific plugins for error overlay, cartographer, dev banner
- **TypeScript**: Strict mode with path aliases (`@/`, `@shared/`)