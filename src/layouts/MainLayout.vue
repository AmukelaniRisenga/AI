<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey-10">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-icon name="hub" class="q-mr-sm" />NexEra AI Prototypes
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-10">
      <q-list>
        <q-item-label header class="text-grey-5 text-uppercase text-caption q-pt-lg">
          Navigation
        </q-item-label>

        <q-item
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          exact
          clickable
          active-class="nav-active"
          class="q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" :color="link.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-grey-3">{{ link.title }}</q-item-label>
            <q-item-label caption class="text-grey-6">{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator dark class="q-my-md" />

        <q-item-label header class="text-grey-5 text-uppercase text-caption">
          About
        </q-item-label>
        <q-item class="q-pb-md">
          <q-item-section>
            <q-item-label class="text-grey-5 text-caption" style="line-height:1.5">
              Two AI-powered interactive prototypes for NexEra's human training platform.
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

const navLinks = [
  {
    title: 'Home',
    caption: 'Overview of prototypes',
    icon: 'home',
    color: 'grey-4',
    to: '/',
  },
  {
    title: '3D Asset Pipeline',
    caption: 'Text / image → 3D model',
    icon: 'view_in_ar',
    color: 'primary',
    to: '/prototype1',
  },
  {
    title: 'Avatar Animation',
    caption: 'Natural language → avatar',
    icon: 'accessibility_new',
    color: 'secondary',
    to: '/prototype2',
  },
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.nav-active {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
</style>
