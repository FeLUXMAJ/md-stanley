<template>
  <div class="post">
    <md-progress md-indeterminate v-if="this.loading" class="md-warn"></md-progress>
    <div class="wrapper" v-else>
      <div class="post-cover" v-once>
      </div>
      <div class="container" id="post">
        <div v-html="post.content.rendered"></div>
        <md-speed-dial md-open="click" md-direction="top" class="md-fab-bottom-right" v-if="this.$children.isCmt == false">
        <md-button class="md-fab" md-fab-trigger>
          <md-icon md-icon-morph>close</md-icon>
          <md-icon>add</md-icon>
        </md-button>

        <md-button class="md-fab md-primary md-mini md-clean">
          <md-icon>share</md-icon>
          <md-tooltip md-direction="left">Share this post</md-tooltip>
        </md-button>

        <md-button class="md-fab md-primary md-mini md-clean">
          <md-icon>comment</md-icon>
          <md-tooltip md-direction="left">Leave a reply</md-tooltip>
        </md-button>

        <md-button class="md-fab md-primary md-mini md-clean">
          <md-icon>attach_money</md-icon>
          <md-tooltip md-direction="left">Donate</md-tooltip>
        </md-button>
        </md-speed-dial>
      </div>
    </div>
    <comment v-bind:postId="post.id" v-if="loading == false"></comment>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
export default {
  data () {
    return {
      post: [],
      tags: [],
      loading: true,
      previousPost: '',
      scrolled: 0,
      postmain: 0
    }
  },
  name: 'post',
  components: {Comment},
  watch: {
    '$route': 'reload'
  },
  mounted () {
    this.reload()
  },
  activated () {
    this.$parent.transparent = true
    window.addEventListener('scroll', this.handleScroll)
    this.scrolled = 0
    this.postmain = 0
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
    reload () {
      this.loading = true
      var post = this.$route.params.postId
      if (typeof post !== 'undefined' && post !== this.previousPost) {
        this.$parent.title = 'Loading...'
        this.$http.get('posts/' + this.$route.params.postId).then((res) => {
          this.post = res.data
          this.$parent.title = this.post.title.rendered
          this.loading = false
          this.previousPost = post
        })
      } else {
        if (this.$route.name == 'Post') {
          this.$parent.title = this.post.title.rendered
          this.loading = false
        }
      }
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
