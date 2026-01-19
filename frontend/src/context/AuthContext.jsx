import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await axios.get('https://e-learning-management-system-j748.onrender.com/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser({ ...data, token });
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('https://e-learning-management-system-j748.onrender.com/api/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const register = async (name, email, password, role) => {
        const { data } = await axios.post('https://e-learning-management-system-j748.onrender.com/api/auth/register', { name, email, password, role });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
