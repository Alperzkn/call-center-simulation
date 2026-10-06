import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import wallFont from '@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff?url'
import { AISLE_OFFSET, STATE_LABEL, TARGETS, floorKpis, fmtDuration, step, type Agent, type Team } from '../sim/engine'
import { useI18n } from '../i18n'
import { STATE_COLOR, useUi, world } from '../store'

const WALK_SPEED = 3.2
const C = {
  carpet: '#B4C1C4',
  rug: '#A3B3B8',
  wall: '#EDF0EC',
  desk: '#E9DDC9',
  metal: '#8C979D',
  chair: '#2F3B45',
  screenOff: '#1C242B',
  partition: '#7F96A3',
}

/** Advances the simulation from the render loop and nudges the UI a few times a second. */
function SimDriver() {
  const acc = useRef(0)
  useFrame((_, delta) => {
    const ui = useUi.getState()
    const dt = Math.min(delta, 0.1)
    if (ui.started && !ui.paused) {
      // The floor slows right down while the trainee is on a call, so call timers stay readable.
      const rate = world.player.phase === 'idle' ? 20 * ui.speed : 3
      let remaining = dt * rate
      while (remaining > 0) {
        const d = Math.min(remaining, 2)
        step(world, d)
        remaining -= d
      }
    }
    acc.current += dt
    if (acc.current > 0.25) {
      acc.current = 0
      ui.bump()
    }
  })
  return null
}

function usePointer(onClick: () => void) {
  const [hovered, setHovered] = useState(false)
  const handlers = {
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      onClick()
    },
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      setHovered(true)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      setHovered(false)
      document.body.style.cursor = ''
    },
  }
  return { hovered, handlers }
}

interface Look { skin: string; hair: string; shirt: string }

