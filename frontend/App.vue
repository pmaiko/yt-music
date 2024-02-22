<template>
  <div>
    <a
      href="https://vitejs.dev"
      target="_blank"
    >
      <img
        src="/vite.svg"
        class="logo"
        alt="Vite logo"
      >
    </a>
    <a
      href="https://vuejs.org/"
      target="_blank"
    >
      <img
        src="@/assets/vue.svg"
        class="logo vue"
        alt="Vue logo"
      >
    </a>
    <MusicPage
      title="MusicPage"
    />
  </div>
</template>

<script setup lang="ts">
  import MusicPage from '~/components/pages/MusicPage.vue'
  import '~/modules/utils.ts'

  onMounted(() => {
    console.log('App')
  })
</script>

<style lang="scss">
  .logo {
    height: 6em;
    padding: 1.5em;
    transition: filter 300ms;
    will-change: filter;
  }

  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>
