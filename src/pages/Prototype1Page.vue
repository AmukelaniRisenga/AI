<template>
  <q-page class="proto1-page column">
    <!-- Page header -->
    <div class="q-px-md q-pt-md q-pb-sm">
      <div class="text-h5 text-grey-2">AI-Generated 3D Asset Pipeline</div>
      <div class="text-caption text-grey-6">
        Describe or upload an object → AI identifies it → 3D model loads with educational context
      </div>
    </div>

    <!-- Main content area -->
    <div class="row col q-pa-md q-gutter-md no-wrap" style="min-height:0;">
      <!-- 3D Viewer -->
      <div class="col-8 viewer-wrap">
        <ModelViewer
          :model-url="modelStore.modelUrl"
          :model-key="modelStore.modelKey"
          :loading="modelStore.isLoading"
          @loaded="onModelLoaded"
          @error="onModelError"
        />
      </div>

      <!-- Control panel -->
      <div class="col-4 column q-gutter-sm" style="min-width:280px;overflow-y:auto;">
        <ModelInputPanel :loading="modelStore.isLoading" @submit="onSubmit" />
        <q-separator dark />
        <ModelInfoCard
          :summary="modelStore.summary"
          :model-key="modelStore.modelKey"
          :loading="modelStore.isLoading"
        />

        <!-- Error banner -->
        <q-banner v-if="modelStore.error" dense rounded class="bg-negative text-white q-mx-md">
          <template #avatar>
            <q-icon name="warning" />
          </template>
          {{ modelStore.error }}
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useModelStore } from 'stores/model-store'
import ModelViewer from 'components/proto1/ModelViewer.vue'
import ModelInputPanel from 'components/proto1/ModelInputPanel.vue'
import ModelInfoCard from 'components/proto1/ModelInfoCard.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const modelStore = useModelStore()

async function onSubmit(input) {
  await modelStore.analyzeAndLoad(input)
  if (modelStore.error) {
    $q.notify({ type: 'negative', message: modelStore.error, position: 'top' })
  }
}

function onModelLoaded() {
  $q.notify({ type: 'positive', message: 'Model loaded', position: 'bottom-right', timeout: 1500 })
}

function onModelError(msg) {
  $q.notify({ type: 'warning', message: msg, position: 'bottom-right', timeout: 2500 })
}
</script>

<style scoped>
.proto1-page {
  background: #0d1117;
  height: 100%;
}
.viewer-wrap {
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
