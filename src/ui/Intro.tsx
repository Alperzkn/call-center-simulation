import { useI18n } from '../i18n'
import { useUi } from '../store'
import { LangSwitch } from './LangSwitch'

const STEPS: [string, string][] = [
  ['Go ready and answer.', 'Calls are routed to you from the live queue. Each one is a real kind of contact: bill shock, an outage, a fraud attempt, a bereavement.'],
  ['Choose what to say.', 'The customer reacts to every answer. The account notes and policy are on screen, as they would be at a real desk.'],
  ['Read your scorecard.', 'After each call your team leader marks quality, satisfaction, handle time and first-contact resolution, and explains what the best answer was.'],
  ['Watch the numbers.', 'Click any agent, a team leader, or the wallboard to see their dashboard. The buttons at the top open the same views.'],
]

export function Intro() {
  const start = useUi((s) => s.start)
  const { t } = useI18n()
  return (
    <div className="intro" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="intro-card">
        <div className="intro-lang">
          <LangSwitch />
        </div>
        <h1 id="intro-title">{t('Your first shift on the floor')}</h1>
        <p className="intro-lede">
          {t('You are the newest agent on Team Birch at Halden, a mobile and broadband provider. Fourteen colleagues are already taking calls around you. Your desk is the one with the blue ring.')}
        </p>
        <ol className="intro-steps">
          {STEPS.map(([head, body]) => (
            <li key={head}>
              <p>
                <strong>{t(head)}</strong> {t(body)}
              </p>
            </li>
          ))}
        </ol>
        <button className="btn btn-primary btn-lg" onClick={start} autoFocus>
          {t('Start the shift')}
        </button>
      </div>
    </div>
  )
}