/** A low-poly person. Model forward is -z. Seated and standing leg sets are toggled by the parent. */
function Figure({ look, headset, upper, head, seatedLegs, standingLegs }: {
  look: Look
  headset?: boolean
  upper: React.RefObject<THREE.Group | null>
  head: React.RefObject<THREE.Group | null>
  seatedLegs: React.RefObject<THREE.Group | null>
  standingLegs: React.RefObject<THREE.Group | null>
}) {
  return (
    <group>
      <group ref={upper}>
        <mesh position={[0, 0.98, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.34, 4, 12]} />
          <meshStandardMaterial color={look.shirt} roughness={0.85} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.25, 0.95, -0.14]} rotation={[-0.9, 0, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.34, 4, 8]} />
            <meshStandardMaterial color={look.shirt} roughness={0.85} />
          </mesh>
        ))}
        <group ref={head} position={[0, 1.45, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.17, 20, 16]} />
            <meshStandardMaterial color={look.skin} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.03, 0.025]}>
            <sphereGeometry args={[0.18, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={look.hair} roughness={0.9} />
          </mesh>
          {headset && (
            <>
              <mesh rotation={[0, 0, 0]} position={[0, 0.02, 0]}>
                <torusGeometry args={[0.19, 0.016, 6, 18, Math.PI]} />
                <meshStandardMaterial color="#20282E" />
              </mesh>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.185, 0, 0]}>
                  <sphereGeometry args={[0.05, 10, 8]} />
                  <meshStandardMaterial color="#20282E" />
                </mesh>
              ))}
              <mesh position={[0.17, -0.07, -0.09]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[0.015, 0.015, 0.17]} />
                <meshStandardMaterial color="#20282E" />
              </mesh>
            </>
          )}
        </group>
      </group>
      <group ref={seatedLegs}>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.11, 0.62, -0.2]} castShadow>
              <boxGeometry args={[0.14, 0.13, 0.46]} />
              <meshStandardMaterial color="#39434B" />
            </mesh>
            <mesh position={[s * 0.11, 0.33, -0.4]}>
              <boxGeometry args={[0.12, 0.5, 0.12]} />
              <meshStandardMaterial color="#39434B" />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={standingLegs} visible={false}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.1, 0.42, 0]} castShadow>
            <boxGeometry args={[0.14, 0.84, 0.15]} />
            <meshStandardMaterial color="#39434B" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Tag({ y, children, strong }: { y: number; children: React.ReactNode; strong?: boolean }) {
  return (
    <Html position={[0, y, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div className={strong ? 'tag tag-strong' : 'tag'}>{children}</div>
    </Html>
  )
}

function AgentUnit({ agent }: { agent: Agent }) {
  const open = useUi((s) => s.open)
  const selected = useUi((s) => s.panel?.kind === 'agent' && s.panel.id === agent.id)
  const { t, who } = useI18n()
  const { hovered, handlers } = usePointer(() => open({ kind: 'agent', id: agent.id }))
  const body = useRef<THREE.Group>(null)
  const upper = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const seatedLegs = useRef<THREE.Group>(null)
  const standingLegs = useRef<THREE.Group>(null)
  const screen = useRef<THREE.MeshStandardMaterial>(null)
  const beacon = useRef<THREE.MeshStandardMaterial>(null)
  const beaconLight = useRef<THREE.Mesh>(null)
  const nav = useRef({ x: agent.seat.x, z: agent.seat.z, dest: 'seat' as 'seat' | 'break', path: [] as [number, number][] })
  const phase = useMemo(() => Math.random() * 10, [])
  const aisle = agent.seat.z + AISLE_OFFSET

  useFrame(({ clock }, delta) => {
    const n = nav.current
    const want = agent.state === 'break' ? 'break' : 'seat'
    if (want !== n.dest) {
      n.dest = want
      n.path = want === 'break'
        ? [[agent.seat.x, aisle], [-8.6, aisle], [agent.breakSpot.x, agent.breakSpot.z]]
        : [[-8.6, aisle], [agent.seat.x, aisle], [agent.seat.x, agent.seat.z]]
    }
    let yaw = 0
    if (n.path.length) {
      const [tx, tz] = n.path[0]
      const dx = tx - n.x
      const dz = tz - n.z
      const dist = Math.hypot(dx, dz)
      const move = WALK_SPEED * Math.min(delta, 0.1)
      if (dist <= move) {
        n.x = tx
        n.z = tz
        n.path.shift()
      } else {
        n.x += (dx / dist) * move
        n.z += (dz / dist) * move
      }
      yaw = Math.atan2(-dx, -dz)
    } else if (n.dest === 'break') {
      yaw = Math.atan2(-(-11.4 - n.x), -(-3.5 - n.z))
    }
    const seated = n.dest === 'seat' && n.path.length === 0
    const t = clock.elapsedTime + phase
    if (body.current) {
      body.current.position.set(n.x, 0, n.z)
      body.current.rotation.y = seated ? 0 : yaw
    }
    if (seatedLegs.current) seatedLegs.current.visible = seated
    if (standingLegs.current) standingLegs.current.visible = !seated
    if (upper.current) {
      upper.current.position.y = seated ? 0 : 0.2 + (n.path.length ? Math.abs(Math.sin(t * 9)) * 0.03 : 0)
      upper.current.rotation.x = seated && agent.state === 'wrap' ? -0.12 : 0
    }
    if (head.current) {
      const talking = agent.state === 'on_call'
      head.current.rotation.x = talking ? Math.sin(t * 5) * 0.07 : 0
      head.current.rotation.y = talking ? Math.sin(t * 1.3) * 0.25 : seated ? Math.sin(t * 0.4) * 0.08 : 0
    }
    const color = STATE_COLOR[agent.state]
    const blink = agent.state === 'ringing' ? 0.4 + 0.6 * Math.abs(Math.sin(t * 7)) : 1
    if (beacon.current) {
      beacon.current.color.set(color)
      beacon.current.emissive.set(color)
      beacon.current.emissiveIntensity = 1.4 * blink
    }
    if (beaconLight.current) beaconLight.current.scale.setScalar(agent.state === 'ringing' ? 1 + 0.25 * blink : 1)
    if (screen.current) {
      const lit = agent.state === 'on_call' || agent.state === 'wrap' || agent.state === 'available' || agent.state === 'ringing'
      screen.current.emissive.set(lit ? color : '#000000')
      screen.current.emissiveIntensity = lit ? 0.55 * blink : 0
    }
  })

  const { x, z } = agent.seat
  return (
    <>
      {/* Desk, chair, monitor and status beacon stay put */}
      <group position={[x, 0, z]} {...handlers}>
        <mesh position={[0, 0.74, -0.85]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.06, 0.85]} />
          <meshStandardMaterial color={agent.isPlayer ? '#F4EBDB' : C.desk} roughness={0.7} />
        </mesh>
        {[-0.85, 0.85].map((lx) => (
          <mesh key={lx} position={[lx, 0.36, -0.85]}>
            <boxGeometry args={[0.05, 0.72, 0.7]} />
            <meshStandardMaterial color={C.metal} />
          </mesh>
        ))}
        <mesh position={[0, 1.12, -1.1]} castShadow>
          <boxGeometry args={[0.74, 0.44, 0.04]} />
          <meshStandardMaterial color={C.screenOff} />
        </mesh>
        <mesh position={[0, 1.12, -1.078]}>
          <planeGeometry args={[0.68, 0.38]} />
          <meshStandardMaterial ref={screen} color="#27323A" emissive="#000" />
        </mesh>
        <mesh position={[0, 0.84, -1.1]}>
          <boxGeometry args={[0.08, 0.16, 0.06]} />
          <meshStandardMaterial color={C.screenOff} />
        </mesh>
        <mesh position={[0, 0.78, -0.72]}>
          <boxGeometry args={[0.46, 0.02, 0.16]} />
          <meshStandardMaterial color="#D5DBDD" />
        </mesh>
        {/* Status beacon */}
        <mesh position={[0.78, 1.02, -1.14]}>
          <cylinderGeometry args={[0.018, 0.018, 0.52, 8]} />
          <meshStandardMaterial color={C.metal} />
        </mesh>
        <mesh ref={beaconLight} position={[0.78, 1.34, -1.14]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          <meshStandardMaterial ref={beacon} color="#2E9E6B" emissive="#2E9E6B" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* Chair */}
        <mesh position={[0, 0.5, 0.02]} castShadow>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color={C.chair} />
        </mesh>
        <mesh position={[0, 0.86, 0.27]} castShadow>
          <boxGeometry args={[0.48, 0.62, 0.07]} />
          <meshStandardMaterial color={C.chair} />
        </mesh>
        <mesh position={[0, 0.25, 0.02]}>
          <cylinderGeometry args={[0.04, 0.04, 0.46, 8]} />
          <meshStandardMaterial color={C.metal} />
        </mesh>
        <mesh position={[0, 0.03, 0.02]}>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 14]} />
          <meshStandardMaterial color={C.metal} />
        </mesh>
        {agent.isPlayer && (
          <mesh position={[0, 0.012, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.25, 1.36, 48]} />
            <meshBasicMaterial color="#2459D6" transparent opacity={0.55} />
          </mesh>
        )}
      </group>
      <group ref={body} position={[x, 0, z]} {...handlers}>
        <Figure look={agent.look} headset upper={upper} head={head} seatedLegs={seatedLegs} standingLegs={standingLegs} />
        {selected && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.62, 0.74, 40]} />
            <meshBasicMaterial color="#17252E" />
          </mesh>
        )}
        {(hovered || selected || agent.isPlayer) && (
          <Tag y={2.1} strong={agent.isPlayer}>
            {who(agent)}
            {(hovered || selected) && <span className="tag-sub">{t(STATE_LABEL[agent.state])}</span>}
          </Tag>
        )}
      </group>
    </>
  )
}

