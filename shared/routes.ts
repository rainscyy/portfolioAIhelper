import { z } from 'zod';
import { insertPortfolioSchema, insertProjectSchema, portfolios, projects } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  portfolios: {
    get: {
      method: 'GET' as const,
      path: '/api/portfolios/:id',
      responses: {
        200: z.custom<typeof portfolios.$inferSelect & { projects: typeof projects.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    // For MVP, maybe just get the "current" user's portfolio or create one
    // But let's stick to standard CRUD
    create: {
      method: 'POST' as const,
      path: '/api/portfolios',
      input: insertPortfolioSchema,
      responses: {
        201: z.custom<typeof portfolios.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/portfolios/:id',
      input: insertPortfolioSchema.partial(),
      responses: {
        200: z.custom<typeof portfolios.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    export: {
      method: 'GET' as const,
      path: '/api/portfolios/:id/export',
      responses: {
        200: z.object({ html: z.string() }), // Returns static HTML string
        404: errorSchemas.notFound,
      },
    },
  },
  projects: {
    create: {
      method: 'POST' as const,
      path: '/api/portfolios/:portfolioId/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound, // if portfolio not found
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/projects/:id',
      input: insertProjectSchema.partial(),
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/projects/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  // AI and File Operations
  ai: {
    extract: {
      method: 'POST' as const,
      path: '/api/ai/extract',
      input: z.object({
        resumeText: z.string().optional(),
        githubUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
      }),
      responses: {
        200: z.custom<{
          name?: string;
          tagline?: string;
          bio?: string;
          email?: string;
          skills?: string[];
          experience?: any[];
          projects?: any[];
        }>(),
        500: errorSchemas.internal,
      },
    },
    generateDescription: {
        method: 'POST' as const,
        path: '/api/ai/generate-description',
        input: z.object({
            projectTitle: z.string(),
            roughNotes: z.string(),
        }),
        responses: {
            200: z.object({ description: z.string() }),
            500: errorSchemas.internal
        }
    }
  },
  upload: {
    create: {
      method: 'POST' as const,
      path: '/api/upload',
      // input is FormData, not typed here
      responses: {
        200: z.object({
          filename: z.string(),
          url: z.string(),
          extractedText: z.string().optional(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Re-export types from schema for hook usage
export type { 
  InsertPortfolio, 
  UpdatePortfolioRequest, 
  InsertProject, 
  UpdateProjectRequest,
  Portfolio,
  Project,
  PortfolioWithProjects
} from './schema';
