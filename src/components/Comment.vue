<template>
  <div class="container" id="comment">
    <div class="header" style="display: flex">
      <span class="md-subheading" style="flex:1">Comments</span>
      <router-link to="/settings">Settings</router-link>
    </div>

    <div class="comment-input" v-bind:class="{ cmtbottom: isCmt }">
      <md-input-container md-inline>
        <label>{{placeholder}}</label>
        <md-textarea v-model="comment"></md-textarea>
        <md-icon v-on:click.native.stop="submit">send</md-icon>
      </md-input-container>
    </div>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="4000">
      <span>{{message}}</span>
      <md-button class="md-warn" @click.native="$refs.snackbar.close()">Dismiss</md-button>
    </md-snackbar>

    <div class="comments">
        <div class="custom-list md-triple-line"  v-for="item in list">
          <comment-list
            v-bind:src="item.author_avatar_urls[48]"
            v-bind:name="item.author_name"
            v-bind:date="item.date"
            v-bind:content="item.content.rendered"
            v-bind:id="item.id"
            v-bind:children="item._links.children">
          </comment-list>
        </div>
      </div>

      <infinite-loading :on-infinite="onInfiniteComments" ref="infiniteLoading">
        <span slot="no-more">
          Loading Complete :)
        </span>
        <span slot="spinner">
          <md-spinner md-indeterminate class="md-warn"></md-spinner>
        </span>
      </infinite-loading>
    </div>
  </div>
</template>

<style scoped>
span {
  font-size: 14px !important;
}

.sub-comment {
  padding-left: 20px;
}

.cmtbottom {
  position: fixed;
  bottom: 0px;
  width: 100%;
  left: 0px;
  z-index: 2;
  padding: 0 16px 0 16px;
  margin: -10px 0 -10px 0;
}

.md-input-container .md-icon::after{
  display: none;
}

#comment {
  margin-bottom: 40px;
}
</style>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import CommentList from '@/components/CommentList'
export default {
  data () {
    return {
      comment: '', //content of comment
      parent: 0,
      list: [],
      authorName: '',
      authorEmail: '',
      message: ''
    }
  },
  name: 'Comment',
  props: ['postId'],
  computed: {
    placeholder () {
      if (this.parent == 0) {
        return 'Leave a comment'
      } else {
        return 'Reply to #' + this.parent
      }
    },
    isCmt () {
      if (this.$parent.scrolled >= this.$parent.postmain) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    InfiniteLoading, CommentList
  },
  activated () {
    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
    this.authorName = localStorage.getItem('name')
    this.authorEmail = localStorage.getItem('email')
  },
  deactivated () {
    this.list = []
  },
  methods: {
    submit () {
      if (this.comment !== '') {
        if (this.authorName != null && this.authorEmail != null) {
          var body = new FormData()
          //append info
          body.append("author_name", this.authorName)
          body.append("author_email", this.authorEmail)
          body.append("post", this.postId)
          body.append("content", this.comment)
          body.append("parent", this.parent)

          this.$parent.loading = true

          this.$http.post('comments/', body).then((res) => {
            this.$parent.loading = false
            this.message = 'Sent'
          },
          (res) => {
            this.$parent.loading = false
            this.message = res.data.message
          })

        }

        else {
          this.message = 'Name and email not set'
        }
        this.$refs.snackbar.open()
      }
    },
    onInfiniteComments () {
      this.$http.get('comments', {
        params: {
          post: this.postId,
          parent: 0,
          page: this.list.length / 10 + 1,
          password: this.$parent.password
        },
      }).then((comments) => {
        if (comments.data.length) {
          //foreach comments with parent = 0, put them into this.comments
          this.list = this.list.concat(comments.data)
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
          if (comments.data.code = "rest_invalid_param") {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        } else {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      })
    }
  }
}
</script>
