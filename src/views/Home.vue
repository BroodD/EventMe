<template>
  <v-container grid-list-md id="my" v-scroll:#scroll-target="onScroll">
		<v-layout row wrap justify-center class="card-wrap">
			<v-flex xs12 md8
				v-for="card in cards"
				:key="card._id"
			>
				<CardMongo
					:card="card"
				/>
			</v-flex>
		</v-layout>
  </v-container>
</template>

<script>
import { scroll } from '@/mixins/index'

export default {
	mixins: [scroll],
  data () {
    return {
      skip: 0
    }
  },
	computed: {
		cards () {
			return this.$store.getters.cards
		},
		userId () {
			return this.$store.getters.userId
		},
		loading () {
			return this.$store.getters.loading
		}
	},
  methods: {
    reload() {
      console.log('reload', this.skip)
      // this.$store.dispatch('fetchCards')
      this.skip++
    },
  }
	// beforeCreate () {
	// 	console.log('create')
	// 	this.$store.commit('loadCards', [])
	// 	this.$store.dispatch('fetchCards')
	// }
}
</script>