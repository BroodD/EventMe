<!-- https://alligator.io/vuejs/vue-google-maps/ -->

<template>
  <div>
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
      :center="center"
      :zoom="16"
      style="width:100%;  height: 400px;"
    >
      <gmap-marker
        v-if="marker"
        :position="marker.position"
        :clickable="true"
        :draggable="true"
        @drag="updateCoordinates"
      ></gmap-marker>
    </gmap-map>

    <div class="search mt-3">
      <v-text-field
        box
        name="search"
        label="Search place"
        type="text"
        :value="text"
        @input="onInput"
      ></v-text-field>

      <gmap-autocomplete
        class="search__control"
        ref="autocomplete"
        @place_changed="setPlace"
        :value="text"
        @input="text = $event.target.value"
      ></gmap-autocomplete>
    </div>

    <v-btn color="primary" @click="addMarker">Select</v-btn>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      default: null
    }
  },
  name: "MapMarker",
  data() {
    return {
      center: { lat: 45.508, lng: -73.587 },
      marker: {},
      currentPlace: null,

      text: ""
    };
  },

  created() {
    if (this.position !== null) {
      this.marker = {
        position: this.position
      };
      this.center = this.marker.position;
    } else {
      const pos = this.$store.getters.get('position')
      console.log(pos);
      this.center = {
        lat: pos[0],
        lng: pos[1]
      };
      this.marker = {
        position: this.center
      };

      this.$emit("onLocation", this.marker.position);
    }
  },

  methods: {
    onInput() {
      this.$refs.autocomplete.$el.focus();
    },
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
      this.text = place.formatted_address;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          position: {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          }
        };
        this.marker = marker;
        this.center = marker.position;

        this.$emit("onLocation", this.marker.position);
      }
    },
    updateCoordinates(location) {
      this.marker = {
        position: {
          lat: location.latLng.lat(),
          lng: location.latLng.lng()
        }
      };

      this.$emit("onLocation", this.marker.position);
    },
    // geolocate: function() {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     this.center = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     this.marker = {
    //       position: this.center
    //     };

    //     this.$emit("onLocation", this.marker.position);
    //   });
    // }
  }
};
</script>

<style scoped lang="sass">
.search
  position: relative
  &__control
    position: absolute
    bottom: 24px
    left: 0
    opacity: 0
    top: -58px
    z-index: -1
</style>
