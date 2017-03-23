<template>
  <div class="container" v-once>
    <p class="md-display-1">Stanley</p>
    <p class="md-subheading">©2017 Stanley Cao</p>
    <p class="md-subheading">ver 0.9.0</p>
  </div>
</template>

<script>
  export default {
    activated () {
      this.$parent.title = 'About'
    }
  }
</script>
