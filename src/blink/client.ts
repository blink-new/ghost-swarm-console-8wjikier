import { createClient } from '@blinkdotnew/sdk'
import type { User } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'ghost-swarm-console-8wjikier',
  authRequired: true,
})

export { blink, User }
