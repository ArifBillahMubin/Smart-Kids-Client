import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/home/home/Home";
import Resister from "../pages/auth/resister/Resister";
import Login from "../pages/auth/login/Login";
import Courses from "../pages/courses/Courses";
import CourseDetails from "../pages/courses/CourseDetails";
import PaymentSuccess from "../pages/payment/PaymentSuccess";

// Guardian pages
import GuardianOverview from "../pages/dashboard/guardian/overview/Overview";
import ChildProgress from "../pages/dashboard/guardian/child/ChildProgress";
import MyCourses from "../pages/dashboard/guardian/courses/MyCourses";
import GuardianReports from "../pages/dashboard/guardian/reports/Reports";
import GuardianProfile from "../pages/dashboard/guardian/profile/Profile";

// Admin pages
import AdminOverview from "../pages/dashboard/admin/overview/AdminOverview";
import ManageUsers from "../pages/dashboard/admin/users/ManageUsers";
import ManageCourses from "../pages/dashboard/admin/courses/ManageCourses";
import AdminReports from "../pages/dashboard/admin/reports/AdminReports";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            { path: 'courses', Component: Courses },
            { path: 'courses/:id', Component: CourseDetails },
        ]
    },
    // Standalone — no navbar/footer, handles Stripe redirect
    {
        path: '/payment-success',
        Component: PaymentSuccess,
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            { path: 'register', Component: Resister },
            { path: 'login', Component: Login },
        ]
    },
    {
        path: '/dashboard',
        Component: DashboardLayout,
        children: [
            { index: true, Component: GuardianOverview },
            { path: 'child-progress', Component: ChildProgress },
            { path: 'my-courses', Component: MyCourses },
            { path: 'reports', Component: GuardianReports },
            { path: 'profile', Component: GuardianProfile },
        ]
    },
    {
        path: '/admin',
        Component: DashboardLayout,
        children: [
            { index: true, Component: AdminOverview },
            { path: 'users', Component: ManageUsers },
            { path: 'courses', Component: ManageCourses },
            { path: 'reports', Component: AdminReports },
        ]
    },
]);
