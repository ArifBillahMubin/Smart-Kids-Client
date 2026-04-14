import { Navigate, useLocation } from 'react-router';
import { TbFidgetSpinner } from 'react-icons/tb';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <TbFidgetSpinner className="animate-spin text-primary text-4xl" />
        </div>
    );

    if (!user) return <Navigate to="/login" state={location.pathname} replace />;

    return children;
};

export default PrivateRoute;
