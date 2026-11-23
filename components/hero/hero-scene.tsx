"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer, MeshTransmissionMaterial, Text } from "@react-three/drei"
import { NAME_BOTTOM_RESERVE, NAME_TOP_RESERVE } from "./constants"

const FONT_URL = "/fonts/syne-800.woff"

interface HeroSceneProps {
  /** Name lines, drawn stacked (e.g. ["MUHAMMAD", "RIZKY", "SAFDILA"]) */
  lines: string[]
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

function Name({ lines, dark, onReady }: { lines: string[]; dark: boolean; onReady?: () => void }) {
  const { viewport, camera, size: px } = useThree()
  // Viewport size measured at the text's depth
  const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, -1))
  const unitsPerPx = vp.height / px.height
  // Keep the name between the top meta row and the bottom tagline block:
  // centre it in that band and size it to the band's height (width fit below)
  const bandPx = Math.max(px.height - NAME_TOP_RESERVE - NAME_BOTTOM_RESERVE, px.height * 0.3)
  const offsetY = ((NAME_BOTTOM_RESERVE - NAME_TOP_RESERVE) / 2) * unitsPerPx
  const size = (bandPx * unitsPerPx) / (lines.length * 1.05)
  const lineGap = size * 0.94
  const color = dark ? "#f5f5f5" : "#0a0a0a"

  // troika lays text out asynchronously (font fetch + worker): collect each
  // line's real width, then fit the block to ~88% of the viewport width.
  const [widths, setWidths] = useState<number[]>([])
  const reported = useRef(false)
  const onSync = (index: number) => (troika: { textRenderInfo?: { blockBounds?: number[] } }) => {
    const b = troika.textRenderInfo?.blockBounds
    if (!b) return
    setWidths((prev) => {
      const next = [...prev]
      next[index] = b[2] - b[0]
      return next
    })
  }

  const measured = widths.filter((w) => w > 0).length === lines.length
  const fit = measured ? Math.min(1, (vp.width * 0.88) / Math.max(...widths)) : 1

  useEffect(() => {
    if (measured && !reported.current) {
      reported.current = true
      onReady?.()
    }
  }, [measured, onReady])

  return (
    <group position={[0, offsetY, -1]} scale={fit} visible={measured}>
      {lines.map((line, i) => (
        <Text
          key={`${i}-${line}`}
          font={FONT_URL}
          fontSize={size}
          color={color}
          anchorX="center"
          anchorY="middle"
          position={[0, ((lines.length - 1) / 2 - i) * lineGap, 0]}
          letterSpacing={-0.02}
          onSync={onSync(i)}
        >
          {line}
        </Text>
      ))}
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

export default function HeroScene({ lines, inView, dark, onReady }: HeroSceneProps) {
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
      <Name lines={lines} dark={dark} onReady={onReady} />
      <Glass dark={dark} pointer={pointer} />
    </Canvas>
  )
}
