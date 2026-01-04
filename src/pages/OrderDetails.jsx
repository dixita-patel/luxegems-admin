import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock, Loader2, ChevronRight, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            toast.error('Failed to load order details');
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

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 italic transition-colors">Order not found.</p>
                <Link to="/orders" className="text-primary-600 dark:text-primary-500 font-bold mt-4 inline-block hover:underline">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <header className="mb-8">
                <Link to="/orders" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4 group">
                    <ArrowLeft size={18} className="mr-1 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Orders
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors flex items-center">
                            Order Details
                            <span className="ml-3 text-[10px] font-bold px-3 py-1 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400 rounded-full border border-primary-100 dark:border-primary-900/20 uppercase tracking-widest transition-colors">
                                #{order.id.slice(-8).toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center transition-colors">
                            <Clock size={14} className="mr-1" />
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${order.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                            order.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                                'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center transition-colors">
                                <Package className="mr-2 text-primary-600 dark:text-primary-500 transition-colors" size={20} />
                                Order Items
                            </h2>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">{order.items?.length || 0} Products</span>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                            {order.items?.map((item, index) => (
                                <div key={index} className="p-6 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700 transition-colors">
                                        {item.product?.image ? (
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white truncate transition-colors">{item.product?.name || `Product #${item.id}`}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{item.product?.category}</p>
                                        <div className="mt-2 flex items-center text-sm font-medium">
                                            <span className="text-gray-900 dark:text-white transition-colors">${item.price}</span>
                                            <X className="mx-2 text-gray-300 dark:text-gray-600" size={12} />
                                            <span className="text-gray-500 dark:text-gray-400 transition-colors">{item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-bold text-gray-900 dark:text-white transition-colors">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50/30 dark:bg-gray-800/20 space-y-3 transition-colors">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-[10px]">Subtotal</span>
                                <span className="text-gray-900 dark:text-white font-bold transition-colors">${order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-[10px]">Shipping</span>
                                <span className="text-green-600 dark:text-green-400 font-bold transition-colors">FREE</span>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 transition-colors" />
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-gray-900 dark:text-white transition-colors">Total Amount</span>
                                <span className="text-2xl font-display font-bold text-primary-600 dark:text-primary-500 transition-colors">${order.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer & Shipping Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors">
                            <User className="mr-2 text-primary-600 dark:text-primary-500 transition-colors" size={20} />
                            Customer Info
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">Stripe Payment ID</p>
                                <p className="text-[11px] font-mono text-gray-900 dark:text-gray-300 break-all bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors">{order.stripePaymentId}</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl transition-colors">
                                <div className="w-10 h-10 bg-primary-100/50 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-500 transition-colors">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Admin User</p>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">Customer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors">
                            <MapPin className="mr-2 text-primary-600 dark:text-primary-500 transition-colors" size={20} />
                            Shipping Address
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1 transition-colors"><MapPin size={16} className="text-gray-400 dark:text-gray-500" /></div>
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium transition-colors">
                                        {order.shippingAddress?.street}<br />
                                        {order.shippingAddress?.city}, {order.shippingAddress?.zip}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 transition-colors duration-300">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors">
                            <CreditCard className="mr-2 text-primary-600 dark:text-primary-500 transition-colors" size={20} />
                            Payment Status
                        </h2>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 transition-colors">
                                    <ChevronRight size={16} />
                                </div>
                                <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-widest transition-colors">PAID via Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
