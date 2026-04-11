import { Outlet } from 'react-router';
import PageTransition from '../components/PageTransition';

const AuthLayout = () => {
    return (
        <PageTransition>
            <Outlet />
        </PageTransition>
    );
};

export default AuthLayout;
