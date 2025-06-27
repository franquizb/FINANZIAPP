// src/components/Layout.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFinanceData from '../hooks/useFinanceData';
import UserMenuModal from './UserMenuModal'; // Asegúrate de que esta importación sea correcta
import avatars from '../utils/avatars'; // <-- ESTA LÍNEA ESTÁ AQUÍ
// --- Iconos SVG para el Layout ---
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const AppLogo = ({ isSidebarOpen }) => isSidebarOpen ? <h1 className="text-2xl font-bold text-blue-400">FinanziApp</h1> : <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM12 8V7m0 10v-1m-7 1.5h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>;

const navLinks = [
  { to: "/dashboard", text: "Dashboard", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
  { to: "/monthly-tracker", text: "Seguimiento Mensual", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> },
  { to: "/net-worth", text: "Patrimonio Neto", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> },
  { to: "/portfolio", text: "Cartera", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
  { to: "/ai-analysis", text: "Análisis IA", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
  { to: "/settings", text: "Configuración", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.827 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.827-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.827-3.31 2.37-2.37.996.608 2.228.077 2.573-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
];

function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
    const { currentUser, logout } = useAuth();
    const { userConfig, loadingData } = useFinanceData();
    const navigate = useNavigate();
    const location = useLocation();
    const [isUserMenuModalOpen, setIsUserMenuModalOpen] = useState(false);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Fallo al cerrar sesión:", error);
        }
    };

    const currentAvatar = (currentUser && !loadingData && userConfig)
        ? (avatars.find(a => a.id === userConfig?.profile?.avatarId) || avatars[0])
        : avatars[0];

    const openUserMenu = useCallback(() => {
        setIsUserMenuModalOpen(true);
        setIsSidebarOpen(false);
    }, []);

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div>
                <div className={`flex items-center mb-8 h-10 ${!isDesktopSidebarCollapsed ? 'justify-start' : 'justify-center'}`}>
                    <AppLogo isSidebarOpen={!isDesktopSidebarCollapsed} />
                </div>
                <nav>
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.to} className="mb-2">
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700/50"
                                        } ${!isDesktopSidebarCollapsed ? '' : 'justify-center'}`
                                    }
                                    title={isDesktopSidebarCollapsed ? link.text : ''}
                                >
                                    <div className={`shrink-0 ${!isDesktopSidebarCollapsed ? 'mr-3' : ''}`}>{link.icon}</div>
                                    {!isDesktopSidebarCollapsed && <span className="text-base font-medium">{link.text}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100 dark:bg-gray-900 dark:text-gray-100">
            {/* Overlay para móvil */}
            <div className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar para móvil (off-canvas) */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800 p-4 shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} dark:bg-gray-800`}>
                {sidebarContent}
            </aside>

            {/* Sidebar para escritorio */}
            <aside className={`hidden md:flex flex-col bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${isDesktopSidebarCollapsed ? 'w-24 p-2' : 'w-64 p-4'} dark:bg-gray-800`}>
                {sidebarContent}
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto ${!isDesktopSidebarCollapsed ? 'md:ml-0' : 'md:ml-0'}`}>
                <header className="flex justify-between items-center mb-6">
                    {/* Botón de toggle unificado, diferente comportamiento por pantalla */}
                    <button
                        onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
                        className="p-2 hidden md:block rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-700 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        aria-label="Toggle sidebar"
                    >
                        <MenuIcon />
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 md:hidden rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-700 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        aria-label="Open sidebar"
                    >
                        <MenuIcon />
                    </button>

                    {/* Avatar del usuario en la esquina superior derecha */}
                    {currentUser && !loadingData && userConfig && ( // Asegurarse de que userConfig también esté cargado
                        <img
                            src={currentAvatar.url}
                            alt="Avatar de usuario"
                            className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors duration-200"
                            onClick={openUserMenu}
                        />
                    )}
                </header>
                <Outlet />
            </main>

            {/* --- RENDERIZA UserMenuModal AQUÍ --- */}
            {isUserMenuModalOpen && (
                <UserMenuModal
                    isOpen={isUserMenuModalOpen}
                    onClose={() => setIsUserMenuModalOpen(false)}
                    currentUser={currentUser}
                    userConfig={userConfig}
                />
            )}
        </div>
    );
}

export default Layout;