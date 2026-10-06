import { STATE_LABEL, type AgentState } from '../sim/engine'
import { useI18n } from '../i18n'
import { STATE_COLOR } from '../store'

const ORDER: AgentState[] = ['available', 'ringing', 'on_call', 'wrap', 'break', 'not_ready']

export function Legend() {
  const { t } = useI18n()
  return (
    <aside className="legend" aria-label={t('Desk light colours')}>
      <p>{t('Desk lights')}</p>
      <ul>
        {ORDER.map((s) => (
          <li key={s}>
            <i style={{ background: STATE_COLOR[s] }} />
            {t(STATE_LABEL[s])}
          </li>
        ))}
      </ul>
      <p className="legend-hint">{t('Click an agent, a team leader or the wallboard to open its dashboard. Drag to look around.')}</p>
    </aside>
  )
}
