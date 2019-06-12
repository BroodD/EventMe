<template>
  <v-app :class="{'user-logined': isUserLoggedIn}">
    <v-navigation-drawer
      app
      temporary
      dark
      v-model="drawer"
      width="280"
      v-if="isUserLoggedIn"
    >
      <v-list dense>
        <div class="por">
          <v-img :src="user.img"></v-img>

          <v-subheader class="avatar__sub">
            {{ user.login }}
          </v-subheader>
        </div>

        <template v-for="link in links">
          <v-list-group
            v-if="link.children"
            v-model="link.model"
            :key="link.text"
            :append-icon="
              link.model || link.children
                ? 'keyboard_arrow_down'
                : 'keyboard_arrow_up'
            "
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ link.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in link.children"
              :key="i"
              :to="child.url"
            >
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>

          <v-list-tile v-else :key="link.text" :to="link.url">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ link.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-list-tile v-if="isUserLoggedIn" @click="onLogout">
          <v-list-tile-content>
            <v-list-tile-title v-text="'Logout'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- <v-toolbar app scroll-off-screen v-if="isUserLoggedIn"> -->
    <v-toolbar app v-if="isUserLoggedIn">
      <v-toolbar-side-icon
        @click="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-toolbar-side-icon>

      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">
          <span class="primary--text">Event</span>
          <span class="accent--text">Me</span>
        </router-link>
        <!-- <router-link to="/" tag="span" class="pointer">
          <img :src="require('@/assets/logo.svg')">
        </router-link> -->
      </v-toolbar-title>

      <!-- <v-btn flat icon @click="$router.go(-1)">
				<v-icon>keyboard_arrow_left</v-icon>
			</v-btn>

			<v-btn flat icon @click="$router.go(1)">
				<v-icon>keyboard_arrow_right</v-icon>
			</v-btn> -->

      <v-spacer></v-spacer>

      <v-toolbar-items :class="isUserLoggedIn ? 'hidden-sm-and-down' : ''">
        <v-menu v-for="link in links" :key="link.title" :to="link.url" offset-y>
          <v-btn
            flat
            color="primary"
            slot="activator"
            :to="link.children ? '' : link.url"
          >
            <template v-if="link.icon">
              <v-icon left>{{ link.icon }}</v-icon>
              <span>{{ link.text }}</span>
            </template>
            <template v-else>
              <span class="mr-3">{{ user.login }}</span>
              <v-avatar>
                <v-img :src="user.img"></v-img>
              </v-avatar>
            </template>
          </v-btn>

          <v-list v-if="link.children">
            <v-list-tile
              v-for="(child, index) in link.children"
              :key="index"
              :to="child.url"
            >
              <v-list-tile-title>{{ child.text }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="onLogout">
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>

    <v-progress-linear 
      v-if="loading"
      color="primary" 
      height="2" 
      indeterminate
    ></v-progress-linear>

    <template>
    <router-view></router-view>
    </template>

    <!-- :active.sync="bottomNav" -->
    <v-bottom-nav
      v-if="isUserLoggedIn"
      class="hidden-md-and-up"
      :value="true"
      fixed
      color="primary"
      height="47"
    >
      <v-btn flat dark :to="l.url" v-for="(l, i) in bottom" :key="i">
        <!-- <span>{{ l.text }}</span> -->
        <v-icon>{{ l.icon }}</v-icon>
      </v-btn>
    </v-bottom-nav>

    <!-- error -->
    <template v-if="error">
      <v-snackbar
        :timeout="4000"
        :multi-line="true"
        :color="error.color || 'error'"
        @input="closeError"
        :value="true"
        bottom
        right
      >
        {{ error.msg || error }}
        <!-- <v-btn v-if="error.btn" flat dark @click="error.btn.func">{{ error.btn.msg }}</v-btn> -->
        <v-btn flat dark @click.native="closeError">Close</v-btn>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      // transitionName: '',
      bottomNav: "home"
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    user() {
      return this.$store.getters.user;
    },
    userId() {
      return this.$store.getters.userId;
    },
    error() {
      return this.$store.getters.error;
    },
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    bottom() {
      return [
        {
          text: "Home",
          url: "/",
          icon: "home"
        },
        {
          text: "Add",
          url: "/new",
          icon: "add_box"
        },
        {
          text: "My account",
          url: "/user/" + this.userId,
          icon: "person"
        },
        {
          text: "My meets",
          url: "/visit",
          icon: "watch_later"
        }
      ];
    },
    links() {
      if (this.isUserLoggedIn) {
        return [
          {
            text: "Add card",
            url: "/new",
            icon: "add_circle"
          },
          {
            text: "My meets",
            url: "/visit",
            icon: "watch_later"
          },
          {
            text: this.user.login,
            url: null,
            model: false,
            children: [
              { text: "My cards", url: "/user/" + this.userId },
              { text: "Settings", url: "/settings" }
            ]
          }
        ];
      }

      return [
        {
          text: "Sign in/up",
          url: "/auth",
          icon: "person"
        }
      ];
    }
  },
  methods: {
    closeError() {
      this.$store.dispatch("clearError");
    },
    onLogout() {
      this.$store.dispatch("logoutUser");
      this.$router.push("/");
    }
  }
};
</script>

<style lang="sass">
@import './assets/sass/_mixins.sass'
@import './assets/sass/style.sass'
</style>
