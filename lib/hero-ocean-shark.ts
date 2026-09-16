import { CanvasTexture, Group, Mesh, MeshBasicMaterial, PlaneGeometry, RingGeometry, SRGBColorSpace, Texture } from "three"

export type SharkState = "idle" | "anticipation" | "chase" | "return"

export interface OceanBounds {
  width: number
  height: number
  waterTop: number
  shark: { x: number; y: number; width: number; height: number }
}

const ease = (value: number): number => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number): number => a + (b - a) * t

// A billboard keeps Nate's original drawing facing the camera. Reuse the already
// decoded, responsive <Image> rather than downloading the large source PNG again.
export function createOceanShark(image: HTMLImageElement) {
  const group = new Group()
  const artwork = new Group()
  group.add(artwork)
  // A responsive <Image> can replace its source before Three's first upload.
  // Freeze the decoded artwork so a resize cannot upload an empty/new image.
  const artworkCanvas = document.createElement("canvas")
  artworkCanvas.width = image.naturalWidth
  artworkCanvas.height = image.naturalHeight
  const artworkContext = artworkCanvas.getContext("2d")
  if (artworkContext) artworkContext.drawImage(image, 0, 0)
  const texture = artworkContext ? new CanvasTexture(artworkCanvas) : new Texture(image)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  const geometry = new PlaneGeometry(1, 1)
  const material = new MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false })
  const plane = new Mesh(geometry, material)
  plane.renderOrder = 6
  artwork.add(plane)

  // Match the static illustration's 0 12px 20px / 26% drop shadow.
  const shadowCanvas = document.createElement("canvas")
  const drawnWidth = 512
  const drawnHeight = drawnWidth * image.naturalHeight / image.naturalWidth
  const padding = 192
  shadowCanvas.width = drawnWidth + padding * 2
  shadowCanvas.height = Math.ceil(drawnHeight + padding * 2)
  const context = shadowCanvas.getContext("2d")
  if (context) {
    context.shadowColor = "rgb(7 27 43 / 26%)"
    context.shadowBlur = 80
    context.shadowOffsetY = 48
    context.drawImage(image, padding, padding, drawnWidth, drawnHeight)
    context.shadowColor = "transparent"
    context.globalCompositeOperation = "destination-out"
    context.drawImage(image, padding, padding, drawnWidth, drawnHeight)
  }
  const shadowTexture = new CanvasTexture(shadowCanvas)
  shadowTexture.colorSpace = SRGBColorSpace
  const shadowMaterial = new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false })
  const shadow = new Mesh(geometry, shadowMaterial)
  shadow.renderOrder = 5
  artwork.add(shadow)

  const bubbleGeometry = new RingGeometry(0.72, 1, 20)
  const bubbles = [0, 1, 2, 3].map(() => {
    const bubbleMaterial = new MeshBasicMaterial({ color: "#d8eff5", transparent: true, opacity: 0, depthTest: false, depthWrite: false })
    const bubble = new Mesh(bubbleGeometry, bubbleMaterial)
    bubble.renderOrder = 7
    group.add(bubble)
    return bubble
  })
  group.visible = false
  let bounds: OceanBounds | undefined
  let started: number | undefined
  let phase: SharkState = "idle"
  let x = 0
  let y = 0
  let scale = 1
  let bank = 0
  let lastChase = { x: 0, y: 0, scale: 1, bank: 0 }

  function reset(): void {
    started = undefined
    phase = "idle"
    group.visible = false
  }

  return {
    group,
    resize(next: OceanBounds) { bounds = next; reset() },
    reset,
    begin(time: number): boolean {
      if (started !== undefined || !bounds || bounds.height - bounds.waterTop < 48) return false
      started = time
      phase = "anticipation"
      group.visible = true
      return true
    },
    render(time: number, fishRightEdge: number): SharkState {
      if (started === undefined || !bounds) return phase
      const age = time - started
      if (age >= 5.2) { reset(); return phase }
      const { width, height, waterTop, shark } = bounds
      const units = 6 / height
      const homeX = shark.x + shark.width / 2
      const homeY = shark.y + shark.height / 2
      // Leave room for the rotated artwork's full bounding box, above the waves
      // and below both the video and the text/CTA column on every breakpoint.
      const fit = Math.min(0.92, (height - waterTop - 16) / (shark.height * 1.18))
      const laneY = waterTop + (height - waterTop) / 2
      let opacity = 1
      if (age < 0.55) {
        phase = "anticipation"
        const rock = Math.sin(Math.PI * age / 0.55)
        x = homeX + rock * 3
        y = homeY + rock * 3
        bank = -rock * 0.045
        scale = 1
      } else if (age < 3.25) {
        phase = "chase"
        const t = (age - 0.55) / 2.7
        const enter = ease(t / 0.24)
        scale = mix(1, fit, enter)
        bank = Math.sin(t * Math.PI * 2) * 0.065 * enter
        const halfWidth = (shark.width * Math.cos(bank) + shark.height * Math.abs(Math.sin(bank))) * scale / 2
        const route = Math.min(width * (width < 768 ? 0.34 : 0.38), homeX - halfWidth - 28)
        x = Math.max(homeX - route * ease(t), fishRightEdge + halfWidth + 18)
        y = mix(homeY, laneY, enter) - Math.sin(t * Math.PI) * Math.min(4, (height - waterTop) * 0.035)
        lastChase = { x, y, scale, bank }
      } else {
        phase = "return"
        const t = (age - 3.25) / 1.95
        const submergedY = height + shark.height
        if (t < 0.38) {
          const dip = ease(t / 0.38)
          x = lastChase.x - 12 * dip
          y = mix(lastChase.y, submergedY, dip)
          scale = lastChase.scale
          bank = mix(lastChase.bank, 0.12, Math.sin(dip * Math.PI))
          opacity = 1 - ease(dip / 0.8)
        } else {
          // Reposition only while completely submerged; never turn the flat art.
          const rise = ease((t - 0.52) / 0.48)
          x = homeX
          y = mix(submergedY, homeY, rise)
          scale = mix(fit, 1, rise)
          bank = -0.035 * Math.sin(rise * Math.PI)
          opacity = rise
        }
      }
      artwork.position.set((x - width / 2) * units, (height / 2 - y) * units, 3)
      artwork.rotation.z = bank
      artwork.scale.setScalar(scale)
      plane.scale.set(shark.width * units, shark.height * units, 1)
      shadow.scale.set(shark.width * units * shadowCanvas.width / drawnWidth, shark.height * units * shadowCanvas.height / drawnHeight, 1)
      material.opacity = shadowMaterial.opacity = opacity
      bubbles.forEach((bubble, index) => {
        const t = (age - index * 0.1) / 0.95
        bubble.visible = t > 0 && t < 1
        bubble.material.opacity = Math.sin(Math.max(0, Math.min(1, t)) * Math.PI) * 0.65
        bubble.position.set((homeX - shark.width * 0.35 - index * 5 - width / 2) * units, (height / 2 - (shark.y + shark.height * 0.25 - t * 20)) * units, 3)
        bubble.scale.setScalar((2.5 + index * 0.6) * units)
      })
      return phase
    },
    dispose() {
      geometry.dispose()
      texture.dispose()
      material.dispose()
      shadowTexture.dispose()
      shadowMaterial.dispose()
      bubbleGeometry.dispose()
      bubbles.forEach((bubble) => bubble.material.dispose())
      group.clear()
    },
  }
}
