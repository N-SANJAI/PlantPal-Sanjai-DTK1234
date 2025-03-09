import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertPlantSchema, insertTaskSchema, insertPlantAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // User routes
  app.get("/api/user", async (req, res) => {
    // For demo purposes, we'll use the default user
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password to client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Plants routes
  app.get("/api/plants", async (req, res) => {
    // For demo purposes, we'll use the default user
    const userId = 1;
    const plants = await storage.getPlants(userId);
    res.json(plants);
  });
  
  app.get("/api/plants/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }
    
    const plant = await storage.getPlant(id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    
    res.json(plant);
  });
  
  app.post("/api/plants", async (req, res) => {
    try {
      // For demo purposes, we'll use the default user
      const userId = 1;
      const plantData = { ...req.body, userId };
      
      const validatedData = insertPlantSchema.parse(plantData);
      const plant = await storage.createPlant(validatedData);
      
      res.status(201).json(plant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create plant" });
    }
  });
  
  app.patch("/api/plants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const plant = await storage.getPlant(id);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      const updatedPlant = await storage.updatePlant(id, req.body);
      res.json(updatedPlant);
    } catch (error) {
      res.status(500).json({ message: "Failed to update plant" });
    }
  });
  
  app.delete("/api/plants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const success = await storage.deletePlant(id);
      if (!success) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete plant" });
    }
  });
  
  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    // For demo purposes, we'll use the default user
    const userId = 1;
    const tasks = await storage.getTasks(userId);
    res.json(tasks);
  });
  
  app.get("/api/plants/:plantId/tasks", async (req, res) => {
    const plantId = parseInt(req.params.plantId);
    if (isNaN(plantId)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }
    
    const tasks = await storage.getTasksByPlant(plantId);
    res.json(tasks);
  });
  
  app.post("/api/tasks", async (req, res) => {
    try {
      // For demo purposes, we'll use the default user
      const userId = 1;
      const taskData = { ...req.body, userId };
      
      const validatedData = insertTaskSchema.parse(taskData);
      const task = await storage.createTask(validatedData);
      
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const updatedTask = await storage.updateTask(id, req.body);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  
  // Badges routes
  app.get("/api/badges", async (req, res) => {
    const badges = await storage.getBadges();
    res.json(badges);
  });
  
  app.get("/api/user/badges", async (req, res) => {
    // For demo purposes, we'll use the default user
    const userId = 1;
    const badges = await storage.getUserBadges(userId);
    res.json(badges);
  });
  
  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    // For demo purposes, we'll use the default user
    const userId = 1;
    const notifications = await storage.getNotifications(userId);
    res.json(notifications);
  });
  
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      
      const notification = await storage.getNotification(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      const updatedNotification = await storage.markNotificationAsRead(id);
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  
  // Plant Analysis routes
  app.get("/api/plants/:plantId/analysis", async (req, res) => {
    const plantId = parseInt(req.params.plantId);
    if (isNaN(plantId)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }
    
    const analyses = await storage.getPlantAnalyses(plantId);
    res.json(analyses);
  });
  
  app.get("/api/plants/:plantId/analysis/latest", async (req, res) => {
    const plantId = parseInt(req.params.plantId);
    if (isNaN(plantId)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }
    
    const analysis = await storage.getLatestPlantAnalysis(plantId);
    if (!analysis) {
      return res.status(404).json({ message: "No analysis found for this plant" });
    }
    
    res.json(analysis);
  });
  
  app.post("/api/plants/:plantId/analysis", async (req, res) => {
    try {
      const plantId = parseInt(req.params.plantId);
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      // For demo purposes, we'll use the default user
      const userId = 1;
      const analysisData = { ...req.body, plantId, userId };
      
      const validatedData = insertPlantAnalysisSchema.parse(analysisData);
      const analysis = await storage.createPlantAnalysis(validatedData);
      
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create plant analysis" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
