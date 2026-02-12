import React, { useState, useEffect } from 'react';
import { useNavigate } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Plus, Users, Globe, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user's cities
    fetchUserCities();
  }, []);

  const fetchUserCities = async () => {
    try {
      const response = await fetch('/api/game/cities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const createNewCity = async () => {
    const cityName = prompt('Enter your new city name:');
    if (!cityName) return;

    try {
      const response = await fetch('/api/game/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: cityName })
      });

      if (response.ok) {
        const data = await response.json();
        setCities([...cities, data.city]);
      } else {
        alert('Failed to create city');
      }
    } catch (error) {
      console.error('Failed to create city:', error);
    }
  };

  const enterCity = (cityId: number) => {
    navigate(`/game?cityId=${cityId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
            <p className="text-gray-300">Manage your cities and resources</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span>{user?.username}</span>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center">
              <Building2 className="text-blue-400 mr-3" size={24} />
              <div>
                <p className="text-gray-400">Cities</p>
                <p className="text-2xl font-bold">{cities.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center">
              <Users className="text-green-400 mr-3" size={24} />
              <div>
                <p className="text-gray-400">Population</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center">
              <Globe className="text-yellow-400 mr-3" size={24} />
              <div>
                <p className="text-gray-400">Online Players</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center">
              <Settings className="text-purple-400 mr-3" size={24} />
              <div>
                <p className="text-gray-400">Level</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Cities</h2>
            <button 
              onClick={createNewCity}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Plus size={18} className="mr-2" />
              New City
            </button>
          </div>

          {cities.length === 0 ? (
            <div className="bg-gray-800/50 p-10 rounded-xl border border-gray-700 text-center">
              <Building2 size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cities yet</h3>
              <p className="text-gray-400 mb-4">Create your first city to start building your empire</p>
              <button 
                onClick={createNewCity}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Create Your First City
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map(city => (
                <div 
                  key={city.id} 
                  className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition cursor-pointer"
                  onClick={() => enterCity(city.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{city.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{city.description || 'A beautiful city'}</p>
                    </div>
                    <Building2 className="text-blue-400" size={24} />
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <span>Population: {city.population || 0}</span>
                    <span>Buildings: 0</span>
                  </div>
                  <button className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                    Enter City
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              View Resources
            </button>
            <button className="py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              Manage Buildings
            </button>
            <button className="py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              Visit Marketplace
            </button>
            <button className="py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              Friends & Guilds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;