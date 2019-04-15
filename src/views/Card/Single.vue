<template>
	<v-container grid-list-md v-if="card">
		<v-layout row wrap justify-center class="card-wrap">
			<v-flex xs12 md8>
				<CardMongo :card="card" />
			</v-flex>

			<v-flex xs12 md8>
				<MembersList :id="id" :length="card.visit"></MembersList>
			</v-flex>

			<v-flex xs12 md8>
				<CommentsList :id="id" :length="card.comments" @incLength="card.comments += 1"></CommentsList>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import CommentsList from '@/components/Cards/CommentsList'
import MembersList from '@/components/Cards/MembersList'

export default {
	props: {
		id: {
      type: String,
      required: true
    }
	},
	components: {
		CommentsList,
		MembersList
	},
	computed: {
		card () {
			// return this.$store.getters.cardById(this.id)
			return this.$store.getters.get('single')
      // return null
		}
	},
	async created () {
		await this.$store.dispatch('fetchSingle', { id: this.id })

		// var base = await fb.database().ref()
		// base.child('cards/' + this.id + '/comments').on('value', e => {
		// 	console.log('Single->commnets', this.card)
		// 	this.card.comments = e.val()
		// })
	},
}
</script> 