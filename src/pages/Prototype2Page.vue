<template>
  <q-page class="proto2-page column">
    <!-- Page header -->
    <div class="q-px-md q-pt-md q-pb-sm">
      <div class="text-h5 text-grey-2">Natural Language → Avatar Animation</div>
      <div class="text-caption text-grey-6">
        Type a command in plain English → AI maps it to an animation → Avatar responds
      </div>
    </div>

    <!-- Main content -->
    <div class="row col q-pa-md q-gutter-md no-wrap" style="min-height:0;">
      <!-- Avatar viewer -->
      <div class="col-8 viewer-wrap">
        <AvatarViewer :animation-key="avatarStore.animationKey" />
      </div>

      <!-- Command panel -->
      <div class="col-4 column q-gutter-sm" style="min-width:280px;overflow-y:auto;">
        <CommandInputPanel :loading="avatarStore.isLoading" @submit="onCommand" />
        <q-separator dark />
        <AnimationInfoCard
          :explanation="avatarStore.explanation"
          :animation-key="avatarStore.animationKey"
          :last-command="avatarStore.lastCommand"
          :loading="avatarStore.isLoading"
        />

        <!-- Error banner -->
        <q-banner v-if="avatarStore.error" dense rounded class="bg-negative text-white q-mx-md">
          <template #avatar>
            <q-icon name="warning" />
          </template>
          {{ avatarStore.error }}
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAvatarStore } from 'stores/avatar-store'
import AvatarViewer from 'components/proto2/AvatarViewer.vue'
import CommandInputPanel from 'components/proto2/CommandInputPanel.vue'
import AnimationInfoCard from 'components/proto2/AnimationInfoCard.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const avatarStore = useAvatarStore()

async function onCommand(command) {
  await avatarStore.interpretAndAnimate(command)
  if (avatarStore.error) {
    $q.notify({ type: 'negative', message: avatarStore.error, position: 'top' })
  }
}
</script>

<style scoped>
.proto2-page {
  background: #0d1117;
  height: 100%;
}
.viewer-wrap {
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
