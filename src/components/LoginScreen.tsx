import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Ghost, Terminal, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface LoginScreenProps {
  onLogin: (email: string, password: string) => boolean
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const success = onLogin(email, password)

    if (success) {
      toast.success('Welcome to Ghost Swarm Console 👻', {
        style: {
          background: '#0f172a',
          color: '#00ff9f',
          border: '1px solid #00ff9f',
        },
      })
    } else {
      toast.error('Invalid credentials', {
        style: {
          background: '#0f172a',
          color: '#ff0080',
          border: '1px solid #ff0080',
        },
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-400/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md bg-slate-950/90 border-slate-800 backdrop-blur-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-purple-400/10 animate-pulse"></div>
        
        <CardHeader className="text-center space-y-4 relative">
          <div className="flex justify-center items-center space-x-2">
            <Ghost className="w-8 h-8 text-green-400 animate-pulse" />
            <Terminal className="w-6 h-6 text-purple-400" />
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            Ghost Swarm Console
          </CardTitle>
          <CardDescription className="text-slate-400">
            Access restricted. Authorized personnel only.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Access ID
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ghost@swarm.console"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-green-400 placeholder:text-slate-500 focus:border-green-400 focus:ring-green-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Security Key
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-green-400 placeholder:text-slate-500 focus:border-green-400 focus:ring-green-400/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold shadow-lg shadow-green-500/25 transition-all duration-200 hover:shadow-green-500/40 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Initialize Console</span>
                </div>
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span>System Status: ONLINE</span>
            </div>
            <div>Authorized user only</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}