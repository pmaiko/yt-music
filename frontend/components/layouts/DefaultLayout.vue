<template>
  <div class="layout">
    <BaseLink :url="{name: 'home', params: null}">Home</BaseLink>
    <BaseLink :url="{name: 'about.id'}">About</BaseLink>

    <ModalsContainer />
    <Notifications />

    <main class="page-content">
      <RouterView />
    </main>
  </div>
</template>
<script setup lang="ts">
  import { ModalsContainer } from 'vue-final-modal'
  import '~/helpers/utils.ts'
</script>
