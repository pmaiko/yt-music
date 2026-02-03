<template>
  <div class="layout">
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
