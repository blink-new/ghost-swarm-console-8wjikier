import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trophy, User, DollarSign } from 'lucide-react'

export interface Agent {
  id: string
  name: string
  earnings: number
  method: string
}

interface AgentLeaderboardProps {
  agents: Agent[]
}

export default function AgentLeaderboard({ agents }: AgentLeaderboardProps) {
  const sortedAgents = [...agents].sort((a, b) => b.earnings - a.earnings).slice(0, 10)

  return (
    <Card className="bg-slate-950/90 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <CardTitle className="text-slate-300">Agent Leaderboard</CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          Top 10 performing agents in the swarm.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAgents.map((agent, index) => (
            <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className={`w-6 text-center font-bold ${index < 3 ? `text-amber-${400 - index * 100}` : 'text-slate-400'}`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-cyan-400 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {agent.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    Method: {agent.method || 'Searching...'}
                  </div>
                </div>
              </div>
              <div className="text-right text-green-400 font-semibold flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {agent.earnings.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
