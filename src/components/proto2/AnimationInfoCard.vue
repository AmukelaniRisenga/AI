<template>
  <div v-if="props.explanation" class="q-pa-md">
    <q-card dark class="bg-grey-9">
      <q-card-section>
        <div class="row items-center q-mb-sm">
          <q-icon name="animation" color="secondary" size="1.5rem" class="q-mr-sm" />
          <span class="text-subtitle1 text-grey-3">AI Explanation</span>
        </div>
        <q-separator dark class="q-mb-sm" />
        <div class="text-body2 text-grey-4" style="line-height:1.6">{{ props.explanation }}</div>
      </q-card-section>

      <q-card-section v-if="props.animationKey" class="q-pt-none">
        <q-chip
          square
          color="secondary"
          text-color="white"
          icon="play_arrow"
          class="text-caption"
        >
          {{ formatKey(props.animationKey) }}
        </q-chip>
        <span v-if="props.lastCommand" class="text-caption text-grey-6 q-ml-sm">
          "{{ props.lastCommand }}"
        </span>
      </q-card-section>
    </q-card>
  </div>

  <div v-else-if="props.loading" class="q-pa-md">
    <q-card dark class="bg-grey-9">
      <q-card-section>
        <div class="row items-center">
          <q-spinner-dots color="secondary" size="1.5rem" class="q-mr-sm" />
          <span class="text-grey-5 text-body2">Interpreting command...</span>
        </div>
        <q-linear-progress indeterminate color="secondary" class="q-mt-sm" rounded />
      </q-card-section>
    </q-card>
  </div>

  <div v-else class="q-pa-md">
    <q-card dark class="bg-grey-9 text-center">
      <q-card-section>
        <q-icon name="accessibility_new" size="3rem" color="grey-7" />
        <div class="text-grey-6 text-body2 q-mt-sm">
          Type a command or pick a preset to control the avatar.
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
const props = defineProps({
  explanation: { type: String, default: null },
  animationKey: { type: String, default: null },
  lastCommand: { type: String, default: null },
  loading: { type: Boolean, default: false },
})

function formatKey(key) {
  return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
</script>
