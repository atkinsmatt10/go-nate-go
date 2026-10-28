import {
  Color,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  Shape,
  SphereGeometry,
} from "three"

export interface SwimLane {
  left: number
  right: number
  y: number
}

interface FishPose {
  x: number
  y: number
  z: number
  scale: number
  yaw: number
  pitch: number
  roll: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function smoothstep(value: number): number {
  const t = clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount
}

function mixAngle(from: number, to: number, amount: number): number {
  return from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * amount
}

const fishVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vHeight;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-viewPosition.xyz);
    vHeight = position.y;
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fishFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBelly;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vHeight;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 light = normalize(vec3(-0.4, 0.8, 1.0));
    float diffuse = max(0.0, dot(normal, light));
    float sheen = pow(max(0.0, dot(normal, normalize(light + vView))), 38.0);
    float belly = (1.0 - smoothstep(-0.16, -0.055, vHeight)) * uBelly;
    vec3 color = mix(uColor, vec3(0.74, 0.88, 0.86), belly * 0.85);
    color *= 0.38 + diffuse * 0.68;
    color += vec3(0.5, 0.72, 0.76) * sheen * 0.48;
    gl_FragColor = vec4(color, uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function finGeometry(points: readonly (readonly [number, number])[]): ExtrudeGeometry {
  const shape = new Shape()
  points.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  })
  shape.closePath()
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.018,
    bevelSegments: 2,
    steps: 1,
  })
  geometry.translate(0, 0, -0.0175)
  return geometry
}

