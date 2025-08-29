<template>
  <div>
    <div>
      <router-link :to="{name: 'test'}">Test</router-link>
      <br>
      <br>
    </div>

    <iframe
      :src="URL"
      allowfullscreen
      frameborder="0"
    />
  </div>
</template>
<script setup lang="ts">
  const URL = ref('https://stage-game-launcher-lux.isoftbet.com/377/31062?lang=en&cur=EUR&mode=1&user=LINATESTACCOUNT123&uid=4007701134&token=R4g2ZvSYjNavS0ecQ00qHvboO0tAar00AbW0&lobbyURL=')

  setTimeout(() => {
    console.log(123123123)
    URL.value = 'https://stage-game-launcher-lux.isoftbet.com/377/31062?lang=en&cur=EUR&mode=1&user=LINATESTACCOUNT123&uid=4007701134&token=2UO07938y70xQsYee53GRRQ6ga284cdf4C43&lobbyURL='
  }, 3000)
</script>
<style>
  iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
</style>
