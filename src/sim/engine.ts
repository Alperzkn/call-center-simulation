import { SCENARIOS, type QaCategory, type QueueName, type Scenario } from './scenarios'

// ---------- Types ----------

export type AgentState = 'available' | 'ringing' | 'on_call' | 'wrap' | 'break' | 'not_ready'

export const STATE_LABEL: Record<AgentState, string> = {
  available: 'Available',
  ringing: 'Ringing',
  on_call: 'On a call',
  wrap: 'After-call work',
  break: 'On break',
  not_ready: 'Not ready',
}

export const TARGETS = {
  serviceLevel: 80, // % answered within SL_SECONDS
  asa: 20,
  abandon: 5,
  aht: 390,
  fcr: 75,
  csat: 4.2,
  qa: 85,
  adherence: 92,
  occupancyLow: 75,
  occupancyHigh: 88,
}
export const SL_SECONDS = 20
export const INTERVAL = 1800 // 30 simulated minutes
export const DAY_START = 10 * 3600

export interface Call {
  id: number
  queue: QueueName
  customer: string
  arrivedAt: number
  answeredAt?: number
  patience: number
  talkSec: number
  reason: string
  /** set on the trainee's calls so the UI can show the scenario in the current language */
  scenarioId?: string
}

export interface CallRecord {
  at: number
  queue: QueueName
  customer: string
  handleSec: number
  fcr: boolean
  csat: number | null
  qa: number | null
  scenarioId?: string
}

export interface AgentStats {
  handled: number
  talkSec: number
  wrapSec: number
  holdSec: number
  fcr: number
  csatSum: number
  csatN: number
  qaSum: number
  qaN: number
  transfers: number
  tAvail: number
  tCall: number
  tWrap: number
  tBreak: number
  tOut: number
  logged: number
}

export interface Agent {
  id: string
  name: string
  teamId: string
  isPlayer: boolean
  seat: { x: number; z: number }
  breakSpot: { x: number; z: number }
  look: { skin: string; hair: string; shirt: string }
  traits: { speed: number; quality: number; empathy: number; discipline: number }
  state: AgentState
  stateSince: number
  call: Call | null
  callEndsAt: number
  wrapEndsAt: number
  breakEndsAt: number
  breakAllowedUntil: number
  nextBreakAt: number
  stats: AgentStats
  recent: CallRecord[]
  trend: { t: number; handled: number; aht: number }[]
  intHandled: number
  intHandle: number
}

export interface Team {
  id: string
  name: string
  leader: string
  leaderLook: { skin: string; hair: string; shirt: string }
  leaderPos: { x: number; z: number }
  rowZ: number
}

export interface IntervalRow {
  t: number
  offered: number
  answered: number
  abandoned: number
  sl: number
}

export interface StepResult {
  category: QaCategory
  chosen: number
  q: 0 | 1 | 2
}

export interface CallResult {
  scenario: Scenario
  steps: StepResult[]
  categories: { category: QaCategory; score: number }[]
  qa: number
  criticalFail: boolean
  csat: number | null
  fcr: boolean
  handleSec: number
  dispositionCorrect: boolean
  dispositionIndex: number
  finalMood: number
}

/** Transcript lines point at scenario text rather than copying it, so they follow the UI language. */
export interface TranscriptLine {
  who: 'customer' | 'agent' | 'system'
  src: 'greeting' | 'opening' | 'prompt' | 'said' | 'reply'
  step?: number
  opt?: number
}

/** Floor events are stored as data and worded by the UI. */
export interface FloorEvent {
  at: number
  tone: 'info' | 'warn' | 'good'
  kind: 'abandon' | 'breakEnded' | 'slDrop' | 'scored'
  queue?: QueueName
  sec?: number
  value?: number
  scenarioId?: string
}

