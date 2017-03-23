<template>
  <div class="comment-list">
    <div class="comment-main">
    <md-avatar class="md-large" style="margin-right: 16px;">
      <img v-bind:src="src" alt="People">
    </md-avatar>

    <div class="md-list-text-container">
      <span>{{name}} #{{id}}</span>
      <span>{{date | locale}}</span>
      <p v-html="content"></p>
    </div>

    <md-button class="md-icon-button md-list-action" v-on:click.native.stop="onSubComments(id)">
      <md-icon v-if="this.children != undefined" class="md-primary">chat_bubble</md-icon>
      <md-icon v-else class="md-primary">chat_bubble_outline</md-icon>
    </md-button>
  </div>
    <md-list v-for="item in sublist" v-if="sublist.length !== 0" class="sub-comment">
      <md-list-item>
        <md-avatar class="md-large">
          <img v-bind:src="item.author_avatar_urls[48]" alt="People">
        </md-avatar>

        <div class="md-list-text-container">
          <span><md-icon>reply</md-icon>{{item.author_name}} #{{item.id}}</span>
          <span>{{item.date | locale}}</span>
          <p v-html="item.content.rendered"></p>
        </div>
      </md-list-item>
    </md-list>

  </div>
</template>

<style>
.sub-comment {
  display: block;
  width: 100%;
}

.comment-main {
  display: flex;
  justify-content: center;
}

.comment-list {
  margin-bottom: 10px;
}
</style>
<script>
export default {
  data () {
    return {
      sublist: [],
      loading: false
    }
  },
  filters: {
    locale: function (value) {
      var v = new Date (Date.parse (value))
      return v.toLocaleString()
    }
  },
  props: ['src', 'name', 'date', 'content', 'id', 'children'],
  methods: {
    onSubComments (parentId) {
        //get sub comments
        this.$parent.parent = parentId
        if (this.sublist.length==0) {
          this.$http.get('comments', {
            params: {
              post: this.postId,
              parent: parentId
            },
          }).then((comments) => {
            if (comments.data.length) {
              this.sublist = this.sublist.concat(comments.data)
            }
          })
        } else {
          this.sublist = []
          this.$parent.parent = 0
        }

      return true
      }
  }
}
</script>
