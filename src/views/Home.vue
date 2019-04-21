<template>
  <v-container grid-list-md id="my" v-scroll:#scroll-target="onScroll">
    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 md8 v-for="card in cards" :key="card._id">
        <CardMongo :card="card" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { scroll } from "@/mixins/index";

export default {
  mixins: [scroll],
  data() {
    return {
      pn: 1
    };
  },
  computed: {
    cards() {
      return this.$store.getters.cards;
    },
    userId() {
      return this.$store.getters.userId;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    reload() {
      this.$store.dispatch("fetchCards", this.pn);
      this.pn++;
    }
  }
};
</script>
