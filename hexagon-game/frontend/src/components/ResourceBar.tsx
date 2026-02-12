import React from 'react';
import { Coins, TreePine, Mountain, Utensils } from 'lucide-react';

interface Resource {
  resourceId: string;
  amount: number;
}

interface ResourceBarProps {
  resources: Resource[];
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ resources }) => {
  // Map resource IDs to display names and icons
  const getResourceInfo = (id: string) => {
    switch(id) {
      case 'gold':
        return { name: 'Gold', icon: Coins, color: 'text-yellow-400' };
      case 'wood':
        return { name: 'Wood', icon: TreePine, color: 'text-amber-600' };
      case 'stone':
        return { name: 'Stone', icon: Mountain, color: 'text-stone-400' };
      case 'food':
        return { name: 'Food', icon: Utensils, color: 'text-emerald-400' };
      default:
        return { name: id, icon: Coins, color: 'text-gray-400' };
    }
  };

  // Get resource amounts by ID for easy access
  const resourceMap: Record<string, number> = {};
  resources.forEach(resource => {
    resourceMap[resource.resourceId] = resource.amount;
  });

  // Define the order of resources to display
  const resourceOrder = ['gold', 'wood', 'stone', 'food'];

  return (
    <div className="resources-bar">
      <div className="flex items-center space-x-6">
        {resourceOrder.map(resourceId => {
          const resourceInfo = getResourceInfo(resourceId);
          const amount = resourceMap[resourceId] || 0;
          
          const IconComponent = resourceInfo.icon;
          
          return (
            <div key={resourceId} className="flex items-center">
              <IconComponent className={resourceInfo.color} size={24} />
              <span className="ml-1 font-semibold">{amount}</span>
              <span className="ml-2 text-gray-300 hidden sm:inline">{resourceInfo.name}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <span className="text-gray-400">Population:</span> 
          <span className="ml-1 font-semibold">0</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Level:</span> 
          <span className="ml-1 font-semibold">1</span>
        </div>
      </div>
    </div>
  );
};