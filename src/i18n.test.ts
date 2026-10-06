import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { COACH_KEYS, makeI18n } from './i18n'
import { NAMES_TR, TR } from './i18n.tr'
import { QUEUE_MIX, STATE_LABEL, createWorld } from './sim/engine'
import { QA_LABELS, SCENARIOS } from './sim/scenarios'
import { SCENARIOS_TR } from './sim/scenarios.tr'

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? sourceFiles(join(dir, e.name)) : /\.tsx?$/.test(e.name) && !e.name.includes('.test.') ? [join(dir, e.name)] : [],
  )
}

describe('Turkish UI strings', () => {
  it('translates every t(...) literal in the source', () => {
    const missing = new Set<string>()
    for (const file of sourceFiles(join(__dirname))) {
      const src = readFileSync(file, 'utf8')
      for (const m of src.matchAll(/\bt\(\s*'((?:[^'\\]|\\.)*)'/g)) if (!(m[1] in TR)) missing.add(m[1])
    }
    expect([...missing]).toEqual([])
  })

  it('translates strings that reach t() through variables', () => {
    const ui = [join(__dirname, 'ui/CallConsole.tsx'), join(__dirname, 'ui/Intro.tsx')].map((f) => readFileSync(f, 'utf8')).join('\n')
    // Quality labels, mood labels, team leader comments and intro steps are plain string literals in these files.
    const literals = [...ui.matchAll(/(?:return|\[|, )\s*'((?:[^'\\]|\\.){4,})'/g)].map((m) => m[1]).filter((s) => /^[A-Z]/.test(s) && s.includes(' ') || ['Angry', 'Upset', 'Neutral', 'Reassured', 'Happy', 'Acceptable'].includes(s))
    const keys = [
      ...Object.values(STATE_LABEL),
      ...Object.values(QA_LABELS),
      ...QUEUE_MIX.flatMap((q) => [q.queue, ...q.reasons]),
      ...COACH_KEYS,
      ...literals,
    ]
    expect(literals.length).toBeGreaterThan(15)
    expect(keys.filter((k) => !(k in TR))).toEqual([])
  })

  it('keeps wallboard labels inside the 3D font’s Latin-1 glyphs', () => {
    for (const key of ['Service level', 'In queue', 'Longest wait', 'Abandoned', 'Available']) {
      expect(TR[key]).toMatch(/^[ -ÿ]+$/)
    }
  })

  it('gives every agent and team leader a distinct Turkish name', () => {
    const w = createWorld()
    const people = [...w.agents.filter((a) => !a.isPlayer).map((a) => a.name), ...w.teams.map((team) => team.leader)]
    expect(people.filter((n) => !(n in NAMES_TR))).toEqual([])
    expect(new Set(people.map((n) => NAMES_TR[n])).size).toBe(people.length)
    // first names are used alone in coaching notes, so they must be distinct too
    expect(new Set(people.map((n) => NAMES_TR[n].split(' ')[0])).size).toBe(people.length)
  })

  it('formats numbers the Turkish way', () => {
    const tr = makeI18n('tr')
    expect(tr.pct(79.4)).toBe('%79')
    expect(tr.dec(4.25)).toBe('4,3')
    expect(makeI18n('en').pct(79.4)).toBe('79%')
  })
})

describe('Turkish scenarios', () => {
  it.each(SCENARIOS)('$id mirrors the English structure', (sc) => {
    const text = SCENARIOS_TR[sc.id]
    expect(text).toBeDefined()
    expect(text.steps.length).toBe(sc.steps.length)
    expect(text.dispositions.length).toBe(sc.dispositions.length)
    expect(text.crm.length).toBe(sc.crm.length)
    expect(text.policy.length).toBe(sc.policy.length)
    sc.steps.forEach((st, i) => {
      expect(Boolean(text.steps[i].prompt)).toBe(Boolean(st.prompt))
      expect(text.steps[i].options.length).toBe(st.options.length)
      for (const o of text.steps[i].options) {
        expect(o.text.length).toBeGreaterThan(10)
        expect(o.reply.length).toBeGreaterThan(3)
        expect(o.note.length).toBeGreaterThan(20)
      }
    })
    const merged = makeI18n('tr').scenario(sc)
    expect(merged.title).toBe(text.title)
    expect(merged.steps.map((s) => s.options.map((o) => o.q))).toEqual(sc.steps.map((s) => s.options.map((o) => o.q)))
    expect(merged.steps[0].options[0].text).toBe(text.steps[0].options[0].text)
  })
})
