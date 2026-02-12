import React from 'react';

interface Building {
  id: number;
  type: string;
  positionX: number;
  positionY: number;
  level: number;
  health: number;
}

interface HexGridProps {
  size: number;
  buildings: Building[];
  selectedTile: {x: number, y: number} | null;
  hoveredTile: {x: number, y: number} | null;
  onTileClick: (x: number, y: number) => void;
  onTileHover: (x: number, y: number) => void;
}

export const HexGrid: React.FC<HexGridProps> = ({ 
  size, 
  buildings, 
  selectedTile, 
  hoveredTile, 
  onTileClick, 
  onTileHover 
}) => {
  // Generate hex coordinates for the grid
  const generateHexCoordinates = (): {x: number, y: number}[] => {
    const coords = [];
    
    // For a hexagonal grid, we use axial coordinates (q, r) where s = -(q + r)
    for (let q = -size; q <= size; q++) {
      const r1 = Math.max(-size, -q - size);
      const r2 = Math.min(size, -q + size);
      
      for (let r = r1; r <= r2; r++) {
        coords.push({ x: q, y: r });
      }
    }
    
    return coords;
  };

  const tiles = generateHexCoordinates();
  
  // Function to get building at a specific position
  const getBuildingAtPosition = (x: number, y: number): Building | undefined => {
    return buildings.find(b => b.positionX === x && b.positionY === y);
  };

  // Function to get tile class based on state
  const getTileClass = (x: number, y: number) => {
    let classes = 'hex-tile ';
    
    // Default tile class
    classes += 'tile-empty ';
    
    // Check if this tile has a building
    const building = getBuildingAtPosition(x, y);
    if (building) {
      classes += `tile-${building.type} `;
    }
    
    // Check if this tile is selected
    if (selectedTile && selectedTile.x === x && selectedTile.y === y) {
      classes += 'ring-2 ring-yellow-400 ';
    }
    
    // Check if this tile is hovered
    if (hoveredTile && hoveredTile.x === x && hoveredTile.y === y) {
      classes += 'ring-2 ring-blue-400 ';
    }
    
    return classes;
  };

  return (
    <div className="hex-grid">
      {tiles.map((coord, index) => (
        <div
          key={`${coord.x}-${coord.y}`}
          className={getTileClass(coord.x, coord.y)}
          onClick={() => onTileClick(coord.x, coord.y)}
          onMouseEnter={() => onTileHover(coord.x, coord.y)}
        >
          {/* Render building icon if present */}
          {getBuildingAtPosition(coord.x, coord.y) && (
            <div className="w-full h-full flex items-center justify-center text-xs">
              {getBuildingAtPosition(coord.x, coord.y)?.type.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};