export interface PlayerSession {
  phase: 'idle' | 'ringing' | 'in_call' | 'wrap' | 'review'
  scenario: Scenario | null
  stepIndex: number
  /** option order for the current step, shuffled so the best answer moves around */
  order: number[]
  transcript: TranscriptLine[]
  mood: number
  results: StepResult[]
  startedAt: number
  result: CallResult | null
  deck: number[]
  history: CallResult[]
  dispositionOrder: number[]
}

export interface World {
  now: number
  agents: Agent[]
  teams: Team[]
  queue: Call[]
  floor: {
    offered: number
    answered: number
    answeredInSl: number
    abandoned: number
    waitSum: number
    intervals: IntervalRow[]
    cur: { offered: number; answered: number; inSl: number; abandoned: number }
    nextIntervalAt: number
  }
  events: FloorEvent[]
  player: PlayerSession
  nextCallId: number
  nextArrivalAt: number
  rand: () => number
}

// ---------- Static data ----------

export const QUEUE_MIX: { queue: QueueName; weight: number; talk: number; reasons: string[] }[] = [
  { queue: 'Billing', weight: 28, talk: 300, reasons: ['Bill higher than expected', 'Refund query', 'Direct Debit date change', 'Charge not recognised'] },
  { queue: 'Technical', weight: 26, talk: 420, reasons: ['Slow broadband speed', 'No mobile signal at home', 'Router keeps dropping', 'Email set-up on new phone'] },
  { queue: 'Accounts', weight: 18, talk: 270, reasons: ['Change of address', 'Add a user to the account', 'PIN reset', 'Upgrade eligibility'] },
  { queue: 'Retention', weight: 10, talk: 400, reasons: ['Wants to cancel', 'Out-of-contract price review', 'Competitor offer'] },
  { queue: 'Collections', weight: 9, talk: 330, reasons: ['Overdue balance', 'Payment plan request', 'Service restricted'] },
  { queue: 'Complaints', weight: 9, talk: 450, reasons: ['Missed engineer visit', 'Repeat fault', 'Wrong information given'] },
]

const CUSTOMER_NAMES = [
  'A. Brennan', 'L. Fofanah', 'M. Sato', 'C. Whitlock', 'R. Banerjee', 'J. Almeida', 'E. Novak', 'P. Adeyemi',
  'S. Haddad', 'T. Eriksen', 'N. Qureshi', 'G. Moreau', 'D. Kowalczyk', 'H. Tanaka', 'I. Mbeki', 'F. Rossi',
  'K. Ansah', 'V. Petrov', 'B. Nguyen', 'O. Lindgren', 'Y. Demir', 'W. Hughes', 'Z. Farouk', 'U. Osei',
]

const SKIN = ['#F1C9A5', '#E0AC83', '#C68B5F', '#A66A42', '#7C4A2A', '#5B3620']
const HAIR = ['#1F1A17', '#3A2A1E', '#6B4526', '#A6763C', '#8E8E8E', '#B33F2C']
const SHIRT = ['#3F6FB5', '#5C8A6B', '#B9744A', '#7A62A8', '#C2A23A', '#4E8D99', '#A9546A', '#6C7A89']

const TEAM_DEFS = [
  { id: 't1', name: 'Team Aster', leader: 'Priya Raman', agents: ['Maya Lindholm', 'Kwame Boateng', 'Chloe Varga', 'Arjun Mehta', 'Isabel Ferreira'] },
  { id: 't2', name: 'Team Birch', leader: 'Marcus Oyelaran', agents: ['Noor Al-Sayed', 'Liam Gallagher-Reid', 'You', 'Hana Kobayashi', 'Diego Paredes'] },
  { id: 't3', name: 'Team Cedar', leader: 'Elena Kovač', agents: ['Femi Adebayo', 'Sara Lund', 'Viktor Hristov', 'Aisha Rahman', 'Tom Sinclair'] },
]

export const ROW_Z = [-5.2, 0, 5.2]
export const SEAT_X = [-6, -3, 0, 3, 6]
export const AISLE_OFFSET = 1.5
export const BREAK_X = -11.4

