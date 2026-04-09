<template>
  <div v-if="props.summary" class="q-pa-md">
    <q-card dark class="bg-grey-9">
      <q-card-section>
        <div class="row items-center q-mb-sm">
          <q-icon name="school" color="primary" size="1.5rem" class="q-mr-sm" />
          <span class="text-subtitle1 text-grey-3">Educational Summary</span>
        </div>
        <q-separator dark class="q-mb-sm" />
        <div class="text-body2 text-grey-4 summary-text">{{ props.summary }}</div>
      </q-card-section>

      <q-card-section v-if="props.modelKey" class="q-pt-none">
        <q-chip
          square
          color="primary"
          text-color="white"
          icon="category"
          class="text-caption"
        >
          {{ formatKey(props.modelKey) }}
        </q-chip>
      </q-card-section>
    </q-card>
  </div>

  <div v-else-if="props.loading" class="q-pa-md">
    <q-card dark class="bg-grey-9">
      <q-card-section>
        <div class="row items-center">
          <q-spinner-dots color="primary" size="1.5rem" class="q-mr-sm" />
          <span class="text-grey-5 text-body2">Analyzing with AI...</span>
        </div>
        <q-linear-progress indeterminate color="primary" class="q-mt-sm" rounded />
      </q-card-section>
    </q-card>
  </div>

  <div v-else class="q-pa-md">
    <q-card dark class="bg-grey-9 text-center">
      <q-card-section>
        <q-icon name="view_in_ar" size="3rem" color="grey-7" />
        <div class="text-grey-6 text-body2 q-mt-sm">
          Enter a description or upload an image to generate a 3D model and learn about it.
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
const props = defineProps({
  summary: { type: String, default: null },
  modelKey: { type: String, default: null },
  loading: { type: Boolean, default: false },
})

function formatKey(key) {
  return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
</script>

<style scoped>
.summary-text {
  line-height: 1.6;
}
</style>
