<template>
  <div class="q-pa-md">
    <div class="text-h6 text-grey-3 q-mb-md">
      <q-icon name="view_in_ar" class="q-mr-sm" />3D Object Finder
    </div>

    <!-- Text input -->
    <q-input
      v-model="textInput"
      dark
      filled
      label="Describe an object (e.g. yellow hard hat)"
      :disable="props.loading"
      @keyup.enter="submitText"
    >
      <template #append>
        <q-btn
          round
          flat
          icon="send"
          color="primary"
          :loading="props.loading"
          :disable="!textInput.trim()"
          @click="submitText"
        />
      </template>
    </q-input>

    <div class="text-center text-grey-6 q-my-sm text-caption">— or —</div>

    <!-- Image upload -->
    <q-file
      v-model="imageFile"
      dark
      filled
      label="Upload an image of the object"
      accept="image/*"
      :disable="props.loading"
      clearable
    >
      <template #prepend>
        <q-icon name="image" color="primary" />
      </template>
    </q-file>

    <q-btn
      v-if="imageFile"
      class="q-mt-sm full-width"
      color="primary"
      icon="search"
      label="Identify from image"
      :loading="props.loading"
      @click="submitImage"
    />

    <!-- Quick example chips -->
    <div class="q-mt-md">
      <div class="text-caption text-grey-6 q-mb-xs">Quick examples:</div>
      <q-chip
        v-for="example in examples"
        :key="example"
        clickable
        color="dark"
        text-color="grey-4"
        class="q-mr-xs q-mb-xs"
        :disable="props.loading"
        @click="quickLoad(example)"
      >
        {{ example }}
      </q-chip>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const textInput = ref('')
const imageFile = ref(null)

const examples = [
  'yellow hard hat',
  'fire extinguisher',
  'safety vest',
  'first aid kit',
  'power drill',
  'wrench',
]

function submitText() {
  if (!textInput.value.trim()) return
  emit('submit', { text: textInput.value.trim() })
}

function quickLoad(text) {
  textInput.value = text
  emit('submit', { text })
}

async function submitImage() {
  if (!imageFile.value) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target.result
    const [header, base64] = dataUrl.split(',')
    const mimeType = header.match(/:(.*?);/)[1]
    emit('submit', { imageBase64: base64, mimeType })
  }
  reader.readAsDataURL(imageFile.value)
}
</script>
