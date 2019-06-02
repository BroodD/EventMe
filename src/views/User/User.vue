<template>
  <v-container grid-list-md v-scroll="onScroll">
    <v-layout row wrap justify-center>
      <v-flex sm5 lg3 mb-5 class="text-center">
        <v-avatar size="200">
          <v-img position="top left" :src="user.img" alt="avatar" />
        </v-avatar>
      </v-flex>
      <v-flex sm lg4>
        <v-layout row wrap>
          <v-flex>
            <h1>{{ user.login }}</h1>
          </v-flex>
          <v-spacer></v-spacer>

          <!-- <v-flex>
            <v-btn color="primary" @click="toggFollow">
              <span>{{ user.follow ? "Following" : "Follow" }}</span>
              <v-icon right>{{ user.follow ? "check" : "star" }}</v-icon>
            </v-btn>
          </v-flex>
          <v-spacer></v-spacer> -->
        </v-layout>

        <h3>{{ user.name }}</h3>
        <p class="mt-3 pre">{{ user.bio }}</p>
        <v-layout row wrap>
          <!-- <v-flex>
            <strong>{{ userCards.length }}</strong> cards
          </v-flex>
          <v-spacer></v-spacer> -->

          <!-- <v-flex> <strong>12k</strong> followers </v-flex>
          <v-spacer></v-spacer>

          <v-flex> <strong>5,805</strong> following </v-flex>
          <v-spacer></v-spacer> -->
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 md8 v-for="card in userCards" :key="card._id">
        <CardMongo :card="card" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { scroll } from "@/mixins/index";
import store from "@/store";


export default {
  props: ["id"],
  mixins: [scroll],
  computed: {
    userCards() {
      return store.getters.cards
    },
    user() {
      if (this.id != store.getters.userId)
        return store.getters.otherUser;
      return store.getters.user;
    },
    loading() {
      return store.getters.loading;
    }
  },
  methods: {
    toggFollow() {
      this.user.follow = !this.user.follow;
    },
    reload({ scroll }) {
      store.dispatch("userCards", { id: this.id, scroll, pageNum: this.pageNum });
    }
  },
  async beforeRouteEnter(to, from, next) {
    if (store.getters.userId != to.params.id)
      await store.dispatch("otherUser", to.params.id);
    
    const currentState = await store.getters.get('currentState')
    if (currentState != 'user') {
      store.commit("clearCards");
      store.commit("set", { v: "currentState", val: 'user' })
      await store.dispatch("userCards", { id: to.params.id, scroll: 0, pageNum: 0 });
    }
    next()
  },
};
</script>
