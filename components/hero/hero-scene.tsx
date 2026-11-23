"use client"

import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer, MeshTransmissionMaterial, Text } from "@react-three/drei"

const FONT_URL = "/fonts/syne-800.woff"

interface HeroSceneProps {
  /** Render loop runs only while the hero is on screen */
  inView: boolean
  dark: boolean
  /** Fires once both name lines are laid out with the real font (i.e. visibly drawn) */
  onReady?: () => void
}

/** Normalised pointer (-1..1) tracked on window, so DOM overlays don't block it. */
function useWindowPointer() {
  const pointer = useRef(new THREE.Vector2(0, 0))
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])
  return pointer
}

function Name({ dark, onReady }: { dark: boolean; onReady?: () => void }) {
  // troika lays text out asynchronously (font fetch + worker); wait for both lines
  const synced = useRef(0)
  const onSync = () => {
    synced.current += 1
    if (synced.current === 2) onReady?.()
  }
  const { viewport, camera } = useThree()
  // Viewport size measured at the text's depth
  const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, -1))
  // "SAFDILA" in Syne 800 is ~6.9em wide → keep it within ~85% of the viewport
  const size = Math.min(vp.width / 8.2, vp.height / 2.6)
  const color = dark ? "#f5f5f5" : "#0a0a0a"

  return (
    <group position={[0, 0, -1]}>
      <Text font={FONT_URL} fontSize={size} color={color} anchorX="center" anchorY="middle" position={[0, size * 0.47, 0]} letterSpacing={-0.02} onSync={onSync}>
        RIZKY
      </Text>
      <Text font={FONT_URL} fontSize={size} color={color} anchorX="center" anchorY="middle" position={[0, -size * 0.47, 0]} letterSpacing={-0.02} onSync={onSync}>
        SAFDILA
      </Text>
    </group>
  )
}

function Glass({ dark, pointer }: { dark: boolean; pointer: React.RefObject<THREE.Vector2> }) {
  const mesh = useRef<THREE.Mesh>(null)
  const { viewport, size } = useThree()
  const mobile = size.width < 768
  const scale = Math.min(1, viewport.width / 7) * 0.8
  const background = useMemo(() => new THREE.Color(dark ? "#0a0a0a" : "#ffffff"), [dark])

  useFrame((_, dt) => {
    const m = mesh.current
    if (!m) return
    m.rotation.x += dt * 0.15
    m.rotation.y += dt * 0.25
    const k = 1 - Math.exp(-dt * 4)
    const p = pointer.current
    m.position.x += (p.x * (viewport.width / 4) - m.position.x) * k
    m.position.y += (p.y * (viewport.height / 4) - m.position.y) * k
  })

  return (
    <mesh ref={mesh} scale={scale}>
      <torusKnotGeometry args={[0.9, 0.32, 220, 32]} />
      <MeshTransmissionMaterial
        background={background}
        backside
        samples={mobile ? 3 : 6}
        resolution={mobile ? 256 : 512}
        thickness={0.2}
        roughness={0.05}
        chromaticAberration={0.08}
        anisotropy={0.2}
        ior={1.2}
        distortion={0.05}
        distortionScale={0.4}
        temporalDistortion={0.05}
      />
    </mesh>
  )
}

export default function HeroScene({ inView, dark, onReady }: HeroSceneProps) {
  const pointer = useWindowPointer()

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 35 }}
      frameloop={inView ? "always" : "never"}
    >
      <ambientLight intensity={0.6} />
      {/* Local light rig instead of a remote HDR preset — no network fetch */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#7ccf00" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#2b7fff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={3} position={[0, 0, -5]} scale={4} />
      </Environment>
      <Name dark={dark} onReady={onReady} />
      <Glass dark={dark} pointer={pointer} />
    </Canvas>
  )
}
