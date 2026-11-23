"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/magicui/dot-pattern"

/**
 * Full-viewport WebGL background.
 *
 * - Slow domain-warped flow field tinted with the brand lime → blue gradient.
 * - Dot grid (successor of <DotPattern />) whose dots swell and get pushed
 *   away from the cursor, with a soft accent glow following the pointer.
 * - Theme-aware: light/dark is cross-faded through a uniform.
 * - Respects `prefers-reduced-motion` (single static frame, no cursor effect),
 *   pauses while the tab is hidden, and falls back to <DotPattern /> when
 *   WebGL is unavailable.
 */

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_active;
uniform float u_dark;
uniform float u_dpr;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Flow field
  float t = u_time * 0.04;
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 4.0));
  float f = fbm(p * 1.2 + q * 1.5 + vec2(t * 0.5, -t * 0.3));

  vec3 lime = vec3(0.486, 0.812, 0.0);  // #7ccf00
  vec3 blue = vec3(0.169, 0.498, 1.0);  // #2b7fff
  vec3 accent = mix(lime, blue, smoothstep(0.35, 0.75, q.x));

  vec3 base = mix(vec3(1.0), vec3(0.039), u_dark);

  // Cursor
  vec2 toMouse = frag - u_mouse;
  float md = length(toMouse);
  float radius = 160.0 * u_dpr;
  float influence = exp(-(md * md) / (2.0 * radius * radius)) * u_active;

  float flow = smoothstep(0.35, 0.8, f) * mix(0.2, 0.22, u_dark);
  vec3 col = mix(base, accent, flow + influence * mix(0.1, 0.16, u_dark));

  // Dot grid, pushed away from the cursor
  float spacing = 16.0 * u_dpr;
  vec2 push = md > 0.001 ? (toMouse / md) * influence * 7.0 * u_dpr : vec2(0.0);
  vec2 cell = mod(frag - push, spacing) - spacing * 0.5;
  float wave = 0.5 + 0.5 * sin(md / (22.0 * u_dpr) - u_time * 2.5);
  float r = u_dpr * (1.0 + influence * (1.1 + 0.4 * wave));
  float dotMask = 1.0 - smoothstep(r - 0.75 * u_dpr, r + 0.75 * u_dpr, length(cell));

  // Fade dots toward the edges (same idea as the old radial mask)
  float center = 1.0 - smoothstep(0.0, 700.0 * u_dpr, length(frag - u_res * 0.5));
  float dotAlpha = dotMask * clamp(center * mix(0.75, 0.45, u_dark) + influence, 0.0, 1.0);
  vec3 dotCol = mix(vec3(0.64), accent, influence);

  col = mix(col, dotCol, dotAlpha);
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const darkTarget = useRef(0)
  const redraw = useRef<() => void>(() => {})
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    darkTarget.current = resolvedTheme === "dark" ? 1 : 0
    redraw.current()
  }, [resolvedTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" })
    if (!gl) {
      setFailed(true)
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = gl.createProgram()
    if (!vs || !fs || !program) {
      setFailed(true)
      return
    }
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true)
      return
    }
    gl.useProgram(program)

    // Full-screen triangle
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const u = {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      active: gl.getUniformLocation(program, "u_active"),
      dark: gl.getUniformLocation(program, "u_dark"),
      dpr: gl.getUniformLocation(program, "u_dpr"),
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let dpr = 1
    let dark = darkTarget.current
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: 0, targetActive: 0 }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reducedMotion.matches) return
      mouse.tx = e.clientX * dpr
      mouse.ty = (window.innerHeight - e.clientY) * dpr
      if (mouse.targetActive === 0) {
        // Jump to the pointer on (re)entry instead of sliding in from far away
        mouse.x = mouse.tx
        mouse.y = mouse.ty
      }
      mouse.targetActive = 1
    }
    const onPointerLeave = () => {
      mouse.targetActive = 0
    }

    let frame = 0
    let last = performance.now()
    let elapsed = 0
    let shown = false

    const draw = () => {
      gl.uniform2f(u.res, canvas.width, canvas.height)
      gl.uniform1f(u.time, elapsed)
      gl.uniform2f(u.mouse, mouse.x, mouse.y)
      gl.uniform1f(u.active, mouse.active)
      gl.uniform1f(u.dark, dark)
      gl.uniform1f(u.dpr, dpr)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!shown) {
        shown = true
        setReady(true)
      }
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      if (reducedMotion.matches) {
        // Static frame only; redrawn on resize / theme change
        mouse.active = 0
        dark = darkTarget.current
        draw()
        frame = 0
        return
      } else {
        elapsed += dt
        const k = 1 - Math.exp(-dt * 8)
        mouse.x += (mouse.tx - mouse.x) * k
        mouse.y += (mouse.ty - mouse.y) * k
        mouse.active += (mouse.targetActive - mouse.active) * (1 - Math.exp(-dt * 4))
        dark += (darkTarget.current - dark) * (1 - Math.exp(-dt * 6))
      }

      draw()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame)
      else start()
    }

    const onResize = () => {
      resize()
      start()
    }

    resize()
    start()
    redraw.current = start

    window.addEventListener("resize", onResize)
    reducedMotion.addEventListener("change", start)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      redraw.current = () => {}
      window.removeEventListener("resize", onResize)
      reducedMotion.removeEventListener("change", start)
      window.removeEventListener("pointermove", onPointerMove)
      document.documentElement.removeEventListener("pointerleave", onPointerLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  if (failed) {
    return (
      <DotPattern
        className={cn(
          "fixed inset-0 z-[-1]",
          "mask-[radial-gradient(600px_circle_at_center,white,transparent)]",
        )}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[-1] h-full w-full transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  )
}
