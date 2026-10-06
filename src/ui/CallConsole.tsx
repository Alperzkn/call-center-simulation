import { useEffect, useRef, useState } from 'react'
import { TARGETS, agentKpis, fmtClock, fmtDuration, type CallResult, type TranscriptLine } from '../sim/engine'
import { QA_LABELS, type Scenario } from '../sim/scenarios'
import { useI18n, type I18n } from '../i18n'
import { player, useTick, useUi, world } from '../store'

const QUALITY = ['Missed the mark', 'Acceptable', 'Best practice'] as const

function moodLabel(mood: number) {
  if (mood < 20) return 'Angry'
  if (mood < 40) return 'Upset'
  if (mood < 60) return 'Neutral'
  if (mood < 80) return 'Reassured'
  return 'Happy'
}

/** Transcript lines are references into the scenario, so they are worded in the current language. */
function lineText(sc: Scenario, line: TranscriptLine, t: I18n['t']): string {
  const step = sc.steps[line.step ?? 0]
  switch (line.src) {
    case 'greeting':
      return t('Thank you for calling Halden. You’re through to the support team. How can I help?')
    case 'opening':
      return sc.opening
    case 'prompt':
      return step.prompt ?? ''
    case 'said':
      return step.options[line.opt ?? 0].text
    case 'reply':
      return step.options[line.opt ?? 0].reply
  }
}

function Idle() {
  const { ready, takeBreak } = useUi()
  const { t } = useI18n()
  const me = player()
  const k = agentKpis(me)
  const taken = world.player.history.length
  return (
    <section className="console console-idle">
      <h2>{t('Your phone')}</h2>
      {me.state === 'available' && (
        <>
          <p className="phone-state">
            <i className="dot dot-available" /> {t('Ready. Waiting for the next call…')}
          </p>
          <div className="row">
            <button className="btn" onClick={() => ready(false)}>{t('Go not ready')}</button>
          </div>
        </>
      )}
      {me.state === 'not_ready' && (
        <>
          <p className="phone-state">
            <i className="dot dot-not_ready" /> {t('Not ready. Calls will not be routed to you.')}
          </p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => ready(true)}>{t('Go ready')}</button>
            <button className="btn" onClick={takeBreak}>{t('Take a 10-minute break')}</button>
          </div>
        </>
      )}
      {me.state === 'break' && (
        <>
          <p className="phone-state">
            <i className="dot dot-break" /> {t('On break until {0}.', fmtClock(me.breakEndsAt))}
          </p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => ready(true)}>{t('End break and go ready')}</button>
          </div>
        </>
      )}
      {taken > 0 && (
        <dl className="mini-stats">
          <div><dt>{t('Calls taken')}</dt><dd>{taken}</dd></div>
          <div><dt>{t('Quality')}</dt><dd>{Math.round(k.qa)}</dd></div>
          <div><dt>{t('Handle time')}</dt><dd>{fmtDuration(k.aht)}</dd></div>
        </dl>
      )}
    </section>
  )
}

function Ringing() {
  const answer = useUi((s) => s.answer)
  const { t } = useI18n()
  const me = player()
  const call = me.call!
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        answer()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answer])
  return (
    <section className="console console-ringing">
      <h2>{t('Incoming call')}</h2>
      <p className="ring-queue">{t('{0} queue', t(call.queue))}</p>
      <p className="ring-wait">{t('Caller has waited {0}', fmtDuration(world.now - call.arrivedAt))}</p>
      <button className="btn btn-primary btn-lg ring-btn" onClick={answer}>{t('Answer call')}</button>
      <p className="hint">{t('or press Enter')}</p>
    </section>
  )
}

