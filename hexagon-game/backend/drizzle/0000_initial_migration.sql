-- Migration: Create initial database schema for Hexagon City Builder Game

-- Create users table
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255),
    "avatar" VARCHAR(255),
    "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
    "last_login_at" TIMESTAMP,
    "is_online" BOOLEAN DEFAULT FALSE,
    "oauth_provider" VARCHAR(20), -- google, discord, twitter
    "oauth_id" VARCHAR(100)
);

-- Create cities table
CREATE TABLE "cities" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "population" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
    "center_x" INTEGER DEFAULT 0,
    "center_y" INTEGER DEFAULT 0,
    "map_size" INTEGER DEFAULT 20 -- Radius of the hexagonal map
);

-- Create buildings table
CREATE TABLE "buildings" (
    "id" SERIAL PRIMARY KEY,
    "city_id" INTEGER NOT NULL REFERENCES "cities"("id") ON DELETE CASCADE,
    "type" VARCHAR(50) NOT NULL, -- residential, commercial, industrial, etc.
    "position_x" INTEGER NOT NULL,
    "position_y" INTEGER NOT NULL,
    "level" INTEGER DEFAULT 1,
    "health" INTEGER DEFAULT 100,
    "build_progress" INTEGER DEFAULT 0, -- 0-100 for construction progress
    "last_interaction" TIMESTAMP DEFAULT NOW(),
    "metadata" JSONB, -- Additional building-specific data
    "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create resources table
CREATE TABLE "resources" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "resource_id" VARCHAR(50) NOT NULL, -- wood, stone, gold, food, etc.
    "amount" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create game_sessions table
CREATE TABLE "game_sessions" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "city_id" INTEGER REFERENCES "cities"("id") ON DELETE SET NULL, -- Current city the player is viewing/editing
    "last_activity" TIMESTAMP DEFAULT NOW() NOT NULL,
    "is_active" BOOLEAN DEFAULT TRUE
);

-- Create chat_messages table
CREATE TABLE "chat_messages" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "channel_id" VARCHAR(50) NOT NULL, -- global, city-specific, private
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON "users"("email");
CREATE INDEX idx_cities_user_id ON "cities"("user_id");
CREATE INDEX idx_buildings_city_id ON "buildings"("city_id");
CREATE INDEX idx_resources_user_id ON "resources"("user_id");
CREATE INDEX idx_chat_messages_channel_id ON "chat_messages"("channel_id");
CREATE INDEX idx_chat_messages_created_at ON "chat_messages"("created_at");