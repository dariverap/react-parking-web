import React from 'react';
import { motion } from 'framer-motion';
import { ParkingIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

const stats = [
  {
    id: 'total-spaces',
    name: 'Espacios Totales',
    value: '0',
    icon: ParkingIcon,
    change: '+0%',
    changeType: 'increase',
  },
  {
    id: 'available',
    name: 'Disponibles',
    value: '0',
    icon: CheckCircleIcon,
    change: '+0%',
    changeType: 'increase',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 'occupied',
    name: 'Ocupados',
    value: '0',
    icon: XCircleIcon,
    change: '0%',
    changeType: 'neutral',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    id: 'reserved',
    name: 'Reservados',
    value: '0',
    icon: ClockIcon,
    change: '0%',
    changeType: 'decrease',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
];

const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <motion.div 
      className="bg-white overflow-hidden shadow rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor || 'bg-gray-100'}`}>
            <Icon className={`h-6 w-6 ${stat.color || 'text-gray-600'}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'increase' ? 'text-green-600' : 
                    stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {stat.change}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
const DashboardStats = ({ statsData = stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <div key={stat.id}>
          <StatCard 
            stat={{
              ...stat,
              value: statsData[index]?.value || stat.value,
              change: statsData[index]?.change || stat.change,
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(DashboardStats);
