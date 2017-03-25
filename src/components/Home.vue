<template>
<div class="home">
  <md-card v-for="item in list" md-with-hover>
    <md-card-media v-if="item._embedded['wp:featuredmedia']">
        <img v-bind:src="item._embedded['wp:featuredmedia'][0].source_url">
    </md-card-media>

    <md-card-header>
      <md-card-header-text>
        <router-link :to="'/post/'+item.id" tag="div"><div class="md-title">{{item.title.rendered}}</div></router-link>
        <div class="md-subhead">{{ item.modified_gmt | locale }}</div>
      </md-card-header-text>
    </md-card-header>

    <md-card-content v-if="item.excerpt.protected">
      This post is password protected
    </md-card-content>
    <md-card-content v-else v-html="item.excerpt.rendered"></md-card-content>

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
  <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
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
      this.$parent.title = this.$route.params.categoryName
      if (this.$route.name == 'Home' || this.$route.params.categoryId != '') {
        if (this.categoryId != this.$route.params.categoryId) {
          this.list = []
          this.$nextTick(() => {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
          })
        }
      }
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
    column-gap:10px;
  }
}

.md-card {
  margin: 5px;
}
</style>
