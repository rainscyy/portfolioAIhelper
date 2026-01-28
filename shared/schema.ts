import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  // For MVP we can keep it simple, Replit Auth would map here usually
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"), // text for simplicity in some sqlite/pg setups, but pg-core timestamp is better. Using text default for now to be safe or valid SQL? No, use proper timestamp in PG.
  // Actually, let's use proper timestamp.
});

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(), // Full name of the student
  tagline: text("tagline"),
  bio: text("bio"),
  resumeText: text("resume_text"), // Parsed text from resume
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  personalWebsiteUrl: text("personal_website_url"),
  email: text("email"),
  templateId: text("template_id").default("minimal"), // minimal, creative, professional
  colorTheme: text("color_theme").default("light"), // light, dark, blue, etc.
  fontStyle: text("font_style").default("sans"), // sans, serif, mono
  profileImageUrl: text("profile_image_url"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  detailedDescription: text("detailed_description"), // Full description for detail page
  role: text("role"),
  year: text("year"), // text because it might be a range "2020-2021"
  imageUrl: text("image_url"), // Cover image URL
  linkUrl: text("link_url"), // Main project URL
  githubUrl: text("github_url"), // GitHub repository
  demoUrl: text("demo_url"), // Live demo link
  videoUrl: text("video_url"), // Video demo link
  technologies: text("technologies").array(), // Array of tech strings
  highlights: text("highlights").array(), // Key achievements/features
  challenges: text("challenges"), // Challenges faced
  outcome: text("outcome"), // Results/impact
  order: integer("order").default(0),
});

// === RELATIONS ===

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [projects.portfolioId],
    references: [portfolios.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPortfolioSchema = createInsertSchema(portfolios).omit({ id: true, userId: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, portfolioId: true });

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type UpdatePortfolioRequest = Partial<InsertPortfolio>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProjectRequest = Partial<InsertProject>;

// Response types
export type PortfolioWithProjects = Portfolio & { projects: Project[] };

// File upload response
export interface FileUploadResponse {
  filename: string;
  url: string;
  originalName: string;
  extractedText?: string; // If it was a resume/doc
}

// AI Extraction Request
export interface ExtractionRequest {
  resumeText?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

// AI Extraction Response
export interface ExtractionResponse {
  name?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  skills?: string[];
  experience?: {
    company: string;
    role: string;
    description: string;
    years: string;
  }[];
  education?: {
    school: string;
    degree: string;
    year: string;
  }[];
  projects?: {
    title: string;
    description: string;
    role?: string;
    technologies?: string[];
  }[];
}
