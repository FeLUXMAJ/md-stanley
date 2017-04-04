<template>
  <div class="post">
    <md-progress md-indeterminate v-if="this.loading" class="loading"></md-progress>
    <main class="post-content" v-else>
      <md-sidenav class="md-right" ref="rightSidenav" v-show="this.tocDisplay">
        <div class="md-toolbar-container">
          <h3 class="md-title toc-title" v-text="this.post.title.rendered" align="center"></h3>
          <md-list class="toc-list">
            <md-list-item v-for="title in toclist" v-bind:class="'toc-'+title.name" v-on:click.native="goAnchor(title.id)">{{title.text}}</md-list-item>
          </md-list>
        </div>
      </md-sidenav>

      <div class="main" v-bind:class="[tocDisplay ? 'main-with-toc' : 'main-without-toc']">
        <div class="post-cover" v-bind:style="{backgroundImage: coverImg}"></div>
        <div class="container">
          <article ref="content" class="content" v-html="post.content.rendered" id="article-main"></article>
          <comment v-bind:postId="post.id" v-if="post.content.rendered && loading != true"></comment>
          <md-button class="md-fab toc-toggle" v-on:click.native="toggleToc()">
            <md-icon>view_list</md-icon>
          </md-button>
        </div>
      </div>
    </main>

    <md-dialog ref="password">
        <md-dialog-title>Password is required for this post</md-dialog-title>
        <md-dialog-content>
          <md-input-container md-has-password md-theme="blue">
            <md-icon>lock</md-icon>
            <label>Password</label>
            <md-input type="password" v-model="password"></md-input>
          </md-input-container>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button v-on:click.native="back()">Cancel</md-button>
          <md-button v-on:click.native.once="confirmPass()">Confirm</md-button>
        </md-dialog-actions>
    </md-dialog>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="4000">
      <span>Incorrect Password</span>
      <md-button class="md-warn" @click.native="$refs.snackbar.close()">Dismiss</md-button>
    </md-snackbar>

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
      tocDisplay: true,
      scrolled: 0,
      postmain: 0,
      toclist: []
    }
  },
  name: 'post',
  components: {Comment},
  computed: {
    coverImg () {
      if (this.post.featured_media == 0) {
        return 'url(/static/background.jpg)'
      } else {
        var url = this.post._embedded['wp:featuredmedia'][0].source_url
        return 'url(' + url + ')'
      }

    }
  },
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
      }
    }else {
      this.getPost()
    }

    this.$nextTick(() => {
      if (window.innerWidth <= 720) {
        window.addEventListener('scroll', this.handleScroll)
      }
    })
  },
  deactivated () {
    window.removeEventListener('scroll', this.handleScroll)
    this.$parent.transparent = false
  },
  methods: {
    back () {
      this.post = []
      this.$refs.password.close()
      history.back(1)
    },
    toggleToc () {
      if (window.innerWidth <= 720) {
        var windowPos = window.scrollY
        this.$refs.rightSidenav.toggle()
        window.scroll(0, windowPos)
      } else {
        if (this.tocDisplay == true) {
          this.tocDisplay = false
          this.$parent.navEnabled = false
        }else {
          this.tocDisplay = true
          this.$parent.navEnabled = true
        }
      }
    },
    handleScroll () {
      this.$parent.transparent = false
      this.scrolled = window.scrollY + window.innerHeight - 300
      this.postmain = document.getElementById("article-main").clientHeight
      if (window.scrollY <= 120) {
        this.$parent.transparent = true
      }
    },
    toc () {  //Render toc and mathjax
      this.$nextTick(() => {
          var toc = []
          var content = this.$refs.content
          var heading = [].slice.call(content.querySelectorAll("h1,h2,h3,h4"))
          heading.forEach((item) => {
            item.id = encodeURI(item.outerText)
            toc = toc.concat([{name: item.nodeName,text: item.outerText,id:item.id}])
          })
          this.toclist = toc

          var math = document.getElementById("article-main");
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]);
      })
    },
    goAnchor (hash) {
      var elem = document.getElementById(hash)
      window.scrollTo(0, elem.offsetTop - 80)
    },
    confirmPass () {
      this.$refs.password.close()
      this.getPost()
    },
    getPost () {
      this.$parent.transparent = false
      this.loading = true
      this.$parent.title = 'Loading...'
      this.$http.get('posts/' + this.$route.params.postId + '?_embed',{
        params: {
          password: this.password
        }
      }).then((res) => {
        this.post = res.data
        this.$parent.title = this.post.title.rendered
        if (res.data.content.rendered == "") {
          this.$refs.password.open()
        } else {
          this.loading = false
          this.$parent.transparent = true
          this.toc()
          this.password = null
        }
      }, (res) => {
        this.loading = false
        this.$refs.snackbar.open()
        this.$refs.password.open()
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
  width: 100%;
  overflow-x: auto;
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

.md-toolbar-post{
  background: transparent !important;
  box-shadow: unset;
  color: #fff !important;
}

.post-cover {
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
  border-left: 5px solid #ccc;
}

.content {
  word-wrap: break-word;
}

.loading {
  z-index: 3;
}

@media screen and (min-width: 768px) {
  .md-toolbar-post {
    color: #000 !important;
    width: 300px;
  }

  .main-without-toc {
    max-width: 960px;
    min-width: 768px;
    margin: auto;
  }

  .main-with-toc {
    margin-left: 300px;
  }

  .toc-title {
    display: none;
  }

  .toc-lg {
    display: none;
  }

  .md-right .md-sidenav-content {
    position: fixed !important;
    left: 0px;
    top: 65px;
    right: initial !important;
    transform: none !important;
    width: 300px;
    box-shadow: none !important;
    pointer-events: all;
  }

  .md-right .md-sidenav-backdrop {
    display: none;
  }
}

</style>
