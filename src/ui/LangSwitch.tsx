import { useI18n } from '../i18n'
import { useUi, type Lang } from '../store'

const LANGS: { id: Lang; short: string; name: string }[] = [
  { id: 'en', short: 'EN', name: 'English' },
  { id: 'tr', short: 'TR', name: 'Türkçe' },
]

export function LangSwitch() {
  const { lang, setLang } = useUi()
  const { t } = useI18n()
  return (
    <div className="speed lang" role="group" aria-label={t('Language')}>
      {LANGS.map((l) => (
        <button key={l.id} className={lang === l.id ? 'on' : ''} aria-pressed={lang === l.id} onClick={() => setLang(l.id)} title={l.name} lang={l.id}>
          {l.short}
        </button>
      ))}
    </div>
  )
}
