<template>
  <div class="model-viewer-container relative-position bg-grey-10" style="width:100%;height:100%;">
    <canvas ref="canvasRef" style="display:block;width:100%;height:100%;" />

    <q-inner-loading :showing="props.loading" color="primary" size="50px">
      <q-spinner-orbit size="50px" color="primary" />
      <div class="text-caption text-grey-4 q-mt-sm">Loading model...</div>
    </q-inner-loading>

    <div v-if="error" class="absolute-center text-negative text-caption text-center q-pa-md">
      <q-icon name="error_outline" size="2rem" /><br />{{ error }}
    </div>

    <!-- Controls hint -->
    <div class="absolute-bottom-left q-pa-sm text-grey-6 text-caption">
      Drag to rotate · Scroll to zoom · Right-drag to pan
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useThreeScene } from 'src/composables/useThreeScene'
import { useModelLoader } from 'src/composables/useModelLoader'
import { buildProceduralModel } from 'src/composables/useProceduralModels'

const props = defineProps({
  modelUrl: { type: String, default: null },
  modelKey: { type: String, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['loaded', 'error'])

const canvasRef = ref(null)
const error = ref(null)

let controls = null
const { scene, camera, init, startLoop } = useThreeScene(canvasRef)
const { loadModel, setCurrentModel } = useModelLoader(scene)

onMounted(() => {
  init(0x0d1117)

  // Grid floor
  const grid = new THREE.GridHelper(10, 20, 0x333333, 0x222222)
  scene.add(grid)

  // OrbitControls — pass the canvas element directly
  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 0.5
  controls.maxDistance = 20
  controls.target.set(0, 0.5, 0)

  startLoop(() => {
    controls.update()
  })

  if (props.modelUrl) {
    loadModelUrl(props.modelUrl)
  }
})

watch(() => props.modelUrl, (url) => {
  if (url) loadModelUrl(url)
})

async function loadModelUrl(url) {
  error.value = null
  const model = await loadModel(url)
  if (model) {
    emit('loaded', model)
  } else {
    // Show distinct procedural model for the current key
    const procedural = buildProceduralModel(scene, props.modelKey)
    setCurrentModel(procedural)
    emit('loaded', procedural)
  }
}
</script>

<style scoped>
.model-viewer-container {
  border-radius: 8px;
  overflow: hidden;
}
</style>
