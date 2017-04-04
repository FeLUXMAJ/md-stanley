<template>
  <div class="container">
    <form novalidate @submit.stop.prevent="submit">
      <span class="md-title">Comments</span>
      <md-input-container md-theme="blue">
        <label>Name</label>
        <md-input v-model="name"></md-input>
      </md-input-container>

      <md-input-container md-theme="blue">
        <label>Email</label>
        <md-input v-model="email"></md-input>
      </md-input-container>

      <md-button class="md-primary" v-on:click.native.stop="submit">Confirm</md-button>
    </form>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="2000">
      <span>Configuration Saved</span>
      <md-button class="md-primary" @click.native="$refs.snackbar.close()">Dismiss</md-button>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      email: ''
    }
  },
  created () {
    this.$parent.title = 'Settings'
    this.name = localStorage.name
    this.email = localStorage.email
  },
  activated () {
    this.$parent.title = 'Settings'
  },
  methods: {
    submit () {
      this.$refs.snackbar.open()
      localStorage.setItem('name', this.name)
      localStorage.setItem('email', this.email);
    }
  }
}
</script>
