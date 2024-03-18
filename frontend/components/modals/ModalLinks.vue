<template>
  <BaseModal class="modal-links">
    <div class="modal-links__list">
      <a
        v-for="(item, index) in links"
        :key="index"
        :href="item.link"
        target="_blank"
        class="modal-links__list-link"
      >
        <BaseIcon
          icon="link"
          class="modal-links__list-link-icon"
        />
        <span class="modal-links__list-link-text">{{ item.label }}</span>
      </a>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
  import { Links } from '~/types.ts'

  defineProps<{
    links: Links[]
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
