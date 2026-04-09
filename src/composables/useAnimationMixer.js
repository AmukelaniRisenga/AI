import { ref } from 'vue'
import * as THREE from 'three'

export function useAnimationMixer() {
  const currentAnimation = ref('idle')
  let mixer = null
  let clips = {}
  let activeAction = null
  const clock = new THREE.Clock()

  function setup(model, animationClips) {
    mixer = new THREE.AnimationMixer(model)
    clips = {}
    animationClips.forEach((clip) => {
      clips[clip.name] = mixer.clipAction(clip)
    })
  }

  function playAnimation(name, fadeDuration = 0.4) {
    if (!mixer || !clips[name]) return
    const next = clips[name]
    if (activeAction && activeAction !== next) {
      activeAction.fadeOut(fadeDuration)
    }
    next.reset().fadeIn(fadeDuration).play()
    activeAction = next
    currentAnimation.value = name
  }

  function update() {
    if (mixer) {
      const delta = clock.getDelta()
      mixer.update(delta)
    }
  }

  function dispose() {
    mixer?.stopAllAction()
    mixer = null
    clips = {}
    activeAction = null
  }

  return { currentAnimation, setup, playAnimation, update, dispose }
}
