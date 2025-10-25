import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PrivateLayout from '../layouts/PrivateLayout'
import PublicLayout from '../layouts/PublicLayout'
import AnalyticsPage from '../pages/AnalyticsPage'
import ApiTestingPage from '../pages/ApiTestingPage'
import BillingPage from '../pages/BillingPage'
import DashboardPage from '../pages/DashboardPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import SettingsPage from '../pages/SettingsPage'
import TransactionDetailPage from '../pages/TransactionDetailPage'
import TransactionsPage from '../pages/TransactionsPage'
import UsersPage from '../pages/UsersPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  },
  {
    path: '/billing',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <BillingPage />
      },
    ]
  },
  {
    path: '/analytics',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <AnalyticsPage />
      },
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'users',
        element: <UsersPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  {
    path: '/api-testing',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <ApiTestingPage />
      }
    ]
  },
  {
    path: '/transactions',
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <TransactionsPage />
      },
      {
        path: ':id',
        element: <TransactionDetailPage />
      }
    ]
  }
])

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
