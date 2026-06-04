import { createBrowserRouter } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

import DashboardPage from '../pages/DashboardPage';
import CreateTicketPage from '../pages/CreateTicketPage';
import TicketDetailsPage from '../pages/TicketDetailsPage';
import EditTicketPage from '../pages/EditTicketPage';
import Profile from '../pages/Profile';

import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'tickets/create',
        element: <CreateTicketPage />,
      },
      {
        path: 'tickets/:id',
        element: <TicketDetailsPage />,
      },
      {
        path: 'tickets/:id/edit',
        element: <EditTicketPage />,
      },
    ],
  },

  // PUBLIC ROUTES
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);