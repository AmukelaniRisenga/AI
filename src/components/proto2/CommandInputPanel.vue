<template>
  <div class="q-pa-md">
    <div class="text-h6 text-grey-3 q-mb-md">
      <q-icon name="accessibility_new" class="q-mr-sm" />Avatar Commands
    </div>

    <q-input
      v-model="commandText"
      dark
      filled
      label='Try: "Wave hello to the learner"'
      :disable="props.loading"
      clearable
      @keyup.enter="submit"
    >
      <template #append>
        <q-btn
          round
          flat
          icon="send"
          color="primary"
          :loading="props.loading"
          :disable="!commandText.trim()"
          @click="submit"
        />
      </template>
    </q-input>

    <!-- Preset chips -->
    <div class="q-mt-md">
      <div class="text-caption text-grey-6 q-mb-xs">Preset commands:</div>
      <div class="row wrap q-gutter-xs">
        <q-chip
          v-for="cmd in presets"
          :key="cmd.label"
          clickable
          color="dark"
          text-color="grey-4"
          :icon="cmd.icon"
          :disable="props.loading"
          class="q-mb-xs"
          @click="quickCommand(cmd.text)"
        >
          {{ cmd.label }}
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const commandText = ref('')

const presets = [
  { label: 'Wave hello', text: 'Wave hello to the learner', icon: 'waving_hand' },
  { label: 'Point forward', text: 'Point at the fire extinguisher', icon: 'back_hand' },
  { label: 'Safety posture', text: 'Show the correct safety posture', icon: 'health_and_safety' },
  { label: 'Walk', text: 'Walk to the table', icon: 'directions_walk' },
  { label: 'Crouch down', text: 'Crouch down to pick up equipment', icon: 'sports_gymnastics' },
  { label: 'Thumbs up', text: 'Give a thumbs up to confirm', icon: 'thumb_up' },
  { label: 'Look around', text: 'Look around to assess the environment', icon: 'visibility' },
  { label: 'Stand idle', text: 'Stand in idle position', icon: 'person' },
]

function submit() {
  if (!commandText.value.trim()) return
  emit('submit', commandText.value.trim())
}

function quickCommand(text) {
  commandText.value = text
  emit('submit', text)
}
</script>
