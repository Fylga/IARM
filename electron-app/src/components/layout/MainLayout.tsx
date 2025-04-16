// src/components/layout/MainLayout.tsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const MainLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="w-full px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">IARM Emergency System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm">
                Connecté en tant que <span className="font-medium">{user.name}</span>
                {isAdmin && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Admin</span>}
              </div>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal avec sidebar */}
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
          <nav className="p-4 space-y-2">
            <div 
              className="block px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate('/')}
            >
              Appels d'urgence
            </div>
            
            {isAdmin && (
              <div 
                className="block px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/admin/users')}
              >
                Gestion des utilisateurs
              </div>
            )}
          </nav>
        </aside>

        {/* Main content - occupant tout l'espace restant */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
