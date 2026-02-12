import React from 'react';
import { Home, Store, Factory, Road, Droplets, Hammer } from 'lucide-react';

interface BuildingListProps {
  onStartPlacement: (type: string) => void;
}

export const BuildingList: React.FC<BuildingListProps> = ({ onStartPlacement }) => {
  const buildingTypes = [
    { 
      id: 'residential', 
      name: 'House', 
      description: 'Provides housing for citizens', 
      icon: Home,
      cost: { wood: 10, stone: 5, gold: 5 }
    },
    { 
      id: 'commercial', 
      name: 'Shop', 
      description: 'Generates income for the city', 
      icon: Store,
      cost: { wood: 15, stone: 10, gold: 10 }
    },
    { 
      id: 'industrial', 
      name: 'Factory', 
      description: 'Produces goods and resources', 
      icon: Factory,
      cost: { wood: 20, stone: 15, gold: 15 }
    },
    { 
      id: 'road', 
      name: 'Road', 
      description: 'Connects different parts of the city', 
      icon: Road,
      cost: { wood: 2, stone: 3, gold: 1 }
    },
    { 
      id: 'water', 
      name: 'Well', 
      description: 'Provides water to surrounding buildings', 
      icon: Droplets,
      cost: { wood: 5, stone: 8, gold: 3 }
    },
    { 
      id: 'special', 
      name: 'Workshop', 
      description: 'Special building for advanced crafting', 
      icon: Hammer,
      cost: { wood: 25, stone: 20, gold: 30 }
    },
  ];

  return (
    <div className="space-y-3">
      {buildingTypes.map((building) => {
        const IconComponent = building.icon;
        return (
          <div 
            key={building.id}
            className="flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition"
            onClick={() => onStartPlacement(building.id)}
          >
            <div className="mr-3 text-blue-400">
              <IconComponent size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{building.name}</h3>
              <p className="text-xs text-gray-400">{building.description}</p>
              <div className="flex mt-1 space-x-2">
                <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-1 rounded">Gold: {building.cost.gold}</span>
                <span className="text-xs bg-amber-900 text-amber-200 px-2 py-1 rounded">Wood: {building.cost.wood}</span>
                <span className="text-xs bg-stone-900 text-stone-200 px-2 py-1 rounded">Stone: {building.cost.stone}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};