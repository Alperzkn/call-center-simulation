import { useMemo } from 'react'
import { TARGETS, fmtDuration, type Agent, type CoachingKind, type FloorEvent, type Kpis } from './sim/engine'
import { SCENARIOS, type Scenario } from './sim/scenarios'
import { SCENARIOS_TR } from './sim/scenarios.tr'
import { NAMES_TR, TR } from './i18n.tr'
import { useUi, type Lang } from './store'

// English text is the key. `t('Calls waiting')` returns the Turkish string when the language is Turkish
// and the key itself otherwise. `{0}`, `{1}` are positional placeholders.
function translate(lang: Lang, key: string, args: (string | number)[]): string {
  const base = lang === 'tr' ? (TR[key] ?? key) : key
  return args.length ? base.replace(/\{(\d)\}/g, (_: string, i: string) => String(args[Number(i)])) : base
}

const scenarioCache = new Map<string, Scenario>()

function localScenario(lang: Lang, ref: Scenario | string): Scenario {
  const base = typeof ref === 'string' ? SCENARIOS.find((s) => s.id === ref)! : ref
  const text = lang === 'tr' ? SCENARIOS_TR[base.id] : undefined
  if (!text) return base
  const cached = scenarioCache.get(base.id)
  if (cached) return cached
  const merged: Scenario = {
    ...base,
    title: text.title,
    customer: { ...base.customer, ...text.customer },
    crm: text.crm,
    policy: text.policy,
    opening: text.opening,
    dispositions: text.dispositions,
    takeaway: text.takeaway,
    steps: base.steps.map((st, i) => ({
      ...st,
      prompt: text.steps[i].prompt ?? st.prompt,
      options: st.options.map((o, j) => ({ ...o, ...text.steps[i].options[j] })),
    })),
  }
  scenarioCache.set(base.id, merged)
  return merged
}

const COACH: Record<CoachingKind, [other: string, player: string]> = {
  new: [
    '{0} is just getting started. Not enough calls yet to coach on.',
    'You are just getting started. Not enough calls yet to coach on.',
  ],
  qa: [
    '{0}’s quality score is {1} against a target of {2}. Review two recorded calls together and pick one behaviour to practise.',
    'Your quality score is {1} against a target of {2}. Review two recorded calls together and pick one behaviour to practise.',
  ],
  aht: [
    '{0}’s average handle time is {1}, above the {2} target. Check where the time goes: long holds, system navigation, or wrap-up notes.',
    'Your average handle time is {1}, above the {2} target. Check where the time goes: long holds, system navigation, or wrap-up notes.',
  ],
  fcr: [
    '{0}’s first-contact resolution is {1}. Customers are calling back. Look at which call types are being transferred or left open.',
    'Your first-contact resolution is {1}. Customers are calling back. Look at which call types are being left open.',
  ],
  csat: [
    '{0}’s customer satisfaction is {1} out of 5. Listen for acknowledgement in the first 20 seconds of each call.',
    'Your customer satisfaction is {1} out of 5. Listen for acknowledgement in the first 20 seconds of each call.',
  ],
  adherence: [
    '{0}’s schedule adherence is {1}. Breaks are running over or there is unscheduled not-ready time.',
    'Your schedule adherence is {1}. Breaks are running over or there is unscheduled not-ready time.',
  ],
  allGood: [
    '{0} is meeting every target today. Recognise it, and consider them for buddying a newer colleague.',
    'You are meeting every target today. Keep it up.',
  ],
}

export function makeI18n(lang: Lang) {
  const t = (key: string, ...args: (string | number)[]) => translate(lang, key, args)
  const dec = (v: number, digits = 1) => (lang === 'tr' ? v.toFixed(digits).replace('.', ',') : v.toFixed(digits))
  // Turkish writes the percent sign before the number.
  const pct = (v: number, digits = 0) => (lang === 'tr' ? `%${dec(v, digits)}` : `${dec(v, digits)}%`)
  const scenario = (ref: Scenario | string) => localScenario(lang, ref)
  /** Agents and team leaders have Turkish names when the app is in Turkish. */
  const name = (english: string) => (lang === 'tr' ? (NAMES_TR[english] ?? english) : english)

  return {
    lang,
    t,
    dec,
    pct,
    scenario,
    name,
    who: (a: Agent) => (a.isPlayer ? t('You') : name(a.name)),
    teamName: (name: string) => t('Team {0}', name.replace('Team ', '')),
    coach(a: Agent, note: { kind: CoachingKind; k: Kpis }): string {
      const k = note.k
      const values: Record<CoachingKind, (string | number)[]> = {
        new: [],
        qa: [Math.round(k.qa), TARGETS.qa],
        aht: [fmtDuration(k.aht), fmtDuration(TARGETS.aht)],
        fcr: [pct(k.fcr)],
        csat: [dec(k.csat)],
        adherence: [pct(k.adherence)],
        allGood: [],
      }
      return t(COACH[note.kind][a.isPlayer ? 1 : 0], name(a.name).split(' ')[0], ...values[note.kind])
    },
    event(e: FloorEvent): string {
      switch (e.kind) {
        case 'abandon':
          return t('{0} caller hung up after waiting {1}', t(e.queue ?? ''), fmtDuration(e.sec ?? 0))
        case 'breakEnded':
          return t('Your break has ended. Go ready when you are back at your desk')
        case 'slDrop':
          return t('Service level fell to {0} in the last half hour', pct(e.value ?? 0))
        case 'scored':
          return t('You finished “{0}” with a quality score of {1}', scenario(e.scenarioId ?? '').title, e.value ?? 0)
      }
    },
  }
}

export type I18n = ReturnType<typeof makeI18n>

export function useI18n(): I18n {
  const lang = useUi((s) => s.lang)
  return useMemo(() => makeI18n(lang), [lang])
}

/** Every English key used by the coaching notes, so tests can check they are translated. */
export const COACH_KEYS = Object.values(COACH).flat()
