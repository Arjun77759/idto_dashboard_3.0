import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Settings2, Bell, Shield, Palette, Save } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from '@/contexts/ThemeContext'

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
}

interface PrivacySettings {
  profileVisibility: string
  dataSharing: boolean
}

interface PreferenceSettings {
  theme: string
  language: string
}

interface SettingsState {
  notifications: NotificationSettings
  privacy: PrivacySettings
  preferences: PreferenceSettings
}

const SettingsPage = () => {
  const { toast } = useToast()
  const { theme: currentTheme, setTheme } = useTheme()
  
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false
    },
    preferences: {
      theme: currentTheme,
      language: 'en'
    }
  })

  const [isSaving, setIsSaving] = useState(false)

  // Sync with current theme on mount
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: currentTheme
      }
    }))
  }, [currentTheme])

  const handleSettingChange = (category: keyof SettingsState, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    
    // Apply theme immediately for preview
    if (category === 'preferences' && key === 'theme') {
      setTheme(value as 'light' | 'dark' | 'auto')
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    
    // Apply theme to the app
    setTheme(settings.preferences.theme as 'light' | 'dark' | 'auto')
    
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start p-4 sm:p-6 relative rounded-2xl w-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 items-start px-3 py-1.5 relative rounded shrink-0 w-full">
        <div className="flex gap-2 items-center">
          <Settings2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#131b31]" />
          <h1 className="font-medium leading-[1.4] relative shrink-0 text-lg sm:text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
            Settings
          </h1>
        </div>
        <p className="text-[12px] text-[#616675] leading-[1.4] tracking-[-0.12px]">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-[#e7e8ea] border-solid flex flex-col gap-4 items-start p-6 relative rounded-2xl shrink-0 w-full">
        <div className="flex gap-2 items-center">
          <Bell className="size-5 text-[#0019ff]" />
          <h3 className="font-medium leading-[1.4] text-[16px] text-[#131b31] tracking-[-0.16px]">
            Notification Settings
          </h3>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', description: 'Receive push notifications in browser' },
            { key: 'sms', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between py-3 border-b border-[#e7e8ea] last:border-b-0"
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium leading-[1.4] text-[13px] text-[#131b31] tracking-[-0.13px]">
                  {setting.label}
                </p>
                <p className="text-[12px] text-[#616675] leading-[1.4] tracking-[-0.12px]">
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={settings.notifications[setting.key as keyof NotificationSettings]}
                onCheckedChange={(checked) => handleSettingChange('notifications', setting.key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white border border-[#e7e8ea] border-solid flex flex-col gap-4 items-start p-6 relative rounded-2xl shrink-0 w-full">
        <div className="flex gap-2 items-center">
          <Shield className="size-5 text-[#00a370]" />
          <h3 className="font-medium leading-[1.4] text-[16px] text-[#131b31] tracking-[-0.16px]">
            Privacy Settings
          </h3>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label className="font-medium leading-[1.4] text-[13px] text-[#131b31] tracking-[-0.13px]">
              Profile Visibility
            </label>
            <Select
              value={settings.privacy.profileVisibility}
              onValueChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
            >
              <SelectTrigger className="w-full max-w-sm border-[#e7e8ea] h-10 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public" className="text-[12px]">Public</SelectItem>
                <SelectItem value="private" className="text-[12px]">Private</SelectItem>
                <SelectItem value="friends" className="text-[12px]">Friends Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between py-3 border-t border-[#e7e8ea]">
            <div className="flex flex-col gap-1">
              <p className="font-medium leading-[1.4] text-[13px] text-[#131b31] tracking-[-0.13px]">
                Data Sharing
              </p>
              <p className="text-[12px] text-[#616675] leading-[1.4] tracking-[-0.12px]">
                Allow sharing of analytics data with third parties
              </p>
            </div>
            <Switch
              checked={settings.privacy.dataSharing}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'dataSharing', checked)}
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-[#e7e8ea] border-solid flex flex-col gap-4 items-start p-6 relative rounded-2xl shrink-0 w-full">
        <div className="flex gap-2 items-center">
          <Palette className="size-5 text-[#ff6b00]" />
          <h3 className="font-medium leading-[1.4] text-[16px] text-[#131b31] tracking-[-0.16px]">
            Preferences
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2">
            <label className="font-medium leading-[1.4] text-[13px] text-[#131b31] tracking-[-0.13px]">
              Theme
            </label>
            <Select
              value={settings.preferences.theme}
              onValueChange={(value) => handleSettingChange('preferences', 'theme', value)}
            >
              <SelectTrigger className="w-full border-[#e7e8ea] h-10 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light" className="text-[12px]">Light</SelectItem>
                <SelectItem value="dark" className="text-[12px]">Dark</SelectItem>
                <SelectItem value="auto" className="text-[12px]">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-medium leading-[1.4] text-[13px] text-[#131b31] tracking-[-0.13px]">
              Language
            </label>
            <Select
              value={settings.preferences.language}
              onValueChange={(value) => handleSettingChange('preferences', 'language', value)}
            >
              <SelectTrigger className="w-full border-[#e7e8ea] h-10 text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en" className="text-[12px]">English</SelectItem>
                <SelectItem value="es" className="text-[12px]">Spanish</SelectItem>
                <SelectItem value="fr" className="text-[12px]">French</SelectItem>
                <SelectItem value="de" className="text-[12px]">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 w-full">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#0019ff] to-[#0019ff] hover:from-[#0015cc] hover:to-[#0015cc] text-white border-0 px-6 py-2 h-10 rounded-lg"
        >
          <Save className="size-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </motion.div>
  )
}

export default SettingsPage
