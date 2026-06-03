import { createBrowserRouter } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CreateTicketPage from '../pages/CreateTicketPage';
import TicketDetailsPage from '../pages/TicketDetailsPage';
import EditTicketPage from '../pages/EditTicketPage';

import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/tickets/create',
    element: (
      <ProtectedRoute>
        <CreateTicketPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/tickets/:id',
    element: (
      <ProtectedRoute>
        <TicketDetailsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/tickets/:id/edit',
    element: (
      <ProtectedRoute>
        <EditTicketPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/auth/login',
    element: <LoginPage />,
  },

  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
]);