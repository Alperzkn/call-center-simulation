import {
  Bar, BarChart, CartesianGrid, Legend as ChartLegend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {
  STATE_LABEL, TARGETS, agentKpis, coachingNote, floorKpis, fmtClock, fmtDuration, groupKpis,
  type Agent, type AgentState, type Kpis,
} from '../sim/engine'
import { QA_LABELS, type QaCategory } from '../sim/scenarios'
import { useI18n } from '../i18n'
import { STATE_COLOR, useTick, useUi, world } from '../store'

const SERIES = { answered: '#2459D6', abandoned: '#C8553D' }
const AXIS = { fontSize: 11, fill: '#5B6B75' }
const STATE_ORDER: AgentState[] = ['on_call', 'wrap', 'available', 'ringing', 'break', 'not_ready']

type Status = 'good' | 'bad' | 'none'

function Tile({ label, value, target, status = 'none' }: { label: string; value: string; target?: string; status?: Status }) {
  const { t } = useI18n()
  return (
    <div className={`tile tile-${status}`}>
      <span className="tile-label">{label}</span>
      <strong>{value}</strong>
      {target && (
        <span className="tile-target">
          {status !== 'none' && <b aria-hidden="true">{status === 'good' ? '✓' : '!'}</b>}
          {status === 'bad' ? t('Off target') : status === 'good' ? t('On target') : t('Target')}: {target}
        </span>
      )}
    </div>
  )
}

const hi = (v: number, t: number, has = true): Status => (!has ? 'none' : v >= t ? 'good' : 'bad')
const lo = (v: number, t: number, has = true): Status => (!has ? 'none' : v <= t ? 'good' : 'bad')

function PeopleTiles({ k }: { k: Kpis }) {
  const { t, pct, dec } = useI18n()
  const has = k.handled > 0
  return (
    <div className="tiles">
      <Tile label={t('Calls handled')} value={String(k.handled)} />
      <Tile label={t('Average handle time')} value={has ? fmtDuration(k.aht) : '–'} target={t('{0} or less', fmtDuration(TARGETS.aht))} status={lo(k.aht, TARGETS.aht, has)} />
      <Tile label={t('Resolved first time')} value={has ? pct(k.fcr) : '–'} target={pct(TARGETS.fcr)} status={hi(k.fcr, TARGETS.fcr, has)} />
      <Tile label={t('Satisfaction')} value={k.csat ? `${dec(k.csat)} / 5` : '–'} target={dec(TARGETS.csat)} status={hi(k.csat, TARGETS.csat, k.csat > 0)} />
      <Tile label={t('Quality score')} value={k.qa ? String(Math.round(k.qa)) : '–'} target={String(TARGETS.qa)} status={hi(k.qa, TARGETS.qa, k.qa > 0)} />
      <Tile label={t('Schedule adherence')} value={pct(k.adherence)} target={pct(TARGETS.adherence)} status={hi(k.adherence, TARGETS.adherence)} />
      <Tile
        label={t('Occupancy')}
        value={pct(k.occupancy)}
        target={`${pct(TARGETS.occupancyLow)}–${pct(TARGETS.occupancyHigh)}`}
        status={!has ? 'none' : k.occupancy >= TARGETS.occupancyLow && k.occupancy <= TARGETS.occupancyHigh ? 'good' : 'bad'}
      />
    </div>
  )
}

function StateDot({ state }: { state: AgentState }) {
  const { t } = useI18n()
  return <i className="dot" style={{ background: STATE_COLOR[state] }} title={t(STATE_LABEL[state])} />
}

function AgentTable({ agents }: { agents: Agent[] }) {
  const open = useUi((s) => s.open)
  const { t, pct, dec, who } = useI18n()
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t('Agent')}</th><th>{t('Calls')}</th><th>{t('Handle')}</th><th>{t('First time')}</th><th>{t('Sat.')}</th><th>{t('Quality')}</th><th>{t('Adher.')}</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => {
            const k = agentKpis(a)
            return (
              <tr key={a.id} onClick={() => open({ kind: 'agent', id: a.id })} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open({ kind: 'agent', id: a.id })}>
                <td><StateDot state={a.state} />{who(a)}</td>
                <td>{k.handled}</td>
                <td className={k.handled && k.aht > TARGETS.aht ? 'is-bad' : ''}>{k.handled ? fmtDuration(k.aht) : '–'}</td>
                <td className={k.handled && k.fcr < TARGETS.fcr ? 'is-bad' : ''}>{k.handled ? pct(k.fcr) : '–'}</td>
                <td className={k.csat && k.csat < TARGETS.csat ? 'is-bad' : ''}>{k.csat ? dec(k.csat) : '–'}</td>
                <td className={k.qa && k.qa < TARGETS.qa ? 'is-bad' : ''}>{k.qa ? Math.round(k.qa) : '–'}</td>
                <td className={k.adherence < TARGETS.adherence ? 'is-bad' : ''}>{pct(k.adherence)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function FloorPanel() {
  const open = useUi((s) => s.open)
  const i18n = useI18n()
  const { t, pct, dec } = i18n
  const k = floorKpis(world)
  const rows = world.floor.intervals.slice(-12).map((r) => ({ ...r, time: fmtClock(r.t), sl: Math.round(r.sl) }))
  const total = world.agents.length
  return (
    <>
      <header className="panel-head">
        <h2>{t('Floor dashboard')}</h2>
        <p>{t('All queues, today so far. {0} agents in 3 teams.', total)}</p>
      </header>

      <div className="tiles">
        <Tile label={t('Service level')} value={pct(k.serviceLevel)} target={t('{0} in 20 s', pct(TARGETS.serviceLevel))} status={hi(k.serviceLevel, TARGETS.serviceLevel)} />
        <Tile label={t('Average speed of answer')} value={t('{0} s', Math.round(k.asa))} target={t('{0} or less', t('{0} s', TARGETS.asa))} status={lo(k.asa, TARGETS.asa)} />
        <Tile label={t('Abandoned')} value={pct(k.abandonRate, 1)} target={t('{0} or less', pct(TARGETS.abandon))} status={lo(k.abandonRate, TARGETS.abandon)} />
        <Tile label={t('Calls waiting')} value={String(k.inQueue)} />
        <Tile label={t('Longest wait')} value={fmtDuration(k.longestWait)} />
        <Tile label={t('Calls offered')} value={String(k.offered)} />
      </div>

      <h3>{t('Agents right now')}</h3>
      <div className="statebar" role="img" aria-label={STATE_ORDER.map((s) => `${k.counts[s]} ${t(STATE_LABEL[s])}`).join(', ')}>
        {STATE_ORDER.filter((s) => k.counts[s] > 0).map((s) => (
          <i key={s} style={{ flexGrow: k.counts[s], background: STATE_COLOR[s] }} />
        ))}
      </div>
      <ul className="statekey">
        {STATE_ORDER.map((s) => (
          <li key={s}><i className="dot" style={{ background: STATE_COLOR[s] }} />{t(STATE_LABEL[s])} <strong>{k.counts[s]}</strong></li>
        ))}
      </ul>

      <h3>{t('Calls per half hour')}</h3>
      <div className="chart">
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={rows} margin={{ top: 6, right: 6, left: -22, bottom: 0 }} barCategoryGap="22%">
            <CartesianGrid stroke="#E3E8E6" vertical={false} />
            <XAxis dataKey="time" tick={AXIS} tickLine={false} axisLine={{ stroke: '#CCD4D2' }} interval="preserveStartEnd" />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'rgba(23,37,46,0.05)' }} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DCE2E0' }} />
            <ChartLegend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: '#17252E' }}>{v}</span>} />
            <Bar dataKey="answered" name={t('Answered')} stackId="a" fill={SERIES.answered} stroke="#FBFBF8" strokeWidth={1} isAnimationActive={false} />
            <Bar dataKey="abandoned" name={t('Abandoned')} stackId="a" fill={SERIES.abandoned} stroke="#FBFBF8" strokeWidth={1} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>{t('Service level per half hour')}</h3>
      <div className="chart">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={rows} margin={{ top: 8, right: 44, left: -22, bottom: 0 }}>
            <CartesianGrid stroke="#E3E8E6" vertical={false} />
            <XAxis dataKey="time" tick={AXIS} tickLine={false} axisLine={{ stroke: '#CCD4D2' }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v: number) => pct(v)} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DCE2E0' }} formatter={(v) => [pct(Number(v)), t('Service level')]} />
            <ReferenceLine y={TARGETS.serviceLevel} stroke="#5B6B75" strokeDasharray="4 4" label={{ value: t('Target'), position: 'right', fontSize: 11, fill: '#5B6B75' }} />
            <Line dataKey="sl" name={t('Service level')} stroke={SERIES.answered} strokeWidth={2} dot={{ r: 2.5 }} activeDot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>{t('Teams')}</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>{t('Team')}</th><th>{t('Calls')}</th><th>{t('Handle')}</th><th>{t('First time')}</th><th>{t('Sat.')}</th><th>{t('Quality')}</th></tr>
          </thead>
          <tbody>
            {world.teams.map((team) => {
              const tk = groupKpis(world.agents.filter((a) => a.teamId === team.id))
              return (
                <tr key={team.id} onClick={() => open({ kind: 'team', id: team.id })} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open({ kind: 'team', id: team.id })}>
                  <td>{i18n.teamName(team.name)}</td>
                  <td>{tk.handled}</td>
                  <td className={tk.aht > TARGETS.aht ? 'is-bad' : ''}>{fmtDuration(tk.aht)}</td>
                  <td className={tk.fcr < TARGETS.fcr ? 'is-bad' : ''}>{pct(tk.fcr)}</td>
                  <td className={tk.csat < TARGETS.csat ? 'is-bad' : ''}>{dec(tk.csat)}</td>
                  <td className={tk.qa < TARGETS.qa ? 'is-bad' : ''}>{Math.round(tk.qa)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h3>{t('Latest on the floor')}</h3>
      <ul className="events">
        {world.events.slice(0, 6).map((e, i) => (
          <li key={i} className={`event-${e.tone}`}>
            <time>{fmtClock(e.at)}</time>
            {i18n.event(e)}
          </li>
        ))}
        {world.events.length === 0 && <li>{t('Nothing to report yet.')}</li>}
      </ul>
    </>
  )
}

function TeamPanel({ id }: { id: string }) {
  const open = useUi((s) => s.open)
  const i18n = useI18n()
  const { t } = i18n
  const team = world.teams.find((x) => x.id === id)!
  const agents = world.agents.filter((a) => a.teamId === id)
  const k = groupKpis(agents)
  const notes = agents
    .map((a) => ({ a, note: coachingNote(a) }))
    .filter((n) => n.note.tone === 'warn')
    .slice(0, 3)
  return (
    <>
      <header className="panel-head">
        <h2>{i18n.teamName(team.name)}</h2>
        <p>{t('Team leader: {0}. {1} agents.', i18n.name(team.leader), agents.length)}</p>
      </header>
      <div className="tabs team-tabs" role="tablist">
        {world.teams.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === id} className={x.id === id ? 'on' : ''} onClick={() => open({ kind: 'team', id: x.id })}>
            {x.name.replace('Team ', '')}
          </button>
        ))}
      </div>
      <PeopleTiles k={k} />
      <h3>{t('Agents')}</h3>
      <AgentTable agents={agents} />
      <h3>{t('Coaching priorities')}</h3>
      {notes.length === 0 && <p className="muted">{t('Everyone on the team is meeting their targets.')}</p>}
      <ul className="coach-list">
        {notes.map(({ a, note }) => (
          <li key={a.id}>
            <button className="link" onClick={() => open({ kind: 'agent', id: a.id })}>{i18n.who(a)}</button>
            <p>{i18n.coach(a, note)}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

function SkillBars() {
  const { t } = useI18n()
  const history = world.player.history
  const sums = new Map<QaCategory, { total: number; n: number }>()
  for (const r of history) {
    for (const c of r.categories) {
      const s = sums.get(c.category) ?? { total: 0, n: 0 }
      s.total += c.score
      s.n++
      sums.set(c.category, s)
    }
  }
  if (!history.length) return <p className="muted">{t('Take a call to see your scores by skill.')}</p>
  return (
    <ul className="bars">
      {[...sums.entries()].map(([cat, s]) => (
        <li key={cat}>
          <span>{t(QA_LABELS[cat])}</span>
          <div className="bar-track"><i style={{ width: `${s.total / s.n}%` }} /></div>
          <strong>{Math.round(s.total / s.n)}</strong>
        </li>
      ))}
    </ul>
  )
}

function AgentPanel({ id }: { id: string }) {
  const open = useUi((s) => s.open)
  const i18n = useI18n()
  const { t, pct } = i18n
  const a = world.agents.find((x) => x.id === id)!
  const team = world.teams.find((x) => x.id === a.teamId)!
  const k = agentKpis(a)
  const note = coachingNote(a)
  const trend = a.trend.slice(-12).map((r) => ({ time: fmtClock(r.t), handled: r.handled }))
  const live = a.call && (a.state === 'on_call' || a.state === 'ringing')
  return (
    <>
      <header className="panel-head">
        <h2>{a.isPlayer ? t('Your performance') : i18n.name(a.name)}</h2>
        <p>
          <button className="link" onClick={() => open({ kind: 'team', id: team.id })}>{i18n.teamName(team.name)}</button>
          {' · '}
          {t('Team leader: {0}', i18n.name(team.leader))}
        </p>
      </header>

      <div className="now">
        <StateDot state={a.state} />
        <strong>{t(STATE_LABEL[a.state])}</strong>
        <span>{t('for {0}', fmtDuration(world.now - a.stateSince))}</span>
      </div>
      {live && a.call && (
        <div className="livecall">
          <p className="livecall-title">{a.state === 'ringing' ? t('Call ringing') : t('Live call')}</p>
          <dl>
            <div><dt>{t('Queue')}</dt><dd>{t(a.call.queue)}</dd></div>
            <div><dt>{t('Customer')}</dt><dd>{a.call.scenarioId ? i18n.scenario(a.call.scenarioId).customer.name : a.call.customer}</dd></div>
            <div><dt>{t('Reason')}</dt><dd>{a.call.scenarioId ? i18n.scenario(a.call.scenarioId).title : t(a.call.reason)}</dd></div>
            {a.call.answeredAt !== undefined && <div><dt>{t('Talk time')}</dt><dd>{fmtDuration(world.now - a.call.answeredAt)}</dd></div>}
          </dl>
        </div>
      )}

      <PeopleTiles k={k} />

      <blockquote className={`leader-note leader-${note.tone}`}>
        <p>{i18n.coach(a, note)}</p>
        <footer>{t('{0}, team leader', i18n.name(team.leader))}</footer>
      </blockquote>

      {a.isPlayer && (
        <>
          <h3>{t('Your scores by skill')}</h3>
          <SkillBars />
        </>
      )}

      <h3>{t('Calls handled per half hour')}</h3>
      {trend.length < 2 ? (
        <p className="muted">{t('The first half hour is still in progress.')}</p>
      ) : (
        <div className="chart">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={trend} margin={{ top: 6, right: 6, left: -26, bottom: 0 }} barCategoryGap="22%">
              <CartesianGrid stroke="#E3E8E6" vertical={false} />
              <XAxis dataKey="time" tick={AXIS} tickLine={false} axisLine={{ stroke: '#CCD4D2' }} interval="preserveStartEnd" />
              <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(23,37,46,0.05)' }} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DCE2E0' }} />
              <Bar dataKey="handled" name={t('Calls handled')} fill={SERIES.answered} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3>{t('Recent calls')}</h3>
      {a.recent.length === 0 ? (
        <p className="muted">{t('No calls yet.')}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>{t('Time')}</th><th>{a.isPlayer ? t('Call') : t('Queue')}</th><th>{t('Handle')}</th><th>{t('First time')}</th><th>{t('Sat.')}</th><th>{t('Quality')}</th></tr>
            </thead>
            <tbody>
              {a.recent.map((r, i) => (
                <tr key={i} className="static">
                  <td>{fmtClock(r.at)}</td>
                  <td>{r.scenarioId ? i18n.scenario(r.scenarioId).title : t(r.queue)}</td>
                  <td>{fmtDuration(r.handleSec)}</td>
                  <td className={r.fcr ? '' : 'is-bad'}>{r.fcr ? t('Yes') : t('No')}</td>
                  <td>{r.csat ?? '–'}</td>
                  <td>{r.qa ?? '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!a.isPlayer && <p className="muted small">{t('Satisfaction comes from customers who answer the survey; quality from the calls a team leader has monitored.')}</p>}
    </>
  )
}

export function Dashboard() {
  useTick()
  const { panel, open } = useUi()
  const { t } = useI18n()
  if (!panel) return null
  return (
    <aside className="panel" aria-label={t('Dashboard')}>
      <button className="panel-close" onClick={() => open(null)} aria-label={t('Close dashboard')}>×</button>
      {panel.kind === 'floor' && <FloorPanel />}
      {panel.kind === 'team' && <TeamPanel id={panel.id} />}
      {panel.kind === 'agent' && <AgentPanel id={panel.id} />}
    </aside>
  )
}