function InCall() {
  const choose = useUi((s) => s.choose)
  const i18n = useI18n()
  const { t } = i18n
  const p = world.player
  const sc = i18n.scenario(p.scenario!)
  const [tab, setTab] = useState<'account' | 'policy'>('account')
  const log = useRef<HTMLDivElement>(null)
  const elapsed = world.now - p.startedAt
  const stepDef = sc.steps[p.stepIndex]

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [p.transcript.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= p.order.length) choose(p.order[n - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choose, p.order])

  return (
    <section className="console console-call">
      <header className="call-head">
        <div>
          <h2>{sc.customer.name}</h2>
          <p>{t('{0} queue, account {1}', t(sc.queue), sc.customer.account)}</p>
        </div>
        <div className={`call-timer${elapsed > sc.targetAht ? ' is-bad' : ''}`}>
          <strong>{fmtDuration(elapsed)}</strong>
          <span>{t('target {0}', fmtDuration(sc.targetAht))}</span>
        </div>
      </header>

      <div className="mood" aria-label={`${t('Customer mood')}: ${t(moodLabel(p.mood))}`}>
        <span>{t('Customer mood')}</span>
        <div className="mood-track"><i style={{ width: `${p.mood}%` }} /></div>
        <strong>{t(moodLabel(p.mood))}</strong>
      </div>

      <div className="crm">
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'account'} className={tab === 'account' ? 'on' : ''} onClick={() => setTab('account')}>
            {t('Account notes')}
          </button>
          <button role="tab" aria-selected={tab === 'policy'} className={tab === 'policy' ? 'on' : ''} onClick={() => setTab('policy')}>
            {t('Policy')}
          </button>
        </div>
        <ul>
          {tab === 'account' && <li>{t('{0}. Customer for {1}', sc.customer.product, sc.customer.tenure)}</li>}
          {(tab === 'account' ? sc.crm : sc.policy).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="transcript" ref={log} aria-live="polite">
        {p.transcript.map((line, i) => (
          <p key={i} className={`line line-${line.who}`}>
            {line.who !== 'system' && <span>{line.who === 'agent' ? t('You') : sc.customer.name.split(' ')[0]}</span>}
            {lineText(sc, line, t)}
          </p>
        ))}
      </div>

      <div className="options">
        <p>{t('What do you say?')}</p>
        {p.order.map((oi, n) => (
          <button key={`${p.stepIndex}-${oi}`} className="option" onClick={() => choose(oi)}>
            <kbd>{n + 1}</kbd>
            <span>{stepDef.options[oi].text}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function Wrap() {
  const disposition = useUi((s) => s.disposition)
  const i18n = useI18n()
  const { t } = i18n
  const p = world.player
  const sc = i18n.scenario(p.scenario!)
  const last = p.transcript[p.transcript.length - 1]
  return (
    <section className="console console-wrap">
      <h2>{t('After-call work')}</h2>
      <p className={`line line-${last.who}`}>{lineText(sc, last, t)}</p>
      <p className="wrap-ask">{t('The call has ended. Pick the wrap-up code that describes it. Reporting and follow-up depend on it.')}</p>
      <div className="options">
        {p.dispositionOrder.map((di) => (
          <button key={di} className="option" onClick={() => disposition(di)}>
            <span>{sc.dispositions[di]}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function leaderComment(r: CallResult): string {
  if (r.criticalFail) return 'There was a critical breach on this call, so it fails regardless of the rest. Read the note on that step carefully, then let’s talk it through before your next one.'
  if (r.qa >= 95) return 'That is the standard I would play to new starters. Nothing to change.'
  if (r.qa >= TARGETS.qa) return 'A strong call. Look at the one or two answers below that were only acceptable; that is where the last few points are.'
  if (r.qa >= 65) return 'A fair call with clear gaps. Pick the weakest category below and focus on only that on your next call.'
  return 'This one got away from you. Read each note below. Most of the lost marks come from not acknowledging the customer or not using the policy on screen.'
}

function Review() {
  const { ready, takeBreak } = useUi()
  const i18n = useI18n()
  const { t } = i18n
  const r = world.player.result!
  const sc = i18n.scenario(r.scenario)
  const leader = world.teams.find((team) => team.id === player().teamId)!.leader
  const pass = !r.criticalFail && r.qa >= TARGETS.qa
  return (
    <section className="console console-review">
      <header className="review-head">
        <div className={`score ${pass ? 'is-good' : 'is-bad'}`}>
          <strong>{r.qa}</strong>
          <span>{t('quality score')}</span>
        </div>
        <div>
          <h2>{sc.title}</h2>
          <p className="verdict">
            {r.criticalFail
              ? `✕ ${t('Failed: critical breach')}`
              : pass
                ? `✓ ${t('Meets the {0} target', TARGETS.qa)}`
                : `! ${t('Below the {0} target', TARGETS.qa)}`}
          </p>
        </div>
      </header>

      <dl className="mini-stats">
        <div>
          <dt>{t('Satisfaction')}</dt>
          <dd>{r.csat === null ? '–' : `${r.csat} / 5`}</dd>
        </div>
        <div>
          <dt>{t('Resolved first time')}</dt>
          <dd>{r.fcr ? t('Yes') : t('No')}</dd>
        </div>
        <div>
          <dt>{t('Handle time')}</dt>
          <dd className={r.handleSec > sc.targetAht ? 'is-bad' : ''}>{fmtDuration(r.handleSec)}</dd>
        </div>
        <div>
          <dt>{t('Wrap-up code')}</dt>
          <dd className={r.dispositionCorrect ? '' : 'is-bad'}>{r.dispositionCorrect ? t('Correct') : t('Wrong')}</dd>
        </div>
      </dl>
      {sc.csatExempt && <p className="hint">{t('Satisfaction is not scored on a suspected fraud call.')}</p>}
      {!r.dispositionCorrect && <p className="hint">{t('The right code was “{0}”.', sc.dispositions[0])}</p>}

      <blockquote className="leader-note">
        <p>{t(leaderComment(r))}</p>
        <footer>{t('{0}, your team leader', i18n.name(leader))}</footer>
      </blockquote>

      <h3>{t('Score by skill')}</h3>
      <ul className="bars">
        {r.categories.map((c) => (
          <li key={c.category}>
            <span>{t(QA_LABELS[c.category])}</span>
            <div className="bar-track"><i style={{ width: `${c.score}%` }} /></div>
            <strong>{c.score}</strong>
          </li>
        ))}
      </ul>

      <h3>{t('Your answers')}</h3>
      <ol className="steps">
        {r.steps.map((s, i) => {
          const opts = sc.steps[i].options
          const chosen = opts[s.chosen]
          const best = opts.find((o) => o.q === 2)!
          return (
            <li key={i} className={`q${s.q}`}>
              <p className="step-meta">
                <span className="q-badge">{chosen.critical ? t('Critical breach') : t(QUALITY[s.q])}</span>
                {t(QA_LABELS[s.category])}
              </p>
              <p className="step-said">“{chosen.text}”</p>
              <p className="step-note">{chosen.note}</p>
              {s.q < 2 && (
                <div className="step-best">
                  <p>{t('A stronger answer')}</p>
                  <p className="step-said">“{best.text}”</p>
                  <p className="step-note">{best.note}</p>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <p className="takeaway"><strong>{t('Take away:')}</strong> {sc.takeaway}</p>

      <div className="row review-actions">
        <button className="btn btn-primary" onClick={() => ready(true)}>{t('Ready for the next call')}</button>
        <button className="btn" onClick={takeBreak}>{t('Take a break')}</button>
      </div>
    </section>
  )
}

export function CallConsole() {
  useTick()
  const phase = world.player.phase
  if (phase === 'ringing') return <Ringing />
  if (phase === 'in_call') return <InCall />
  if (phase === 'wrap') return <Wrap />
  if (phase === 'review') return <Review />
  return <Idle />
}
