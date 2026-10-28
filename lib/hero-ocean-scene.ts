import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from "three"
import { createOceanFish, type SwimLane } from "@/lib/hero-ocean-fish"
import { createOceanShark, type OceanBounds, type SharkState } from "@/lib/hero-ocean-shark"

export interface HeroOceanScene {
  resize: (bounds: OceanBounds, topLane: SwimLane) => void
  prepareShark: (image: HTMLImageElement) => void
  beginChase: (time: number) => boolean
  isActive: () => boolean
  render: (time: number) => SharkState
  point: (x: number, y: number) => void
  dispose: () => void
}

const waveVertex = /* glsl */ `
  uniform float uTime;
  uniform float uWidth;
  uniform float uHeight;
  uniform float uPhase;
  uniform float uActivity;
  uniform float uWaterScale;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vCrest;

  void main() {
    vUv = uv;
    float x = (uv.x - 0.5) * uWidth;
    float t = uTime * 0.34;
    float swell = (sin(x * 0.55 + t + uPhase) * 0.19
      + sin(x * 1.05 - t * 0.65 + uPhase) * 0.065)
      * mix(0.5, 1.2, uActivity);
    float depth = sin(uv.y * 3.14159) * 0.32;
    vCrest = swell;
    vec3 p = vec3(
      x + uPointer.x * 0.07 * uv.y,
      -3.13 + (uv.y * uHeight + swell * pow(uv.y, 2.0)
        + uPointer.y * 0.025 * uv.y) * uWaterScale,
      depth + cos(x * 0.4 + t + uPhase) * 0.18 * uv.y
    );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const waveFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uPhase;
  varying vec2 vUv;
  varying float vCrest;

  void main() {
    float edge = smoothstep(0.982, 1.0, vUv.y);
    float sheen = pow(max(0.0, sin(vUv.x * 7.0 + vCrest * 2.0
      - uTime * 0.06 + uPhase)), 5.0);
    vec3 color = mix(uColor * 0.42, uColor, pow(vUv.y, 1.6));
    color += vec3(0.32, 0.52, 0.55) * (edge * 0.22 + sheen * 0.065 * vUv.y);
    float alpha = uOpacity * smoothstep(0.0, 0.45, vUv.y);
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const lightVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lightFragment = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * vec2(uAspect, 1.0) + uPointer * 0.012;
    float t = uTime * 0.035;
    float bend = sin(p.y * 4.0 + t) * 0.18;
    float rays = pow(max(0.0, sin(p.x * 11.0 + p.y * 2.5 + bend + t)), 12.0);
    float caustic = pow(1.0 - abs(sin(p.x * 5.0 + sin(p.y * 6.0 + t))
      * cos(p.y * 5.0 - t + sin(p.x * 4.0 - t))), 9.0);
    float top = smoothstep(0.25, 0.9, vUv.y) * (1.0 - smoothstep(0.88, 1.0, vUv.y));
    float side = smoothstep(0.3, 0.9, vUv.x);
    float bottom = 1.0 - smoothstep(0.0, 0.35, vUv.y);
    float alpha = rays * top * side * 0.075 + caustic * bottom * 0.04;
    gl_FragColor = vec4(0.45, 0.8, 0.82, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const bubbleVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const bubbleFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float rim = pow(1.0 - abs(vNormal.z), 2.8);
    float glint = pow(max(0.0, dot(vNormal, normalize(vec3(-0.45, 0.6, 0.7)))), 24.0);
    gl_FragColor = vec4(vec3(0.58, 0.84, 0.88) + glint * 0.12,
      rim * 0.32 + glint * 0.36 + 0.012);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

// Three.js lives in this deferred module. The shark reuses the decoded DOM image.
export function createHeroOceanScene(canvas: HTMLCanvasElement): HeroOceanScene {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  })
  renderer.setClearColor(0x000000, 0)

  const scene = new Scene()
  const fish = createOceanFish()
  scene.add(fish.group)
  let fishAppearedAt: number | undefined
  let fishOpacity = 0
  let fishStartOpacity = 0
  let previousElapsed: number | undefined
  let burstStartActivity = 0
  canvas.dataset.waveState = "calm"

  function showFish(opacity: number): void {
    fishOpacity = opacity
    fish.setOpacity(opacity)
    const visibility = fish.group.visible ? "visible" : "hidden"
    if (canvas.dataset.fishVisibility !== visibility) canvas.dataset.fishVisibility = visibility
  }

  function ease(value: number): number {
    const t = Math.max(0, Math.min(1, value))
    return t * t * (3 - 2 * t)
  }
  let shark: ReturnType<typeof createOceanShark> | undefined
  let bounds: OceanBounds | undefined
  const camera = new OrthographicCamera(-6, 6, 3, -3, 0.1, 30)
  camera.position.z = 10

  const time = { value: 0 }
  const activity = { value: 0 }
  const waterScale = { value: 1 }
  const pointer = { value: new Vector2() }
  const smoothedPointer = new Vector2()
  const target = new Vector2()
  const width = { value: 12 }
  const aspect = { value: 2 }
  const plane = new PlaneGeometry(1, 1, 96, 12)
  const lightPlane = new PlaneGeometry(1, 1)
  const sphere = new SphereGeometry(1, 20, 14)

  const lightMaterial = new ShaderMaterial({
    uniforms: { uTime: time, uAspect: aspect, uPointer: pointer },
    vertexShader: lightVertex,
    fragmentShader: lightFragment,
    transparent: true,
    depthWrite: false,
  })
  const light = new Mesh(lightPlane, lightMaterial)
  light.position.z = -2
  light.renderOrder = 0
  scene.add(light)

  const waveMaterials = [
    { color: "#3f5d81", height: 0.98, phase: 1.4, opacity: 0.65 },
    { color: "#3d929f", height: 0.72, phase: 3.6, opacity: 0.58 },
    { color: "#42a8a9", height: 0.48, phase: 5.2, opacity: 0.56 },
  ].map((wave, index) => {
    const material = new ShaderMaterial({
      uniforms: {
        uTime: time,
        uActivity: activity,
        uWaterScale: waterScale,
        uWidth: width,
        uPointer: pointer,
        uHeight: { value: wave.height },
        uPhase: { value: wave.phase },
        uColor: { value: new Color(wave.color) },
        uOpacity: { value: wave.opacity },
      },
      vertexShader: waveVertex,
      fragmentShader: waveFragment,
      transparent: true,
      depthWrite: false,
    })
    const mesh = new Mesh(plane, material)
    // The shader moves vertices beyond the unit plane's original bounding sphere.
    mesh.frustumCulled = false
    mesh.renderOrder = index + 1
    scene.add(mesh)
    return material
  })

  const bubbleMaterial = new ShaderMaterial({
    vertexShader: bubbleVertex,
    fragmentShader: bubbleFragment,
    transparent: true,
    depthWrite: false,
  })
  const bubbles = [
    { x: -0.93, y: 0.66, radius: 0.062, speed: 0.09 },
    { x: -0.84, y: -0.35, radius: 0.031, speed: 0.07 },
    { x: -0.97, y: -0.7, radius: 0.042, speed: 0.1 },
    { x: 0.91, y: 0.76, radius: 0.055, speed: 0.08 },
    { x: 0.97, y: -0.23, radius: 0.036, speed: 0.06 },
    { x: 0.83, y: -0.63, radius: 0.068, speed: 0.07 },
    { x: -0.46, y: -0.77, radius: 0.028, speed: 0.08 },
    { x: 0.19, y: -0.81, radius: 0.043, speed: 0.06 },
    { x: 0.57, y: -0.7, radius: 0.026, speed: 0.09 },
    { x: -0.72, y: -0.85, radius: 0.038, speed: 0.065 },
    { x: 0.94, y: -0.61, radius: 0.05, speed: 0.075 },
    { x: -0.91, y: -0.37, radius: 0.057, speed: 0.07 },
    { x: 0.88, y: -0.13, radius: 0.03, speed: 0.085 },
    { x: -0.96, y: 0.11, radius: 0.034, speed: 0.06 },
    { x: 0.95, y: 0.35, radius: 0.06, speed: 0.07 },
    { x: -0.89, y: 0.59, radius: 0.027, speed: 0.09 },
    { x: 0.74, y: 0.83, radius: 0.042, speed: 0.065 },
    { x: -0.18, y: -0.93, radius: 0.033, speed: 0.08 },
  ].map((bubble, index) => {
    const mesh = new Mesh(sphere, bubbleMaterial)
    mesh.scale.setScalar(bubble.radius)
    mesh.position.z = 1 + index * 0.1
    mesh.renderOrder = 4
    scene.add(mesh)
    return { ...bubble, mesh }
  })

  return {
    resize(nextBounds, topLane) {
      fishAppearedAt = undefined
      showFish(0)
      activity.value = 0
      previousElapsed = undefined
      pointer.value.set(0, 0)
      smoothedPointer.set(0, 0)
      target.set(0, 0)
      canvas.dataset.waveState = "calm"
      bounds = nextBounds
      const { width: viewWidth, height: viewHeight, waterTop, shark: sharkBounds } = bounds
      // Fit even the highest active crest below the measured content/video.
      // 1.311 = tallest layer + maximum swell + pointer displacement.
      const availableWater = Math.max(0, viewHeight - waterTop - 4) * 6 / Math.max(viewHeight, 1)
      waterScale.value = Math.min(1, (availableWater + 0.13) / 1.311)
      aspect.value = viewWidth / Math.max(viewHeight, 1)
      width.value = aspect.value * 6 + 0.6
      camera.left = -aspect.value * 3
      camera.right = aspect.value * 3
      camera.updateProjectionMatrix()
      light.scale.set(aspect.value * 6, 6, 1)
      // A decorative canvas does not need full Retina resolution.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, viewWidth < 768 ? 1 : 1.5))
      renderer.setSize(viewWidth, viewHeight, false)
      fish.resize(viewWidth, viewHeight, topLane, {
        left: viewWidth < 768 ? 44 : 64,
        right: sharkBounds.x - (viewWidth < 768 ? 64 : 86),
        y: waterTop + (viewHeight - waterTop) / 2,
      })
      shark?.resize(bounds)
    },
    prepareShark(image) {
      if (shark || !image.complete || !image.naturalWidth) return
      shark = createOceanShark(image)
      if (bounds) shark.resize(bounds)
      scene.add(shark.group)
    },
    beginChase(elapsed) {
      if (!shark?.begin(elapsed)) return false
      // A new visit lasts 12 seconds of the existing playback clock. Replaying
      // while fish are still here extends the visit without blinking them out.
      fishAppearedAt = elapsed
      fishStartOpacity = fishOpacity
      burstStartActivity = activity.value
      previousElapsed = elapsed
      canvas.dataset.waveState = "active"
      fish.beginEscape(elapsed)
      return true
    },
    isActive() {
      return fishAppearedAt !== undefined
    },
    point(x, y) {
      target.set(x, y).clampScalar(-1, 1)
    },
    render(elapsed) {
      const delta = previousElapsed === undefined ? 0 : Math.max(0, elapsed - previousElapsed)
      previousElapsed = elapsed
      const age = fishAppearedAt === undefined ? 12 : elapsed - fishAppearedAt
      const arrival = burstStartActivity + (1 - burstStartActivity) * ease(age / 0.45)
      activity.value = fishAppearedAt === undefined ? 0 : arrival * (1 - ease((age - 5.2) / 3.8))
      // Integrate a motion phase rather than multiplying elapsed time: both
      // acceleration and settling stay continuous, including another click.
      time.value += delta * activity.value * 3
      smoothedPointer.lerp(target, 1 - Math.exp(-delta * 3))
      pointer.value.copy(smoothedPointer).multiplyScalar(activity.value)
      const waveState = activity.value > 0 || age === 0 ? "active" : "calm"
      if (canvas.dataset.waveState !== waveState) canvas.dataset.waveState = waveState
      fish.animate(elapsed, pointer.value.x, pointer.value.y)
      if (fishAppearedAt !== undefined) {
        const arrival = fishStartOpacity + (1 - fishStartOpacity) * ease(age / 0.35)
        showFish(arrival * ease(12 - age))
        if (age >= 12) fishAppearedAt = undefined
      }
      const phase = shark?.render(elapsed, fish.rightmostBottomEdge()) ?? "idle"
      bubbles.forEach((bubble, index) => {
        const drift = time.value * bubble.speed + index * 1.7
        const parallax = 0.035 + index * 0.009
        bubble.mesh.position.x = bubble.x * aspect.value * 3
          + Math.sin(drift) * 0.045 + pointer.value.x * parallax
        const rise = (time.value * bubble.speed * 1.15 + index * 0.79) % 6.6
        bubble.mesh.position.y = -3.3 + rise + pointer.value.y * parallax
        const edgeFade = Math.min(1, rise / 0.4, (6.6 - rise) / 0.4)
        bubble.mesh.scale.setScalar(bubble.radius * edgeFade)
      })
      renderer.render(scene, camera)
      return phase
    },
    dispose() {
      fishAppearedAt = undefined
      canvas.dataset.waveState = "calm"
      showFish(0)
      plane.dispose()
      lightPlane.dispose()
      sphere.dispose()
      fish.dispose()
      shark?.dispose()
      lightMaterial.dispose()
      bubbleMaterial.dispose()
      waveMaterials.forEach((material) => material.dispose())
      scene.clear()
      renderer.dispose()
    },
  }
}
