<template>
  <div class="view-container">
    <h1 class="page-title">INDEX</h1>
    <test-component />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TestComponent from '@/components/TestComponent.vue'

export default Vue.extend({ components: { TestComponent } })
</script>