function LeaderUnit({ team }: { team: Team }) {
  const open = useUi((s) => s.open)
  const selected = useUi((s) => s.panel?.kind === 'team' && s.panel.id === team.id)
  const { t } = useI18n()
  const { hovered, handlers } = usePointer(() => open({ kind: 'team', id: team.id }))
  const upper = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const seatedLegs = useRef<THREE.Group>(null)
  const standingLegs = useRef<THREE.Group>(null)
  const phase = useMemo(() => Math.random() * 10, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase
    if (seatedLegs.current) seatedLegs.current.visible = false
    if (standingLegs.current) standingLegs.current.visible = true
    if (upper.current) upper.current.position.y = 0.2
    if (head.current) head.current.rotation.y = Math.sin(t * 0.5) * 0.5
  })
  return (
    <group position={[team.leaderPos.x, 0, team.leaderPos.z]} rotation={[0, Math.PI / 2, 0]} {...handlers}>
      <Figure look={team.leaderLook} upper={upper} head={head} seatedLegs={seatedLegs} standingLegs={standingLegs} />
      {/* Lanyard */}
      <mesh position={[0, 1.24, -0.2]}>
        <boxGeometry args={[0.09, 0.12, 0.01]} />
        <meshStandardMaterial color="#F2C230" />
      </mesh>
      {/* Standing desk with a team monitor */}
      <mesh position={[0, 1.08, -0.75]} castShadow>
        <boxGeometry args={[1.5, 0.06, 0.7]} />
        <meshStandardMaterial color="#D9C8AD" roughness={0.7} />
      </mesh>
      {[-0.6, 0.6].map((lx) => (
        <mesh key={lx} position={[lx, 0.53, -0.75]}>
          <boxGeometry args={[0.07, 1.06, 0.07]} />
          <meshStandardMaterial color={C.metal} />
        </mesh>
      ))}
      <mesh position={[0, 1.5, -0.98]} castShadow>
        <boxGeometry args={[1.05, 0.56, 0.04]} />
        <meshStandardMaterial color={C.screenOff} />
      </mesh>
      <mesh position={[0, 1.5, -0.955]}>
        <planeGeometry args={[0.97, 0.48]} />
        <meshStandardMaterial color="#27323A" emissive="#F2C230" emissiveIntensity={hovered || selected ? 0.75 : 0.4} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.74, 40]} />
          <meshBasicMaterial color="#17252E" />
        </mesh>
      )}
      <Tag y={2.3}>
        {team.leader}
        <span className="tag-sub">{t('Team leader, {0}', team.name.replace('Team ', ''))}</span>
      </Tag>
    </group>
  )
}

