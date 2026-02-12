import express from 'express';
import { Request, Response } from 'express';
import { db } from '../database';
import { users, cities, buildings, resources } from '../database/schema';
import { eq, and, sql } from 'drizzle-orm';

const router = express.Router();

// Get user's cities
router.get('/cities', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming this is set by authentication middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userCities = await db.select().from(cities).where(eq(cities.userId, userId));

    res.status(200).json({ cities: userCities });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new city
router.post('/cities', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming this is set by authentication middleware
    const { name, description } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: 'User ID and city name are required' });
    }

    // Check if user already has max number of cities (let's say 3 for now)
    const userCityCount = await db.select({ count: sql<number>`count(*)` })
      .from(cities)
      .where(eq(cities.userId, userId));

    if (userCityCount[0].count >= 3) {
      return res.status(400).json({ message: 'Maximum number of cities reached' });
    }

    const [newCity] = await db.insert(cities).values({
      userId,
      name,
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Initialize default resources for the new city
    const defaultResources = [
      { resourceId: 'wood', amount: 100 },
      { resourceId: 'stone', amount: 100 },
      { resourceId: 'gold', amount: 50 },
      { resourceId: 'food', amount: 50 },
    ];

    for (const resource of defaultResources) {
      await db.insert(resources).values({
        userId,
        resourceId: resource.resourceId,
        amount: resource.amount,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.status(201).json({ city: newCity });
  } catch (error) {
    console.error('Create city error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get city details with buildings
router.get('/cities/:cityId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming this is set by authentication middleware
    const { cityId } = req.params;

    if (!userId || !cityId) {
      return res.status(400).json({ message: 'User ID and city ID are required' });
    }

    // Verify that the city belongs to the user
    const [city] = await db.select().from(cities).where(
      and(eq(cities.id, Number(cityId)), eq(cities.userId, userId))
    ).limit(1);

    if (!city) {
      return res.status(404).json({ message: 'City not found or does not belong to user' });
    }

    // Get all buildings in the city
    const cityBuildings = await db.select().from(buildings).where(eq(buildings.cityId, Number(cityId)));

    // Get user's resources
    const userResources = await db.select().from(resources).where(eq(resources.userId, userId));

    res.status(200).json({
      city,
      buildings: cityBuildings,
      resources: userResources,
    });
  } catch (error) {
    console.error('Get city details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Place a building on the map
router.post('/cities/:cityId/buildings', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming this is set by authentication middleware
    const { cityId } = req.params;
    const { type, positionX, positionY } = req.body;

    if (!userId || !cityId || !type || positionX === undefined || positionY === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify that the city belongs to the user
    const [city] = await db.select().from(cities).where(
      and(eq(cities.id, Number(cityId)), eq(cities.userId, userId))
    ).limit(1);

    if (!city) {
      return res.status(404).json({ message: 'City not found or does not belong to user' });
    }

    // Check if there's already a building at this position
    const existingBuilding = await db.select().from(buildings).where(
      and(
        eq(buildings.cityId, Number(cityId)),
        eq(buildings.positionX, positionX),
        eq(buildings.positionY, positionY)
      )
    ).limit(1);

    if (existingBuilding.length > 0) {
      return res.status(409).json({ message: 'There is already a building at this position' });
    }

    // Deduct resources needed for construction (simplified for now)
    // In a real game, we'd check costs and deduct accordingly
    
    // Create the new building
    const [newBuilding] = await db.insert(buildings).values({
      cityId: Number(cityId),
      type,
      positionX,
      positionY,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json({ building: newBuilding });
  } catch (error) {
    console.error('Place building error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's resources
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming this is set by authentication middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userResources = await db.select().from(resources).where(eq(resources.userId, userId));

    res.status(200).json({ resources: userResources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update resource amounts (for game mechanics)
router.put('/resources', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming this is set by authentication middleware
    const { updates } = req.body; // Array of { resourceId, amount } objects

    if (!userId || !updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // Process each resource update
    for (const update of updates) {
      const { resourceId, amount } = update;
      
      if (!resourceId || amount === undefined) {
        continue; // Skip invalid updates
      }

      // Check if resource exists for user
      const [existingResource] = await db.select().from(resources)
        .where(and(eq(resources.userId, userId), eq(resources.resourceId, resourceId)))
        .limit(1);

      if (existingResource) {
        // Update existing resource
        await db.update(resources)
          .set({ amount: existingResource.amount + amount, updatedAt: new Date() })
          .where(and(eq(resources.userId, userId), eq(resources.resourceId, resourceId)));
      } else {
        // Create new resource entry
        await db.insert(resources).values({
          userId,
          resourceId,
          amount: Math.max(0, amount), // Ensure non-negative amount
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Return updated resources
    const userResources = await db.select().from(resources).where(eq(resources.userId, userId));

    res.status(200).json({ resources: userResources });
  } catch (error) {
    console.error('Update resources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;