// ---------- Helpers ----------

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function gauss(rand: () => number) {
  const u = Math.max(rand(), 1e-9)
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
}

function pick<T>(rand: () => number, list: T[]): T {
  return list[Math.floor(rand() * list.length)]
}

function shuffled(rand: () => number, n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Calls per simulated hour. Shaped like a typical weekday: mid-morning peak, lunch dip, afternoon peak. */
export function arrivalRate(now: number): number {
  const h = ((now / 3600) % 24 + 24) % 24
  const curve: [number, number][] = [
    [0, 0.25], [7, 0.35], [9, 0.85], [10.5, 1.22], [12, 1.0], [13, 0.8], [14.5, 1.15], [16, 1.05], [18, 0.75], [20, 0.45], [24, 0.25],
  ]
  let m = 1
  for (let i = 0; i < curve.length - 1; i++) {
    const [h0, m0] = curve[i]
    const [h1, m1] = curve[i + 1]
    if (h >= h0 && h <= h1) {
      m = m0 + ((m1 - m0) * (h - h0)) / (h1 - h0)
      break
    }
  }
  return 103 * m
}

const emptyStats = (): AgentStats => ({
  handled: 0, talkSec: 0, wrapSec: 0, holdSec: 0, fcr: 0, csatSum: 0, csatN: 0, qaSum: 0, qaN: 0,
  transfers: 0, tAvail: 0, tCall: 0, tWrap: 0, tBreak: 0, tOut: 0, logged: 0,
})

// ---------- World creation ----------

export function createWorld(seed = 20261006): World {
  const rand = mulberry32(seed)
  const teams: Team[] = []
  const agents: Agent[] = []
  let n = 0
  TEAM_DEFS.forEach((def, ti) => {
    teams.push({
      id: def.id,
      name: def.name,
      leader: def.leader,
      leaderLook: { skin: SKIN[(ti * 2 + 1) % SKIN.length], hair: HAIR[(ti + 2) % HAIR.length], shirt: '#27333B' },
      leaderPos: { x: 9.6, z: ROW_Z[ti] + 0.2 },
      rowZ: ROW_Z[ti],
    })
    def.agents.forEach((name, si) => {
      const isPlayer = name === 'You'
      const idx = n++
      agents.push({
        id: `a${idx}`,
        name,
        teamId: def.id,
        isPlayer,
        seat: { x: SEAT_X[si], z: ROW_Z[ti] },
        breakSpot: { x: BREAK_X + (idx % 3) * 1.1 - 1.1, z: -6.5 + Math.floor(idx / 3) * 1.5 + (idx % 2) * 0.4 },
        look: {
          skin: SKIN[Math.floor(rand() * SKIN.length)],
          hair: HAIR[Math.floor(rand() * HAIR.length)],
          shirt: isPlayer ? '#2459D6' : SHIRT[idx % SHIRT.length],
        },
        traits: {
          speed: clamp(0.5 + gauss(rand) * 0.2, 0.1, 0.95),
          quality: clamp(0.62 + gauss(rand) * 0.17, 0.2, 0.97),
          empathy: clamp(0.6 + gauss(rand) * 0.18, 0.2, 0.97),
          discipline: clamp(0.72 + gauss(rand) * 0.18, 0.25, 0.99),
        },
        state: isPlayer ? 'not_ready' : 'available',
        stateSince: DAY_START,
        call: null,
        callEndsAt: 0,
        wrapEndsAt: 0,
        breakEndsAt: 0,
        breakAllowedUntil: 0,
        nextBreakAt: DAY_START + 2400 + rand() * 6000,
        stats: emptyStats(),
        recent: [],
        trend: [],
        intHandled: 0,
        intHandle: 0,
      })
    })
  })

  const world: World = {
    now: DAY_START,
    agents,
    teams,
    queue: [],
    floor: {
      offered: 0, answered: 0, answeredInSl: 0, abandoned: 0, waitSum: 0, intervals: [],
      cur: { offered: 0, answered: 0, inSl: 0, abandoned: 0 },
      nextIntervalAt: DAY_START + INTERVAL,
    },
    events: [],
    player: {
      phase: 'idle', scenario: null, stepIndex: 0, order: [], transcript: [], mood: 50, results: [],
      startedAt: 0, result: null, deck: [], history: [], dispositionOrder: [],
    },
    nextCallId: 1,
    nextArrivalAt: DAY_START + 5,
    rand,
  }
  return world
}

/** Run the floor for a while before the trainee joins, so dashboards open with a morning of data. */
export function warmUp(world: World, seconds: number) {
  const start = world.now - seconds
  world.now = start
  world.nextArrivalAt = start + 5
  world.floor.nextIntervalAt = Math.ceil(start / INTERVAL) * INTERVAL + (start % INTERVAL === 0 ? INTERVAL : 0)
  for (const a of world.agents) {
    a.stateSince = start
    a.nextBreakAt = start + 1800 + world.rand() * 6000
  }
  for (let t = 0; t < seconds; t += 2) step(world, 2)
  const player = world.agents.find((a) => a.isPlayer)!
  player.stats = emptyStats()
  player.trend = []
  player.stateSince = world.now
}

// ---------- Simulation step ----------

function logEvent(world: World, ev: Omit<FloorEvent, 'at'>) {
  world.events.unshift({ at: world.now, ...ev })
  if (world.events.length > 30) world.events.pop()
}

function setState(world: World, a: Agent, s: AgentState) {
  a.state = s
  a.stateSince = world.now
}

function spawnCall(world: World) {
  const { rand } = world
  const total = QUEUE_MIX.reduce((s, q) => s + q.weight, 0)
  let r = rand() * total
  let mix = QUEUE_MIX[0]
  for (const q of QUEUE_MIX) {
    r -= q.weight
    if (r <= 0) { mix = q; break }
  }
  world.queue.push({
    id: world.nextCallId++,
    queue: mix.queue,
    customer: pick(rand, CUSTOMER_NAMES),
    arrivedAt: world.now,
    patience: 45 + -Math.log(Math.max(rand(), 1e-6)) * 150,
    talkSec: mix.talk,
    reason: pick(rand, mix.reasons),
  })
  world.floor.offered++
  world.floor.cur.offered++
}

function recordAnswer(world: World, call: Call) {
  const wait = world.now - call.arrivedAt
  call.answeredAt = world.now
  world.floor.answered++
  world.floor.cur.answered++
  world.floor.waitSum += wait
  if (wait <= SL_SECONDS) {
    world.floor.answeredInSl++
    world.floor.cur.inSl++
  }
}

function pushRecord(a: Agent, rec: CallRecord) {
  a.recent.unshift(rec)
  if (a.recent.length > 8) a.recent.pop()
  a.intHandled++
  a.intHandle += rec.handleSec
}

function finishAiCall(world: World, a: Agent) {
  const { rand } = world
  const call = a.call!
  const talk = world.now - (call.answeredAt ?? world.now)
  const wrap = (35 + rand() * 55) * (1.35 - 0.7 * a.traits.speed)
  const fcr = rand() < 0.5 + 0.42 * a.traits.quality
  const csat = clamp(Math.round(2.9 + 2.1 * a.traits.empathy + (fcr ? 0.35 : -0.7) + gauss(rand) * 0.7), 1, 5)
  const surveyed = rand() < 0.55
  const monitored = rand() < 0.3
  const qa = monitored ? clamp(Math.round(58 + 40 * a.traits.quality + gauss(rand) * 6), 35, 100) : null
  a.stats.handled++
  a.stats.talkSec += talk
  a.stats.wrapSec += wrap
  if (rand() < 0.35) a.stats.holdSec += 20 + rand() * 70 * (1.2 - a.traits.quality)
  if (fcr) a.stats.fcr++
  if (surveyed) { a.stats.csatSum += csat; a.stats.csatN++ }
  if (qa !== null) { a.stats.qaSum += qa; a.stats.qaN++ }
  if (!fcr && rand() < 0.4) a.stats.transfers++
  pushRecord(a, { at: world.now, queue: call.queue, customer: call.customer, handleSec: talk + wrap, fcr, csat: surveyed ? csat : null, qa })
  a.wrapEndsAt = world.now + wrap
  setState(world, a, 'wrap')
}

function route(world: World) {
  if (!world.queue.length) return
  const player = world.agents.find((a) => a.isPlayer)!
  // The trainee gets the next call once they have been ready for a few seconds.
  if (player.state === 'available' && world.player.phase === 'idle' && world.now - player.stateSince > 12) {
    const call = world.queue.shift()!
    offerToPlayer(world, player, call)
  }
  while (world.queue.length) {
    let best: Agent | null = null
    for (const a of world.agents) {
      if (a.isPlayer || a.state !== 'available') continue
      if (!best || a.stateSince < best.stateSince) best = a
    }
    if (!best) break
    const call = world.queue.shift()!
    recordAnswer(world, call)
    const noise = Math.exp(gauss(world.rand) * 0.35)
    best.call = call
    best.callEndsAt = world.now + clamp(call.talkSec * (1.1 - 0.5 * best.traits.speed) * noise, 60, 1500)
    setState(world, best, 'on_call')
  }
}

function accrue(a: Agent, dt: number) {
  const s = a.stats
  s.logged += dt
  switch (a.state) {
    case 'available':
    case 'ringing':
      s.tAvail += dt
      break
    case 'on_call':
      s.tCall += dt
      break
    case 'wrap':
      s.tWrap += dt
      break
    case 'break':
      s.tBreak += dt
      break
  }
}

export function step(world: World, dt: number) {
  if (dt <= 0) return
  world.now += dt
  const { rand } = world

  // Arrivals
  while (world.now >= world.nextArrivalAt) {
    spawnCall(world)
    const perSec = arrivalRate(world.nextArrivalAt) / 3600
    world.nextArrivalAt += -Math.log(Math.max(rand(), 1e-9)) / perSec
  }

  // Abandons
  for (let i = world.queue.length - 1; i >= 0; i--) {
    const c = world.queue[i]
    if (world.now - c.arrivedAt > c.patience) {
      world.queue.splice(i, 1)
      world.floor.abandoned++
      world.floor.cur.abandoned++
      logEvent(world, { kind: 'abandon', tone: 'warn', queue: c.queue, sec: world.now - c.arrivedAt })
    }
  }

  const onBreak = world.agents.filter((a) => a.state === 'break' || a.state === 'not_ready').length

  for (const a of world.agents) {
    accrue(a, dt)
    if (a.state === 'break' && world.now > a.breakAllowedUntil) a.stats.tOut += dt
    if (a.state === 'not_ready') {
      // The trainee gets a short grace period, and longer while reviewing feedback (scheduled coaching time).
      const grace = a.isPlayer ? (world.player.phase === 'review' ? 900 : 120) : 0
      if (world.now - a.stateSince > grace) a.stats.tOut += dt
    }
    if (a.isPlayer) {
      if (a.state === 'break' && world.now >= a.breakEndsAt) {
        setState(world, a, 'not_ready')
        logEvent(world, { kind: 'breakEnded', tone: 'info' })
      }
      continue
    }
    switch (a.state) {
      case 'on_call':
        if (world.now >= a.callEndsAt) finishAiCall(world, a)
        break
      case 'wrap':
        if (world.now >= a.wrapEndsAt) {
          a.call = null
          if (world.now >= a.nextBreakAt && onBreak < 3) {
            const length = 600
            a.breakAllowedUntil = world.now + length
            a.breakEndsAt = world.now + length * (1 + (1 - a.traits.discipline) * rand() * 0.9)
            a.nextBreakAt = world.now + 5400 + rand() * 3600
            setState(world, a, 'break')
          } else if (rand() < (1 - a.traits.discipline) * 0.06) {
            a.breakEndsAt = world.now + 90 + rand() * 200
            setState(world, a, 'not_ready')
          } else {
            setState(world, a, 'available')
          }
        }
        break
      case 'break':
      case 'not_ready':
        if (world.now >= a.breakEndsAt) setState(world, a, 'available')
        break
    }
  }

  route(world)

  // Interval roll-up
  while (world.now >= world.floor.nextIntervalAt) {
    const c = world.floor.cur
    const sl = c.answered + c.abandoned > 0 ? (100 * c.inSl) / (c.answered + c.abandoned) : 100
    world.floor.intervals.push({ t: world.floor.nextIntervalAt - INTERVAL, offered: c.offered, answered: c.answered, abandoned: c.abandoned, sl })
    if (world.floor.intervals.length > 20) world.floor.intervals.shift()
    if (sl < TARGETS.serviceLevel - 10) logEvent(world, { kind: 'slDrop', tone: 'warn', value: Math.round(sl) })
    world.floor.cur = { offered: 0, answered: 0, inSl: 0, abandoned: 0 }
    for (const a of world.agents) {
      a.trend.push({ t: world.floor.nextIntervalAt - INTERVAL, handled: a.intHandled, aht: a.intHandled ? a.intHandle / a.intHandled : 0 })
      if (a.trend.length > 20) a.trend.shift()
      a.intHandled = 0
      a.intHandle = 0
    }
    world.floor.nextIntervalAt += INTERVAL
  }
}

// ---------- Player actions ----------

function getPlayer(world: World) {
  return world.agents.find((a) => a.isPlayer)!
}

function offerToPlayer(world: World, player: Agent, call: Call) {
  const p = world.player
  if (!p.deck.length) p.deck = shuffled(world.rand, SCENARIOS.length)
  const scenario = SCENARIOS[p.deck.shift()!]
  call.queue = scenario.queue
  call.customer = scenario.customer.name
  call.reason = scenario.title
  call.scenarioId = scenario.id
  player.call = call
  p.phase = 'ringing'
  p.scenario = scenario
  p.stepIndex = 0
  p.transcript = []
  p.results = []
  p.mood = scenario.startMood
  p.result = null
  setState(world, player, 'ringing')
}

export function playerSetReady(world: World, ready: boolean) {
  const a = getPlayer(world)
  if (world.player.phase !== 'idle' && world.player.phase !== 'review') return
  if (world.player.phase === 'review') world.player.phase = 'idle'
  a.call = null
  setState(world, a, ready ? 'available' : 'not_ready')
}

export function playerTakeBreak(world: World) {
  const a = getPlayer(world)
  if (world.player.phase !== 'idle' && world.player.phase !== 'review') return
  world.player.phase = 'idle'
  a.call = null
  a.breakAllowedUntil = world.now + 600
  a.breakEndsAt = world.now + 600
  setState(world, a, 'break')
}

export function playerAnswer(world: World) {
  const a = getPlayer(world)
  const p = world.player
  if (p.phase !== 'ringing' || !a.call || !p.scenario) return
  recordAnswer(world, a.call)
  p.phase = 'in_call'
  p.startedAt = world.now
  p.transcript = [
    { who: 'agent', src: 'greeting' },
    { who: 'customer', src: 'opening' },
  ]
  p.order = shuffled(world.rand, p.scenario.steps[0].options.length)
  if (p.scenario.steps[0].prompt) p.transcript.push({ who: 'system', src: 'prompt', step: 0 })
  setState(world, a, 'on_call')
}

export function playerChoose(world: World, optionIndex: number) {
  const p = world.player
  const a = getPlayer(world)
  if (p.phase !== 'in_call' || !p.scenario) return
  const stepDef = p.scenario.steps[p.stepIndex]
  const opt = stepDef.options[optionIndex]
  if (!opt) return
  p.transcript.push({ who: 'agent', src: 'said', step: p.stepIndex, opt: optionIndex })
  p.transcript.push({ who: opt.narrated ? 'system' : 'customer', src: 'reply', step: p.stepIndex, opt: optionIndex })
  p.mood = clamp(p.mood + opt.mood, 0, 100)
  // Holds, tests and detours cost real handle time: the floor clock moves on while they happen.
  if (opt.sec) step(world, opt.sec)
  p.results.push({ category: stepDef.category, chosen: optionIndex, q: opt.q })
  p.stepIndex++
  if (p.stepIndex >= p.scenario.steps.length) {
    p.phase = 'wrap'
    p.dispositionOrder = shuffled(world.rand, p.scenario.dispositions.length)
    a.stats.talkSec += world.now - p.startedAt
    a.wrapEndsAt = world.now
    setState(world, a, 'wrap')
  } else {
    const next = p.scenario.steps[p.stepIndex]
    p.order = shuffled(world.rand, next.options.length)
    if (next.prompt) p.transcript.push({ who: 'system', src: 'prompt', step: p.stepIndex })
  }
}

export function scoreCall(scenario: Scenario, results: StepResult[], finalMood: number, handleSec: number, dispositionIndex: number): CallResult {
  const byCat = new Map<QaCategory, number[]>()
  let criticalFail = false
  results.forEach((r, i) => {
    const opt = scenario.steps[i].options[r.chosen]
    if (opt.critical) criticalFail = true
    const pts = r.q === 2 ? 100 : r.q === 1 ? 60 : 0
    byCat.set(r.category, [...(byCat.get(r.category) ?? []), pts])
  })
  const categories = [...byCat.entries()].map(([category, pts]) => ({
    category,
    score: Math.round(pts.reduce((s, v) => s + v, 0) / pts.length),
  }))
  // The first disposition in a scenario is the correct one.
  const dispositionCorrect = dispositionIndex === 0
  let qa = categories.reduce((s, c) => s + c.score, 0) / Math.max(categories.length, 1)
  qa = qa * 0.95 + (dispositionCorrect ? 5 : 0)
  // A critical breach caps the score, as on a real QA form.
  if (criticalFail) qa = Math.min(qa, 40)
  const resolution = results.filter((r) => r.category === 'resolution')
  const resolved = resolution.length ? resolution.every((r) => r.q >= 1) && resolution.some((r) => r.q === 2) : results.filter((r) => r.q === 2).length >= 3
  const csat = scenario.csatExempt ? null : clamp(Math.round(1 + finalMood / 22), 1, 5)
  return {
    scenario,
    steps: results,
    categories,
    qa: Math.round(qa),
    criticalFail,
    csat,
    fcr: resolved && !criticalFail,
    handleSec,
    dispositionCorrect,
    dispositionIndex,
    finalMood,
  }
}

export function playerDisposition(world: World, dispositionIndex: number) {
  const p = world.player
  const a = getPlayer(world)
  if (p.phase !== 'wrap' || !p.scenario) return
  const talk = a.stateSince - p.startedAt
  const wrap = world.now - a.stateSince
  const result = scoreCall(p.scenario, p.results, p.mood, talk + wrap, dispositionIndex)
  a.stats.handled++
  a.stats.wrapSec += wrap
  if (result.fcr) a.stats.fcr++
  if (result.csat !== null) { a.stats.csatSum += result.csat; a.stats.csatN++ }
  a.stats.qaSum += result.qa
  a.stats.qaN++
  pushRecord(a, {
    at: world.now, queue: p.scenario.queue, customer: p.scenario.customer.name, handleSec: result.handleSec,
    fcr: result.fcr, csat: result.csat, qa: result.qa, scenarioId: p.scenario.id,
  })
  p.result = result
  p.history.push(result)
  p.phase = 'review'
  a.call = null
  setState(world, a, 'not_ready')
  logEvent(world, { kind: 'scored', tone: result.qa >= TARGETS.qa ? 'good' : 'info', scenarioId: p.scenario.id, value: result.qa })
}

// ---------- KPI selectors ----------

export interface Kpis {
  handled: number
  aht: number
  fcr: number
  csat: number
  qa: number
  adherence: number
  occupancy: number
  transfers: number
}

export function agentKpis(a: Agent): Kpis {
  const s = a.stats
  const busy = s.tCall + s.tWrap
  return {
    handled: s.handled,
    aht: s.handled ? (s.talkSec + s.wrapSec) / s.handled : 0,
    fcr: s.handled ? (100 * s.fcr) / s.handled : 0,
    csat: s.csatN ? s.csatSum / s.csatN : 0,
    qa: s.qaN ? s.qaSum / s.qaN : 0,
    adherence: s.logged ? clamp(100 * (1 - s.tOut / s.logged), 0, 100) : 100,
    occupancy: busy + s.tAvail > 0 ? (100 * busy) / (busy + s.tAvail) : 0,
    transfers: s.transfers,
  }
}

export function groupKpis(agents: Agent[]): Kpis {
  const sum = emptyStats()
  for (const a of agents) for (const k of Object.keys(sum) as (keyof AgentStats)[]) sum[k] += a.stats[k]
  return agentKpis({ stats: sum } as Agent)
}

export function floorKpis(world: World) {
  const f = world.floor
  const done = f.answered + f.abandoned
  const longest = world.queue.length ? world.now - Math.min(...world.queue.map((c) => c.arrivedAt)) : 0
  const counts: Record<AgentState, number> = { available: 0, ringing: 0, on_call: 0, wrap: 0, break: 0, not_ready: 0 }
  for (const a of world.agents) counts[a.state]++
  return {
    serviceLevel: done ? (100 * f.answeredInSl) / done : 100,
    asa: f.answered ? f.waitSum / f.answered : 0,
    abandonRate: done ? (100 * f.abandoned) / done : 0,
    inQueue: world.queue.length,
    longestWait: longest,
    offered: f.offered,
    answered: f.answered,
    abandoned: f.abandoned,
    counts,
    ...groupKpis(world.agents),
  }
}

export type CoachingKind = 'new' | 'qa' | 'aht' | 'fcr' | 'csat' | 'adherence' | 'allGood'

/** What a team leader would raise in a one-to-one, picked from the agent's weakest measure. The UI words it. */
export function coachingNote(a: Agent): { kind: CoachingKind; tone: 'good' | 'warn'; k: Kpis } {
  const k = agentKpis(a)
  if (k.handled < 3) return { kind: 'new', tone: 'good', k }
  const gaps: { gap: number; kind: CoachingKind }[] = [
    { gap: (TARGETS.qa - k.qa) / TARGETS.qa, kind: 'qa' },
    { gap: (k.aht - TARGETS.aht) / TARGETS.aht, kind: 'aht' },
    { gap: (TARGETS.fcr - k.fcr) / TARGETS.fcr, kind: 'fcr' },
    { gap: (TARGETS.csat - k.csat) / TARGETS.csat, kind: 'csat' },
    { gap: (TARGETS.adherence - k.adherence) / TARGETS.adherence, kind: 'adherence' },
  ]
  gaps.sort((x, y) => y.gap - x.gap)
  if (gaps[0].gap <= 0) return { kind: 'allGood', tone: 'good', k }
  return { kind: gaps[0].kind, tone: 'warn', k }
}

// ---------- Formatting ----------

export function fmtDuration(sec: number): string {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function fmtClock(now: number): string {
  const s = ((Math.floor(now) % 86400) + 86400) % 86400
  return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}`
}
