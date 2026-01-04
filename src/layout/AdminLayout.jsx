import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const SidebarItem = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li>
            <Link
                to={to}
                className={clsx(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium",
                    isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
            >
                <Icon size={20} />
                <span>{label}</span>
            </Link>
        </li>
    );
};

export default function AdminLayout() {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full z-10 hidden md:block transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold font-display">L</span>
                    </div>
                    <span className="text-xl font-display font-bold text-gray-900 dark:text-white">LuxeGems</span>
                </div>

                <nav className="p-4 overflow-y-auto h-[calc(100vh-160px)]">
                    <ul className="space-y-2">
                        <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
                        <SidebarItem to="/products" icon={ShoppingBag} label="Products" />
                        <SidebarItem to="/orders" icon={Package} label="Orders" />
                        <SidebarItem to="/customers" icon={Users} label="Customers" />
                        <SidebarItem to="/settings" icon={Settings} label="Settings" />
                    </ul>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">{user?.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium text-sm"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}
