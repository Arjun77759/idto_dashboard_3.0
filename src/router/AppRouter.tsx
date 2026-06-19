import { useIsMobile } from '@/hooks/use-mobile'
import CreatePassword from '@/pages/CreatePassword'
import KYCCallbackPage from '@/pages/KYCCallbackPage'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import PrivateLayout from '../layouts/PrivateLayout'
import PublicLayout from '../layouts/PublicLayout'
import AnalyticsPage from '../pages/AnalyticsPage'
import ApiCredentialsPage from '../pages/ApiCredentialsPage'
import ApiTestingPage from '../pages/ApiTestingPage'
import BillingPage from '../pages/BillingPage'
import BusinessProfilePage from '../pages/BusinessProfilePage'
import BusinessTypePage from '../pages/BusinessTypePage'
import CheckInboxPage from '../pages/CheckInboxPage'
import ConfirmNumberPage from '../pages/ConfirmNumberPage'
import DashboardPage from '../pages/DashboardPage'
import ForgetPasswordPage from '../pages/ForgetPasswordPage'
import GoogleConnectingPage from '../pages/GoogleConnectingPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import MobileProductionRedirectPage from '../pages/MobileProductionRedirectPage'
import PostSignupInfoPage from '../pages/PostSignupInfoPage'
import RegisterPage from '../pages/RegisterPage'
import ResetPasswordCheckInboxPage from '../pages/ResetPasswordCheckInboxPage'
import SandboxReadyPage from '../pages/SandboxReadyPage'
import SettingsPage from '../pages/SettingsPage'
import SwitchToProductionMobilePage from '../pages/SwitchToProductionMobilePage'
import SwitchToProductionMobileStepPage from '../pages/SwitchToProductionMobileStepPage'
import TransactionDetailPage from '../pages/TransactionDetailPage'
import TransactionsPage from '../pages/TransactionsPage'
import UsersPage from '../pages/UsersPage'
import WorkspaceProfilePage from '../pages/WorkspaceProfilePage'
import WorkspaceSetupPage from '../pages/WorkspaceSetupPage'

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
    path: 'signup',
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
    path: 'google-connecting',
    element: <GoogleConnectingPage />
  },
  {
    path: 'confirm-number',
    element: <ConfirmNumberPage />
  },
  {
    path: 'workspace-profile',
    element: <WorkspaceProfilePage />
  },
  {
    path: 'business-profile',
    element: <BusinessProfilePage />
  },
  {
    path: 'business-type',
    element: <BusinessTypePage />
  },
  {
    path: 'sandbox-ready',
    element: <SandboxReadyPage />
  },
  {
    path: 'workspace-setup',
    element: <WorkspaceSetupPage />
  },
  {
    path: 'kyc-callback',
    element: <KYCCallbackPage />
  },
  {
    path: 'forgot-password',
    element: <ForgetPasswordPage />
  },
  {
    path: 'reset-password-check-inbox',
    element: <ResetPasswordCheckInboxPage />
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

const apiCredentialsRoutes = [
  {
    index: true,
    element: <ApiCredentialsPage />
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

// Only enable '/mobile-production-redirect' for mobile; all other routes for non-mobile
const AppRouter = () => {
  const isMobile = useIsMobile()

  // If mobile, only allow '/mobile-production-redirect'
  const mobileOnlyRouter = createBrowserRouter([
    {
      path: '/post-signup-info',
      element: <PostSignupInfoPage />
    },
    {
      path: '/switch-to-production-mobile',
      element: <SwitchToProductionMobilePage />
    },
    {
      path: '/switch-to-production-mobile/:step',
      element: <SwitchToProductionMobileStepPage />
    },
    {
      path: '/mobile-production-redirect',
      element: <MobileProductionRedirectPage />
    },
    {
      path: '*',
      element: <Navigate to="/mobile-production-redirect" replace />
    }
  ])

  // Default full set of routes for non-mobile
  const defaultRouter = createBrowserRouter([
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
      path: '/api-credentials',
      element: <PrivateLayout />,
      children: apiCredentialsRoutes,
    },
    {
      path: '/transactions',
      element: <PrivateLayout />,
      children: transactionsRoutes,
    },
    {
      path: '/post-signup-info',
      element: <PostSignupInfoPage />
    },
    {
      path: '/switch-to-production-mobile',
      element: <SwitchToProductionMobilePage />
    },
    {
      path: '/switch-to-production-mobile/:step',
      element: <SwitchToProductionMobileStepPage />
    },
    {
      path: '/mobile-production-redirect',
      element: <MobileProductionRedirectPage />
    }
  ])

  return <RouterProvider router={defaultRouter} />
}

export default AppRouter
