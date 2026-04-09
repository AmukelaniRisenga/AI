import { ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

export function useModelLoader(scene) {
  const isLoading = ref(false)
  const error = ref(null)
  let currentModel = null

  function clearModel() {
    if (currentModel) {
      scene.remove(currentModel)
      currentModel.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      currentModel = null
    }
  }

  function autoScaleCenter(object) {
    const box = new THREE.Box3().setFromObject(object)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2.0 / maxDim
    object.scale.setScalar(scale)

    const center = new THREE.Vector3()
    box.getCenter(center)
    object.position.sub(center.multiplyScalar(scale))
    object.position.y += size.y * scale * 0.5
  }

  async function loadModel(url) {
    clearModel()
    isLoading.value = true
    error.value = null

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject)
      })

      const model = gltf.scene
      autoScaleCenter(model)
      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true
          obj.receiveShadow = true
        }
      })
      scene.add(model)
      currentModel = model
      return model
    } catch (err) {
      error.value = `Failed to load model: ${err.message}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  function createFallbackMesh(color = 0x4488ff) {
    clearModel()
    const geo = new THREE.BoxGeometry(1, 1, 1)
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = true
    scene.add(mesh)
    currentModel = mesh
    return mesh
  }

  function setCurrentModel(model) {
    currentModel = model
  }

  return { isLoading, error, loadModel, createFallbackMesh, clearModel, setCurrentModel }
}
