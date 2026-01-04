import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Mail, Calendar, User, ShieldCheck, Shield, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Customers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to load customers');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors">Customer Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage and view all registered platform users.</p>
                </div>
            </header>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10 transition-colors">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all shadow-inner shadow-gray-100/10"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest font-bold transition-colors">
                            <tr>
                                <th className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">User Details</th>
                                <th className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">Role</th>
                                <th className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">Account Type</th>
                                <th className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">Joined Date</th>
                                <th className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex justify-center flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-primary-600" size={32} />
                                            <span className="text-gray-500 dark:text-gray-400 font-medium">Loading user data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 font-medium italic">
                                        No customers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/10 overflow-hidden border border-primary-100 dark:border-primary-900/10 flex-shrink-0 transition-colors">
                                                    {user.profilePicture ? (
                                                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-primary-600 dark:text-primary-500 bg-primary-100/50 dark:bg-primary-900/20">
                                                            <User size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5 transition-colors">
                                                        <Mail size={12} className="mr-1" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${user.role === 'admin'
                                                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                                                : 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm font-medium transition-colors">
                                                {user.isAdminUser ? (
                                                    <span className="flex items-center text-amber-600 dark:text-amber-500">
                                                        <ShieldCheck size={16} className="mr-1.5" />
                                                        Privileged
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-gray-400 dark:text-gray-500">
                                                        <Shield size={16} className="mr-1.5 opacity-50" />
                                                        Standard
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-500 dark:text-gray-400 transition-colors">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/customers/${user.id}`}
                                                className="text-xs font-bold text-primary-600 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 uppercase tracking-widest py-2 px-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                                            >
                                                View Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

