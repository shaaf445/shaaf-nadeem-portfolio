import { Component, type ReactNode } from 'react'

/** Keeps the page alive if the WebGL scene fails (old GPU, WebGL disabled, etc.). */
export class SafeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: unknown) { console.warn('3D scene disabled:', error) }
  render() { return this.state.failed ? null : this.props.children }
}
