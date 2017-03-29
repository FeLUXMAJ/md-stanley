<template>
  <div id="app">
    <title>{{title}}</title>
    <md-toolbar class="top" v-bind:class="{ 'md-toolbar-post': transparent}">
      <div class="md-toolbar-container">
        <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
          <md-icon>menu</md-icon>
        </md-button>

        <h2 class="md-title" style="flex: 1">{{title}}</h2>
        <md-button class="md-icon-button">
          <md-icon>search</md-icon>
        </md-button>
      </div>
    </md-toolbar>

    <md-sidenav class="md-left" ref="leftSidenav">
      <md-toolbar class="md-account-header">
        <md-list class="md-transparent">
          <md-list-item class="md-avatar-list">
            <md-avatar class="md-large">
              <img src="https://secure.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=96&d=mm&r=g" alt="People">
            </md-avatar>
          </md-list-item>

          <md-list-item class="md-avatar-list">
            <div class="md-list-text-container">
              <span>{{siteName}}</span>
              <span>{{siteDescription}}</span>
            </div>
          </md-list-item>
        </md-list>
      </md-toolbar>

      <md-list>
          <router-link to="/" tag="li"><md-list-item>
            <md-icon>home</md-icon> <span>Home</span>
          </md-list-item></router-link>

          <md-list-item>
            <md-icon>view_list</md-icon>
            <span>Categories</span>

            <md-list-expand>
              <md-list>
                <router-link
                  :to="'/category/'+ category.name +'/id/'+ category.id "
                  tag="li"
                  v-for="category in categories">
                <md-list-item class="md-inset">
                  {{category.name}}
                </md-list-item>
              </router-link>
              </md-list>
            </md-list-expand>
            <md-divider></md-divider>
          </md-list-item>

          <router-link to="/about" tag="li">
          <md-list-item>
            <md-icon>info</md-icon> <span>About</span>
          </md-list-item>
          </router-link>

          <router-link to="/settings" tag="li">
          <md-list-item>
            <md-icon>settings</md-icon> <span>Settings</span>
          </md-list-item>
          </router-link>
        </md-list>
    </md-sidenav>

      <transition name="slide-fade">
        <keep-alive>
          <router-view class="main"></router-view>
        </keep-alive>
      </transition>

  </div>
</template>

<script>
export default {
  data () {
    return {
      categories: [],
      siteName: 'Stanley\'s blog',
      siteDescription: 'Where fragments of time goes',
      title: null,
      transparent: false
    }
  },
  created: function () {
    this.$http.get('categories').then((res) => {this.categories = res.data})
  },
  methods: {
    toggleLeftSidenav() {
      this.$refs.leftSidenav.toggle();
    }
  }
}
</script>

<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif, "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  font-variant-ligatures: common-ligatures contextual;
}

body, .cmtbottom{
  background-color: #fff !important;
  color: #161823 !important;
}

.md-title {
  transition: all .4s cubic-bezier(.25,.8,.25,1);
}

.md-toolbar {
  color: #fff !important;
}

.md-toolbar-post{
  background-image: none;
  background: transparent !important;
  color: #fff !important;
}

.md-sidenav .md-backdrop{
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 300;
  top: 0px !important;
}

/*prevent z-index calculate error */
.md-card {
  z-index: 100;
}

body {
  margin-top: 64px !important;
}

.md-avatar-list .md-list-item-container:hover{
  background: none !important;
}

.top {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 200 !important;
}

.md-sidenav-content {
  z-index: 400 !important;
  position: fixed !important;
}

.container {
  padding: 16px;
}
</style>
