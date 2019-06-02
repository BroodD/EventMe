<template>
  <!-- <v-container grid-list-md id="my" v-scroll:#scroll-target="onScroll"> -->
  <v-container grid-list-md v-scroll="onScroll">
    <v-bottom-sheet v-model="setting" inset>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Filtering</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-text-field
            v-model="text"
            box
            name="text"
            label="Search by text..."
            type="text"
          ></v-text-field>
        </v-card-text>

        <v-card-text>
          <v-flex md10>
            <v-range-slider
              label="Distance (km)"
              thumb-label="always"
              v-model="distance"
              :step="10"
              :max="1000"
              :min="0"
            ></v-range-slider>
          </v-flex>
        </v-card-text>

        <v-card-actions>
          <v-btn
            class="mb-0"
            color="accent"
            :loading="loading"
            block
            depressed
            large
            @click="reset"
          >Reset</v-btn>

          <v-btn
            class="mb-0"
            color="primary"
            :loading="loading"
            block
            depressed
            large
            @click="filter"
          >Find</v-btn>
        </v-card-actions>
      </v-card>
      </v-list>
    </v-bottom-sheet>

    <v-btn
      class="filter" depressed fixed bottom left fab dark small color="primary" @click="setting = true">
      <v-icon>filter_list</v-icon>
    </v-btn>

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
        <v-btn depressed color="primary" @click="reset">Try again</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { scroll } from "@/mixins/index";
import store from "@/store"

export default {
  mixins: [scroll],
  data () {
    return {
      setting: false,
      text: '',
      distance: [null, null],
      orderDis: 1,
      orderTime: -1,
      orderCreate: -1
    }
  },
  computed: {
    cards () {
      return store.getters.cards;
    },
    loading() {
      return store.getters.loading;
    }
  },
  methods: {
    reload ({ scroll }) {
      if (this.cards.length)
        store.dispatch("fetchCards", { scroll, pageNum: this.pageNum, max: this.distance[1], min: this.distance[0], text: this.text });
    },
    async filter () {
      this.scroll = 0
      store.commit("clearCards")
      await store.dispatch("fetchCards", { scroll: 0, pageNum: 0, max: this.distance[1], min: this.distance[0], text: this.text });
      this.setting = false
    },
    async reset () {
      this.text = ''
      this.distance = [null, null]
      this.scroll = 0
      store.commit("clearCards")
      await store.dispatch('fetchCards', { scroll: 0, pageNum: 0 })
      this.setting = false
    }
  },
  beforeRouteEnter (to, from, next) {
    const currentState = store.getters.get('currentState')
    if (currentState != 'home') {
      store.commit("clearCards");
      store.commit("set", { v: "currentState", val: 'home' })
      store.dispatch('fetchCards', { scroll: 0, pageNum: 0 });
    }
    next()
  },
};
</script>
