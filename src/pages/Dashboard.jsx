import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
    const changeValue = parseFloat(change.replace(/[+%]/g, ''));
    const isPositive = changeValue >= 0;

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                    <Icon size={24} className={color.replace('bg-', 'text-').replace('-500', '-600')} />
                </div>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 dark:bg-green-900/10 text-green-600' : 'bg-red-50 dark:bg-red-900/10 text-red-600'}`}>
                    {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                    {change}
                </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider transition-colors">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors">{value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 italic transition-colors">Compared to last month</p>
        </div>
    );
};

const ActivityItem = ({ title, subtitle, time, type }) => {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 px-2 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${type === 'order' ? 'bg-blue-500' : type === 'user' ? 'bg-purple-500' : 'bg-green-500'}`} />
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors">{title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">{subtitle}</p>
                    <div className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 mt-1 transition-colors">
                        <Clock size={10} className="mr-1" />
                        {formatTime(time)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, activityRes, analyticsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/activity'),
                api.get('/dashboard/analytics')
            ]);

            setStats(statsRes.data);
            setActivities(activityRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error('Dashboard Error:', error);
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

    // Dynamic Chart Height Calculation (scale revenue to 100%)
    const maxRevenue = Math.max(...analytics.map(item => item.revenue), 1);

    return (
        <div className="animate-in fade-in duration-500">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Complete overview of your platform performance.</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 flex shadow-sm transition-colors">
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Last Updated</p>
                        <p className="text-sm font-bold text-primary-600">{new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.value.toLocaleString()}`}
                    change={stats.totalRevenue.change}
                    icon={DollarSign}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders.value.toLocaleString()}
                    change={stats.totalOrders.change}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers.value.toLocaleString()}
                    change={stats.totalCustomers.change}
                    icon={Users}
                    color="bg-violet-500"
                />
                <StatCard
                    title="Active Alerts"
                    value={stats.activeAlerts.value}
                    change={stats.activeAlerts.change}
                    icon={TrendingUp}
                    color="bg-rose-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Card */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Recent Activity</h2>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 transition-colors">Latest events from your platform</p>
                        </div>
                        <Link to="/activity" className="text-sm font-bold text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">See All</Link>
                    </div>
                    <div className="space-y-1 flex-1">
                        {activities.length > 0 ? (
                            activities.map((activity, idx) => (
                                <ActivityItem
                                    key={idx}
                                    title={activity.title}
                                    subtitle={activity.subtitle}
                                    time={activity.time}
                                    type={activity.type}
                                />
                            ))
                        ) : (
                            <div className="py-10 text-center text-gray-400 italic text-sm">No recent activity detected.</div>
                        )}
                    </div>
                </div>

                {/* Sales Analytics Chart */}
                <div className="lg:col-span-2 bg-gradient-to-br from-primary-900 to-black p-8 rounded-3xl shadow-xl flex flex-col justify-between text-white relative min-h-[400px]">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Sales Analytics</h2>
                                <p className="text-primary-200 text-sm">Monthly revenue performance</p>
                            </div>
                            <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                <span className="text-xs font-bold text-accent-400">Total: ${analytics.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between space-x-3 mt-16 relative z-10 h-48 pt-10">
                        {analytics.map((item, i) => {
                            const height = (item.revenue / maxRevenue) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-3 bg-white text-primary-900 text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl transform translate-y-2 group-hover:translate-y-0 z-20">
                                        ${item.revenue.toLocaleString()}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                                    </div>

                                    <div
                                        className="w-full bg-gradient-to-t from-primary-500 to-accent-400 rounded-t-lg transition-all duration-1000 group-hover:from-accent-400 group-hover:to-accent-300 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] relative"
                                        style={{ height: `${Math.max(height, 4)}%` }}
                                    >
                                        {/* Optional: Value overlay for large bars */}
                                        {height > 40 && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity">
                                                <span className="text-[8px] font-black rotate-90 whitespace-nowrap uppercase tracking-widest text-white">REVENUE</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-primary-300 mt-4 uppercase tracking-tighter">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Decorative Blurs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent-500/10 rounded-full blur-[120px]"></div>
                </div>
            </div>
        </div>
    );
}
