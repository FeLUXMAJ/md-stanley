<template>
  <div class="post">
    <md-progress md-indeterminate v-if="this.loading" class="md-warn"></md-progress>
    <div class="wrapper" v-else>
      <div class="post-cover" v-once></div>
      <div class="container" id="container">
        <div v-if="post.content.rendered == ''">
          <md-input-container md-has-password>
            <md-icon>lock</md-icon>
            <label>Password</label>
            <md-input type="password" v-model="password"></md-input>
          </md-input-container>
          <md-button class="md-primary" v-on:click.native.once="getPost">Confirm</md-button>
        </div>

        <div class="post-content" v-else>
          <md-button class="md-fab toc-toggle" v-on:click.native="$refs.rightSidenav.toggle()">
            <md-icon>view_list</md-icon>
          </md-button>

          <md-sidenav class="md-right toc-container" ref="rightSidenav">
            <md-list class="toc">
              <a v-bind:href="'#'+title.id" v-for="title in toclist">
                <md-list-item v-bind:class="'toc-'+title.name">{{title.text}}</md-list-item>
              </a>
            </md-list>
          </md-sidenav>
          <div ref="content" class="content" v-html="post.content.rendered"></div>
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
    }
  },
  name: 'post',
  components: {Comment},
  activated () {
    this.$parent.transparent = true
    this.scrolled = 0
    this.postmain = 0

    if (this.post) {
      if (this.post.id != this.$route.params.postId) {
        this.password = null
        this.getPost()
      }else {
        this.$parent.title = this.post.title.rendered
        this.$parent.transparent = true
      }
    }else {
      this.getPost()
    }

    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll)
    })
  },
  deactivated () {
    window.removeEventListener('scroll', this.handleScroll)
    this.$parent.transparent = false
  },
  methods: {
    handleScroll () {
      this.$parent.transparent = false
      this.scrolled = window.scrollY + window.innerHeight - 220
      this.postmain = document.getElementById("container").clientHeight
      if (window.scrollY <= 120) {
        this.$parent.transparent = true
      }
    },
    toc () {
      this.$nextTick(() => {
          var toc = []
          var content = this.$refs.content
          var heading = [].slice.call(content.querySelectorAll("h1,h2,h3,h4"))
          heading.forEach((item) => {
            item.id = encodeURI(item.outerText)
            toc = toc.concat([{name: item.nodeName,text: item.outerText,id:item.id}])
          })
          this.toclist = toc
      })
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

.toc-H2 {
  padding-left: 10px;
}

.toc-H3 {
  padding-left: 15px;
}

.toc-H4 {
  padding-left: 20px;
}

.toc {
  list-style: none;
}

.toc-toggle {
  position: fixed;
  right: 40px;
  bottom: 65px;
}

@media screen and (min-width: 960px) {
  .post-content {
    display: flex;
  }
  .content {
    flex: 1;
  }
  .toc-toggle {
    display: none;
  }
  .toc-container {
    position: static !important;
    width: 233px !important;
  }
  .md-sidenav-content {
    position: absolute;
    left: 0px;
    width: 233px;
  }
}
</style>
