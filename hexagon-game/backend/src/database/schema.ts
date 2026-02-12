import { pgTable, serial, text, varchar, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  avatar: varchar('avatar', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
  isOnline: boolean('is_online').default(false),
  oauthProvider: varchar('oauth_provider', { length: 20 }), // google, discord, twitter
  oauthId: varchar('oauth_id', { length: 100 }),
});

// Cities table
export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  population: integer('population').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  centerX: integer('center_x').default(0),
  centerY: integer('center_y').default(0),
  mapSize: integer('map_size').default(20), // Radius of the hexagonal map
});

// Buildings table
export const buildings = pgTable('buildings', {
  id: serial('id').primaryKey(),
  cityId: integer('city_id').notNull().references(() => cities.id),
  type: varchar('type', { length: 50 }).notNull(), // residential, commercial, industrial, etc.
  positionX: integer('position_x').notNull(),
  positionY: integer('position_y').notNull(),
  level: integer('level').default(1),
  health: integer('health').default(100),
  buildProgress: integer('build_progress').default(0), // 0-100 for construction progress
  lastInteraction: timestamp('last_interaction').defaultNow(),
  metadata: jsonb('metadata'), // Additional building-specific data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Resources table
export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  resourceId: varchar('resource_id', { length: 50 }).notNull(), // wood, stone, gold, food, etc.
  amount: integer('amount').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Game sessions table
export const gameSessions = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  cityId: integer('city_id').references(() => cities.id), // Current city the player is viewing/editing
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
  isActive: boolean('is_active').default(true),
});

// Chat messages table
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  channelId: varchar('channel_id', { length: 50 }).notNull(), // global, city-specific, private
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});