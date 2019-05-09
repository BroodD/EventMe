<template>
  <!-- <v-container grid-list-md id="my" v-scroll:#scroll-target="onScroll"> -->
  <v-container grid-list-md v-scroll="onScroll">
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
  // data () {
  //   return {
  //     // scroll: this.$store.getters.get('scrollHome'),
  //     pageNum: this.$store.getters.get('pageNumHome')
  //   };
  // },
  computed: {
    cards () {
      return this.$store.getters.cards;
    },
    pageNum () {
      return this.$store.getters.get('pageNumHome')
    },
    // scroll () {
    //   return this.$store.getters.get('scrollHome');
    // },
    // userId() {
    //   return this.$store.getters.userId;
    // },
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    reload ({ scroll }) {
      // if(this.scroll) {
        // this.$store.commit('setScrollAndPageNum', { scroll });
        // this.pageNum++;
        console.log('reload home -----------', scroll, this.pageNum);
        this.$store.dispatch("fetchCards", { scroll, pageNum: this.pageNum });
        // this.pn++;
      // }
    }
  },
  async beforeMount () {
    var currentState = this.$store.getters.get('currentState')
    // console.log('___________', currentState)

    // window.scrollTo({
    //     top: this.scroll,
    //     behavior: "smooth"
    // });

    if (currentState != "home") {
      // console.log('home beforeMount', currentState)
      // this.$store.commit("set", { v: "cards", val: [] });
      this.$store.commit("clearCards");
      this.$store.commit("set", { v: "currentState", val: "home" })
      this.$store.dispatch("fetchCards", { scroll: 0, pageNum: 0 });
      // this.$store.commit('setScrollAndPageNum', { scroll: 0, pageNum: 0 });
    } else {
      console.log('scrollTo', this.scrollState)
      this.$vuetify.goTo(this.scrollState, { duration: 0 })
    }
  },
  beforeDestroy () {
    console.log(this.scroll, document.documentElement.scrollTop + window.innerHeight)
    this.$store.commit('set', { v: 'scrollHome', val: this.scroll });
  }
};
</script>
