import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@radix-ui/react-dialog';

interface Building {
  id: number;
  type: string;
  positionX: number;
  positionY: number;
  level: number;
  health: number;
}

interface BuildingInterfaceProps {
  building: Building;
  onClose: () => void;
}

export const BuildingInterface: React.FC<BuildingInterfaceProps> = ({ building, onClose }) => {
  // Building-specific information
  const buildingInfo = {
    residential: { name: 'Residential House', description: 'Provides housing for citizens' },
    commercial: { name: 'Commercial Center', description: 'Generates income for the city' },
    industrial: { name: 'Industrial Plant', description: 'Produces goods and resources' },
    road: { name: 'Road', description: 'Connects different parts of the city' },
    water: { name: 'Water Source', description: 'Provides water to surrounding buildings' },
  };

  const info = buildingInfo[building.type as keyof typeof buildingInfo] || { name: building.type, description: 'A basic building' };

  return (
    <Dialog open={!!building} onOpenChange={onClose}>
      <DialogContent className="building-interface bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white mb-2">
            {info.name} #{building.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300">{info.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Level</p>
              <p className="text-white font-semibold">{building.level}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Health</p>
              <p className="text-white font-semibold">{building.health}%</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Position</p>
              <p className="text-white font-semibold">({building.positionX}, {building.positionY})</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Type</p>
              <p className="text-white font-semibold capitalize">{building.type}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
              Upgrade
            </button>
            <button className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white">
              Repair
            </button>
            <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
              Demolish
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};