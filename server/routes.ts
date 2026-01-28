import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { db } from "./db";
import * as schema from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { openai } from "./replit_integrations/image/client"; // reusing client from image integration for openai instance

// Setup uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storageConfig });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // --- Portfolios ---
  app.get(api.portfolios.get.path, async (req, res) => {
    const portfolio = await storage.getPortfolio(Number(req.params.id));
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  });

  app.post(api.portfolios.create.path, async (req, res) => {
    try {
      const input = api.portfolios.create.input.parse(req.body);
      const portfolio = await storage.createPortfolio(input);
      res.status(201).json(portfolio);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.portfolios.update.path, async (req, res) => {
    try {
      const input = api.portfolios.update.input.parse(req.body);
      const portfolio = await storage.updatePortfolio(Number(req.params.id), input);
      res.json(portfolio);
    } catch (err) {
        // Handle errors
         return res.status(400).json({ message: "Validation error" });
    }
  });

  // --- Projects ---
  app.post(api.projects.create.path, async (req, res) => {
     try {
      // Ensure portfolioId from params matches body if present, or just use params
      const portfolioId = Number(req.params.portfolioId);
      const input = api.projects.create.input.parse({ ...req.body, portfolioId });
      
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });
  
    app.put(api.projects.update.path, async (req, res) => {
    try {
      const input = api.projects.update.input.parse(req.body);
      const project = await storage.updateProject(Number(req.params.id), input);
      res.json(project);
    } catch (err) {
         return res.status(400).json({ message: "Validation error" });
    }
  });

  app.delete(api.projects.delete.path, async (req, res) => {
    await storage.deleteProject(Number(req.params.id));
    res.status(204).send();
  });

  // --- Upload ---
  app.post(api.upload.create.path, upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    let extractedText = undefined;

    // If PDF, extract text
    if (req.file.mimetype === 'application/pdf') {
      try {
        const pdfParse = (await import("pdf-parse")).default;
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        extractedText = data.text;
      } catch (e) {
        console.error("PDF parse error", e);
      }
    }

    res.json({
      filename: req.file.filename,
      url: fileUrl,
      extractedText
    });
  });

  // --- AI Extraction ---
  app.post(api.ai.extract.path, async (req, res) => {
    const { resumeText, githubUrl, linkedinUrl } = req.body;

    if (!resumeText && !githubUrl && !linkedinUrl) {
        // Just return empty if nothing provided
        return res.json({});
    }

    try {
        const prompt = `
          You are an expert resume parser and portfolio generator.
          Extract the following structured data from the provided resume text and profile links.
          Return ONLY valid JSON with no markdown formatting.
          
          Format:
          {
            "name": "Full Name",
            "tagline": "Short professional tagline (e.g. 'Senior Full Stack Engineer')",
            "bio": "A professional summary/bio (approx 50-100 words)",
            "email": "Email address",
            "skills": ["Skill 1", "Skill 2"],
            "experience": [
              { "company": "Company Name", "role": "Job Title", "description": "Brief summary of responsibilities", "years": "Date range" }
            ],
            "education": [
               { "school": "School Name", "degree": "Degree", "year": "Graduation Year" }
            ],
            "projects": [
               { "title": "Project Title", "description": "Brief description", "role": "My role", "technologies": ["Tech 1"] }
            ]
          }

          Resume Text:
          ${resumeText ? resumeText.substring(0, 10000) : "N/A"}

          GitHub: ${githubUrl || "N/A"}
          LinkedIn: ${linkedinUrl || "N/A"}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // fast and cheap
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        const parsed = JSON.parse(content || "{}");
        res.json(parsed);

    } catch (e) {
        console.error("AI Extraction error", e);
        res.status(500).json({ message: "Failed to extract data" });
    }
  });

  app.post(api.ai.generateDescription.path, async (req, res) => {
      const { projectTitle, roughNotes } = req.body;
      
      try {
          const response = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [{ 
                  role: "user", 
                  content: `Generate a professional, concise project description (max 100 words) for a portfolio project titled "${projectTitle}".
                  Base it on these rough notes: "${roughNotes}".
                  Focus on achievements and technologies used.` 
              }],
          });
          
          res.json({ description: response.choices[0].message.content || "" });
      } catch (e) {
          console.error("AI Generation error", e);
          res.status(500).json({ message: "Failed to generate description" });
      }
  });

  // --- Seed Data ---
  // Seed a default user and portfolio if empty
  const users = await db.select().from(schema.users).limit(1);
  if (users.length === 0) {
      // Create default user
      const user = await storage.createUser({ username: "student_demo" });
      
      // Create sample portfolio
      const portfolio = await storage.createPortfolio({
          userId: user.id,
          name: "Alex Dev",
          tagline: "Building the future with code",
          bio: "I am a passionate computer science student...",
          colorTheme: "blue",
          fontStyle: "sans"
      });

      // Create sample project
      await storage.createProject({
          portfolioId: portfolio.id,
          title: "Portfolio Builder",
          description: "An AI-powered app to help students build portfolios.",
          role: "Lead Developer",
          year: "2024",
          technologies: ["React", "Node.js", "AI"]
      });
  }

  return httpServer;
}
