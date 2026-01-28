import { db } from "./db";
import {
  users, portfolios, projects,
  type User, type InsertUser,
  type Portfolio, type InsertPortfolio, type UpdatePortfolioRequest,
  type Project, type InsertProject, type UpdateProjectRequest,
  type PortfolioWithProjects
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolios
  getPortfolio(id: number): Promise<PortfolioWithProjects | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, updates: UpdatePortfolioRequest): Promise<Portfolio>;
  
  // Projects
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: UpdateProjectRequest): Promise<Project>;
  deleteProject(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Portfolios
  async getPortfolio(id: number): Promise<PortfolioWithProjects | undefined> {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.id, id));
    if (!portfolio) return undefined;

    const portfolioProjects = await db.select().from(projects).where(eq(projects.portfolioId, id));
    
    return { ...portfolio, projects: portfolioProjects };
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const [portfolio] = await db.insert(portfolios).values(insertPortfolio).returning();
    return portfolio;
  }

  async updatePortfolio(id: number, updates: UpdatePortfolioRequest): Promise<Portfolio> {
    const [updated] = await db.update(portfolios)
      .set(updates)
      .where(eq(portfolios.id, id))
      .returning();
    return updated;
  }

  // Projects
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, updates: UpdateProjectRequest): Promise<Project> {
    const [updated] = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }
}

export const storage = new DatabaseStorage();
