import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import PrivateLayout from '../layouts/PrivateLayout'
import PublicLayout from '../layouts/PublicLayout'
import AnalyticsPage from '../pages/AnalyticsPage'
import ApiTestingPage from '../pages/ApiTestingPage'
import BillingPage from '../pages/BillingPage'
import DashboardPage from '../pages/DashboardPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import CheckInboxPage from '../pages/CheckInboxPage'
import SettingsPage from '../pages/SettingsPage'
import TransactionDetailPage from '../pages/TransactionDetailPage'
import TransactionsPage from '../pages/TransactionsPage'
import UsersPage from '../pages/UsersPage'
import CreatePassword from '@/pages/CreatePassword'
import KYCCallbackPage from '@/pages/KYCCallbackPage'

// Refactored route configuration for better readability and maintainability
const publicRoutes = [
  {
    index: true,
    element: <Navigate to="/login" replace />
  },
  {
    path: 'home',
    element: <HomePage />
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'register',
    element: <RegisterPage />
  },
  {
    path: 'check-inbox',
    element: <CheckInboxPage />
  },
  {
    path: 'create-password',
    element: <CreatePassword />
  },
  {
    path: 'kyc-callback',
    element: <KYCCallbackPage />
  }
]

const billingRoutes = [
  {
    index: true,
    element: <BillingPage />
  }
]

const analyticsRoutes = [
  {
    index: true,
    element: <AnalyticsPage />
  }
]

const dashboardRoutes = [
  {
    index: true,
    element: <DashboardPage />
  }
]

const usersRoutes = [
  {
    index: true,
    element: <UsersPage />
  }
]

const settingsRoutes = [
  {
    index: true,
    element: <SettingsPage />
  }
]

const apiTestingRoutes = [
  {
    index: true,
    element: <ApiTestingPage />
  }
]

const transactionsRoutes = [
  {
    index: true,
    element: <TransactionsPage />
  },
  {
    path: ':id',
    element: <TransactionDetailPage />
  }
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: publicRoutes,
  },
  {
    path: '/billing',
    element: <PrivateLayout />,
    children: billingRoutes,
  },
  {
    path: '/analytics',
    element: <PrivateLayout />,
    children: analyticsRoutes,
  },
  {
    path: '/dashboard',
    element: <PrivateLayout />,
    children: dashboardRoutes,
  },
  {
    path: '/users',
    element: <PrivateLayout />,
    children: usersRoutes,
  },
  {
    path: '/settings',
    element: <PrivateLayout />,
    children: settingsRoutes,
  },
  {
    path: '/api-testing',
    element: <PrivateLayout />,
    children: apiTestingRoutes,
  },
  {
    path: '/transactions',
    element: <PrivateLayout />,
    children: transactionsRoutes,
  }
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
