import { useState } from 'react';
import Sidebar from '../sidebar/SIdebar';

const Layout = ({ children }:any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay Background */}
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Sidebar Panel */}
          <div className="relative z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-mine-shaft-950 text-white p-4 flex items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="mr-4">
            {/* Hamburger Icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Subjects</h1>
        </header>
        <main className="p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
