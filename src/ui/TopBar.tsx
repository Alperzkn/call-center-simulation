import { TARGETS, floorKpis, fmtClock, fmtDuration } from '../sim/engine'
import { useI18n } from '../i18n'
import { player, useTick, useUi, world } from '../store'
import { LangSwitch } from './LangSwitch'

export function TopBar() {
  useTick()
  const { paused, speed, setPaused, setSpeed, open, panel, started } = useUi()
  const { t, pct } = useI18n()
  const k = floorKpis(world)
  const me = player()
  const slow = world.player.phase !== 'idle'
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <div>
          <strong>{t('Halden contact centre')}</strong>
          <span>{t('Agent training floor')}</span>
        </div>
      </div>

      <dl className="live" aria-label={t('Live floor figures')}>
        <div>
          <dt>{t('Floor time')}</dt>
          <dd>{fmtClock(world.now)}</dd>
        </div>
        <div>
          <dt>{t('Calls waiting')}</dt>
          <dd className={k.inQueue > 5 ? 'is-bad' : ''}>{k.inQueue}</dd>
        </div>
        <div>
          <dt>{t('Longest wait')}</dt>
          <dd className={k.longestWait > 60 ? 'is-bad' : ''}>{fmtDuration(k.longestWait)}</dd>
        </div>
        <div>
          <dt>{t('Service level')}</dt>
          <dd className={k.serviceLevel < TARGETS.serviceLevel ? 'is-bad' : ''}>{pct(k.serviceLevel)}</dd>
        </div>
      </dl>

      <div className="topbar-actions">
        {started && (
          <div className="speed" role="group" aria-label={t('Simulation speed')}>
            <button className={paused ? 'on' : ''} onClick={() => setPaused(!paused)} aria-pressed={paused}>
              {paused ? t('Resume') : t('Pause')}
            </button>
            {([1, 2, 4] as const).map((s) => (
              <button
                key={s}
                className={!paused && speed === s && !slow ? 'on' : ''}
                onClick={() => setSpeed(s)}
                disabled={slow}
                title={slow ? t('The floor runs slowly while you are on a call') : t('Run the floor at {0}× speed', s)}
              >
                {s}×
              </button>
            ))}
          </div>
        )}
        <nav className="views" aria-label={t('Dashboards')}>
          <button className={panel?.kind === 'floor' ? 'on' : ''} onClick={() => open({ kind: 'floor' })}>
            {t('Floor dashboard')}
          </button>
          <button className={panel?.kind === 'team' ? 'on' : ''} onClick={() => open({ kind: 'team', id: me.teamId })}>
            {t('Team leaders')}
          </button>
          <button
            className={panel?.kind === 'agent' && panel.id === me.id ? 'on' : ''}
            onClick={() => open({ kind: 'agent', id: me.id })}
          >
            {t('My performance')}
          </button>
        </nav>
        <LangSwitch />
      </div>
    </header>
  )
}
