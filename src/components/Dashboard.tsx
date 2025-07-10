import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Ghost, 
  LogOut, 
  DollarSign, 
  Activity, 
  Bot, 
  Skull,
  TrendingUp,
  Clock,
  Users,
  Wifi,
  WifiOff,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'
import SettingsDialog from './SettingsDialog'
import { blink, User } from '../blink/client'

interface Transaction {
  id: string
  amount: number
  source: string
  time: string
  agentId: string
  type: 'earning' | 'activation'
  createdAt: string
}

interface DashboardProps {
  user: User
  onLogout: () => void
}

const agentNames = [
  'RefundBot', 'CodeFlip', 'CouponHunter', 'PriceTracker', 'DataMiner',
  'TaskBot', 'ScrapeGhost', 'APIHunter', 'WebCrawler', 'AutoBidder',
  'FlipBot', 'ArbitragePro', 'DealHunter', 'DiscountBot', 'CashBot'
]

const generateMockTransaction = (): Omit<Transaction, 'id' | 'createdAt' | 'userId'> => {
  const agentName = agentNames[Math.floor(Math.random() * agentNames.length)]
  const agentId = `${agentName}_${Math.floor(Math.random() * 99) + 1}`
  const amount = Math.random() * 2 + 0.01 // $0.01 to $2.00
  
  return {
    amount: Math.round(amount * 100) / 100,
    source: agentName,
    time: new Date().toLocaleTimeString(),
    agentId,
    type: 'earning',
  }
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isActivating, setIsActivating] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [activationProgress, setActivationProgress] = useState(0)
  const [activeAgents, setActiveAgents] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('ghost-swarm-settings')
    return savedSettings ? JSON.parse(savedSettings) : {
      sendTransactionEmails: true,
      paypalAddress: ''
    }
  })

  useEffect(() => {
    localStorage.setItem('ghost-swarm-settings', JSON.stringify(settings))
  }, [settings])

  const fetchDashboardData = useCallback(async () => {
    try {
      const [walletData, transactionsData] = await Promise.all([
        blink.db.wallets.list({ where: { userId: user.id }, limit: 1 }),
        blink.db.transactions.list({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, limit: 50 })
      ])

      if (walletData.length > 0) {
        setWalletBalance(walletData[0].balance)
      } else {
        // Create a new wallet if one doesn't exist
        const newWallet = await blink.db.wallets.create({
          userId: user.id,
          balance: 1247.83
        })
        setWalletBalance(newWallet.balance)
      }

      setTransactions(transactionsData as unknown as Transaction[])
      
      // A simple way to get a dynamic number of active agents
      const agentCount = new Set(transactionsData.map(tx => tx.agentId)).size
      setActiveAgents(agentCount > 0 ? agentCount : 42)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data.')
    }
  }, [user.id])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Auto-earnings mode
  useEffect(() => {
    if (!autoMode) return

    const interval = setInterval(async () => {
      const mockTx = generateMockTransaction()
      const newTransaction = await blink.db.transactions.create({
        ...mockTx,
        userId: user.id,
      })
      const newBalance = walletBalance + newTransaction.amount
      await blink.db.wallets.update(user.id, { balance: newBalance })
      setTransactions(prev => [newTransaction as unknown as Transaction, ...prev.slice(0, 49)])
      setWalletBalance(newBalance)
    }, 3000 + Math.random() * 4000) // 3-7 seconds

    return () => clearInterval(interval)
  }, [autoMode, user.id, walletBalance])

  // Agent activation sequence
  const activateAgents = useCallback(async () => {
    setIsActivating(true)
    setActivationProgress(0)

    toast.success('👻 Deploying 100 ghost agents...', {
      style: {
        background: '#0f172a',
        color: '#00ff9f',
        border: '1px solid #00ff9f',
      },
    })

    // Simulate activation progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setActivationProgress(i)
    }

    // Generate transactions for 60 seconds
    const endTime = Date.now() + 60000
    const generateTransactions = async () => {
      while (Date.now() < endTime) {
        const numTransactions = Math.floor(Math.random() * 4) + 2 // 2-5 transactions
        
        for (let i = 0; i < numTransactions; i++) {
          const mockTx = generateMockTransaction()
          const newTransaction = await blink.db.transactions.create({
            ...mockTx,
            userId: user.id,
          })
          const newBalance = walletBalance + newTransaction.amount
          await blink.db.wallets.update(user.id, { balance: newBalance })
          setTransactions(prev => [newTransaction as unknown as Transaction, ...prev.slice(0, 49)])
          setWalletBalance(newBalance)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
      }
    }

    generateTransactions()
    setActiveAgents(prev => prev + 100)
    
    setTimeout(() => {
      setIsActivating(false)
      setActivationProgress(0)
      toast.success('✨ Agent deployment complete!', {
        style: {
          background: '#0f172a',
          color: '#00ff9f',
          border: '1px solid #00ff9f',
        },
      })
    }, 1000)
  }, [user.id, walletBalance])

  const handleLogout = () => {
    toast.success('Ghost session terminated 👻', {
      style: {
        background: '#0f172a',
        color: '#ff0080',
        border: '1px solid #ff0080',
      },
    })
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Ghost className="w-8 h-8 text-green-400 animate-pulse" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
                Ghost Swarm Console
              </h1>
            </div>
            <Badge variant="outline" className="border-green-400/50 text-green-400 bg-green-400/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping mr-2"></div>
              ONLINE
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Users className="w-4 h-4" />
              <span>{activeAgents} Active Agents</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-slate-400 hover:text-green-400"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-red-400/50 text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Terminate
            </Button>
          </div>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-slate-950/90 border-slate-800 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-purple-400/10 animate-pulse"></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <CardTitle className="text-slate-300">Wallet Balance</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Auto Mode</span>
                <Switch
                  checked={autoMode}
                  onCheckedChange={setAutoMode}
                  className="data-[state=checked]:bg-green-400"
                />
                {autoMode ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-bold text-green-400 mb-2">
              ${walletBalance.toFixed(2)}
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <TrendingUp className="w-4 h-4" />
              <span>+${(walletBalance * 0.03).toFixed(2)} (3.2%) today</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Feed */}
          <Card className="lg:col-span-2 bg-slate-950/90 border-slate-800 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <CardTitle className="text-slate-300">Live Transaction Feed</CardTitle>
                <Badge variant="outline" className="border-purple-400/50 text-purple-400 bg-purple-400/10">
                  {transactions.length}
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Real-time earnings from your agent swarm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium text-green-400">
                          +${tx.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400">
                          from {tx.source}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-300">{tx.agentId}</div>
                      <div className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Ghost className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No transactions yet. Activate agents to start earning!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Agent Activation */}
          <Card className="bg-slate-950/90 border-slate-800 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <CardTitle className="text-slate-300">Agent Control</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Deploy your ghost agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={activateAgents}
                disabled={isActivating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 hover:shadow-purple-500/40 hover:scale-105"
                size="lg"
              >
                {isActivating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Activating... {activationProgress}%</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Skull className="w-5 h-5" />
                    <span>☠️ Activate 100 Agents Now</span>
                  </div>
                )}
              </Button>

              <Separator className="bg-slate-800" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Agents</span>
                  <span className="text-green-400 font-semibold">{activeAgents}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">97.3%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Avg. Earnings</span>
                  <span className="text-green-400 font-semibold">$0.74/agent</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">System Status</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">All systems operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
        settings={settings} 
        onSave={setSettings} 
      />
    </div>
  )
}