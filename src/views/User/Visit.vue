<template>
  <v-container grid-list-md v-scroll="onScroll">
    <v-layout row wrap justify-center class="card-wrap" v-if="cards.length">
      <v-flex xs12 md8 v-for="card in cards" :key="card._id">
        <CardMongo :card="card" />
      </v-flex>
    </v-layout>
     <v-layout row wrap class="h-100 text-center" v-else-if="!cards.length && !loading">
      <v-flex xs12 lg4>
        <img src="@/assets/watch-black.svg">
      </v-flex>
      <v-flex xs12 lg4>
        <h1>Oops, nothing found</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { scroll } from "@/mixins/index";
import store from '@/store'

export default {
  mixins: [scroll],
  computed: {
    cards () {
      return store.getters.cards
    },
    loading () {
      return store.getters.loading;
    }
  },
  methods: {
    reload ({ scroll }) {
      store.dispatch("visitCards", { scroll, pageNum: this.pageNum });
    }
  },
  beforeRouteEnter (to, from, next) {
    const currentState = store.getters.get('currentState')
    if (currentState != 'visit') {
      store.commit("clearCards");
      store.commit("set", { v: "currentState", val: 'visit' })
      store.dispatch('visitCards', { scroll: 0, pageNum: 0 });
    }
    next()
  },
};
</script>
