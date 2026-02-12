import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Disable fetch for Vercel compatibility
const client = postgres(process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/hexagon_game');
export const db = drizzle(client, { schema });

export const createDbConnection = async () => {
  try {
    // Test the connection
    await db.execute('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};