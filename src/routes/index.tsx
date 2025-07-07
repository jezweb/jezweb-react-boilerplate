import { RouteObject } from 'react-router';
import { lazy } from 'react';
import { AuthGuard } from '../guards/AuthGuard';
import { GuestGuard } from '../guards/GuestGuard';
import { HomePage } from '../modules/public/pages/HomePage';
import { AboutPage } from '../modules/public/pages/AboutPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';

const PublicModule = lazy(() => import('../modules/public'));
const AuthModule = lazy(() => import('../modules/auth'));
const DashboardModule = lazy(() => import('../modules/dashboard'));
const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../modules/auth/pages/RegisterPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicModule />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <GuestGuard><AuthModule /></GuestGuard>,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <GuestGuard><AuthModule /></GuestGuard>,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/register',
    element: <GuestGuard><AuthModule /></GuestGuard>,
    children: [
      {
        index: true,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <AuthGuard><DashboardModule /></AuthGuard>,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
];