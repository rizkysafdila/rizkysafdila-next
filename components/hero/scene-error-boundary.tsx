"use client"

import { Component, type ReactNode } from "react"

interface Props {
  onError: () => void
  children: ReactNode
}

/**
 * Contains any failure of the 3D hero (chunk load error, WebGL renderer
 * creation, shader compile, font worker) so it can't take down the page.
 * Renders nothing on error; the parent switches the hero to its DOM fallback.
 */
export class SceneErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn("Hero 3D scene failed, using fallback:", error)
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
