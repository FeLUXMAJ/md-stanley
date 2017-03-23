<template>
  <div class="post">
    <md-progress md-indeterminate v-if="this.loading" class="md-warn"></md-progress>
    <div class="wrapper" v-else>
      <div class="post-cover" v-once></div>

      <div class="container" id="post">
        <div v-if="post.content.rendered == ''">
          <md-input-container md-has-password>
            <md-icon>lock</md-icon>
            <label>Password</label>
            <md-input type="password" v-model="password"></md-input>
          </md-input-container>
          <md-button class="md-primary" v-on:click.native.once="getPost">Confirm</md-button>
        </div>

        <div v-else v-html="post.content.rendered"></div>
      </div>

    </div>
    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="4000">
      <span>Incorrect Password</span>
      <md-button class="md-warn" @click.native="$refs.snackbar.close()">Dismiss</md-button>
    </md-snackbar>
    <comment v-bind:postId="post.id" v-if="post.content.rendered != ''"></comment>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
export default {
  data () {
    return {
      post: [],
      tags: [],
      password: '',
      loading: true,
      scrolled: 0,
      postmain: 0,
    }
  },
  name: 'post',
  components: {Comment},
  activated () {
    window.addEventListener('scroll', this.handleScroll)
    this.scrolled = 0
    this.postmain = 0
    if (this.post.id != this.$route.params.postId) {
      this.password = null
      this.getPost()
    }
    if (this.post) {
      this.$parent.title = this.post.title.rendered
    }
    this.$parent.transparent = true
  },
  deactivated () {
    this.$parent.transparent = false
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.$parent.transparent = true
      this.scrolled = window.scrollY + window.innerHeight - 220
      this.postmain = document.getElementById('post').clientHeight
      if (window.scrollY >= 120) {
        this.$parent.transparent = false
      }
    },
    getPost () {
      this.loading = true
      this.$parent.title = 'Loading...'
      this.$http.get('posts/' + this.$route.params.postId,{
        params: {
          password: this.password
        }
      }).then((res) => {
        this.post = res.data
        this.$parent.title = this.post.title.rendered
        this.loading = false
        this.previousPost = post
      }, (res) => {
        this.loading = false
        this.$refs.snackbar.open()
      })
    }
  }
}
</script>

<style scoped>
.post-cover {
  background-image: url('/static/background.jpg');
  background-size: cover;
  height: 200px;
  margin-top: -65px;
}

.md-display-1 {
  padding-top: 25px;
}

.md-speed-dial {
  z-index: 9999;
  position: fixed !important;
}
</style>
