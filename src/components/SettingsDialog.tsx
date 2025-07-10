import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

interface Settings {
  sendTransactionEmails: boolean
  paypalAddress: string
}

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: Settings
  onSave: (settings: Settings) => void
}

export default function SettingsDialog({ open, onOpenChange, settings, onSave }: SettingsDialogProps) {
  const [tempSettings, setTempSettings] = useState<Settings>(settings)

  useEffect(() => {
    setTempSettings(settings)
  }, [settings, open])

  const handleSave = () => {
    onSave(tempSettings)
    onOpenChange(false)
    toast.success('Settings saved!', {
      style: {
        background: '#0f172a',
        color: '#00ff9f',
        border: '1px solid #00ff9f',
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950/90 border-slate-800 text-slate-300 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-green-400">Ghost Swarm Settings</DialogTitle>
          <DialogDescription className="text-slate-400">
            Manage your console preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="sendEmails" className="text-slate-300">
              Send Transaction Emails
            </Label>
            <Switch
              id="sendEmails"
              checked={tempSettings.sendTransactionEmails}
              onCheckedChange={(checked) => setTempSettings(prev => ({ ...prev, sendTransactionEmails: checked }))}
              className="data-[state=checked]:bg-green-400"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paypalAddress" className="text-slate-300">
              PayPal Address
            </Label>
            <Input
              id="paypalAddress"
              type="email"
              placeholder="your.email@example.com"
              value={tempSettings.paypalAddress}
              onChange={(e) => setTempSettings(prev => ({ ...prev, paypalAddress: e.target.value }))}
              className="bg-slate-900/50 border-slate-700 text-green-400 placeholder:text-slate-500 focus:border-green-400 focus:ring-green-400/20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            onClick={handleSave} 
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold shadow-lg shadow-green-500/25 transition-all duration-200 hover:shadow-green-500/40"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}