import { describe, expect, it } from 'vitest'
import {
  agentKpis, createWorld, floorKpis, playerAnswer, playerChoose, playerDisposition, playerSetReady, scoreCall, step, warmUp,
} from './engine'
import { SCENARIOS } from './scenarios'

describe('floor simulation', () => {
  it('produces plausible contact-centre numbers after a morning', () => {
    const w = createWorld(7)
    warmUp(w, 7200)
    for (let t = 0; t < 3 * 3600; t += 2) step(w, 2)
    const k = floorKpis(w)
    expect(k.offered).toBeGreaterThan(300)
    expect(k.answered + k.abandoned + k.inQueue).toBeLessThanOrEqual(k.offered)
    expect(k.serviceLevel).toBeGreaterThan(40)
    expect(k.serviceLevel).toBeLessThanOrEqual(100)
    expect(k.aht).toBeGreaterThan(240)
    expect(k.aht).toBeLessThan(600)
    expect(k.occupancy).toBeGreaterThan(50)
    expect(k.occupancy).toBeLessThanOrEqual(100)
    expect(w.floor.intervals.length).toBeGreaterThan(5)
    for (const a of w.agents.filter((x) => !x.isPlayer)) {
      const ak = agentKpis(a)
      expect(ak.handled).toBeGreaterThan(5)
      expect(ak.adherence).toBeGreaterThan(50)
    }
  })

  it('routes a scenario call to the trainee and scores it', () => {
    const w = createWorld(3)
    warmUp(w, 3600)
    playerSetReady(w, true)
    for (let i = 0; i < 600 && w.player.phase !== 'ringing'; i++) step(w, 1)
    expect(w.player.phase).toBe('ringing')
    playerAnswer(w)
    const sc = w.player.scenario!
    for (const st of sc.steps) {
      step(w, 30)
      playerChoose(w, st.options.findIndex((o) => o.q === 2))
    }
    expect(w.player.phase).toBe('wrap')
    step(w, 20)
    playerDisposition(w, 0)
    const r = w.player.result!
    expect(r.qa).toBe(100)
    expect(r.criticalFail).toBe(false)
    expect(r.fcr).toBe(true)
    expect(r.handleSec).toBeGreaterThanOrEqual(170)
    expect(agentKpis(w.agents.find((a) => a.isPlayer)!).handled).toBe(1)
  })
})

describe('scenario content', () => {
  it.each(SCENARIOS)('$id is well formed', (sc) => {
    expect(sc.steps.length).toBeGreaterThanOrEqual(4)
    expect(sc.dispositions.length).toBe(4)
    for (const st of sc.steps) {
      expect(st.options.map((o) => o.q).sort()).toEqual([0, 1, 2])
      for (const o of st.options) {
        expect(o.text.length).toBeGreaterThan(10)
        expect(o.reply.length).toBeGreaterThan(3)
        expect(o.note.length).toBeGreaterThan(20)
        if (o.critical) expect(o.q).toBe(0)
      }
    }
    const best = sc.steps.map((st, i) => ({ category: st.category, chosen: st.options.findIndex((o) => o.q === 2), q: 2 as const, i }))
    expect(scoreCall(sc, best, 90, 300, 0).qa).toBe(100)
    const worst = sc.steps.map((st) => ({ category: st.category, chosen: st.options.findIndex((o) => o.q === 0), q: 0 as const }))
    expect(scoreCall(sc, worst, 5, 300, 3).qa).toBeLessThan(20)
  })
})
