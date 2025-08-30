import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TableCellsIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const SidebarMenu = ({ isOpen, setIsOpen }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Determinar navegación según el rol del usuario
  const navigation = [];
  
  if (currentUser) {
    if (currentUser.rol === 'admin_general' || currentUser.rol === 'admin_parking') {
      navigation.push(
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, current: location.pathname === '/admin/dashboard' },
        { name: 'Parkings', href: '/admin/parkings', icon: BuildingOfficeIcon, current: location.pathname === '/admin/parkings' },
        { name: 'Usuarios', href: '/admin/usuarios', icon: UsersIcon, current: location.pathname === '/admin/usuarios' },
        { name: 'Reportes', href: '/admin/reportes', icon: ChartBarIcon, current: location.pathname === '/admin/reportes' },
        { name: 'Tarifas', href: '/admin/tarifas', icon: CurrencyDollarIcon, current: location.pathname === '/admin/tarifas' }
      );
    } else if (currentUser.rol === 'empleado') {
      navigation.push(
        { name: 'Dashboard', href: '/employee/dashboard', icon: HomeIcon, current: location.pathname === '/employee/dashboard' },
        { name: 'Espacios', href: '/employee/espacios', icon: TableCellsIcon, current: location.pathname === '/employee/espacios' },
        { name: 'Reservas', href: '/employee/reservas', icon: CalendarIcon, current: location.pathname === '/employee/reservas' },
        { name: 'Pagos', href: '/employee/pagos', icon: CurrencyDollarIcon, current: location.pathname === '/employee/pagos' }
      );
    }
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div 
      className={classNames(
        isOpen ? 'sidebar-expanded' : 'sidebar-collapsed',
        'h-screen bg-gradient-to-b from-[#1E3A8A] to-[#1E40AF] text-white shadow-xl z-10 flex flex-col fixed'
      )}
    >
      {/* Logo y botón de cerrar */}
      <div className="flex items-center justify-between p-4 border-b border-[#2563EB]/30">
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-white text-[#1E40AF] h-10 w-10 rounded-full flex items-center justify-center font-bold text-xl shadow-md hover:shadow-lg transition-all duration-200">
            P
          </div>
          {isOpen && <span className="font-bold text-xl text-shadow">ParkingSystem</span>}
        </Link>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-[#3B82F6]/30 transition-all duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Información del usuario */}
      {currentUser && (
        <div className={classNames(
          isOpen ? 'px-4 py-5' : 'px-2 py-5',
          'border-b border-[#2563EB]/30'
        )}>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-medium text-lg">
              {currentUser.nombre ? currentUser.nombre.charAt(0) : 'U'}
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{currentUser.nombre || 'Usuario'}</p>
                <p className="text-xs text-gray-300">
                  {currentUser.rol === 'admin_general' ? 'Administrador General' : currentUser.rol === 'admin_parking' ? 'Administrador de Parking' : 'Empleado'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                item.current ? 'sidebar-link-active' : 'sidebar-link-inactive',
                isOpen ? 'px-3 py-3' : 'px-3 py-3 justify-center',
                'sidebar-link hover-raise focus-ring'
              )}
            >
              <item.icon className={classNames(
                'flex-shrink-0 h-6 w-6',
                item.current ? 'text-white' : 'text-gray-400 hover:text-white transition-colors duration-200'
              )} />
              {isOpen && <span className="ml-3">{item.name}</span>}
              {!isOpen && (
                <span className="absolute left-full rounded-md px-2 py-1 ml-2 bg-gray-900 text-xs text-white transform scale-0 hover:scale-100 transition-all duration-200 z-50">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Acciones de usuario */}
      <div className={classNames(
        isOpen ? 'px-4 py-4' : 'px-2 py-4',
        'border-t border-[#2563EB]/30'
      )}>
        {currentUser ? (
          <div className="space-y-2">
            <Link
              to="/profile"
              className={classNames(
                'sidebar-link-inactive',
                isOpen ? 'px-3 py-2' : 'px-3 py-2 justify-center',
                'sidebar-link hover-raise focus-ring'
              )}
            >
              <UserCircleIcon className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200" />
              {isOpen && <span className="ml-3">Tu perfil</span>}
              {!isOpen && (
                <span className="absolute left-full rounded-md px-2 py-1 ml-2 bg-gray-900 text-xs text-white transform scale-0 hover:scale-100 transition-all duration-200 z-50">
                  Tu perfil
                </span>
              )}
            </Link>
            <button
              onClick={logout}
              className={classNames(
                'sidebar-link-inactive',
                isOpen ? 'px-3 py-2 w-full' : 'px-3 py-2 justify-center w-full',
                'sidebar-link hover-raise focus-ring'
              )}
            >
              <ArrowRightOnRectangleIcon className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200" />
              {isOpen && <span className="ml-3">Cerrar sesión</span>}
              {!isOpen && (
                <span className="absolute left-full rounded-md px-2 py-1 ml-2 bg-gray-900 text-xs text-white transform scale-0 hover:scale-100 transition-all duration-200 z-50">
                  Cerrar sesión
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              className={classNames(
                'sidebar-link-inactive',
                isOpen ? 'px-3 py-2' : 'px-3 py-2 justify-center',
                'sidebar-link hover-raise focus-ring'
              )}
            >
              <ArrowRightOnRectangleIcon className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200" />
              {isOpen && <span className="ml-3">Iniciar sesión</span>}
              {!isOpen && (
                <span className="absolute left-full rounded-md px-2 py-1 ml-2 bg-gray-900 text-xs text-white transform scale-0 hover:scale-100 transition-all duration-200 z-50">
                  Iniciar sesión
                </span>
              )}
            </Link>
            <Link
              to="/register"
              className={classNames(
                'sidebar-link-active',
                isOpen ? 'px-3 py-2' : 'px-3 py-2 justify-center',
                'sidebar-link shadow-sm hover-raise focus-ring'
              )}
            >
              <UserCircleIcon className="flex-shrink-0 h-6 w-6 text-white" />
              {isOpen && <span className="ml-3">Registrarse</span>}
              {!isOpen && (
                <span className="absolute left-full rounded-md px-2 py-1 ml-2 bg-gray-900 text-xs text-white transform scale-0 hover:scale-100 transition-all duration-200 z-50">
                  Registrarse
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;