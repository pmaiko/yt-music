<template>
  <BaseModal class="modal-links">
    <div class="modal-links__list">
      <a
        v-if="src"
        :href="src"
        target="_blank"
        class="modal-links__list-link"
      >
        <BaseIcon
          icon="link"
          class="modal-links__list-link-icon"
        />
        <span class="modal-links__list-link-text">Audio src</span>
      </a>
      <a
        :href="links.saveFrom"
        target="_blank"
        class="modal-links__list-link"
      >
        <BaseIcon
          icon="link"
          class="modal-links__list-link-icon"
        />
        <span class="modal-links__list-link-text">SaveFrom</span>
      </a>
      <a
        v-for="(sefon, index) in links.seFon"
        :key="sefon"
        :href="sefon"
        target="_blank"
        class="modal-links__list-link"
      >
        <BaseIcon
          icon="link"
          class="modal-links__list-link-icon"
        />
        <span class="modal-links__list-link-text">SeFon {{ index + 1 }}</span>
      </a>
      <a
        v-for="(fm, index) in links.fm"
        :key="fm"
        :href="fm"
        target="_blank"
        class="modal-links__list-link"
      >
        <BaseIcon
          icon="link"
          class="modal-links__list-link-icon"
        />
        <span class="modal-links__list-link-text">Fm {{ index + 1 }}</span>
      </a>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
  import { Links } from '~/types.ts'

  defineProps<{
    src: string | null,
    links: Links
  }>()
</script>
<style lang="scss">
  .modal-links {
    &__list {
      &-link {
        display: flex;
        text-transform: uppercase;
        word-break: break-word;

        &:not(:last-child) {
          margin-right: 1rem;
          margin-bottom: 1.5rem;
        }

        &-icon {
          margin-right: 0.225rem;
        }
      }
    }
  }
</style>
