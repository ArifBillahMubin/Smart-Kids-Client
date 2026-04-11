import { Outlet } from 'react-router';
import Navbar from '../pages/shared/navbar/Navbar';
import Footer from '../pages/shared/footer/Footer';
import FAB from '../components/FAB';
import PageTransition from '../components/PageTransition';

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar — full width, sticky */}
            <div className="sticky top-0 z-50">
                <div className="max-w-7xl mx-auto">
                    <Navbar />
                </div>
            </div>

            {/* Page content — full width for banner, sections handle their own max-w */}
            <main className="flex-1">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>

            <div className="max-w-7xl mx-auto w-full">
                <Footer />
            </div>
            <FAB />
        </div>
    );
};

export default RootLayout;
