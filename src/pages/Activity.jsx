import { useState, useEffect } from 'react';
import { Clock, Search, Filter, Loader2, ArrowLeft, Package, User, CreditCard, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ActivityIcon = ({ type }) => {
    switch (type) {
        case 'order': return <Package className="text-blue-600 dark:text-blue-400" size={20} />;
        case 'user': return <User className="text-purple-600 dark:text-purple-400" size={20} />;
        case 'payment': return <CreditCard className="text-green-600 dark:text-green-400" size={20} />;
        default: return <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />;
    }
};

export default function Activity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await api.get('/dashboard/activity');
            setActivities(response.data);
        } catch (error) {
            toast.error('Failed to load activity log');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredActivities = activities.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <Link to="/" className="flex items-center text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4 group">
                    <ArrowLeft size={18} className="mr-1 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors">Activity Log</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Real-time audit trail of all platform events.</p>
            </header>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search activity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all shadow-inner shadow-gray-100/10"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-primary-600" size={40} />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Fetching event logs...</p>
                        </div>
                    ) : filteredActivities.length === 0 ? (
                        <div className="py-20 text-center text-gray-400 dark:text-gray-500 italic">No activities found matching your criteria.</div>
                    ) : (
                        filteredActivities.map((activity, idx) => (
                            <div key={idx} className="p-6 flex items-start gap-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${activity.type === 'order' ? 'bg-blue-50 dark:bg-blue-900/20' :
                                    activity.type === 'user' ? 'bg-purple-50 dark:bg-purple-900/20' :
                                        'bg-amber-50 dark:bg-amber-900/20'
                                    }`}>
                                    <ActivityIcon type={activity.type} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                                            {activity.title}
                                        </h3>
                                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center shrink-0">
                                            <Clock size={12} className="mr-1" />
                                            {formatTime(activity.time)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{activity.subtitle}</p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${activity.type === 'order' ? 'text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30' :
                                            activity.type === 'user' ? 'text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/30' :
                                                'text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30'
                                            }`}>
                                            {activity.type}
                                        </span>
                                        <button className="text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                            Event Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
