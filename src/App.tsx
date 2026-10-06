import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './scene/Scene'
import { TopBar } from './ui/TopBar'
import { CallConsole } from './ui/CallConsole'
import { Dashboard } from './ui/Dashboard'
import { Intro } from './ui/Intro'
import { Legend } from './ui/Legend'
import { useUi } from './store'

export function App() {
  const started = useUi((s) => s.started)
  const lang = useUi((s) => s.lang)
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'tr' ? 'Halden Çağrı Merkezi: eğitim katı' : 'Halden Contact Centre: training floor'
  }, [lang])
  return (
    <div className="app">
      <Canvas
        className="stage"
        shadows
        dpr={[1, 2]}
        camera={{ position: [1, 19, 28], fov: 36, near: 0.5, far: 120 }}
        onPointerMissed={() => useUi.getState().open(null)}
      >
        <Scene />
      </Canvas>
      <TopBar />
      {started && <CallConsole />}
      <Dashboard />
      <Legend />
      {!started && <Intro />}
    </div>
  )
}
