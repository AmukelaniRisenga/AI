import { onUnmounted } from 'vue'
import * as THREE from 'three'

export function useThreeScene(canvasRef) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
  camera.position.set(0, 1.5, 4)

  let renderer = null
  let animFrameId = null
  let resizeObserver = null

  function init(bgColor = 0x111827) {
    if (!canvasRef.value) return

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: false,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    scene.background = new THREE.Color(bgColor)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 7)
    dirLight.castShadow = true
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4)
    fillLight.position.set(-5, 2, -5)
    scene.add(fillLight)

    // Responsive resize
    resizeObserver = new ResizeObserver(() => updateSize())
    resizeObserver.observe(canvasRef.value.parentElement)
    updateSize()
  }

  function updateSize() {
    if (!renderer || !canvasRef.value) return
    const container = canvasRef.value.parentElement
    const w = container.clientWidth || 400
    const h = container.clientHeight || 400
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function startLoop(onFrame) {
    function loop() {
      animFrameId = requestAnimationFrame(loop)
      if (onFrame) onFrame()
      renderer?.render(scene, camera)
    }
    loop()
  }

  function stopLoop() {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
  }

  function dispose() {
    stopLoop()
    resizeObserver?.disconnect()
    renderer?.dispose()
    renderer = null
  }

  onUnmounted(dispose)

  return { scene, camera, renderer: { get value() { return renderer } }, init, startLoop, stopLoop, dispose }
}
