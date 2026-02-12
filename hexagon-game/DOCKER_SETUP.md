# Docker Setup for Hexagon City Builder

This document describes how to set up and run the Hexagon City Builder game using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed

## Database Setup with Docker

The project uses PostgreSQL as the database, which runs in a Docker container. The database is configured in `docker/docker-compose.yml`.

### Manual Database Setup (Alternative Method)

If you prefer to set up the database manually without Docker:

1. Install PostgreSQL locally
2. Create a database named `hexagon_game`
3. Create a user with appropriate permissions
4. Update the `DATABASE_URL` in your backend `.env` file

## Running the Development Environment

### Using Batch Scripts (Windows)

1. **Start the development environment:**
   ```bash
   start-dev.bat
   ```

   This script will:
   - Start the PostgreSQL database container
   - Install backend dependencies
   - Run database migrations
   - Start the backend server on port 5000
   - Install frontend dependencies
   - Start the frontend server on port 3000

2. **Stop the development environment:**
   ```bash
   stop-dev.bat
   ```

   This script will:
   - Stop the PostgreSQL database container
   - Terminate all Node.js processes

### Using Docker Compose (Alternative Method)

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **View logs:**
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Database Migrations

The first migration (`0000_initial_migration.sql`) creates all the necessary tables for the game:

- `users` - Stores user accounts and authentication data
- `cities` - Tracks user cities
- `buildings` - Records placed buildings in cities
- `resources` - Manages user resources
- `game_sessions` - Tracks active game sessions
- `chat_messages` - Stores chat history

These tables support the core game mechanics:
- User registration and authentication
- City creation and management
- Building placement on hexagonal grids
- Resource management
- Real-time chat functionality

## Environment Variables

Make sure your `.env` files contain the correct database connection string:

**Backend (.env):**
```
DATABASE_URL="postgresql://hexagon_user:hexagon_password@localhost:5432/hexagon_game"
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Make sure no other PostgreSQL instances are running on port 5432
   - Check that no other applications are using ports 3000 or 5000

2. **Database connection errors:**
   - Verify that the database container is running: `docker ps`
   - Check that the environment variables match between the container and application

3. **Migration failures:**
   - Ensure the database is fully started before running migrations
   - The init.sql file is executed when the container starts to prepare the database

4. **Docker permission errors:**
   - Run Docker Desktop as administrator
   - Make sure your user account has Docker permissions

### Useful Commands

- Check running containers: `docker ps`
- View container logs: `docker logs <container_name>`
- Execute commands in a container: `docker exec -it <container_name> /bin/sh`
- Check Docker Compose services: `docker-compose -f docker/docker-compose.yml ps`

## Development Notes

- The database data persists in a Docker volume (`postgres_data`)
- Changes to the database schema require new migration files
- The `init.sql` file runs once during the initial container setup
- Both frontend and backend volumes allow live reloading during development