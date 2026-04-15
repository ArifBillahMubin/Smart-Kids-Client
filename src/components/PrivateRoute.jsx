import { useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { getUserByEmail } from '../utils';
import PinModal from './PinModal';
import { useApp } from '../context/AppContext';

const PIN_SESSION_KEY = 'sk-pin-verified';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { lang } = useApp();
    const location = useLocation();
    const [role, isRoleLoading] = useRole();
    const [pinVerified, setPinVerified] = useState(
        () => sessionStorage.getItem(PIN_SESSION_KEY) === 'true'
    );

    const { data: dbUser, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: () => getUserByEmail(user.email),
        enabled: !!user?.email,
        staleTime: 5 * 60 * 1000,
    });

    if (loading || isRoleLoading || isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <TbFidgetSpinner className="animate-spin text-primary text-4xl" />
        </div>
    );

    if (!user) return <Navigate to="/login" state={location.pathname} replace />;

    const hasPin = !!dbUser?.dashboardPin;

    if (hasPin && !pinVerified) {
        return (
            <PinModal
                userName={dbUser?.name || user.displayName}
                onSuccess={(entered) => {
                    if (entered === dbUser.dashboardPin) {
                        sessionStorage.setItem(PIN_SESSION_KEY, 'true');
                        setPinVerified(true);
                    } else {
                        toast.error(lang === 'bn' ? 'ভুল PIN! আবার চেষ্টা করুন।' : 'Wrong PIN! Try again.');
                    }
                }}
                onCancel={() => window.history.back()}
            />
        );
    }

    return children;
};

export default PrivateRoute;
