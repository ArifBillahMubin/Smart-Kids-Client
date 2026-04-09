import React from 'react';
import useAuth from '../hooks/useAuth';
import { useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return <Navigate state={{ from: location }} to='/login' replace></Navigate>
    }
    return children;
};

export default PrivateRoute;