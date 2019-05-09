<template>
  <v-container grid-list-md v-scroll="onScroll">
    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 md8 v-for="card in cards" :key="card._id">
        <CardMongo :card="card" />
        <!-- <v-btn
					fab
					dark
					small
					color="red"
				>
					<v-icon>delete</v-icon>
				</v-btn> -->
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
      return this.$store.getters.cards
    },
    loading () {
      return this.$store.getters.loading;
    },
    pageNum () {
      return this.$store.getters.get('pageNumHome')
    }
  },
  methods: {
    reload ({ scroll }) {
      // this.pageNum++;
      console.log('reload visit -----------', scroll, this.pageNum);
      this.$store.dispatch("visitCards", { scroll, pageNum: this.pageNum });
    }
  },
  async beforeMount () {
    var currentState = this.$store.getters.get('currentState')

    // window.scrollTo({
    //     top: this.scroll,
    //     behavior: "smooth"
    // });

    if (currentState != "visit" && this.$store.getters.isUserLoggedIn) {
      console.log('visit beforeMount', currentState)
      // this.$store.commit("set", { v: "cards", val: [] });
      this.$store.commit("clearCards");
      this.$store.commit("set", { v: "currentState", val: "visit" })
      this.$store.dispatch("visitCards", { scroll: 0, pageNum: 0 });
      // this.$store.commit('setScrollAndPageNum', { scroll: 0, pageNum: 0 });
    } else {
      // this.$vuetify.goTo(this.scrollState, { duration: 0 })
    }
  }
};
</script>
