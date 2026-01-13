import {createContext, useState, useContext, useEffect, useMemo, useCallback} from "react";
import { AuthAPI } from "../../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    // Fetch all users on initial mount
    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = useCallback(async () => {
        try {
            const response = await AuthAPI.getAllUsers();
            const allUsers = response.data.users || response.data;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            setUsers(allUsers);
            console.log('All users fetched and stored in localStorage:', allUsers.length);
        } catch (error) {
            console.error('Error fetching all users:', error);
            // Try to load from localStorage if fetch fails
            const storedUsers = localStorage.getItem('allUsers');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
                console.log('Loaded users from localStorage');
            }
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");
                
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    console.log('Auth: Loaded from localStorage');
                } else if (storedToken) {
                    setToken(storedToken);
                    try {
                        const response = await AuthAPI.getUser();
                        setUser(response.data);
                    } catch (error) {
                        // Token is invalid, clear it
                        console.error('Token validation failed:', error);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setToken(null);
                        setUser(null);
                    }
                } else {
                    // No token or user
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };
        
        initAuth();
    }, []);

    const login = useCallback(async (credentials) => {
        try{
            console.log('AuthContext: Attempting login with:', { username: credentials.username });
            const response = await AuthAPI.login(credentials);
            console.log('AuthContext: Login response received:', { 
              hasToken: !!response.data.token,
              hasUser: !!response.data.user,
              keys: Object.keys(response.data)
            });
            
            const {token, ...userData} = response.data;
            
            console.log('AuthContext: Token:', token ? 'exists' : 'missing');
            console.log('AuthContext: User data:', userData);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);
            
            console.log('AuthContext: State updated, isAuthenticated should be:', !!token);
            return {success: true}
        }
        catch(error){
            console.error('AuthContext: Login error:', error.response?.data || error.message);
            return {success: false, message: error.response?.data?.message || 'Login failed'};
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
        users,
        fetchAllUsers,
    }), [user, token, loading, login, logout, users, fetchAllUsers]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};

