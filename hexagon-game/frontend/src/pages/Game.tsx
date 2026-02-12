import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { HexGrid, HexTile } from '../components/HexGrid';
import { Chat } from '../components/Chat';
import { BuildingInterface } from '../components/BuildingInterface';
import { BuildingList } from '../components/BuildingList';
import { ResourceBar } from '../components/ResourceBar';

const Game: React.FC = () => {
  const { user } = useAuth();
  const { 
    gameState, 
    placeBuilding, 
    selectBuilding, 
    deselectBuilding, 
    startPlacementMode, 
    endPlacementMode 
  } = useGame();
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('cityId');
  const [selectedTile, setSelectedTile] = useState<{x: number, y: number} | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{x: number, y: number} | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load city data when component mounts or cityId changes
  useEffect(() => {
    if (cityId) {
      loadCityData(Number(cityId));
    }
  }, [cityId]);

  const loadCityData = async (id: number) => {
    try {
      const response = await fetch(`/api/game/cities/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update game context with city data
        console.log('Loaded city data:', data);
      }
    } catch (error) {
      console.error('Failed to load city data:', error);
    }
  };

  const handleTileClick = (x: number, y: number) => {
    if (gameState.isPlacingBuilding) {
      // Place building at clicked tile
      placeBuilding(gameState.placementType, x, y);
      endPlacementMode();
      setSelectedTile(null);
    } else {
      // Select tile for interaction
      setSelectedTile({ x, y });
      
      // Check if there's a building at this location
      const building = gameState.buildings.find(b => b.positionX === x && b.positionY === y);
      if (building) {
        selectBuilding(building);
      } else {
        deselectBuilding();
      }
    }
  };

  const handleTileHover = (x: number, y: number) => {
    setHoveredTile({ x, y });
  };

  return (
    <div className="game-layout">
      {/* Resources bar at the top */}
      <ResourceBar resources={gameState.resources} />
      
      {/* Main content area */}
      <div className="main-content">
        {/* Sidebar with building selection */}
        <div className="sidebar">
          <h2 className="text-xl font-bold mb-4">Construction</h2>
          <BuildingList onStartPlacement={startPlacementMode} />
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Current City</h3>
            <p>{gameState.currentCity?.name || 'Loading...'}</p>
            <p className="text-sm text-gray-400 mt-1">Population: {gameState.currentCity?.population || 0}</p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Select a building type from the list</li>
              <li>• Click on the hex grid to place it</li>
              <li>• Click on placed buildings for options</li>
            </ul>
          </div>
        </div>
        
        {/* Game area with hex grid */}
        <div className="game-area" ref={canvasRef}>
          <HexGrid 
            size={gameState.currentCity?.mapSize || 10}
            buildings={gameState.buildings}
            selectedTile={selectedTile}
            hoveredTile={hoveredTile}
            onTileClick={handleTileClick}
            onTileHover={handleTileHover}
          />
          
          {/* Building interface when a building is selected */}
          {gameState.selectedBuilding && (
            <BuildingInterface 
              building={gameState.selectedBuilding} 
              onClose={deselectBuilding} 
            />
          )}
        </div>
      </div>
      
      {/* Chat at the bottom */}
      <div className="chat-container">
        <Chat userId={user?.id} />
      </div>
    </div>
  );
};

export default Game;