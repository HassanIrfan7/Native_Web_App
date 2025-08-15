import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { User } from '../types';
import { Users, UserCheck, UserX, Plus, Search } from 'lucide-react';

export default function AdminDashboard() {
  const { creators, updateCreator, getCreators } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [allCreators, setAllCreators] = useState<User[]>([]);

  useEffect(() => {
    // Load creators from localStorage including pending ones
    const savedCreators = localStorage.getItem('creators');
    if (savedCreators) {
      setAllCreators(JSON.parse(savedCreators));
    }
  }, []);

  const filteredCreators = allCreators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCreators = filteredCreators.filter(creator => !creator.isActive);
  const activeCreators = filteredCreators.filter(creator => creator.isActive);

  const handleApproveCreator = (creatorId: string) => {
    const updatedCreators = allCreators.map(creator =>
      creator.id === creatorId ? { ...creator, isActive: true } : creator
    );
    setAllCreators(updatedCreators);
    localStorage.setItem('creators', JSON.stringify(updatedCreators));
    updateCreator(creatorId, { isActive: true });
  };

  const handleSuspendCreator = (creatorId: string) => {
    const updatedCreators = allCreators.map(creator =>
      creator.id === creatorId ? { ...creator, isActive: false } : creator
    );
    setAllCreators(updatedCreators);
    localStorage.setItem('creators', JSON.stringify(updatedCreators));
    updateCreator(creatorId, { isActive: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage creators and monitor platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active Creators</p>
              <p className="text-2xl font-bold text-white">{activeCreators.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-white">{pendingCreators.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <UserX className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Creators</p>
              <p className="text-2xl font-bold text-white">{allCreators.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingCreators.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-yellow-400" />
            Pending Approvals ({pendingCreators.length})
          </h2>
          <div className="space-y-4">
            {pendingCreators.map(creator => (
              <div key={creator.id} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full border-2 border-yellow-500"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-white">{creator.name}</h3>
                      <p className="text-gray-400">{creator.email}</p>
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(creator.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveCreator(creator.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Creators */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-green-400" />
          Active Creators ({activeCreators.length})
        </h2>
        {activeCreators.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No active creators found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCreators.map(creator => (
              <div key={creator.id} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full border-2 border-green-500"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-white">{creator.name}</h3>
                    <p className="text-gray-400">{creator.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Active since {new Date(creator.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleSuspendCreator(creator.id)}
                    className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}