function Wallboard() {
  // Re-render about once a second; the numbers do not need more.
  useUi((s) => Math.floor(s.tick / 4))
  const open = useUi((s) => s.open)
  const { hovered, handlers } = usePointer(() => open({ kind: 'floor' }))
  const { t, pct } = useI18n()
  const k = floorKpis(world)
  // The wallboard font only carries Latin-1 glyphs, so its Turkish labels avoid ş, ğ and ı.
  const tiles = [
    { label: t('Service level'), value: pct(k.serviceLevel), bad: k.serviceLevel < TARGETS.serviceLevel },
    { label: t('In queue'), value: String(k.inQueue), bad: k.inQueue > 5 },
    { label: t('Longest wait'), value: fmtDuration(k.longestWait), bad: k.longestWait > 60 },
    { label: t('Abandoned'), value: pct(k.abandonRate, 1), bad: k.abandonRate > TARGETS.abandon },
    { label: t('Available'), value: String(k.counts.available), bad: false },
  ]
  return (
    <group position={[0, 3.25, -10.82]} {...handlers}>
      <mesh>
        <boxGeometry args={[11.6, 2.5, 0.12]} />
        <meshStandardMaterial color={hovered ? '#22333E' : '#17252E'} />
      </mesh>
      {tiles.map((tile, i) => (
        <group key={i} position={[-4.5 + i * 2.25, 0, 0.08]}>
          <Text font={wallFont} fontSize={0.34} color="#A9BAC2" anchorX="center" position={[0, 0.72, 0]}>
            {tile.label}
          </Text>
          <Text font={wallFont} fontSize={1.12} color={tile.bad ? '#FF8E6B' : '#F4F7F6'} anchorX="center" position={[0, -0.22, 0]}>
            {tile.value}
          </Text>
        </group>
      ))}
    </group>
  )
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.6, 12]} />
        <meshStandardMaterial color="#C9BBA6" />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.5, 1.3, 9]} />
        <meshStandardMaterial color="#4F7F5C" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 1.5, 0.1]} castShadow>
        <coneGeometry args={[0.32, 0.9, 8]} />
        <meshStandardMaterial color="#5E9169" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0, 0]} receiveShadow>
        <planeGeometry args={[31, 22]} />
        <meshStandardMaterial color={C.carpet} roughness={1} />
      </mesh>
      {/* Back and left walls only, so the floor reads like an open model */}
      <mesh position={[-1.5, 2.6, -11]} receiveShadow>
        <boxGeometry args={[31, 5.2, 0.24]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      <mesh position={[-17, 2.6, 0]} receiveShadow>
        <boxGeometry args={[0.24, 5.2, 22]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      {[-7.5, -2.5, 2.5, 7.5].map((wz) => (
        <mesh key={wz} position={[-16.86, 2.9, wz]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.6, 2.8]} />
          <meshStandardMaterial color="#DDF0F8" emissive="#BFE3F4" emissiveIntensity={0.55} />
        </mesh>
      ))}
      {/* Team rows: a rug and a low partition behind the monitors */}
      {world.teams.map((t) => (
        <group key={t.id}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.006, t.rowZ - 0.2]} receiveShadow>
            <planeGeometry args={[19.4, 3.7]} />
            <meshStandardMaterial color={C.rug} roughness={1} />
          </mesh>
          <mesh position={[0, 0.62, t.rowZ - 1.34]} castShadow receiveShadow>
            <boxGeometry args={[14.4, 1.24, 0.08]} />
            <meshStandardMaterial color={C.partition} roughness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Break area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12.6, 0.006, -3.2]} receiveShadow>
        <planeGeometry args={[7.2, 12.5]} />
        <meshStandardMaterial color="#C8BFAE" roughness={1} />
      </mesh>
      <mesh position={[-16.2, 0.4, -2]} castShadow>
        <boxGeometry args={[0.9, 0.5, 4.4]} />
        <meshStandardMaterial color="#6E8FA3" roughness={0.95} />
      </mesh>
      <mesh position={[-16.5, 0.85, -2]} castShadow>
        <boxGeometry args={[0.3, 0.6, 4.4]} />
        <meshStandardMaterial color="#6E8FA3" roughness={0.95} />
      </mesh>
      <mesh position={[-14.6, 0.36, -2]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 20]} />
        <meshStandardMaterial color={C.desk} />
      </mesh>
      <mesh position={[-14.6, 0.17, -2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.34, 8]} />
        <meshStandardMaterial color={C.metal} />
      </mesh>
      <mesh position={[-13, 0.5, -10.3]} castShadow>
        <boxGeometry args={[5, 1, 0.9]} />
        <meshStandardMaterial color="#DAD3C5" />
      </mesh>
      <mesh position={[-14.3, 1.3, -10.4]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.5]} />
        <meshStandardMaterial color="#39434B" />
      </mesh>
      <mesh position={[-12.4, 1.14, -10.35]}>
        <boxGeometry args={[0.9, 0.28, 0.5]} />
        <meshStandardMaterial color="#B9744A" />
      </mesh>
      <Plant position={[-9.4, 0, -9.9]} />
      <Plant position={[12.6, 0, -9.9]} />
      <Plant position={[-16, 0, 9.6]} />
      <Plant position={[-16, 0, 3.4]} />
    </group>
  )
}

export function Scene() {
  return (
    <>
      <color attach="background" args={['#D6E1E4']} />
      <fog attach="fog" args={['#D6E1E4', 45, 90]} />
      <hemisphereLight args={['#FFFFFF', '#9DAAB0', 1.15]} />
      <directionalLight
        position={[9, 18, 11]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0004}
      />
      <SimDriver />
      <Room />
      <Wallboard />
      {world.agents.map((a) => (
        <AgentUnit key={a.id} agent={a} />
      ))}
      {world.teams.map((t) => (
        <LeaderUnit key={t.id} team={t} />
      ))}
      <OrbitControls
        makeDefault
        target={[-1.6, 0.6, -1.6]}
        minDistance={7}
        maxDistance={42}
        maxPolarAngle={1.45}
        enableDamping
      />
    </>
  )
}
