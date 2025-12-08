import { disableClient, enableClient, getClients, type Client } from '@/api/clientsApi'
import CreateApiKeyModal from '@/components/api-credentials/CreateApiKeyModal'
import SwitchToProductionModal from '@/components/modals/switchToProductionModal/SwitchToProductionModal'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { TableWithPagination, type TableColumn } from '@/components/ui/TableWithPagination'
import { useToast } from '@/hooks/use-toast'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { fetchOnboardingStatus } from '@/store/onboardingStore'
import { motion } from 'framer-motion'
import { Code, Copy, Eye, EyeOff, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ApiKey {
  id: string
  name: string
  clientId: string
  createdAt: string
  isEnabled: boolean
}

const ApiCredentialsPage = () => {
  const { toast } = useToast()
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSwitchToProductionModalOpen, setIsSwitchToProductionModalOpen] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)

  // Mock data for non-production environments
  const mockApiKeys: ApiKey[] = [

  ]

  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)

  // Format date from ISO string to display format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const year = String(date.getFullYear()).slice(-2)
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${month}/${day}/${year}  ${hours}:${minutes}:${seconds}`
    } catch {
      return dateString
    }
  }

  // Convert Client from API to ApiKey format
  const clientToApiKey = (client: Client): ApiKey => ({
    id: client.client_id,
    name: client.name,
    clientId: client.client_id,
    createdAt: formatDate(client.created_at),
    isEnabled: client.active,
  })

  // Fetch clients from API when in production
  useEffect(() => {
    if (isProduction) {
      const fetchClients = async () => {
        try {
          const clients = await getClients()
          setApiKeys(clients.map(clientToApiKey))
        } catch (error: any) {
          toast({
            title: 'Error',
            description: error?.response?.data?.detail || 'Failed to load API keys',
            variant: 'destructive',
          })
        }
      }
      fetchClients()
    } else {
      // Use mock data for non-production
      setApiKeys(mockApiKeys)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProduction])

  const toggleKeyVisibility = (keyId: string) => {
    if (!isProduction) {
      pendingActionRef.current = () => {
        setVisibleKeys((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(keyId)) {
            newSet.delete(keyId)
          } else {
            newSet.add(keyId)
          }
          return newSet
        })
      }
      setIsSwitchToProductionModalOpen(true)
      return
    }

    setVisibleKeys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string) => {
    if (!isProduction) {
      pendingActionRef.current = () => {
        navigator.clipboard.writeText(text)
        toast({
          title: 'Copied to clipboard',
          description: 'API key has been copied to your clipboard.',
        })
      }
      setIsSwitchToProductionModalOpen(true)
      return
    }

    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied to clipboard',
      description: 'API key has been copied to your clipboard.',
    })
  }

  const maskClientId = (_clientId: string) => {
    return '***********************'
  }

  const formatClientId = (key: ApiKey) => {
    if (visibleKeys.has(key.id)) {
      return key.clientId
    }
    return maskClientId(key.clientId)
  }

  const handleToggleKeyStatus = async (keyId: string, currentStatus: boolean) => {
    if (!isProduction) {
      pendingActionRef.current = async () => {
        // For non-production, just update local state
        setApiKeys((prev) =>
          prev.map((key) =>
            key.id === keyId ? { ...key, isEnabled: !currentStatus } : key
          )
        )
      }
      setIsSwitchToProductionModalOpen(true)
      return
    }

    // For production, call the API
    try {
      if (currentStatus) {
        await disableClient(keyId)
      } else {
        await enableClient(keyId)
      }
      // Update local state after successful API call
      setApiKeys((prev) =>
        prev.map((key) =>
          key.id === keyId ? { ...key, isEnabled: !currentStatus } : key
        )
      )
      toast({
        title: 'Success',
        description: `API key ${!currentStatus ? 'enabled' : 'disabled'} successfully`,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.detail || `Failed to ${!currentStatus ? 'enable' : 'disable'} API key`,
        variant: 'destructive',
      })
    }
  }

  const handleCreateApiKey = () => {
    if (!isProduction) {
      pendingActionRef.current = () => {
        setIsCreateModalOpen(true)
      }
      setIsSwitchToProductionModalOpen(true)
      return
    }

    setIsCreateModalOpen(true)
  }

  const handleCreateSuccess = async () => {
    if (isProduction) {
      // Refresh the API keys list from API
      try {
        const clients = await getClients()
        setApiKeys(clients.map(clientToApiKey))
        toast({
          title: 'Success',
          description: 'API key created successfully.',
        })
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error?.response?.data?.detail || 'Failed to refresh API keys list',
          variant: 'destructive',
        })
      }
    } else {
      toast({
        title: 'Success',
        description: 'API key created successfully.',
      })
    }
  }

  const columns: TableColumn<ApiKey>[] = [
    {
      key: 'name',
      header: 'API Key Name',
      width: '205px',
      render: (key) => (
        <span className="text-[14px] text-[#131b31] font-normal">{key.name}</span>
      ),
    },
    {
      key: 'clientId',
      header: 'Client ID',
      render: (key) => (
        <div className="flex items-center gap-4 w-full">
          <span className="text-[14px] text-[#9296a0] font-normal">{formatClientId(key)}</span>
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => toggleKeyVisibility(key.id)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              {visibleKeys.has(key.id) ? (
                <EyeOff className="w-4 h-4 text-[#9296a0]" />
              ) : (
                <Eye className="w-4 h-4 text-[#9296a0]" />
              )}
            </button>
            <button
              onClick={() => copyToClipboard(key.clientId)}
              className="border border-[#e7e8ea] border-solid rounded px-2 py-0.5 flex items-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <span className="text-[14px] text-[#9296a0] font-normal">copy</span>
              <Copy className="w-4 h-4 text-[#9296a0]" />
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created at',
      width: '201px',
      render: (key) => (
        <span className="text-[14px] text-[#9296a0] font-normal">{key.createdAt}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '193px',
      align: 'center',
      render: (key) => (
        <div className="flex items-center justify-center gap-1.5 w-full">
          <span
            className={`text-[14px] font-normal ${key.isEnabled ? 'text-[#3ac828]' : 'text-[#9296a0]'
              }`}
          >
            {key.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch
            checked={key.isEnabled}
            onCheckedChange={() => handleToggleKeyStatus(key.id, key.isEnabled)}
            className={`h-[21px] w-[45px] ${key.isEnabled
              ? 'data-[state=checked]:bg-[#3ac828] border-[#e7e8ea]'
              : 'bg-[#f7f7f8] border-[#e7e8ea]'
              }`}
          />
        </div>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-5 items-start p-6 relative rounded-2xl w-full"
    >
      {/* Header */}
      <div className="flex gap-5 items-start relative shrink-0 w-full">
        <div className="flex gap-2 items-center flex-1 min-w-0">
          <div className="overflow-hidden relative shrink-0 size-6">
            <Code className="w-6 h-6 text-[#131b31]" />
          </div>
          <h1 className="font-medium leading-[1.4] relative shrink-0 text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
            API Credentials
          </h1>
        </div>
        <Button
          onClick={handleCreateApiKey}
          className="bg-white border border-[#e7e8ea] border-solid rounded-lg px-4 py-3.5 h-auto hover:bg-gray-50"
        >
          <span className="font-medium leading-[1.4] text-[12px] text-[#616675] tracking-[-0.12px] mr-2">
            Create API Key
          </span>
          <Plus className="w-4 h-4 text-[#616675] rotate-90" />
        </Button>
      </div>

      {/* API Keys Section */}
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 w-full">
        <div className="flex flex-col gap-5 items-start overflow-hidden p-6 relative rounded-[inherit] w-full">
          {/* Section Header */}
          <div className="border-b border-[#c8cacf] border-solid flex flex-col gap-2 items-start pb-2 relative shrink-0 w-full">
            <h2 className="font-bold leading-[20px] relative shrink-0 text-[14px] text-[#616675] tracking-[-0.14px] w-full">
              API Keys
            </h2>
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Manage your API keys to authenticate requests and securely access your account data. You can create multiple keys with different scopes and permissions for your integrations.
            </p>
          </div>

          {/* API Keys Table */}
          <TableWithPagination
            data={apiKeys}
            columns={columns}
            itemsPerPage={10}
            className="w-full items-start"
            emptyMessage="No API keys available"
          />
        </div>
      </div>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Switch to Production Modal */}
      <SwitchToProductionModal
        isOpen={isSwitchToProductionModalOpen}
        onClose={() => {
          setIsSwitchToProductionModalOpen(false)
          pendingActionRef.current = null
        }}
        onConfirm={async () => {
          // Refresh onboarding status to check if user is now in production
          try {
            const updatedStatus = await fetchOnboardingStatus()
            // Only execute the pending action if user is now in production
            if (updatedStatus?.is_onboarded && pendingActionRef.current) {
              pendingActionRef.current()
            }
          } catch (error) {
            // If refresh fails, still try to execute the action
            // The action handlers will check isProduction themselves
            if (pendingActionRef.current) {
              pendingActionRef.current()
            }
          } finally {
            pendingActionRef.current = null
            setIsSwitchToProductionModalOpen(false)
          }
        }}
      />
    </motion.div>
  )
}

export default ApiCredentialsPage

