import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const statusStyles = {
  available: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    label: 'Disponible',
  },
  occupied: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
    label: 'Ocupado',
  },
  reserved: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
    label: 'Reservado',
  },
};

const ParkingSpaceCard = ({
  id,
  number,
  status = 'available',
  type = 'standard',
  onSelect,
  selected = false,
  className = '',
}) => {
  const statusConfig = statusStyles[status] || statusStyles.available;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect && onSelect(id)}
      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${statusConfig.bg} ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-200 hover:border-gray-300'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Espacio #{number}</h3>
          <p className={`inline-flex items-center text-sm ${statusConfig.text} mt-1`}>
            {statusConfig.icon}
            <span className="ml-1.5">{statusConfig.label}</span>
          </p>
        </div>
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200">
          {type === 'standard' ? 'Estándar' : type === 'premium' ? 'Premium' : 'VIP'}
        </span>
      </div>
      
      {selected && (
        <div className="absolute -top-2 -right-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        </div>
      )}
    </motion.button>
  );
};

export default React.memo(ParkingSpaceCard);
