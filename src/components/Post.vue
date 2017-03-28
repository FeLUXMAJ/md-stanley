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

        <div class="post-content" v-else>
          <div class="toc" v-bind:class="{'toc-top': tocScroll}">
            <ul>
              <li v-for="title in toclist" v-bind:class="'toc-'+title.name">
                <a v-bind:href="'#'+title.id">{{title.text}}</a>
              </li>
            </ul>
          </div>
          <div ref="content" class="content" v-html="post.content.rendered" v-bind:class="{'content-toc-top': tocScroll}"></div>
        </div>
      </div>

    </div>
    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="4000">
      <span>Incorrect Password</span>
      <md-button class="md-warn" @click.native="$refs.snackbar.close()">Dismiss</md-button>
    </md-snackbar>
    <comment v-bind:postId="post.id" v-if="post.content.rendered && loading != true"></comment>
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
      toclist: [],
      tocScroll: false
    }
  },
  name: 'post',
  components: {Comment},
  activated () {
    window.addEventListener('scroll', this.handleScroll)
    this.scrolled = 0
    this.postmain = 0

    if (this.post && this.post.id != this.$route.params.postId) {
      this.password = null
      this.getPost()
    }else {
      this.$parent.title = this.post.title.rendered
      this.$parent.transparent = true
    }
  },
  deactivated () {
    window.removeEventListener('scroll', this.handleScroll)
    this.$parent.transparent = false
    this.tocScroll = false
  },
  methods: {
    toc () {
      this.$nextTick((item) => {
          var toc = []
          var content = this.$refs.content
          var heading = [].slice.call(content.querySelectorAll("h1,h2,h3,h4"))
          heading.forEach((item) => {
            toc = toc.concat([{name: item.nodeName,text: item.outerText}])
          })
          this.toclist = toc
      })
    },
    handleScroll () {
      this.$parent.transparent = true
      this.tocScroll = false
      this.scrolled = window.scrollY + window.innerHeight - 220
      this.postmain = document.getElementById('post').clientHeight
      if (window.scrollY >= 120) {
        this.$parent.transparent = false
        this.tocScroll = true
      }
    },
    getPost () {
      this.$parent.transparent = false
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
        this.$parent.transparent = true
        this.toc()
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

.post-content {
  display: flex;
}

@media screen and (min-width: 960px) {
  .toc {
    width: 233px;
    left: 0px;
    top: 65px;
  }

  .toc-top {
    position: fixed;
    height: 100%;
  }

  .content {
    flex: 1;
  }

  .content-toc-top {
    padding-left: 233px;
  }
}

.toc-H2 {
  padding-left: 10px;
}

.toc-H3 {
  padding-left: 15px;
}

.toc-H4 {
  padding-left: 20px;
}

.toc ul {
  list-style: none;
}
</style>
