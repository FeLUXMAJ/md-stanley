<template>
<div class="home">
  <md-card v-for="item in list">
    <router-link :to="'/post/'+item.id" tag="div">
    <md-card-media v-if="item._embedded['wp:featuredmedia']">
        <img v-bind:src="item._embedded['wp:featuredmedia'][0].source_url">
    </md-card-media>

    <md-card-header>
      <md-card-header-text>
        <div class="md-title">{{item.title.rendered}}</div>
        <div class="md-subhead">{{ item.modified_gmt | locale }}</div>
      </md-card-header-text>
    </md-card-header>

    <md-card-content v-if="item.excerpt.protected" class="password-protected">
      <md-icon class="md-size-3x md-display-1">lock</md-icon>
      <p>This post is password protected</p>
    </md-card-content>
    <md-card-content v-else v-html="item.excerpt.rendered"></md-card-content>
    </router-link>

    <md-card-actions>
      <md-button class="md-icon-button">
        <md-icon>favorite</md-icon>
      </md-button>

      <md-button class="md-icon-button">
        <md-icon>bookmark</md-icon>
      </md-button>

      <md-button class="md-icon-button">
        <md-icon>share</md-icon>
      </md-button>
    </md-card-actions>
  </md-card>
  <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" class="spinner">
  <span slot="no-more">
    Loading Complete :)
  </span>
  <span slot="spinner">
    <md-spinner md-indeterminate class="md-warn"></md-spinner>
  </span>
</infinite-loading>
</div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'home',
  data () {
    return {
      list: [],
      categoryId: ''
    }
  },
  mounted () {
    this.categoryId = this.$route.params.categoryId
  },
  activated () {
    this.$parent.title = this.$parent.siteName
    if (this.categoryId) {
      this.$parent.title = this.$route.params.categoryName
    }
    if (this.$route.params.categoryId != this.categoryId) {
      this.reload()
    }
  },
  watch: {
    '$route.params.categoryId': 'reload'
  },
  methods: {
    reload () {
      if(this.$route.name == 'Home') {
        this.$parent.title = this.$parent.siteName
      }else if (this.categoryId != this.$route.params.categoryId) {
        this.$parent.title = this.$route.params.categoryName
      }
      this.list = []
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
    },
    onInfinite() {
      this.$http.get('posts?_embed', {
        params: {
          page: this.list.length / 10 + 1,
          fields: 'id,title,excerpt,modified_gmt,_embedded',
          categories: this.$route.params.categoryId
        },
      }).then((posts) => {
        if (posts.data.length) {
          this.list = this.list.concat(posts.data)
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
          if (posts.data.code = "rest_invalid_param") {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        } else {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      })
    }
  },
  filters: {
    locale: function (value) {
      var v = new Date (Date.parse (value))
      return v.toLocaleString()
    }
  },
  components: {
    InfiniteLoading
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media screen and (min-width: 768px) {
  .home {
    column-count: 2;
    column-gap:15px;
    width: 90%;
    margin: 0px auto;
  }

  .md-card {
    display: inline-block;
    width: 100%
  }

  .spinner {
    column-span: all
  }
}

.password-protected {
  text-align: center;
}

.md-card {
  margin: 5px;
}
</style>
