<template>
  <div class="avatar-viewer-container relative-position bg-grey-10" style="width:100%;height:100%;">
    <canvas ref="canvasRef" style="display:block;width:100%;height:100%;" />

    <q-inner-loading :showing="isLoadingAvatar" color="primary" size="50px">
      <q-spinner-orbit size="50px" color="primary" />
      <div class="text-caption text-grey-4 q-mt-sm">Loading avatar...</div>
    </q-inner-loading>

    <!-- Current animation badge -->
    <div class="absolute-top-right q-pa-sm">
      <q-chip
        v-if="currentAnim !== 'idle'"
        color="primary"
        text-color="white"
        icon="animation"
        class="text-caption"
      >
        {{ formatAnim(currentAnim) }}
      </q-chip>
    </div>

    <!-- Camera controls hint -->
    <div class="absolute-bottom-left q-pa-sm text-grey-6 text-caption">
      Drag to orbit · Scroll to zoom
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useThreeScene } from 'src/composables/useThreeScene'
import { useAnimationMixer } from 'src/composables/useAnimationMixer'

const props = defineProps({
  animationKey: { type: String, default: 'idle' },
})

const canvasRef = ref(null)
const isLoadingAvatar = ref(true)
const currentAnim = ref('idle')

const { scene, camera, init, startLoop } = useThreeScene(canvasRef)
const animMixer = useAnimationMixer()

let controls = null
const loader = new GLTFLoader()
const clock = new THREE.Clock()

// ── Part references for procedural animation ──────────────────────────────────
let parts = null   // { body, head, leftArm, rightArm, leftLeg, rightLeg }
let animTime = 0
let usingProcedural = false

// Neutral poses (reset between animations)
const NEUTRAL = {
  body:     { py: 1.0, sy: 1.0, ry: 0 },
  head:     { rx: 0, ry: 0, rz: 0 },
  leftArm:  { rx: 0, rz:  0.3 },
  rightArm: { rx: 0, rz: -0.3 },
  leftLeg:  { rx: 0 },
  rightLeg: { rx: 0 },
}

function resetToNeutral() {
  if (!parts) return
  parts.body.position.y    = NEUTRAL.body.py
  parts.body.scale.y       = NEUTRAL.body.sy
  parts.body.rotation.y    = NEUTRAL.body.ry
  parts.head.rotation.set(NEUTRAL.head.rx, NEUTRAL.head.ry, NEUTRAL.head.rz)
  parts.leftArm.rotation.set(NEUTRAL.leftArm.rx,  0, NEUTRAL.leftArm.rz)
  parts.rightArm.rotation.set(NEUTRAL.rightArm.rx, 0, NEUTRAL.rightArm.rz)
  parts.leftLeg.rotation.x  = NEUTRAL.leftLeg.rx
  parts.rightLeg.rotation.x = NEUTRAL.rightLeg.rx
}

function animateBody(delta) {
  if (!parts || !usingProcedural) return
  animTime += delta
  const t = animTime

  switch (currentAnim.value) {
    case 'idle':
      // Gentle breathing — body rises/falls slightly
      parts.body.position.y = 1.0 + Math.sin(t * 1.5) * 0.028
      parts.head.rotation.z = Math.sin(t * 0.8) * 0.025
      break

    case 'wave':
      // Right arm waves vigorously; head nods along
      parts.rightArm.rotation.z = -0.3 + Math.sin(t * 4.5) * 0.85
      parts.rightArm.rotation.x = -0.2 + Math.sin(t * 4.5) * 0.15
      parts.head.rotation.z     = Math.sin(t * 4.5) * 0.08
      parts.body.position.y     = 1.0 + Math.sin(t * 4.5) * 0.015
      break

    case 'point':
      // Right arm extends forward; slight torso lean
      parts.rightArm.rotation.z = -Math.PI / 2.8
      parts.rightArm.rotation.x = -Math.PI / 3.5
      parts.head.rotation.x     = -0.18
      parts.body.rotation.y     = Math.sin(t * 0.6) * 0.05   // tiny sway
      break

    case 'walk':
      // Classic walk cycle — legs alternate, arms counterswing, body bobs
      parts.leftLeg.rotation.x  =  Math.sin(t * 3.2) * 0.45
      parts.rightLeg.rotation.x = -Math.sin(t * 3.2) * 0.45
      parts.leftArm.rotation.x  = -Math.sin(t * 3.2) * 0.32
      parts.rightArm.rotation.x =  Math.sin(t * 3.2) * 0.32
      parts.body.position.y     = 1.0 + Math.abs(Math.sin(t * 6.4)) * 0.04
      parts.body.rotation.y     = Math.sin(t * 3.2) * 0.06
      break

    case 'safety-posture':
      // Arms spread at shoulder height, stance held (static with subtle hold-sway)
      parts.leftArm.rotation.z  =  Math.PI / 2.2 + Math.sin(t * 1.2) * 0.03
      parts.rightArm.rotation.z = -Math.PI / 2.2 - Math.sin(t * 1.2) * 0.03
      parts.leftArm.rotation.x  = 0.1
      parts.rightArm.rotation.x = 0.1
      parts.leftLeg.rotation.x  = 0.12
      parts.rightLeg.rotation.x = -0.12
      parts.body.position.y     = 0.94 + Math.sin(t * 1.0) * 0.015
      break

    case 'crouch':
      // Body lowers; legs bent (simulated by scaling + position)
      parts.body.position.y = 0.62 + Math.sin(t * 1.8) * 0.015
      parts.body.scale.y    = 0.72
      parts.leftLeg.rotation.x  =  0.55
      parts.rightLeg.rotation.x = -0.55
      parts.leftArm.rotation.z  =  0.55
      parts.rightArm.rotation.z = -0.55
      parts.head.rotation.x     = 0.2
      break

    case 'thumbs-up':
      // Right arm raised with a pump; body sways proudly
      parts.rightArm.rotation.z = -Math.PI / 1.9 + Math.sin(t * 2.0) * 0.12
      parts.rightArm.rotation.x = -0.2
      parts.leftArm.rotation.z  =  0.45
      parts.body.rotation.y     = Math.sin(t * 1.2) * 0.18
      parts.head.rotation.y     = Math.sin(t * 1.2) * 0.14
      parts.body.position.y     = 1.0 + Math.sin(t * 2.0) * 0.025
      break

    case 'look-around':
      // Head sweeps left and right; body follows slightly
      parts.head.rotation.y  = Math.sin(t * 1.4) * 0.82
      parts.body.rotation.y  = Math.sin(t * 1.4) * 0.14
      parts.head.rotation.x  = Math.sin(t * 0.7) * 0.12
      parts.body.position.y  = 1.0 + Math.sin(t * 1.4) * 0.018
      break
  }
}

