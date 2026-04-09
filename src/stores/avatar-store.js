import { defineStore } from 'pinia'
import { interpretCommand } from 'src/services/avatarService'

export const useAvatarStore = defineStore('avatar', {
  state: () => ({
    animationKey: 'idle',
    explanation: null,
    isLoading: false,
    error: null,
    lastCommand: null,
  }),
  actions: {
    async interpretAndAnimate(command) {
      this.isLoading = true
      this.error = null
      this.lastCommand = command
      try {
        const { animationKey, explanation } = await interpretCommand(command)
        this.animationKey = animationKey
        this.explanation = explanation
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },
    reset() {
      this.animationKey = 'idle'
      this.explanation = null
      this.error = null
      this.lastCommand = null
    },
  },
})
