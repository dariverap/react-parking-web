import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, FilterIcon, XIcon } from '@heroicons/react/outline';
import ParkingSpaceCard from '../ui/ParkingSpaceCard';

const statusFilters = {
  all: 'Todos',
  available: 'Disponibles',
  occupied: 'Ocupados',
  reserved: 'Reservados',
};

const typeFilters = {
  all: 'Todos',
  standard: 'Estándar',
  premium: 'Premium',
  vip: 'VIP',
};

const ParkingGrid = ({ spaces = [], loading = false, onSpaceSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesSearch = space.number.toString().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || space.status === statusFilter;
      const matchesType = typeFilter === 'all' || space.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [spaces, searchTerm, statusFilter, typeFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and filter bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar por número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FilterIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
              Filtros
            </button>
            
            {(statusFilter !== 'all' || typeFilter !== 'all' || searchTerm) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Limpiar filtros
                <XIcon className="ml-2 -mr-0.5 h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusFilters).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatusFilter(key)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          statusFilter === key
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(typeFilters).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTypeFilter(key)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          typeFilter === key
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredSpaces.length} de {spaces.length} espacios
      </div>

      {/* Parking spaces grid */}
      {filteredSpaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSpaces.map((space) => (
            <ParkingSpaceCard
              key={space.id}
              id={space.id}
              number={space.number}
              status={space.status}
              type={space.type}
              onSelect={onSpaceSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No se encontraron espacios que coincidan con los filtros.</p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ParkingGrid);
