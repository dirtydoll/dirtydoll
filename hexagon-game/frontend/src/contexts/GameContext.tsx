import React, { createContext, useContext, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface Building {
  id: number;
  type: string;
  positionX: number;
  positionY: number;
  level: number;
  health: number;
}

interface City {
  id: number;
  name: string;
  description: string;
  population: number;
}

interface Resource {
  resourceId: string;
  amount: number;
}

interface GameState {
  currentCity: City | null;
  buildings: Building[];
  resources: Resource[];
  selectedBuilding: Building | null;
  isPlacingBuilding: boolean;
  placementType: string;
}

interface GameContextType {
  gameState: GameState;
  socket: Socket | null;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
  placeBuilding: (type: string, x: number, y: number) => void;
  selectBuilding: (building: Building) => void;
  deselectBuilding: () => void;
  startPlacementMode: (type: string) => void;
  endPlacementMode: () => void;
  updateResources: (updates: { resourceId: string; amount: number }[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentCity: null,
    buildings: [],
    resources: [],
    selectedBuilding: null,
    isPlacingBuilding: false,
    placementType: '',
  });
  
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = (token: string) => {
    const newSocket = io('http://localhost:5000', {
      auth: {
        token
      }
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to game server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    // Listen for game state updates
    newSocket.on('game-state-updated', (data) => {
      setGameState(prev => ({
        ...prev,
        ...data
      }));
    });

    // Listen for building placements
    newSocket.on('building-placed', (data) => {
      setGameState(prev => ({
        ...prev,
        buildings: [...prev.buildings, data.buildingData]
      }));
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const placeBuilding = (type: string, x: number, y: number) => {
    if (socket) {
      socket.emit('place-building', {
        userId: gameState.currentCity?.id, // This would be the actual user ID
        cityId: gameState.currentCity?.id,
        buildingData: { type, positionX: x, positionY: y }
      });
    }
  };

  const selectBuilding = (building: Building) => {
    setGameState(prev => ({
      ...prev,
      selectedBuilding: building
    }));
  };

  const deselectBuilding = () => {
    setGameState(prev => ({
      ...prev,
      selectedBuilding: null
    }));
  };

  const startPlacementMode = (type: string) => {
    setGameState(prev => ({
      ...prev,
      isPlacingBuilding: true,
      placementType: type
    }));
  };

  const endPlacementMode = () => {
    setGameState(prev => ({
      ...prev,
      isPlacingBuilding: false,
      placementType: ''
    }));
  };

  const updateResources = (updates: { resourceId: string; amount: number }[]) => {
    setGameState(prev => {
      const newResources = [...prev.resources];
      
      for (const update of updates) {
        const index = newResources.findIndex(r => r.resourceId === update.resourceId);
        if (index !== -1) {
          newResources[index] = {
            ...newResources[index],
            amount: newResources[index].amount + update.amount
          };
        } else {
          newResources.push({
            resourceId: update.resourceId,
            amount: Math.max(0, update.amount)
          });
        }
      }
      
      return {
        ...prev,
        resources: newResources
      };
    });
  };

  const value = {
    gameState,
    socket,
    connectSocket,
    disconnectSocket,
    placeBuilding,
    selectBuilding,
    deselectBuilding,
    startPlacementMode,
    endPlacementMode,
    updateResources,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}