// ── Scene setup ───────────────────────────────────────────────────────────────
onMounted(async () => {
  init(0x0d1117)
  camera.position.set(0, 1.5, 3.5)

  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(10, 10)
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 1 })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const grid = new THREE.GridHelper(10, 20, 0x333333, 0x222222)
  scene.add(grid)

  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.target.set(0, 1, 0)
  controls.minDistance = 1
  controls.maxDistance = 8

  startLoop(() => {
    const delta = clock.getDelta()
    controls.update()
    animMixer.update()
    animateBody(delta)
  })

  await loadAvatar()
})

watch(() => props.animationKey, (key) => {
  playAnim(key)
})

// ── Avatar loader ─────────────────────────────────────────────────────────────
async function loadAvatar() {
  isLoadingAvatar.value = true
  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load('/avatar/character.glb', resolve, undefined, reject)
    })
    const avatar = gltf.scene
    avatar.position.set(0, 0, 0)
    avatar.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    scene.add(avatar)
    animMixer.setup(avatar, gltf.animations)
    animMixer.playAnimation('idle')
    currentAnim.value = 'idle'
  } catch {
    buildFallbackHumanoid()
  } finally {
    isLoadingAvatar.value = false
  }
}

// ── Procedural humanoid ───────────────────────────────────────────────────────
function buildFallbackHumanoid() {
  usingProcedural = true
  const group = new THREE.Group()

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.55 })
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.75 })
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.6 })

  // Torso
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.78, 8, 16), bodyMat)
  body.position.y = 1.0
  group.add(body)

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), headMat)
  head.position.y = 1.82
  group.add(head)

  // Eyes (decorative)
  const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 })
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
  leftEye.position.set(-0.08, 1.84, 0.18)
  group.add(leftEye)
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
  rightEye.position.set(0.08, 1.84, 0.18)
  group.add(rightEye)

  // Arms (pivot from shoulder — use a pivot group)
  const leftArmPivot = new THREE.Group()
  leftArmPivot.position.set(-0.35, 1.42, 0)
  const leftArmMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.5, 4, 8), bodyMat)
  leftArmMesh.position.y = -0.3
  leftArmPivot.add(leftArmMesh)
  leftArmPivot.rotation.z = 0.3
  group.add(leftArmPivot)

  const rightArmPivot = new THREE.Group()
  rightArmPivot.position.set(0.35, 1.42, 0)
  const rightArmMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.5, 4, 8), bodyMat)
  rightArmMesh.position.y = -0.3
  rightArmPivot.add(rightArmMesh)
  rightArmPivot.rotation.z = -0.3
  group.add(rightArmPivot)

  // Legs (pivot from hip)
  const leftLegPivot = new THREE.Group()
  leftLegPivot.position.set(-0.15, 0.62, 0)
  const leftLegMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.58, 4, 8), darkMat)
  leftLegMesh.position.y = -0.32
  leftLegPivot.add(leftLegMesh)
  group.add(leftLegPivot)

  const rightLegPivot = new THREE.Group()
  rightLegPivot.position.set(0.15, 0.62, 0)
  const rightLegMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.58, 4, 8), darkMat)
  rightLegMesh.position.y = -0.32
  rightLegPivot.add(rightLegMesh)
  group.add(rightLegPivot)

  // Feet
  const footGeo = new THREE.BoxGeometry(0.14, 0.07, 0.22)
  const footMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.8 })
  const leftFoot = new THREE.Mesh(footGeo, footMat)
  leftFoot.position.set(-0.15, 0.035, 0.04)
  group.add(leftFoot)
  const rightFoot = new THREE.Mesh(footGeo, footMat)
  rightFoot.position.set(0.15, 0.035, 0.04)
  group.add(rightFoot)

  group.traverse((obj) => { if (obj.isMesh) obj.castShadow = true })
  scene.add(group)

  // Store named references using pivot groups for limbs
  parts = {
    body,
    head,
    leftArm:  leftArmPivot,
    rightArm: rightArmPivot,
    leftLeg:  leftLegPivot,
    rightLeg: rightLegPivot,
  }

  // Override animMixer to use our procedural system
  animMixer.setup(group, [])
  animMixer.playAnimation = (key) => {
    resetToNeutral()
    animTime = 0
    currentAnim.value = key
  }

  animMixer.playAnimation('idle')
}

// ── Unified play function ─────────────────────────────────────────────────────
function playAnim(key) {
  if (usingProcedural) {
    animMixer.playAnimation(key)
  } else {
    animMixer.playAnimation(key)
    currentAnim.value = key
  }
}

function formatAnim(key) {
  return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
</script>

<style scoped>
.avatar-viewer-container {
  border-radius: 8px;
  overflow: hidden;
}
</style>
