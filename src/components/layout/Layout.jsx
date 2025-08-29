import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import SidebarMenu from './SidebarMenu';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <SidebarMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0 md:ml-20'}`}>
        <main className="flex-grow bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] min-h-screen">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6 topbar rounded-xl bg-white/70 shadow-sm border border-[#E5E7EB] px-4 sm:px-6 py-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md bg-white shadow-md text-[#1E40AF] hover:bg-[#EFF6FF] transition-all duration-200 hover:shadow-lg"
                aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
              <div className="text-[#1E40AF] font-bold text-xl hidden md:block">
                {location.pathname.includes('/admin') && 'Panel de Administración'}
                {location.pathname.includes('/employee') && 'Panel de Empleado'}
              </div>
            </div>
            <Outlet />
          </div>
        </main>
        <footer className="gradient-nav text-white text-center py-6 shadow-inner">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="bg-white text-[#1E40AF] h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg">
                  P
                </div>
                <span className="font-bold text-xl">ParkingSystem</span>
              </div>
              <p className="text-gray-300">© {new Date().getFullYear()} Sistema de Gestión de Parkings</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;