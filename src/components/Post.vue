<template>
  <div class="post">
    <md-progress md-indeterminate v-if="this.loading" class="md-warn"></md-progress>
    <div class="post-cover" v-once v-else></div>
    <div class="container" id="container" v-if="this.loading == false">
      <div v-if="post.content.rendered == ''">
        <md-input-container md-has-password>
          <md-icon>lock</md-icon>
          <label>Password</label>
          <md-input type="password" v-model="password"></md-input>
        </md-input-container>
        <md-button class="md-primary" v-on:click.native.once="getPost">Confirm</md-button>
      </div>

      <div class="post-content" v-else>
        <md-sidenav class="md-right" ref="rightSidenav">
          <div class="md-toolbar-container">
            <h3 class="md-title toc-title" v-text="this.post.title.rendered" align="center"></h3>
            <md-list class="toc-list">
              <md-list-item
                v-for="title in toclist"
                v-bind:class="'toc-'+title.name"
                v-on:click.native="goAnchor(title.id)"
                >{{title.text}}</md-list-item>
            </md-list>
          </div>
        </md-sidenav>

        <div ref="content" class="content" v-html="post.content.rendered"></div>
        <md-button class="md-fab toc-toggle" v-on:click.native="toggleToc()">
          <md-icon>view_list</md-icon>
        </md-button>
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
      if (window.innerWidth >= 960) {
        $refs.rightSidenav.mdVisible = true
      }
    })
  },
  deactivated () {
    window.removeEventListener('scroll', this.handleScroll)
    this.$parent.transparent = false
  },
  methods: {
    toggleToc () {
      var windowPos = window.scrollY
      this.$refs.rightSidenav.toggle()
      window.scroll(0, windowPos)
    },
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
    goAnchor (hash) {
      var elem = document.getElementById(hash)
      window.scrollTo(0, elem.offsetTop - 80)
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

<style>
table {
  color: #333;
  border-collapse:collapse;
  border-spacing: 0;
  min-width: 640px;
  overflow-x: auto;
}

@media screen and (max-width: 720px) {
  table {
    width: 100%;
    min-width: 0px;
  }
}

td, th {
  border: 1px solid transparent;
  height: 30px;
  transition: all 0.3s;
}

th {
  background: #DFDFDF;
  font-weight: bold;
}

td {
  background: #FAFAFA;
  text-align: center;
}

tr:nth-child(even) td { background: #F1F1F1; }

tr:nth-child(odd) td { background: #FEFEFE; }

.post-cover {
  background-image: url('/static/background.jpg');
  background-size: cover;
  height: 200px;
  margin-top: -65px;
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

.toc-toggle {
  position: fixed;
  right: 16px;
  bottom: 64px;
}

blockquote {
  margin: 20px 0;
  padding-left: 1rem;
  border-left: 5px solid #B2DFDB;
}

@media screen and (min-width: 960px) {
  .post-content {
    display: flex;
  }

  .content {
    flex: 1;
    padding-left: 16px;
  }

  .toc-toggle, .toc-title {
    display: none;
  }

  .md-right .md-sidenav-content {
    position: initial !important;
    left: 0px;
    right: initial !important;
    transform: none !important;
    width: 260px;
    box-shadow: none !important;
    pointer-events: all;
  }

  .md-right .md-sidenav-backdrop {
    display: none;
  }
}
</style>
