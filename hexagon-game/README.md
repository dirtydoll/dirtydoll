# Hexagon City Builder Game by Marat

A multiplayer hexagonal grid-based city building game built with modern web technologies.

## Technologies Used

### Backend
- **Node.js** with **Express** framework
- **TypeScript** for type safety
- **PostgreSQL** database with **Drizzle ORM** for database operations
- **JWT** (JSON Web Tokens) for authentication and session management
- **Socket.IO** for real-time communication
- **Passport.js** for OAuth authentication (Google, Discord, Twitter)
- Various utilities including **Winston** for logging, **Helmet** for security

### Frontend
- **React** (version 19.x) with TypeScript
- **Tailwind CSS** for styling
- **wouter** for routing
- **TanStack Query** (formerly React Query) for data fetching and state management
- **i18next** with react-i18next for internationalization (supports English and Russian)
- **Radix UI** components with shadcn/ui-style implementations
- **Socket.IO client** for real-time features
- **Lucide React** for icons
- **React Hook Form** with Zod for form validation

## Features

### Core Gameplay
- Hexagonal grid-based city building
- Real-time multiplayer interactions
- Resource management system
- Building placement and management
- Chat functionality

### Authentication
- Registration and login with email/password
- OAuth integration (Google, Discord, Twitter)
- JWT-based session management

### Game Elements
- Multiple building types (residential, commercial, industrial, roads, etc.)
- Resource tracking (wood, stone, gold, food)
- Population management
- City creation and management
- Building upgrades and repairs

## Project Structure

```
hexagon-game/
├── backend/
│   ├── src/
│   │   ├── database/       # Database schemas and connections
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication and other middleware
│   │   ├── sockets/        # Socket.IO handlers
│   │   ├── config/         # Configuration files
│   │   └── index.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── contexts/       # React context providers
    │   ├── pages/          # Page components
    │   ├── i18n/           # Internationalization config
    │   ├── main.tsx        # Entry point
    │   └── App.tsx         # Main App component
    ├── public/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── tailwind.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/hexagon_game"
   JWT_SECRET="your_jwt_secret"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   DISCORD_CLIENT_ID="your_discord_client_id"
   DISCORD_CLIENT_SECRET="your_discord_client_secret"
   CLIENT_URL="http://localhost:3001"
   ```
4. Run database migrations: `npx drizzle-kit push`
5. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

The game will be accessible at `http://localhost:3001`.

## Game Mechanics

### City Building
- Players can create multiple cities
- Each city has a hexagonal grid where buildings can be placed
- Different building types serve different purposes
- Buildings require resources to construct and maintain

### Resources
- Wood: Used for construction of residential and commercial buildings
- Stone: Used for infrastructure and industrial buildings
- Gold: Currency for transactions and upgrades
- Food: Supports population growth

### Multiplayer Features
- Real-time chat with other players
- Shared cities for collaborative building
- Competitive elements (leaderboards, achievements)

## Development

The project is structured to allow easy expansion of features. New building types, resources, and gameplay mechanics can be added by extending the existing systems.

### Adding New Building Types
1. Add the building type to the database schema
2. Create a new building interface component
3. Update the building placement logic
4. Add balancing parameters (costs, effects)

### Extending Game Mechanics
- Use the existing context systems for state management
- Leverage Socket.IO for real-time interactions
- Follow the existing patterns for API endpoints and database operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.