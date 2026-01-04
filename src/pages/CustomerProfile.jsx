import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, ShieldCheck, Clock, MapPin, Package, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CustomerProfile() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setCustomer(response.data);
        } catch (error) {
            toast.error('Failed to load customer profile');
            console.error('Error fetching customer:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 font-medium italic transition-colors">Customer profile not found.</p>
                <Link to="/customers" className="text-primary-600 dark:text-primary-500 font-bold mt-4 inline-block hover:underline">Back to Customers</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <Link to="/customers" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4 group">
                        <ArrowLeft size={18} className="mr-1 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Customers
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors">User Profile</h1>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Fixed Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center transition-colors duration-300">
                        <div className="w-32 h-32 rounded-full bg-primary-50 dark:bg-gray-800 border-4 border-white dark:border-gray-800 shadow-xl mx-auto overflow-hidden mb-6 transition-colors">
                            {customer.profilePicture ? (
                                <img src={customer.profilePicture} alt={customer.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary-600 dark:text-primary-500 bg-primary-100/50 dark:bg-primary-900/20 text-4xl">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{customer.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 uppercase tracking-widest font-bold transition-colors">{customer.role}</p>

                        <div className="flex justify-center">
                            {customer.isAdminUser ? (
                                <span className="inline-flex items-center px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/30 transition-colors">
                                    <ShieldCheck size={14} className="mr-1.5" />
                                    Administrator
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-500 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30 transition-colors">
                                    <Shield size={14} className="mr-1.5" />
                                    Standard User
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 space-y-6 transition-colors duration-300">
                        <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] transition-colors">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider transition-colors">Email Address</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">{customer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider transition-colors">Member Since</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">
                                        {new Date(customer.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity/Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center transition-colors">
                                <Clock className="mr-2 text-primary-600 dark:text-primary-500" size={20} />
                                Recent Activity
                            </h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30 mt-1.5 transition-all"></div>
                                    <div className="absolute top-6 bottom-[-32px] left-[5px] w-px bg-gray-100 dark:bg-gray-800 transition-colors"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Account Created</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Successfully registered on the platform.</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-2 tracking-wider transition-colors">
                                        {new Date(customer.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30 mt-1.5 transition-all"></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Last Profile Update</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Updated account preferences.</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-2 tracking-wider transition-colors">
                                        {new Date(customer.updatedAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center transition-colors">
                                <Package className="mr-2 text-primary-600 dark:text-primary-500" size={20} />
                                Order History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest font-black transition-colors">
                                    <tr>
                                        <th className="px-8 py-4">Order ID</th>
                                        <th className="px-8 py-4">Date</th>
                                        <th className="px-8 py-4">Amount</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                                    {customer.orders?.length > 0 ? (
                                        customer.orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                                <td className="px-8 py-4 text-sm font-bold text-primary-600 dark:text-primary-500 transition-colors">
                                                    #{order.id.slice(-8).toUpperCase()}
                                                </td>
                                                <td className="px-8 py-4 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-4 text-sm font-bold text-gray-900 dark:text-white transition-colors">
                                                    ${order.totalAmount}
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <Link
                                                        to={`/orders/${order.id}`}
                                                        className="text-primary-600 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-400 transition-colors font-bold text-xs"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-10 text-center text-gray-400 italic text-sm">
                                                No orders placed yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-primary-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-4 opacity-90">Customer Summary</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Orders</p>
                                    <p className="text-2xl font-display font-bold">{customer.totalOrders || 0}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Spent</p>
                                    <p className="text-2xl font-display font-bold">${customer.totalSpent?.toLocaleString() || '0.00'}</p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent-500/20 rounded-full blur-[80px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
