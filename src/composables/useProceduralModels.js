import * as THREE from 'three'

function mat(color, roughness = 0.55, metalness = 0.1) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness })
}

function autoScaleCenter(group) {
  const box = new THREE.Box3().setFromObject(group)
  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 2.0 / maxDim
  group.scale.setScalar(scale)
  const center = new THREE.Vector3()
  box.getCenter(center)
  group.position.sub(center.multiplyScalar(scale))
  group.position.y += size.y * scale * 0.5
}

const builders = {
  'hard-hat'() {
    const g = new THREE.Group()
    // Dome (top hemisphere)
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(0xffc107),
    )
    dome.position.y = 0.05
    g.add(dome)
    // Brim ring
    const brim = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.07, 8, 32), mat(0xffb300))
    brim.position.y = 0.02
    g.add(brim)
    // Interior band
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.06, 20, 1, true),
      mat(0xe65100),
    )
    band.position.y = 0.06
    g.add(band)
    return g
  },

  'fire-extinguisher'() {
    const g = new THREE.Group()
    // Main cylinder body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.9, 20), mat(0xd32f2f))
    body.position.y = 0.45
    g.add(body)
    // Top dome cap
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(0xb71c1c),
    )
    cap.position.y = 0.9
    g.add(cap)
    // Bottom base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.06, 20), mat(0x333333))
    base.position.y = 0.03
    g.add(base)
    // Nozzle arm
    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8),
      mat(0x424242, 0.3, 0.6),
    )
    nozzle.position.set(0.26, 1.02, 0)
    nozzle.rotation.z = Math.PI / 2
    g.add(nozzle)
    // Pressure gauge
    const gauge = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), mat(0x757575, 0.3, 0.5))
    gauge.position.set(0, 0.85, 0.24)
    g.add(gauge)
    // Handle/ring
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.025, 6, 14, Math.PI),
      mat(0x555555),
    )
    handle.position.y = 1.02
    handle.rotation.x = Math.PI
    g.add(handle)
    return g
  },

  wrench() {
    const g = new THREE.Group()
    // Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.0, 0.06), mat(0x90a4ae, 0.3, 0.5))
    handle.position.y = 0.5
    g.add(handle)
    // Open jaw ring
    const jaw = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.065, 8, 20, Math.PI),
      mat(0x78909c, 0.3, 0.5),
    )
    jaw.position.y = 1.12
    g.add(jaw)
    // Cross bar connecting jaw to handle
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.13, 0.1), mat(0x607d8b, 0.3, 0.5))
    bar.position.y = 1.02
    g.add(bar)
    // Hex nut feature on handle base
    const nut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.1, 6),
      mat(0x455a64, 0.2, 0.7),
    )
    nut.position.y = 0.06
    g.add(nut)
    return g
  },

  hammer() {
    const g = new THREE.Group()
    // Handle
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.085, 1.0, 12),
      mat(0x8d6e63, 0.8, 0.0),
    )
    handle.position.y = 0.5
    g.add(handle)
    // Grip wrap (darker band at base)
    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.2, 12),
      mat(0x4e342e, 0.9, 0.0),
    )
    grip.position.y = 0.1
    g.add(grip)
    // Head (face side)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.2), mat(0x546e7a, 0.2, 0.6))
    head.position.y = 1.06
    g.add(head)
    // Claw side (forked)
    const clawL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.07), mat(0x455a64, 0.2, 0.6))
    clawL.position.set(-0.19, 1.06, 0.08)
    clawL.rotation.z = 0.35
    g.add(clawL)
    const clawR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.07), mat(0x455a64, 0.2, 0.6))
    clawR.position.set(-0.19, 1.06, -0.08)
    clawR.rotation.z = 0.35
    g.add(clawR)
    return g
  },

  'safety-vest'() {
    const g = new THREE.Group()
    const orange = mat(0xff6f00)
    const hivis = mat(0xffee58, 0.9, 0.0)
    // Front body panel
    const front = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.8, 0.06), orange)
    front.position.y = 0.4
    g.add(front)
    // Hi-vis chest stripe
    const stripeTop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 0.07), hivis)
    stripeTop.position.y = 0.58
    g.add(stripeTop)
    const stripeBot = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 0.07), hivis)
    stripeBot.position.y = 0.22
    g.add(stripeBot)
    // Left shoulder strap
    const lShoulder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.06), mat(0xef6c00))
    lShoulder.position.set(-0.26, 0.95, 0)
    lShoulder.rotation.z = 0.28
    g.add(lShoulder)
    // Right shoulder strap
    const rShoulder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.06), mat(0xef6c00))
    rShoulder.position.set(0.26, 0.95, 0)
    rShoulder.rotation.z = -0.28
    g.add(rShoulder)
    // Zipper line
    const zipper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 0.08), mat(0x212121))
    zipper.position.y = 0.4
    g.add(zipper)
    return g
  },

  drill() {
    const g = new THREE.Group()
    // Main body barrel (horizontal)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.62, 16), mat(0x1565c0))
    body.rotation.z = Math.PI / 2
    body.position.x = 0.1
    g.add(body)
    // Chuck nose
    const chuck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.13, 0.16, 14),
      mat(0x424242, 0.2, 0.7),
    )
    chuck.rotation.z = Math.PI / 2
    chuck.position.x = 0.49
    g.add(chuck)
    // Drill bit
    const bit = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.55, 8), mat(0xbdbdbd, 0.15, 0.85))
    bit.rotation.z = -Math.PI / 2
    bit.position.x = 0.85
    g.add(bit)
    // Pistol grip
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.44, 12), mat(0x333333))
    grip.position.set(0.08, -0.22, 0)
    grip.rotation.z = 0.3
    g.add(grip)
    // Trigger guard
    const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.08), mat(0x1a237e))
    trigger.position.set(0.14, -0.05, 0)
    g.add(trigger)
    // Battery pack at base of grip
    const battery = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.18), mat(0xf57c00))
    battery.position.set(0.02, -0.48, 0)
    g.add(battery)
    return g
  },

  screwdriver() {
    const g = new THREE.Group()
    // Handle (ergonomic — octagonal approximated by cylinder)
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.09, 0.55, 8),
      mat(0xf9a825, 0.8, 0.0),
    )
    handle.position.y = 0.28
    g.add(handle)
    // Handle grip bands
    for (let i = 0; i < 3; i++) {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.115, 0.115, 0.04, 8),
        mat(0x333333, 0.9, 0.0),
      )
      band.position.y = 0.12 + i * 0.16
      g.add(band)
    }
    // Steel shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.7, 8),
      mat(0xbdbdbd, 0.15, 0.85),
    )
    shaft.position.y = 0.9
    g.add(shaft)
    // Flat-head tip
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.04), mat(0x9e9e9e, 0.1, 0.9))
    tip.position.y = 1.28
    g.add(tip)
    return g
  },

  'first-aid-kit'() {
    const g = new THREE.Group()
    // Box case
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.58, 0.38),
      mat(0xffffff, 0.9, 0.0),
    )
    box.position.y = 0.29
    g.add(box)
    // Lid edge (slightly wider top)
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.1, 0.41),
      mat(0xeeeeee, 0.9, 0.0),
    )
    lid.position.y = 0.53
    g.add(lid)
    // Red cross — vertical bar
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.08), mat(0xd32f2f))
    crossV.position.set(0, 0.29, 0.22)
    g.add(crossV)
    // Red cross — horizontal bar
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.13, 0.08), mat(0xd32f2f))
    crossH.position.set(0, 0.29, 0.22)
    g.add(crossH)
    // Handle
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.03, 8, 18, Math.PI),
      mat(0x424242),
    )
    handle.position.y = 0.6
    handle.rotation.x = Math.PI
    g.add(handle)
    // Latch
    const latch = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), mat(0xbdbdbd, 0.2, 0.7))
    latch.position.set(0, 0.15, 0.2)
    g.add(latch)
    return g
  },

  helmet() {
    const g = new THREE.Group()
    // Outer shell dome
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.46, 22, 22, 0, Math.PI * 2, 0, Math.PI * 0.62),
      mat(0x212121, 0.4, 0.3),
    )
    dome.position.y = 0.08
    g.add(dome)
    // Inner padding rim
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.05, 8, 28), mat(0x333333))
    rim.position.y = -0.04
    g.add(rim)
    // Visor (tinted)
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.18, 0.03),
      mat(0x1a237e, 0.05, 0.0),
    )
    visor.position.set(0, -0.05, 0.44)
    visor.rotation.x = -0.28
    g.add(visor)
    // Chin strap left
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.03), mat(0x555555))
    strapL.position.set(-0.35, -0.18, 0.2)
    strapL.rotation.z = 0.3
    g.add(strapL)
    // Chin strap right
    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.03), mat(0x555555))
    strapR.position.set(0.35, -0.18, 0.2)
    strapR.rotation.z = -0.3
    g.add(strapR)
    // Ventilation slots (decorative)
    for (let i = -1; i <= 1; i++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.04), mat(0x111111))
      vent.position.set(i * 0.15, 0.3, 0.4)
      g.add(vent)
    }
    return g
  },

  'default-box'() {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat(0x1565c0, 0.4, 0.3)))
    return g
  },
}

/**
 * Build a distinct procedural Three.js model for the given model key and add it to the scene.
 * Returns the created Group.
 */
export function buildProceduralModel(scene, key) {
  const builder = builders[key] || builders['default-box']
  const group = builder()
  group.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true
      obj.receiveShadow = true
    }
  })
  autoScaleCenter(group)
  scene.add(group)
  return group
}
