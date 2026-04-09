<template>
  <q-page class="index-page column items-center justify-center q-pa-xl">
    <!-- Hero -->
    <div class="text-center q-mb-xl">
      <q-icon name="hub" size="4rem" color="primary" class="q-mb-md" />
      <div class="text-h3 text-grey-2 q-mb-sm">NexEra AI Prototypes</div>
      <div class="text-subtitle1 text-grey-6" style="max-width:540px;margin:0 auto">
        Two AI-powered interactive prototypes demonstrating how NexEra's platform
        can generate 3D training content and drive intelligent avatar simulations.
      </div>
    </div>

    <!-- Prototype cards -->
    <div class="row q-gutter-lg justify-center full-width" style="max-width:900px">

      <!-- Prototype 1 card -->
      <q-card
        dark
        class="prototype-card bg-grey-9 col-12 col-sm-5"
        clickable
        v-ripple
        @click="$router.push('/prototype1')"
      >
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <q-icon name="view_in_ar" size="4rem" color="primary" />
          <div class="text-h6 text-grey-2 q-mt-md">3D Asset Pipeline</div>
          <div class="text-caption text-grey-6 q-mt-xs">Test 1</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-body2 text-grey-5 text-center" style="line-height:1.6">
            Describe an object or upload an image. Claude AI identifies it, retrieves a matching
            3D model, and generates an educational safety summary.
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row justify-center q-gutter-xs">
            <q-badge color="blue-9" text-color="blue-3" label="Three.js Viewer" />
            <q-badge color="blue-9" text-color="blue-3" label="GLB Models" />
            <q-badge color="blue-9" text-color="blue-3" label="Claude Vision" />
          </div>
        </q-card-section>
        <q-card-actions class="justify-center q-pb-lg">
          <q-btn color="primary" icon-right="arrow_forward" label="Open Prototype" to="/prototype1" />
        </q-card-actions>
      </q-card>

      <!-- Prototype 2 card -->
      <q-card
        dark
        class="prototype-card bg-grey-9 col-12 col-sm-5"
        clickable
        v-ripple
        @click="$router.push('/prototype2')"
      >
        <q-card-section class="text-center q-pt-xl q-pb-md">
          <q-icon name="accessibility_new" size="4rem" color="secondary" />
          <div class="text-h6 text-grey-2 q-mt-md">Avatar Animation</div>
          <div class="text-caption text-grey-6 q-mt-xs">Test 2</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-body2 text-grey-5 text-center" style="line-height:1.6">
            Type plain English commands like "wave hello" or "show safety posture". Claude maps
            the intent to an animation and the 3D avatar performs it instantly.
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row justify-center q-gutter-xs">
            <q-badge color="teal-9" text-color="teal-3" label="NL Understanding" />
            <q-badge color="teal-9" text-color="teal-3" label="Animation Mixer" />
            <q-badge color="teal-9" text-color="teal-3" label="Mixamo Avatar" />
          </div>
        </q-card-section>
        <q-card-actions class="justify-center q-pb-lg">
          <q-btn color="secondary" icon-right="arrow_forward" label="Open Prototype" to="/prototype2" />
        </q-card-actions>
      </q-card>

    </div>

    <!-- Footer note -->
    <div class="text-caption text-grey-8 q-mt-xl text-center">
      Built with Quasar · Vue 3 · Three.js · Anthropic API
    </div>
  </q-page>
</template>

<style scoped>
.index-page {
  background: #0d1117;
  min-height: 100vh;
}
.prototype-card {
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.2s, border-color 0.2s;
  cursor: pointer;
}
.prototype-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.15);
}
</style>
