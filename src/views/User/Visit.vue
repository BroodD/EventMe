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
import { scroll } from '@/mixins/index'

export default {
	mixins: [scroll],
	computed: {
		cards () {
			return this.$store.getters.get('visitCards')
		},
		loading () {
			return this.$store.getters.loading
		}
	},
	methods: {
		reload() {
			// var endAt = this.$store.getters.get('visitEnd')
			// if(endAt)
			// 	this.$store.dispatch('fetchVisit', endAt)
			// else
			// 	this.$store.dispatch('setError', { msg: 'No more cards', color: 'orange' })
		},
	},
	async beforeMount () {
		if(!this.cards.length) {
			this.$store.commit('set', {v: 'visitCards', val: []})
			this.$store.dispatch('visitCards')
		}
	}
}
</script>
