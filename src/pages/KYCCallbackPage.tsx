import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { updateDirectorKYC } from '@/api/onboardingApi'
import { invalidateOnboardingStatus } from '@/store/onboardingStore'
import { invalidateOnboardingSteps } from '@/store/onboardingStepsStore'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const KYCCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // DigiLocker may return codeVerifier (camelCase) or code_verifier (snake_case)
    const code = searchParams.get('code')
    const codeVerifier = searchParams.get('code_verifier') || searchParams.get('codeVerifier')

    // Check for error in URL params (DigiLocker might redirect with error)
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
      setStatus('error')
      setErrorMessage(
        errorDescription || 
        error || 
        'DigiLocker authentication was cancelled or failed. Please try again.'
      )
      return
    }

    if (!code || !codeVerifier) {
      setStatus('error')
      setErrorMessage('Missing authorization code or code verifier from DigiLocker. Please try again.')
      return
    }

    const handleCallback = async () => {
      try {
        await updateDirectorKYC({
          code,
          code_verifier: codeVerifier
        })
        
        // Invalidate both stores so they refetch with updated data
        invalidateOnboardingStatus()
        invalidateOnboardingSteps()
        
        setStatus('success')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } catch (err: any) {
        console.error('DigiLocker callback error:', err)
        setStatus('error')
        setErrorMessage(
          err?.response?.data?.message || 
          err?.response?.data?.detail || 
          err?.message || 
          'Failed to complete DigiLocker verification. Please try again.'
        )
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f8] p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Verification</h2>
            <p className="text-gray-600">Please wait while we complete your DigiLocker verification...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h2>
            <p className="text-gray-600 mb-4">Your DigiLocker verification has been completed successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default KYCCallbackPage

