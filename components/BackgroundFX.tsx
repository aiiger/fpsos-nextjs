'use client'

export default function BackgroundFX() {
  return (
    <div className="bgLayer" aria-hidden="true">
      <div className="blob layer-one" />
      <div className="blob layer-two" />
      <div className="blob layer-three" />
      <div className="vignette" />
      <div className="noise" />
      <div className="gridOverlay" />
    </div>
  )
}
