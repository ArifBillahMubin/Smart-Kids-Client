import { Outlet } from 'react-router';
import Navbar from '../pages/shared/navbar/Navbar';
import Footer from '../pages/shared/footer/Footer';
import FAB from '../components/FAB';
import PageTransition from '../components/PageTransition';
import ChatBot from '../components/ChatBot';

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <Footer />
            <FAB />
            <ChatBot />
        </div>
    );
};

export default RootLayout;
