import { create } from 'zustand'
import {
  createWorld, playerAnswer, playerChoose, playerDisposition, playerSetReady, playerTakeBreak, warmUp, type AgentState,
} from './sim/engine'

// The simulation world is a plain mutable object so the 3D scene can read it every frame
// without re-rendering React. The UI re-reads it whenever `tick` changes.
export const world = createWorld()
warmUp(world, 2 * 3600)

export type Lang = 'en' | 'tr'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('halden-lang')
    if (saved === 'en' || saved === 'tr') return saved
  } catch {
    // storage can be unavailable in private windows; fall through to the browser language
  }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

export type Panel = { kind: 'floor' } | { kind: 'team'; id: string } | { kind: 'agent'; id: string } | null

interface UiState {
  tick: number
  started: boolean
  paused: boolean
  speed: 1 | 2 | 4
  panel: Panel
  lang: Lang
  setLang: (l: Lang) => void
  bump: () => void
  start: () => void
  setPaused: (p: boolean) => void
  setSpeed: (s: 1 | 2 | 4) => void
  open: (p: Panel) => void
  ready: (r: boolean) => void
  takeBreak: () => void
  answer: () => void
  choose: (i: number) => void
  disposition: (index: number) => void
}

export const useUi = create<UiState>((set) => {
  const act = (fn: () => void) => () => {
    fn()
    set((s) => ({ tick: s.tick + 1 }))
  }
  return {
    tick: 0,
    started: false,
    paused: false,
    speed: 1,
    panel: null,
    lang: initialLang(),
    setLang: (lang) => {
      try {
        localStorage.setItem('halden-lang', lang)
      } catch {
        // not being able to remember the choice is fine
      }
      set({ lang })
    },
    bump: () => set((s) => ({ tick: s.tick + 1 })),
    start: () => set({ started: true }),
    setPaused: (paused) => set({ paused }),
    setSpeed: (speed) => set({ speed, paused: false }),
    open: (panel) => set({ panel }),
    ready: (r) => act(() => playerSetReady(world, r))(),
    takeBreak: act(() => playerTakeBreak(world)),
    answer: act(() => playerAnswer(world)),
    choose: (i) => act(() => playerChoose(world, i))(),
    disposition: (index) => act(() => playerDisposition(world, index))(),
  }
})

/** Subscribe a component to the simulation clock (about four updates a second). */
export function useTick() {
  return useUi((s) => s.tick)
}

export const STATE_COLOR: Record<AgentState, string> = {
  available: '#2E9E6B',
  ringing: '#F2C230',
  on_call: '#2459D6',
  wrap: '#E08A00',
  break: '#8A7FB5',
  not_ready: '#98A3A9',
}

export const player = () => world.agents.find((a) => a.isPlayer)!
