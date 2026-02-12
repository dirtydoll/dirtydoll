# Hexagon City Builder Game - Local Development Setup Guide

This document provides a step-by-step guide to set up and run the hexagonal city builder game locally.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v16 or higher) - [Download here](https://nodejs.org/)
- npm or yarn package manager (usually comes with Node.js)
- Docker Desktop with Docker Compose

**Note:** If Node.js is not installed on your system, please download and install it from the official website before proceeding with the setup.

## Quick Start with Batch Scripts (Windows)

The easiest way to run the project locally is using the provided batch scripts:

1. **Start the development environment:**
   ```
   start-dev.bat
   ```
   
   This script will:
   - Start the PostgreSQL database container
   - Install backend dependencies
   - Apply database migrations using Drizzle Kit
   - Start the backend server on port 5000
   - Install frontend dependencies
   - Start the frontend server on port 3000

2. **Stop the development environment:**
   ```
   stop-dev.bat
   ```
   
   This script will:
   - Stop the PostgreSQL database container
   - Terminate all Node.js processes

3. Once started, open your browser and navigate to `http://localhost:3000`

## Manual Setup (Alternative Method)

If you prefer to set up the project manually:

### 1. Database Setup with Docker

1. Navigate to the project root directory
2. Start the PostgreSQL database container:
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file to add your database credentials and other configuration.

4. Apply database migrations:
   ```bash
   npx drizzle-kit push
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 4. Running the Application

1. Make sure both the backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:3000`
3. You should now be able to register an account and start playing the game

## Database Access

If you need to access the database directly (e.g., for debugging):

- Host: localhost
- Port: 5432
- Database: hexagon_game
- Username: hexagon_user
- Password: hexagon_password

You can connect using any PostgreSQL client like DBeaver, pgAdmin, or psql.

## Key Features Implemented

- User registration and authentication (email/password and OAuth)
- City creation and management
- Hexagonal grid-based building placement
- Resource management system
- Real-time chat functionality
- Building interaction interfaces
- Multiplayer support via WebSocket connections

## Development Commands

### Backend Commands
- `npm run dev` - Start the development server
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run db:push` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio

### Frontend Commands
- `npm run dev` - Start the development server
- `npm run build` - Build for production

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are properly set
2. Verify that Docker is running and the database container is active
3. Check that both frontend and backend servers are running on their respective ports
4. Review the console logs for error messages
5. If using the batch scripts, ensure you're running them from the project root directory

For additional help, refer to the README.md file in the project root directory.