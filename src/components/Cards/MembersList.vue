<template>
	<v-card class="mb-2 elevation-10">
		<v-card-title>
			<div class="headline">Members <small class="primary--text">{{ length }}</small></div>
		</v-card-title>
		<v-layout row wrap>
			<v-flex md3 v-for="m in members" :key="m._id">
				<v-list>
					<router-link :to="'/user/' + m._id">
						<v-list-tile avatar>
							<v-list-tile-avatar>
								<v-img position="top left" :src="m.img" alt="avatar" size="100" />
							</v-list-tile-avatar>

							<v-list-tile-content>
								<v-list-tile-title v-html="m.login"></v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</router-link>
				</v-list>
			</v-flex>
		</v-layout>

    <v-card-actions>
      <v-btn
        flat
        :disabled="pn <= 0"
        @click="fetchComments(false)"
      >
        <v-icon left>keyboard_arrow_left</v-icon>
        <span>Prev</span>
      </v-btn>

      <v-spacer></v-spacer>
      
      <v-btn
        flat
        :disabled="length <= (pn + 1) * pz"
        @click="fetchComments(true)"
      >
        <span>Next</span>
        <v-icon right>keyboard_arrow_right</v-icon>
      </v-btn>
    </v-card-actions>
	</v-card>
</template>

<script>
  import CardsService from '@/services/CardsService'

	export default {
		name: 'MembersList',
		props: {
			id: String,
			length: Number
		},
		data () {
			return {
				members: [],
        pn: 0,
        pz: 8
			}
		},
    methods: {
      async fetchMembers (step) {
        try {
          if ( step === true) this.pn++
          if ( step === false) this.pn--
          const response = await CardsService.fetchMembers({ id: this.id, pn: this.pn, pz: this.pz })
          this.members   = response.data.members
        } catch (error) {
          this.$store.commit('setError', error.message)
          throw error
        }

      }
    },
		created () {
      this.fetchMembers()
		}
	}
</script>