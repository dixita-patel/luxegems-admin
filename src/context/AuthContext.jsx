import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            try {
                const response = await api.get('/users/profile');
                if (response.data.role === 'admin' || response.data.role === 'user') { // Allowing 'user' for dev testing
                    setUser(response.data);
                } else {
                    logout();
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/admin/login', { email, password });
        const { access_token, user } = response.data;

        // In production, strictly check user.role === 'admin'
        localStorage.setItem('admin_token', access_token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
