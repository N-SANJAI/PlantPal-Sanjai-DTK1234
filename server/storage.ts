import { 
  users, type User, type InsertUser,
  plants, type Plant, type InsertPlant,
  tasks, type Task, type InsertTask,
  badges, type Badge, type InsertBadge,
  userBadges, type UserBadge, type InsertUserBadge,
  notifications, type Notification, type InsertNotification,
  plantAnalysis, type PlantAnalysis, type InsertPlantAnalysis
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  
  // Plants
  getPlants(userId: number): Promise<Plant[]>;
  getPlant(id: number): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
  updatePlant(id: number, updates: Partial<Plant>): Promise<Plant>;
  deletePlant(id: number): Promise<boolean>;
  
  // Tasks
  getTasks(userId: number): Promise<Task[]>;
  getTasksByPlant(plantId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<boolean>;
  
  // Badges
  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // User Badges
  getUserBadges(userId: number): Promise<(Badge & { earnedAt: Date })[]>;
  assignBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  
  // Plant Analysis
  getPlantAnalyses(plantId: number): Promise<PlantAnalysis[]>;
  getLatestPlantAnalysis(plantId: number): Promise<PlantAnalysis | undefined>;
  createPlantAnalysis(analysis: InsertPlantAnalysis): Promise<PlantAnalysis>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plants: Map<number, Plant>;
  private tasks: Map<number, Task>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private notifications: Map<number, Notification>;
  private plantAnalyses: Map<number, PlantAnalysis>;
  
  private currentUserId: number;
  private currentPlantId: number;
  private currentTaskId: number;
  private currentBadgeId: number;
  private currentUserBadgeId: number;
  private currentNotificationId: number;
  private currentPlantAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.plants = new Map();
    this.tasks = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.notifications = new Map();
    this.plantAnalyses = new Map();
    
    this.currentUserId = 1;
    this.currentPlantId = 1;
    this.currentTaskId = 1;
    this.currentBadgeId = 1;
    this.currentUserBadgeId = 1;
    this.currentNotificationId = 1;
    this.currentPlantAnalysisId = 1;
    
    // Initialize with default badges
    this.initializeDefaultBadges();
    // Create a default user - we'll do this asynchronously to avoid issues
    this.initializeDefaultData();
  }
  
  // Asynchronous initialization method
  private async initializeDefaultData() {
    try {
      await this.createDefaultUser();
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }

  private initializeDefaultBadges() {
    const defaultBadges: InsertBadge[] = [
      {
        name: "First Plant",
        description: "Added your first plant",
        icon: "eco",
        requirements: { plantsAdded: 1 }
      },
      {
        name: "Hydration Pro",
        description: "Watered on time 5 times",
        icon: "water_drop",
        requirements: { wateringCompleted: 5 }
      },
      {
        name: "Plant Reviver",
        description: "Nurse a sick plant back to health",
        icon: "healing",
        requirements: { plantsRevived: 1 }
      },
      {
        name: "Plant Expert",
        description: "Own 10 thriving plants",
        icon: "auto_awesome",
        requirements: { healthyPlants: 10 }
      },
      {
        name: "Plant Parent",
        description: "Care for plants for 30 days",
        icon: "volunteer_activism",
        requirements: { daysCaring: 30 }
      },
      {
        name: "Diagnostician",
        description: "Identify 5 plant issues",
        icon: "query_stats",
        requirements: { issuesIdentified: 5 }
      }
    ];
    
    for (const badge of defaultBadges) {
      this.createBadge(badge);
    }
  }
  
  private async createDefaultUser() {
    const defaultUser: InsertUser = {
      username: "plantlover",
      password: "password"
    };
    
    // We need to await this Promise to get the actual user object
    const user = await this.createUser(defaultUser);
    
    // Add some example plants for the default user
    const plants: InsertPlant[] = [
      {
        userId: user.id,
        name: "Monstera",
        species: "Monstera Deliciosa",
        imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&h=300"
      },
      {
        userId: user.id,
        name: "Snake Plant",
        species: "Sansevieria",
        imageUrl: "https://images.unsplash.com/photo-1620127252536-03bdfcf6d5c3?auto=format&fit=crop&w=400&h=300"
      },
      {
        userId: user.id,
        name: "Pothos",
        species: "Epipremnum aureum",
        imageUrl: "https://images.unsplash.com/photo-1616690248596-58b8f857e7f9?auto=format&fit=crop&w=400&h=300"
      },
      {
        userId: user.id,
        name: "Fiddle Leaf Fig",
        species: "Ficus lyrata",
        imageUrl: "https://images.unsplash.com/photo-1611048267451-e6ed903d689f?auto=format&fit=crop&w=400&h=300"
      }
    ];
    
    // We need to await these Promises too
    const monstera = await this.createPlant({...plants[0], userId: user.id});
    const snakePlant = await this.createPlant({...plants[1], userId: user.id});
    
    // Update plant health metrics
    await this.updatePlant(monstera.id, {
      waterLevel: 25,
      healthScore: 60
    });
    
    await this.updatePlant(snakePlant.id, {
      lightLevel: 50, 
      healthScore: 75
    });
    
    // Create some tasks
    const tasks: InsertTask[] = [
      {
        userId: user.id,
        plantId: monstera.id,
        title: "Water Monstera",
        description: "Last watered 9 days ago",
        type: "water",
        priority: "urgent",
        dueDate: new Date()
      },
      {
        userId: user.id,
        plantId: snakePlant.id,
        title: "Move Snake Plant",
        description: "Direct sunlight is too intense",
        type: "move",
        priority: "high",
        dueDate: new Date()
      }
    ];
    
    for (const task of tasks) {
      await this.createTask(task);
    }
    
    // Assign some badges to the user
    await this.assignBadge({
      userId: user.id,
      badgeId: 1 // First Plant badge
    });
    
    await this.assignBadge({
      userId: user.id,
      badgeId: 2 // Hydration Pro badge
    });
    
    // Create some notifications
    const notifications: InsertNotification[] = [
      {
        userId: user.id,
        title: "Water Monstera Now",
        message: "Your Monstera is very thirsty. Water it as soon as possible.",
        type: "task",
        relatedId: 1
      },
      {
        userId: user.id,
        title: "Move Snake Plant",
        message: "Current spot is too sunny. Move to a place with indirect light.",
        type: "task",
        relatedId: 2
      },
      {
        userId: user.id,
        title: "New Badge Earned!",
        message: "Congratulations! You've earned the \"Hydration Pro\" badge.",
        type: "badge",
        relatedId: 2
      },
      {
        userId: user.id,
        title: "Tip of the Day",
        message: "Mist your tropical plants regularly to increase humidity.",
        type: "tip"
      }
    ];
    
    for (const notification of notifications) {
      await this.createNotification(notification);
    }
    
    // Create plant analysis for Monstera
    await this.createPlantAnalysis({
      plantId: monstera.id,
      userId: user.id,
      healthScore: 60,
      waterLevel: 20,
      lightLevel: 80,
      nutrientLevel: 40,
      pestRisk: 20,
      issues: [
        { name: "Dehydration", description: "Your plant needs water urgently. The soil is very dry.", icon: "water_drop" },
        { name: "Nutrient Deficiency", description: "Yellowing leaves indicate a lack of nutrients.", icon: "grass" }
      ],
      recommendations: [
        { 
          title: "Water Thoroughly", 
          description: "Your plant is severely dehydrated. Water until you see it drain from the bottom.",
          priority: "urgent",
          type: "water",
          icon: "water_drop",
          tip: "For Monsteras, wait until the top 2 inches of soil is dry before watering again."
        },
        { 
          title: "Apply Fertilizer", 
          description: "Yellowing leaves indicate your plant needs nutrients. Apply a balanced fertilizer within 3 days.",
          priority: "recommended",
          type: "fertilize",
          icon: "grass"
        },
        { 
          title: "Clean Leaves", 
          description: "Wipe dust from leaves every 2 weeks to help your plant breathe better.",
          priority: "maintenance",
          type: "clean",
          icon: "cleaning_services"
        },
        { 
          title: "Consider Repotting", 
          description: "Your plant might need a larger pot in the next 3-4 months.",
          priority: "maintenance",
          type: "repot",
          icon: "format_color_fill"
        }
      ],
      imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&h=300"
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, level: 1, points: 0 };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    user.points += points;
    
    // Level up logic (simple implementation)
    const pointsPerLevel = 100;
    const newLevel = Math.floor(user.points / pointsPerLevel) + 1;
    
    if (newLevel > user.level) {
      user.level = newLevel;
      // Could create a notification for level up here
    }
    
    this.users.set(userId, user);
    return user;
  }

  // Plants
  async getPlants(userId: number): Promise<Plant[]> {
    return Array.from(this.plants.values()).filter(
      (plant) => plant.userId === userId
    );
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const id = this.currentPlantId++;
    const now = new Date();
    const plant: Plant = {
      ...insertPlant,
      id,
      healthScore: 100,
      waterLevel: 100,
      lightLevel: 100,
      nutrientLevel: 100,
      pestRisk: 0,
      lastWatered: now,
      lastFertilized: now,
      createdAt: now
    };
    this.plants.set(id, plant);
    
    // Check if this is the user's first plant for badge
    const userPlants = await this.getPlants(insertPlant.userId);
    if (userPlants.length === 1) {
      // Get the First Plant badge
      const firstPlantBadge = Array.from(this.badges.values()).find(
        badge => badge.name === "First Plant"
      );
      
      if (firstPlantBadge) {
        // Check if user already has this badge
        const userBadges = await this.getUserBadges(insertPlant.userId);
        const hasBadge = userBadges.some(badge => badge.id === firstPlantBadge.id);
        
        if (!hasBadge) {
          // Award the badge
          await this.assignBadge({
            userId: insertPlant.userId,
            badgeId: firstPlantBadge.id
          });
          
          // Create notification for badge
          await this.createNotification({
            userId: insertPlant.userId,
            title: "New Badge Earned!",
            message: `Congratulations! You've earned the "${firstPlantBadge.name}" badge.`,
            type: "badge",
            relatedId: firstPlantBadge.id
          });
          
          // Add points
          await this.updateUserPoints(insertPlant.userId, 25);
        }
      }
    }
    
    return plant;
  }

  async updatePlant(id: number, updates: Partial<Plant>): Promise<Plant> {
    const plant = await this.getPlant(id);
    if (!plant) {
      throw new Error(`Plant with id ${id} not found`);
    }
    
    const updatedPlant = { ...plant, ...updates };
    this.plants.set(id, updatedPlant);
    return updatedPlant;
  }

  async deletePlant(id: number): Promise<boolean> {
    const exists = this.plants.has(id);
    if (exists) {
      this.plants.delete(id);
      // Delete related tasks
      const tasks = await this.getTasksByPlant(id);
      for (const task of tasks) {
        await this.deleteTask(task.id);
      }
      return true;
    }
    return false;
  }

  // Tasks
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId
    );
  }

  async getTasksByPlant(plantId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.plantId === plantId
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = {
      ...insertTask,
      id,
      completed: false,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    
    // If task is marked as completed, check for badges
    if (updates.completed && !task.completed) {
      if (task.type === "water") {
        // Check for Hydration Pro badge
        const allTasks = await this.getTasks(task.userId);
        const completedWateringTasks = allTasks.filter(
          t => t.type === "water" && t.completed
        );
        
        if (completedWateringTasks.length >= 5) {
          // Get the Hydration Pro badge
          const hydrationBadge = Array.from(this.badges.values()).find(
            badge => badge.name === "Hydration Pro"
          );
          
          if (hydrationBadge) {
            // Check if user already has this badge
            const userBadges = await this.getUserBadges(task.userId);
            const hasBadge = userBadges.some(badge => badge.id === hydrationBadge.id);
            
            if (!hasBadge) {
              // Award the badge
              await this.assignBadge({
                userId: task.userId,
                badgeId: hydrationBadge.id
              });
              
              // Create notification for badge
              await this.createNotification({
                userId: task.userId,
                title: "New Badge Earned!",
                message: `Congratulations! You've earned the "${hydrationBadge.name}" badge.`,
                type: "badge",
                relatedId: hydrationBadge.id
              });
              
              // Add points
              await this.updateUserPoints(task.userId, 50);
            }
          }
        }
      }
      
      // Add points for completing a task
      await this.updateUserPoints(task.userId, 10);
    }
    
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const exists = this.tasks.has(id);
    if (exists) {
      this.tasks.delete(id);
      return true;
    }
    return false;
  }

  // Badges
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.currentBadgeId++;
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }

  // User Badges
  async getUserBadges(userId: number): Promise<(Badge & { earnedAt: Date })[]> {
    const userBadgeEntries = Array.from(this.userBadges.values()).filter(
      (userBadge) => userBadge.userId === userId
    );
    
    const userBadgesWithDetails = await Promise.all(
      userBadgeEntries.map(async (userBadge) => {
        const badge = await this.getBadge(userBadge.badgeId);
        if (!badge) {
          throw new Error(`Badge with id ${userBadge.badgeId} not found`);
        }
        return {
          ...badge,
          earnedAt: userBadge.earnedAt
        };
      })
    );
    
    return userBadgesWithDetails;
  }

  async assignBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const id = this.currentUserBadgeId++;
    const userBadge: UserBadge = {
      ...insertUserBadge,
      id,
      earnedAt: new Date()
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }

  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      read: false,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = await this.getNotification(id);
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    
    notification.read = true;
    this.notifications.set(id, notification);
    return notification;
  }

  // Plant Analysis
  async getPlantAnalyses(plantId: number): Promise<PlantAnalysis[]> {
    return Array.from(this.plantAnalyses.values())
      .filter((analysis) => analysis.plantId === plantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
  }

  async getLatestPlantAnalysis(plantId: number): Promise<PlantAnalysis | undefined> {
    const analyses = await this.getPlantAnalyses(plantId);
    return analyses.length > 0 ? analyses[0] : undefined;
  }

  async createPlantAnalysis(insertAnalysis: InsertPlantAnalysis): Promise<PlantAnalysis> {
    const id = this.currentPlantAnalysisId++;
    const analysis: PlantAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date()
    };
    this.plantAnalyses.set(id, analysis);
    
    // Update the plant with the analysis results
    await this.updatePlant(insertAnalysis.plantId, {
      healthScore: insertAnalysis.healthScore,
      waterLevel: insertAnalysis.waterLevel,
      lightLevel: insertAnalysis.lightLevel,
      nutrientLevel: insertAnalysis.nutrientLevel,
      pestRisk: insertAnalysis.pestRisk
    });
    
    // Create tasks from recommendations
    if (insertAnalysis.recommendations) {
      const recommendations = insertAnalysis.recommendations as any[];
      for (const rec of recommendations) {
        if (rec.priority === "urgent" || rec.priority === "recommended") {
          await this.createTask({
            plantId: insertAnalysis.plantId,
            userId: insertAnalysis.userId,
            title: rec.title,
            description: rec.description,
            type: rec.type,
            priority: rec.priority === "urgent" ? "urgent" : "high",
            dueDate: new Date(Date.now() + (rec.priority === "urgent" ? 24 : 72) * 60 * 60 * 1000) // 1 or 3 days
          });
        }
      }
    }
    
    // Create notifications for issues
    if (insertAnalysis.issues) {
      const issues = insertAnalysis.issues as any[];
      for (const issue of issues) {
        const plant = await this.getPlant(insertAnalysis.plantId);
        if (plant) {
          await this.createNotification({
            userId: insertAnalysis.userId,
            title: `${issue.name} detected in ${plant.name}`,
            message: issue.description,
            type: "issue",
            relatedId: insertAnalysis.plantId
          });
        }
      }
    }
    
    // Add points for performing an analysis
    await this.updateUserPoints(insertAnalysis.userId, 15);
    
    return analysis;
  }
}

export const storage = new MemStorage();
