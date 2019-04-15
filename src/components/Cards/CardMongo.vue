<template>
	<v-card class="mb-2 elevation-10">
		<v-list>
			<v-list-tile
				avatar
			>
				<router-link :to="'/user/' + card.user._id" class="card__author" v-if="card.user">
					<v-avatar class="mr-3">
						<v-img position="top left" :src="card.user.img || user.img"></v-img>
					</v-avatar>

					<v-list-tile-content>
						<v-list-tile-title>{{ card.user.login || user.login }}</v-list-tile-title>
						<!-- <v-list-tile-sub-title>06:40 20 April 2018 id: {{ card.id }}</v-list-tile-sub-title> -->
					</v-list-tile-content>
				</router-link>

				<v-spacer></v-spacer>

				<template v-if="(card.user._id) == user._id">
					<v-btn small flat fab color="primary" :to="'/edit/' + card._id">
						<v-icon>edit</v-icon>
					</v-btn>

					<v-dialog v-model="dialog" persistent max-width="320">
						<v-btn slot="activator" fab dark small flat color="red">
							<v-icon>close</v-icon>
						</v-btn>
						<v-card>
							<v-card-title class="headline">Do you really want delete "{{ card.title }}"</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="green darken-1" flat @click="dialog = false">No</v-btn>
								<v-btn color="red darken-1" flat @click="delCard">Yes</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</template>
			</v-list-tile>
			<!-- </router-link> -->
		</v-list>

		<router-link :to="'/card/'+card._id">
		<div class="auto-wrap"
				v-if="Array.isArray(card.img) && card.img.length == 1"
		>
			<v-img
				:src="card.img[0]"
				position="center"
				max-height="400px"
				class="elevation-10 auto"
			>
			</v-img>
		</div>

		<v-layout
			v-else-if="Array.isArray(card.img) && card.img.length > 1"
		>
			<v-flex>
				<div class="auto-wrap elevation-10">
					<v-carousel>
						<v-carousel-item
							v-for="(img, i) in card.img"
							:key="i"
							:src="img"
							position="center"
						></v-carousel-item>
					</v-carousel>
				</div>
			</v-flex>
		</v-layout>

		<!-- <v-divider v-else></v-divider> -->
    </router-link>


		<v-card-title>
			<div>
				<router-link :to="'/card/'+card._id">
					<div class="headline">{{ card.title }}</div>
				</router-link>
			</div>
		</v-card-title>

		<v-card-text class="pre">{{ card.desc }}</v-card-text>

		<v-card-text>
			<v-layout row wrap>
				<div>
					<v-icon color="black">today</v-icon>
					<strong>{{ card.time | formatDate }}</strong>
				</div>
				<v-spacer></v-spacer>
				<div v-if="card.distance">
					<strong>{{ ( card.distance / 1000 ).toFixed(2) }}km</strong>
          <v-icon left color="black">location_on</v-icon>
				</div>
			</v-layout>
		</v-card-text>

		<v-divider></v-divider>

		<v-card-actions>
			<v-spacer></v-spacer>
			
			<v-btn
				flat
        :color="card.hasVisit ? 'red' : ''"
        @click="toggVisit()"
			>
				<span>{{ card.visit }} / {{ card.people }}</span>
				<v-icon right>people</v-icon>
			</v-btn>

			<v-btn
				flat
				:to="'/card/' + card._id + '#comments'"
			>
				<span>{{ card.comments }}</span>
				<v-icon right>chat</v-icon>
			</v-btn>

			<v-btn 
				flat
        :color="card.hasLike ? 'red' : ''"
        @click="toggLike()"
			>
				<span>{{ card.like }}</span>
				<v-icon right>favorite</v-icon>
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
	export default {
		name: 'Card',
		props: {
			card: {
				type: Object,
				required: true
			},
		},
		data () {
			return {
				dialog: false
			}
		},
		computed: {
			user () {
				return this.$store.getters.user
			},
			position () {
				return this.$store.getters.get('position')
			},
		},
		methods: {
			delCard () {
				this.$store.dispatch('deleteCard', { id: this.card._id, ownerId: this.card.user._id, images: this.card.img })
				this.dialog = false
			},
      toggLike () {
        var has = this.card.hasLike
        if ( has ) {
          this.card.like--
        } else {
          this.card.like++
        }
        this.card.hasLike = !has

        this.$store.dispatch('toggleLike', { id: this.card._id, has })
      },
      toggVisit () {
        var has = this.card.hasVisit
        if ( has ) {
          this.card.visit--
        } else {
          this.card.visit++
        }
        this.card.hasVisit = !has

        this.$store.dispatch('toggleVisit', { id: this.card._id, has })
      }
		},
		filters: {
			formatDate (value) {
				var now = new Date()
				var obj = new Date( Math.abs( value ) )
				var mi = obj.getMinutes() < 9 ? '0' + obj.getMinutes() : obj.getMinutes()
				var h = obj.getHours() < 9 ? '0' + obj.getHours() : obj.getHours()
				var d = obj.getDate() < 9 ? '0' + obj.getDate() : obj.getDate()
				var m = obj.getMonth() < 9 ? '0' + obj.getMonth() : obj.getMonth()
				var y = (obj.getFullYear() + '').slice(-2)

				var f

				if( obj < now) return `Past ${h}:${mi} ${d}/${m}/${y}`
				
				if ( y == now.getFullYear())
					if ( m - now.getMonth() == 0)
						
						if ( d - now.getDate() == 0)
							f = 'Today';
						else if ( d - now.getDate() == 1)
							f = 'Tommorow';
						else if ( d - now.getDate() <= 7)
							f = 'This week';
						else if (d - now.getDate() <= 14)
							f = 'Next week';
						else
							f = 'This month'
					else if ( m - now.getMonth() == 1)
						f = 'Next month';
					else
						f = `${d}/${m}`
				else
					f = `${d}/${m}/${y}`

				return `${f} ${h}:${mi}`
			}
		},
	}
</script>