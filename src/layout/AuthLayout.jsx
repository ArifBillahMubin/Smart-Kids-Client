import React from 'react';
import logo from '../assets/SmartKids_logo_final.png'
import { NavLink, Outlet } from 'react-router';
import Footer from '../pages/shared/footer/Footer';

const AuthLayout = () => {

    return (
        <div className='max-w-7xl mx-auto'>
            <NavLink to="/"><img src={logo} alt="SmartKids Logo" className='w-36'/></NavLink>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;