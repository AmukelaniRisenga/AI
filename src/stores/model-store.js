import { defineStore } from 'pinia'
import { analyzeObject, modelKeyToUrl } from 'src/services/modelService'

export const useModelStore = defineStore('model', {
  state: () => ({
    modelKey: null,
    modelUrl: null,
    summary: null,
    isLoading: false,
    error: null,
    lastQuery: null,
  }),
  actions: {
    async analyzeAndLoad({ text, imageBase64, mimeType }) {
      this.isLoading = true
      this.error = null
      this.lastQuery = text || 'image upload'
      try {
        const { modelKey, summary } = await analyzeObject({ text, imageBase64, mimeType })
        this.modelKey = modelKey
        this.modelUrl = modelKeyToUrl(modelKey)
        this.summary = summary
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },
    reset() {
      this.modelKey = null
      this.modelUrl = null
      this.summary = null
      this.error = null
      this.lastQuery = null
    },
  },
})
