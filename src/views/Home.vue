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

        <v-card-text>
          <h3 class="primary--text">Ordering</h3>
          <v-btn color="primary" depressed @click="setOrder('orderDis')">
            Distance
            <v-icon v-if="orderDis">{{ orderDis == 1 ? 'arrow_upward' : 'arrow_downward' }}</v-icon>
          </v-btn>
          <v-btn color="primary" depressed @click="setOrder('orderTime')">
            Time event
            <v-icon v-if="orderTime">{{ orderTime == 1 ? 'arrow_upward' : 'arrow_downward' }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-actions>
          <v-btn
            class="mb-0"
            color="accent"
            :loading="loading"
            block
            depressed
            large
            @click="onReset"
          >Reset</v-btn>

          <v-btn
            class="mb-0"
            color="primary"
            :loading="loading"
            block
            depressed
            large
            @click="onFilter"
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
        <v-btn depressed color="primary" @click="onReset">Try again</v-btn>
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
      orderTime: -1
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
    setOrder (field) {
      if (this[field] >= 1) {
        this[field] = -1
      } else {
        this[field]++
      }
    },
    reload ({ scroll }) {
      if (this.cards.length) {
        const filter = {
          max: this.distance[1],
          min: this.distance[0],
          text: this.text,
          orderDis: this.orderDis,
          orderTime: this.orderTime,
        }
        store.dispatch("fetchCards", { scroll, pageNum: this.pageNum, filter: filter });
      }
    },
    async onFilter () {
      this.scroll = 0
      const filter = {
          max: this.distance[1],
          min: this.distance[0],
          text: this.text,
          orderDis: this.orderDis,
          orderTime: this.orderTime,
        }
      await store.commit("clearCards")
      await store.dispatch("fetchCards", { scroll: 0, pageNum: 0, filter: filter });
      this.setting = false
    },
    async onReset () {
      this.text =  '',
      this.distance =  [null, null],
      this.orderDis =  1
      this.orderTime =  -1
      await store.commit("clearCards")
      await store.dispatch('fetchCards', { scroll: 0, pageNum: 0 })
      this.setting = false
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log('home ', store.getters.get('position'))
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
