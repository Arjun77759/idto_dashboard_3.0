import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Edit, Copy, Check } from 'lucide-react'
import { createClient } from '@/api/clientsApi'
import { useToast } from '@/hooks/use-toast'

interface CreateApiKeyModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateApiKeyModal = ({ open, onClose, onSuccess }: CreateApiKeyModalProps) => {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [apiVersion, setApiVersion] = useState('2025-10-27')
  const [isLoading, setIsLoading] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState<{
    client_id: string
    client_secret: string
    name: string
  } | null>(null)
  const [copiedField, setCopiedField] = useState<'client_id' | 'client_secret' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name is required',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await createClient(name.trim())
      
      // Store credentials to show in modal
      setCreatedCredentials({
        client_id: response.client_id,
        client_secret: response.client_secret,
        name: response.name,
      })

      // Don't close modal yet - show credentials
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.detail || 'Failed to create API key',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string, field: 'client_id' | 'client_secret') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast({
        title: 'Copied',
        description: `${field === 'client_id' ? 'Client ID' : 'Client Secret'} copied to clipboard`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const handleDone = () => {
    setCreatedCredentials(null)
    setName('')
    setApiVersion('2025-10-27')
    setCopiedField(null)
    onSuccess()
    onClose()
  }

  const handleCancel = () => {
    if (createdCredentials) {
      // If credentials are shown, reset to form
      setCreatedCredentials(null)
      setName('')
      setApiVersion('2025-10-27')
      setCopiedField(null)
    } else {
      // Otherwise close modal
      setName('')
      setApiVersion('2025-10-27')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px] p-4 gap-4 border-[#e7e8ea] rounded-lg">
        <DialogHeader className="gap-0 pb-0">
          <DialogTitle className="text-[20px] font-medium leading-[1.4] text-[#131b31] tracking-[-0.2px]">
            {createdCredentials ? 'API Key Created' : 'Create API Key'}
          </DialogTitle>
        </DialogHeader>

        {createdCredentials ? (
          // Show credentials after creation
          <div className="flex flex-col gap-4">
            <div className="bg-[#f7f7f8] border border-[#e7e8ea] rounded-lg p-4 space-y-4">
              <p className="text-[12px] font-normal leading-[1.4] text-[#9296a0] tracking-[-0.12px]">
                Your API key has been created. Please copy these credentials and store them securely. 
                You won't be able to see the client secret again.
              </p>

              {/* Client ID */}
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-normal leading-[1.4] text-[#9296a0] tracking-[-0.12px]">
                  Client ID
                </label>
                <div className="flex items-center gap-2 bg-white border border-[#e7e8ea] rounded-lg px-4 py-2.5">
                  <span className="flex-1 text-[12px] font-normal text-[#131b31] font-mono break-all">
                    {createdCredentials.client_id}
                  </span>
                  <button
                    onClick={() => handleCopy(createdCredentials.client_id, 'client_id')}
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-50 transition-colors"
                  >
                    {copiedField === 'client_id' ? (
                      <Check className="w-4 h-4 text-[#3ac828]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#9296a0]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Client Secret */}
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-normal leading-[1.4] text-[#9296a0] tracking-[-0.12px]">
                  API KEY
                </label>
                <div className="flex items-center gap-2 bg-white border border-[#e7e8ea] rounded-lg px-4 py-2.5">
                  <span className="flex-1 text-[12px] font-normal text-[#131b31] font-mono break-all">
                    {createdCredentials.client_secret}
                  </span>
                  <button
                    onClick={() => handleCopy(createdCredentials.client_secret, 'client_secret')}
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-50 transition-colors"
                  >
                    {copiedField === 'client_secret' ? (
                      <Check className="w-4 h-4 text-[#3ac828]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#9296a0]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleDone}
                className="bg-[#e6e8ff] border border-[#e7e8ea] text-[#0019ff] hover:bg-[#d0d4ff] h-auto px-4 py-3.5 rounded-lg font-medium text-[12px] leading-[1.4] tracking-[-0.12px]"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          // Show form for creating API key
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Field */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[12px] font-normal leading-[1.4] text-[#9296a0] tracking-[-0.12px]">
                Name (required)
              </label>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 px-4 py-2 text-[12px] text-[#616675] border-[#e7e8ea] rounded-lg bg-white"
                disabled={isLoading}
              />
            </div>

            {/* API Version Field */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[12px] font-normal leading-[1.4] text-[#9296a0] tracking-[-0.12px]">
                API Version
              </label>
              <Select value={apiVersion} onValueChange={setApiVersion} disabled={isLoading}>
                <SelectTrigger className="h-10 px-4 py-2 text-[12px] text-[#616675] border-[#e7e8ea] rounded-lg bg-white">
                  <SelectValue>
                    <span className="text-[12px] text-[#616675]">2025 - 10 - 27 (Latest)</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-10-27">2025 - 10 - 27 (Latest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-start pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-[#f7f7f8] border-[#e7e8ea] text-[#9296a0] hover:bg-gray-50 h-auto px-2 py-3.5 rounded-lg w-[146px] font-medium text-[12px] leading-[1.4] tracking-[-0.12px]"
              >
                <span className="mr-2">Cancel</span>
                <X className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex-1 bg-[#e6e8ff] border border-[#e7e8ea] text-[#0019ff] hover:bg-[#d0d4ff] h-auto px-2 py-3.5 rounded-lg font-medium text-[12px] leading-[1.4] tracking-[-0.12px]"
              >
                <span className="mr-2">Create</span>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreateApiKeyModal

