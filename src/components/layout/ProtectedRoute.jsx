import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/contexts/AuthContext';
import { CircularProgress, Box} from '@mui/material';

const ProtectedRoute = ({ children }) =>{
    const { loading } = useAuth();
    const token = localStorage.getItem('token');

    if (loading){
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

export default ProtectedRoute;


