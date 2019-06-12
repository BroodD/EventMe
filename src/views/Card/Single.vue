<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center class="card-wrap" v-if="card">
      <v-flex xs12 md8>
        <CardMongo :card="card" />
      </v-flex>

      <v-flex xs12 md8>
        <v-card class="m-card mb-2 elevation-10">
          <v-card-title>
            <div class="headline">
              Location <span class="primary--text">{{ (card.distance / 1000).toFixed(2) }}km</span> from you.
            </div>
          </v-card-title>
          <v-card-text>
            <gmap-map
              :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                disableDefaultUi: false
              }"
              :zoom="13"
              style="width:100%;  height: 400px;"
              :center="position"
            >
              <gmap-marker
                :position="position"
              ></gmap-marker>
            </gmap-map>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md8>
        <MembersList :id="id" :length="card.visit"></MembersList>
      </v-flex>

      <v-flex xs12 md8>
        <CommentsList
          :id="id"
          :length="card.comments"
          @incLength="card.comments += 1"
        ></CommentsList>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CommentsList from "@/components/Cards/CommentsList";
import MembersList from "@/components/Cards/MembersList";
import MapMarker from "@/components/MapMarker";
import store from '@/store'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    CommentsList,
    MembersList,
    MapMarker
  },
  data () {
    return {
      position: {
        lat: 0,
        lng: 0
      }
    }
  },
  computed: {
    card() {
      // return this.$store.getters.cardById(this.id)
      return this.$store.getters.get("single");
      // return null
    }
  },
  created () {
    if (this.card) {
      this.position = {
        lat: this.card.location[0],
        lng: this.card.location[1]
      };
    }
  },
  async beforeRouteEnter (to, from, next) {
    await store.dispatch("fetchSingle", { id: to.params.id });

    next()
  }
};
</script>
