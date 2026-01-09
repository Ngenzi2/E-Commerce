import {createContext, useState, useContext, useEffect} from "react";
import { AuthAPI } from "../../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
        if(storedToken){
            try{
                const response = await AuthAPI.getUser();
                setUser(response.data);
                setToken(storedToken);

            }
            catch(error){
                localStorage.removeItem("token");

            }

        }
        setLoading(false);

        };
        initAuth();

        
    }, []);

    const login = async (credentials) => {
        try{
            const response = await AuthAPI.login(credentials);
            const {token, ...userData} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);
            return {success: true}
        }
        catch(error){
            return {success: false, message: error.response?.data?.message || 'Login failed'};
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        token,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!token,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};

