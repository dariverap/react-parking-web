import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Determinar navegación según el rol del usuario
  const navigation = [];
  
  if (currentUser) {
    if (currentUser.rol === 'admin_general' || currentUser.rol === 'admin_parking') {
      navigation.push(
        { name: 'Dashboard', href: '/admin/dashboard', current: location.pathname === '/admin/dashboard' },
        { name: 'Parkings', href: '/admin/parkings', current: location.pathname === '/admin/parkings' },
        { name: 'Usuarios', href: '/admin/usuarios', current: location.pathname === '/admin/usuarios' },
        { name: 'Reportes', href: '/admin/reportes', current: location.pathname === '/admin/reportes' }
      );
    } else if (currentUser.rol === 'empleado') {
      navigation.push(
        { name: 'Dashboard', href: '/employee/dashboard', current: location.pathname === '/employee/dashboard' },
        { name: 'Espacios', href: '/employee/espacios', current: location.pathname === '/employee/espacios' },
        { name: 'Reservas', href: '/employee/reservas', current: location.pathname === '/employee/reservas' }
      );
    }
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <Disclosure as="nav" className="gradient-nav shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-[#3B82F6] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#60A5FA] transition-all duration-200">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Abrir menú principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-white text-[#1E40AF] h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                      P
                    </div>
                    <span className="text-white font-bold text-xl">ParkingSystem</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current 
                            ? 'bg-[#3B82F6] text-white shadow-md' 
                            : 'text-gray-100 hover:bg-[#3B82F6]/50 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover-lift'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                {currentUser ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-[#374151] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1E40AF]">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Abrir menú de usuario</span>
                        <div className="h-8 w-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white">
                          {currentUser.nombre ? currentUser.nombre.charAt(0) : 'U'}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-[#E5E7EB] ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(active ? 'bg-[#F3F4F6]' : '', 'block px-4 py-2 text-sm text-[#374151]')}
                            >
                              Tu perfil
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(active ? 'bg-[#F3F4F6]' : '', 'block w-full text-left px-4 py-2 text-sm text-[#374151]')}
                            >
                              Cerrar sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-300 hover:bg-[#3B82F6] hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-all duration-200"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      className="text-white bg-[#2563EB] hover:bg-[#1E40AF] rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 shadow-sm"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current ? 'bg-[#3B82F6] text-white' : 'text-gray-300 hover:bg-[#3B82F6]/50 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;