import { useState, useEffect } from 'react';
import { Search, Eye, MoreVertical, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
        processing: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
        shipped: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
        delivered: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
        cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${styles[status?.toLowerCase()] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'}`}>
            {status}
        </span>
    );
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.stripePaymentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors">Order Management</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Track and manage customer purchases.</p>
            </header>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest font-bold transition-colors">
                            <tr>
                                <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Order ID</th>
                                <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Date</th>
                                <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Total</th>
                                <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Status</th>
                                <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex justify-center"><Loader2 className="animate-spin text-primary-600" /></div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No orders found.</td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-primary-600 dark:text-primary-500 truncate max-w-[120px]">#{order.id.slice(-8)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors">${order.totalAmount}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 shadow-sm transition-all"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
