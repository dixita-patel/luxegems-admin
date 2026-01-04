import { useState, useRef, useEffect } from 'react';
import {
    User,
    Lock,
    Bell,
    Globe,
    Shield,
    CreditCard,
    Save,
    Moon,
    Sun,
    Mail,
    Phone,
    Camera,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">{subtitle}</p>
    </div>
);

const SettingCard = ({ children, className }) => (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6 transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const Toggle = ({ enabled, setEnabled }) => (
    <button
        onClick={() => setEnabled(!enabled)}
        className={`${enabled ? 'bg-primary-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
        <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

export default function Settings() {
    const { user, setUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const fileInputRef = useRef(null);

    // Form States
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(user?.profilePicture || null);

    // Security States
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI States
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhoneNumber(user.phoneNumber || '');
            setPreview(user.profilePicture);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (activeTab === 'profile') {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('phoneNumber', phoneNumber);
                if (profilePicture) {
                    formData.append('profilePicture', profilePicture);
                }

                const response = await api.patch('/users/profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setUser(response.data);
                toast.success('Profile updated successfully!');
                setProfilePicture(null);
            } else if (activeTab === 'security') {
                if (!oldPassword || !newPassword || !confirmPassword) {
                    toast.error('Please fill in all password fields');
                    return;
                }
                if (newPassword !== confirmPassword) {
                    toast.error('New passwords do not match');
                    return;
                }

                await api.post('/users/change-password', {
                    oldPassword,
                    newPassword
                });

                toast.success('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Mock success for other tabs
                toast.success('Settings updated successfully!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update settings');
            console.error('Settings Update Error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Globe },
    ];

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white transition-colors">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage your account and platform preferences.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-500'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'profile' && (
                                <>
                                    <SectionTitle
                                        title="Profile Information"
                                        subtitle="Update your personal details and public information."
                                    />
                                    <SettingCard>
                                        <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-50 dark:border-gray-800">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                                                    {preview ? (
                                                        <img src={preview} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <User size={40} />
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl border-4 border-white hover:bg-primary-700 transition-colors shadow-lg"
                                                >
                                                    <Camera size={14} />
                                                </button>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">{user?.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">Administrator • Registered {new Date(user?.createdAt).toLocaleDateString()}</p>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                                                >
                                                    <Camera size={14} className="mr-2" />
                                                    Change Photo
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="tel"
                                                        placeholder="+1 (555) 000-0000"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SettingCard>
                                </>
                            )}

                            {activeTab === 'security' && (
                                <>
                                    <SectionTitle
                                        title="Password & Security"
                                        subtitle="Secure your account with multi-factor authentication."
                                    />
                                    <SettingCard>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-colors">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-primary-600 transition-colors">
                                                        <Shield size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 transition-colors">Two-factor Authentication</h4>
                                                        <p className="text-xs text-gray-500 mt-0.5">Protect your account with an extra layer of security.</p>
                                                    </div>
                                                </div>
                                                <Toggle enabled={twoFactor} setEnabled={setTwoFactor} />
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            value={oldPassword}
                                                            onChange={(e) => setOldPassword(e.target.value)}
                                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                                                        <input
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                                                        <input
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SettingCard>
                                </>
                            )}

                            {activeTab === 'appearance' && (
                                <>
                                    <SectionTitle
                                        title="Appearance"
                                        subtitle="Customize how LuxeGems Admin looks for you."
                                    />
                                    <SettingCard>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => toggleTheme('light')}
                                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${theme === 'light'
                                                    ? 'border-primary-600 bg-primary-50/50'
                                                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
                                                    }`}
                                            >
                                                <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                                    <Sun size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`font-bold ${theme === 'light' ? 'text-primary-900' : 'text-gray-900 dark:text-white'}`}>Light Mode</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Default clean interface</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => toggleTheme('dark')}
                                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${theme === 'dark'
                                                    ? 'border-primary-500 bg-primary-600/10 dark:bg-primary-500/10'
                                                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
                                                    }`}
                                            >
                                                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                                    <Moon size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`font-bold ${theme === 'dark' ? 'text-primary-500' : 'text-gray-900 dark:text-white'}`}>Dark Mode</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Easier on the eyes</p>
                                                </div>
                                            </button>
                                        </div>
                                    </SettingCard>
                                </>
                            )}

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => {
                                        setName(user.name);
                                        setEmail(user.email);
                                        setPhoneNumber(user.phoneNumber || '');
                                        setPreview(user.profilePicture);
                                        setProfilePicture(null);
                                    }}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-all font-display"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-8 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
