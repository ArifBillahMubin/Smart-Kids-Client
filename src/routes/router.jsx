import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/DashboardLayout";
import PrivateRoute from "../components/PrivateRoute";
import Home from "../pages/home/home/Home";
import Resister from "../pages/auth/resister/Resister";
import Login from "../pages/auth/login/Login";
import Courses from "../pages/courses/Courses";
import CourseDetails from "../pages/courses/CourseDetails";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import NotFound from "../pages/NotFound";

// Guardian pages
import GuardianOverview from "../pages/dashboard/guardian/overview/Overview";
import ChildProgress from "../pages/dashboard/guardian/child/ChildProgress";
import MyCourses from "../pages/dashboard/guardian/courses/MyCourses";
import MyClass from "../pages/myclass/MyClass";
import GuardianReports from "../pages/dashboard/guardian/reports/Reports";
import GuardianProfile from "../pages/dashboard/guardian/profile/Profile";

// Admin pages
import AdminOverview from "../pages/dashboard/admin/overview/AdminOverview";
import ManageUsers from "../pages/dashboard/admin/users/ManageUsers";
import ManageCourses from "../pages/dashboard/admin/courses/ManageCourses";
import CourseManager from "../pages/dashboard/admin/courses/CourseManager";
import AdminReports from "../pages/dashboard/admin/reports/AdminReports";

const protect = (el) => <PrivateRoute>{el}</PrivateRoute>;

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            { path: 'courses', Component: Courses },
            { path: 'courses/:id', Component: CourseDetails },
            { path: 'my-class', Component: MyClass },
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            { path: 'register', Component: Resister },
            { path: 'login', Component: Login },
        ]
    },
    // Guardian Dashboard — protected
    {
        path: '/dashboard',
        element: protect(<DashboardLayout />),
        children: [
            { index: true, Component: GuardianOverview },
            { path: 'child-progress', Component: ChildProgress },
            { path: 'my-courses', Component: MyCourses },
            { path: 'my-courses/:courseId/class', Component: MyClass },
            { path: 'reports', Component: GuardianReports },
            { path: 'profile', Component: GuardianProfile },
        ]
    },
    // Admin Dashboard — protected
    {
        path: '/admin',
        element: protect(<DashboardLayout />),
        children: [
            { index: true, Component: AdminOverview },
            { path: 'users', Component: ManageUsers },
            { path: 'courses', Component: ManageCourses },
            { path: 'courses/:id/manage', Component: CourseManager },
            { path: 'reports', Component: AdminReports },
        ]
    },
    { path: '/payment-success', Component: PaymentSuccess },
    { path: '*', Component: NotFound },
]);