export function createOceanFish(): {
  group: Group
  resize: (width: number, height: number, top: SwimLane, bottom: SwimLane) => void
  animate: (time: number, pointerX: number, pointerY: number) => void
  beginEscape: (time: number) => void
  resetEscape: () => void
  setOpacity: (opacity: number) => void
  rightmostBottomEdge: () => number
  dispose: () => void
} {
  const group = new Group()
  group.visible = false
  const opacity = { value: 0 }
  const bodyGeometry = new SphereGeometry(1, 28, 18)
  const positions = bodyGeometry.attributes.position
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index)
    const taper = 0.8 + (x + 1) * 0.1
    positions.setXYZ(index, x * 0.62, positions.getY(index) * 0.29 * taper, positions.getZ(index) * 0.23 * taper)
  }
  bodyGeometry.computeVertexNormals()
  const tailGeometry = finGeometry([[0.05, 0], [-0.37, 0.26], [-0.29, 0], [-0.37, -0.26]])
  const dorsalGeometry = finGeometry([[-0.31, 0.15], [-0.2, 0.44], [0.2, 0.18]])
  const flipperGeometry = finGeometry([[0.1, 0.04], [-0.18, -0.21], [-0.23, -0.03]])
  const eyeGeometry = new SphereGeometry(1, 10, 8)
  const eyeMaterial = new MeshBasicMaterial({ color: "#112b40", transparent: true, opacity: 0 })
  const glintMaterial = new MeshBasicMaterial({ color: "#f7fbff", transparent: true, opacity: 0 })
  const palettes = ["#55c4c2", "#9ac8e6", "#e7c778"].map((color) => ({
    body: new ShaderMaterial({
      uniforms: { uColor: { value: new Color(color) }, uBelly: { value: 1 }, uOpacity: opacity },
      vertexShader: fishVertex,
      fragmentShader: fishFragment,
      transparent: true,
    }),
    fin: new ShaderMaterial({
      uniforms: { uColor: { value: new Color(color).multiplyScalar(0.72) }, uBelly: { value: 0 }, uOpacity: opacity },
      vertexShader: fishVertex,
      fragmentShader: fishFragment,
      transparent: true,
    }),
  }))

  const fish = [
    { lane: "bottom", size: 96, phase: 3.1, speed: 0.3, palette: 0 },
    { lane: "bottom", size: 64, phase: 4, speed: 0.3, palette: 1 },
    { lane: "bottom", size: 44, phase: 4.8, speed: 0.3, palette: 2 },
  ].map((config) => {
    const root = new Group()
    const material = palettes[config.palette]
    root.add(new Mesh(bodyGeometry, material.body))
    const tail = new Mesh(tailGeometry, material.fin)
    tail.position.x = -0.5
    root.add(tail, new Mesh(dorsalGeometry, material.fin))
    const flippers = [-1, 1].map((side) => {
      const fin = new Mesh(flipperGeometry, material.fin)
      fin.position.set(0.08, -0.08, side * 0.19)
      fin.rotation.x = side * 0.55
      root.add(fin)
      const eye = new Mesh(eyeGeometry, eyeMaterial)
      eye.scale.setScalar(0.037)
      eye.position.set(0.35, 0.075, side * 0.186)
      const glint = new Mesh(eyeGeometry, glintMaterial)
      glint.scale.setScalar(0.011)
      glint.position.set(0.36, 0.089, side * 0.217)
      root.add(eye, glint)
      return fin
    })
    // Composite fading fish over the water, keeping the waves visible through
    // them. All body parts share an order so Three can still sort their depth.
    root.traverse((part) => { part.renderOrder = 5 })
    group.add(root)
    return {
      ...config, root, tail, flippers,
      pose: { x: 0, y: 0, z: 2, scale: 1, yaw: 0, pitch: 0, roll: 0 } as FishPose,
      tailPhase: config.phase,
      flipperPhase: config.phase,
      escape: null as { start: FishPose; delay: number; targetX: number } | null,
    }
  })

  let viewportWidth = 1
  let unitsPerPixel = 1
  let topLane: SwimLane = { left: 0, right: 1, y: 0 }
  let bottomLane = topLane
  let viewportHeight = 1
  let escapeStarted: number | null = null
  let lastTime: number | null = null

  // The tail reaches x=-.888 and the dorsal fin reaches y=.458. A .98
  // radius also covers their rocking, yaw, and depth: use the complete fish,
  // not just its body center, for containment and the shark's safety gap.
  const fullExtent = 0.98

  function resetEscape(): void {
    escapeStarted = null
    fish.forEach((swimmer) => { swimmer.escape = null })
  }

  return {
    group,
    resize(width, height, top, bottom) {
      viewportWidth = width
      viewportHeight = height
      unitsPerPixel = 6 / height
      topLane = top
      bottomLane = bottom
      resetEscape()
    },
    beginEscape(time) {
      if (escapeStarted !== null) return
      escapeStarted = time
      const nearestFirst = fish.filter((swimmer) => swimmer.lane === "bottom")
        .toSorted((a, b) => b.pose.x - a.pose.x)
      fish.forEach((swimmer, index) => {
        const lane = swimmer.lane === "top" ? topLane : bottomLane
        const halfWidth = swimmer.pose.scale / unitsPerPixel * fullExtent
        const left = Math.max(halfWidth + 4, lane.left)
        const right = Math.max(left, Math.min(lane.right, viewportWidth - halfWidth - 4))
        const rank = swimmer.lane === "bottom" ? nearestFirst.indexOf(swimmer) : index
        // Compress the school into the left of its lane without collapsing
        // every fish onto one endpoint. Rank also fans out fish that met at
        // the right boundary during pointer parallax.
        const escapeSpan = Math.min(90, (right - left) * 0.52)
        const targetX = swimmer.lane === "bottom"
          ? left + (swimmer.pose.x - left) / Math.max(1, right - left) * escapeSpan - rank * 16
          : swimmer.pose.x - Math.min(viewportWidth * 0.16, 120)
        swimmer.escape = {
          // Copy exactly what was rendered, including pointer parallax and
          // the current turn. The first chase frame therefore cannot jump.
          start: { ...swimmer.pose },
          delay: (swimmer.lane === "top" ? 0.22 : 0.1) + rank * 0.12,
          targetX: Math.min(swimmer.pose.x, Math.max(left, targetX)),
        }
      })
    },
    resetEscape,
    setOpacity(value) {
      opacity.value = clamp(value, 0, 1)
      eyeMaterial.opacity = glintMaterial.opacity = opacity.value
      const solid = opacity.value === 1
      eyeMaterial.depthWrite = glintMaterial.depthWrite = solid
      palettes.forEach(({ body, fin }) => { body.depthWrite = fin.depthWrite = solid })
      group.visible = opacity.value > 0
    },
    rightmostBottomEdge() {
      return Math.max(...fish.filter((swimmer) => swimmer.lane === "bottom")
        .map((swimmer) => swimmer.pose.x + swimmer.pose.scale / unitsPerPixel * fullExtent))
    },
    animate(time, pointerX, pointerY) {
      const delta = lastTime === null ? 0 : clamp(time - lastTime, 0, 0.1)
      const firstFrame = lastTime === null
      lastTime = time
      const age = escapeStarted === null ? 0 : Math.max(0, time - escapeStarted)
      if (escapeStarted !== null && age >= 5.2) resetEscape()
      fish.forEach((swimmer, index) => {
        const lane = swimmer.lane === "top" ? topLane : bottomLane
        const angle = time * swimmer.speed + swimmer.phase
        const depth = Math.sin(angle)
        const mobileSize = viewportWidth < 768 && swimmer.lane === "bottom" ? 0.66 : 1
        const scale = swimmer.size * mobileSize * unitsPerPixel / 1.55 * (1 + depth * 0.1)
        const halfWidth = scale / unitsPerPixel * fullExtent
        const left = clamp(lane.left, halfWidth + 4, viewportWidth - halfWidth - 4)
        const right = Math.max(left, Math.min(lane.right, viewportWidth - halfWidth - 4))
        const radius = (right - left) / 2
        const center = (left + right) / 2
        const pose: FishPose = {
          x: clamp(center + Math.cos(angle) * radius + pointerX * 0.06 / unitsPerPixel,
            left, right),
          y: lane.y + Math.sin(angle * 2 + index) * (swimmer.lane === "top" ? 5 : 9)
            - pointerY * 0.025 / unitsPerPixel,
          z: 2 + depth * 0.4,
          scale,
          // Follow an ellipse in depth, turning toward the camera at its ends.
          yaw: Math.atan2(-Math.cos(angle) * 0.24, -Math.sin(angle)),
          roll: Math.sin(time * 1.6 + index) * 0.065,
          pitch: Math.sin(time * 1.1 + index) * 0.12,
        }
        let excitement = 0
        if (swimmer.escape) {
          const { start, delay, targetX } = swimmer.escape
          const reaction = smoothstep((age - delay) / 0.48)
          const progress = smoothstep((age - delay) / (3.25 - delay))
          // Keep the school at its escape end until the shark has dipped;
          // only then blend into the continuously advancing ambient orbit.
          const recovery = smoothstep((age - 3.65) / 1.55)
          const curve = Math.sin(progress * Math.PI) * (swimmer.lane === "top" ? 6 : 8)
          const escapedY = mix(start.y, lane.y + (index % 3 - 1) * 4, progress)
            + curve * (index % 2 ? 1 : -1)
          pose.x = mix(mix(start.x, targetX, progress), pose.x, recovery)
          pose.y = mix(escapedY, pose.y, recovery)
          pose.z = mix(start.z, pose.z, recovery)
          pose.scale = mix(start.scale, pose.scale, recovery)
          const escapedYaw = mixAngle(start.yaw, Math.PI, reaction)
          pose.yaw = mixAngle(escapedYaw, pose.yaw, recovery)
          pose.pitch = mix(start.pitch * (1 - reaction), pose.pitch, recovery)
          pose.roll = mix(mix(start.roll, Math.sin(progress * Math.PI * 2) * 0.075, reaction),
            pose.roll, recovery)
          excitement = reaction * (1 - recovery)
        }
        const finalExtent = pose.scale / unitsPerPixel * fullExtent
        // A conservative vertical extent includes the dorsal fin and bank.
        const halfHeight = pose.scale / unitsPerPixel * 0.6
        pose.x = clamp(pose.x, finalExtent + 4, viewportWidth - finalExtent - 4)
        pose.y = clamp(pose.y, halfHeight + 4, viewportHeight - halfHeight - 4)
        swimmer.pose = pose
        swimmer.root.scale.setScalar(pose.scale)
        swimmer.root.position.set(
          (pose.x - viewportWidth / 2) * unitsPerPixel,
          (viewportHeight / 2 - pose.y) * unitsPerPixel,
          pose.z,
        )
        swimmer.root.rotation.set(pose.pitch, pose.yaw, pose.roll)
        // Integrate phase rather than multiplying the clock by a changing
        // speed: tailbeats remain continuous when fleeing and settling.
        if (firstFrame) {
          swimmer.tailPhase = time * 9 + index * 1.3
          swimmer.flipperPhase = time * 6 + index
        } else {
          swimmer.tailPhase += delta * (9 + excitement * 13)
          swimmer.flipperPhase += delta * (6 + excitement * 6)
        }
        swimmer.tail.rotation.y = Math.sin(swimmer.tailPhase) * (0.58 + excitement * 0.1)
        swimmer.flippers.forEach((fin, side) => {
          fin.rotation.x = (side === 0 ? -1 : 1) * (0.55 + Math.sin(swimmer.flipperPhase) * 0.22)
        })
      })
    },
    dispose() {
      bodyGeometry.dispose()
      tailGeometry.dispose()
      dorsalGeometry.dispose()
      flipperGeometry.dispose()
      eyeGeometry.dispose()
      eyeMaterial.dispose()
      glintMaterial.dispose()
      palettes.forEach(({ body, fin }) => { body.dispose(); fin.dispose() })
      group.clear()
    },
  }
}
