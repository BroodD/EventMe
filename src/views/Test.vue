import Vue from "vue";
import "./plugins/vuetify";
import router from "./router/index";
import store from "./store/index";
var fb = require("firebase/app");
require("firebase/auth");
import App from "./App.vue";

import CardMongo from "@/components/Cards/CardMongo";
Vue.component("CardMongo", CardMongo);

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAFiLGzijljjjgmnWiDdOb_UzOWO4Zgfek",
    libraries: "places" // necessary for places input
  }
});

Vue.config.productionTip = false;

// Vue.component("Card", Card);
let app = '';

fb.initializeApp({
  apiKey: "AIzaSyB1B2yJmi94g0hGCMvPnpsJ7CbXzR2wL4I",
  authDomain: "sparty-3251e.firebaseapp.com",
  databaseURL: "https://sparty-3251e.firebaseio.com",
  projectId: "sparty-3251e",
  storageBucket: "sparty-3251e.appspot.com",
  messagingSenderId: "435493051386"

  // apiKey: "AIzaSyCh6LNMxHX3cfYBI7zdDXShoaCH0CT1ND4",
  // authDomain: "time-4-event.firebaseapp.com",
  // databaseURL: "https://time-4-event.firebaseio.com",
  // projectId: "time-4-event",
  // storageBucket: "time-4-event.appspot.com",
  // messagingSenderId: "984805020632"
});


// maybe it is bad way but I dont know how do better render app after login user and it not work
fb.auth().onAuthStateChanged(user => {
  console.log('onAuthStateChanged [user.uid]');
  if(!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App),
      async beforeCreate() {

        var self = this;
        window.vu = this
        // await void (function() {
        function getLocation() {
          if (navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
              position => {
                console.log('get position', position);
                var cords = [position.coords.latitude, position.coords.longitude];
                self.$store.commit("set", { v: "position", val: cords });

                console.log('user', user)

                if (user) {
                  self.$store
                    .dispatch("autoLoginUser", {
                      id: user.uid,
                      email: user.email
                    })
                    .then(() => {
                      console.log('user is login successful')
                      // if (!user.emailVerified)
                      //   self.$store.commit("setError", {
                      //     msg: "Verification email sent to " + user.email,
                      //     color: "orange"
                      //   });

                      // return to prev link
                      if (window.history.length > 2) {
                        if (self.$route.name == "auth") self.$router.go(-1);
                      } else self.$router.push("/");

                      
                      self.$store.commit("clearCards")

                      let route = self.$route.name
                      switch (route) {
                        case 'user': 
                          console.log('switch user'); break;
                        case 'visit':
                          self.$store.dispatch("visitCards", { scroll: 0, pageNum: 0 });
                          self.$store.commit("set", { v: "currentState", val: "visit" })
                        default: 
                          self.$store.dispatch("fetchCards", { scroll: 0, pageNum: 0 });
                          self.$store.commit("set", { v: "currentState", val: "home" })
                      } 

                      // self.$store.commit("set", { v: "cards", val: [] });
                    });
                } else {
                  self.$router.push("/auth");
                }
              },
              () => {
                self.$store.commit("setError", "Please accept geo location");
              },
              { enableHighAccuracy: true, timeout: 60000, maximumAge: 600000 }
            );
          } else {
            self.$store.commit(
              "setError",
              "Geolocation is not supported by this browser"
            );
          }
        }
        await getLocation();
      }
    });
  }
});









import Vue from "vue";
import "./plugins/vuetify";
import router from "./router/index";
import store from "./store/index";
var fb = require("firebase/app");
require("firebase/auth");
import App from "./App.vue";

import CardMongo from "@/components/Cards/CardMongo";
Vue.component("CardMongo", CardMongo);

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAFiLGzijljjjgmnWiDdOb_UzOWO4Zgfek",
    libraries: "places" // necessary for places input
  }
});

Vue.config.productionTip = false;

// Vue.component("Card", Card);



new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  async beforeCreate() {
    await fb.initializeApp({
      apiKey: "AIzaSyB1B2yJmi94g0hGCMvPnpsJ7CbXzR2wL4I",
      authDomain: "sparty-3251e.firebaseapp.com",
      databaseURL: "https://sparty-3251e.firebaseio.com",
      projectId: "sparty-3251e",
      storageBucket: "sparty-3251e.appspot.com",
      messagingSenderId: "435493051386"

      // apiKey: "AIzaSyCh6LNMxHX3cfYBI7zdDXShoaCH0CT1ND4",
      // authDomain: "time-4-event.firebaseapp.com",
      // databaseURL: "https://time-4-event.firebaseio.com",
      // projectId: "time-4-event",
      // storageBucket: "time-4-event.appspot.com",
      // messagingSenderId: "984805020632"
    });

    var self = this;
    window.vu = this
    // await void (function() {
    function getLocation() {
      if (navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          position => {
            var cords = [position.coords.latitude, position.coords.longitude];
            self.$store.commit("set", { v: "position", val: cords });

            fb.auth().onAuthStateChanged(user => {
              if (user) {
                self.$store
                  .dispatch("autoLoginUser", {
                    id: user.uid,
                    email: user.email
                  })
                  .then(() => {
                    // if (!user.emailVerified)
                    //   self.$store.commit("setError", {
                    //     msg: "Verification email sent to " + user.email,
                    //     color: "orange"
                    //   });

                    // return to prev link
                    if (window.history.length > 2) {
                      if (self.$route.name == "auth") self.$router.go(-1);
                    } else self.$router.push("/");

                    // self.$store.commit("set", { v: "cards", val: [] });
                    // self.$store.dispatch("fetchCards", { scroll: 0, pageNum: 0, currentState: 'home' });
                  });
              } else {
                self.$router.push("/auth");
              }
            });
          },
          () => {
            self.$store.commit("setError", "Please accept geo location");
          },
          { enableHighAccuracy: true, timeout: 60000, maximumAge: 600000 }
        );
      } else {
        self.$store.commit(
          "setError",
          "Geolocation is not supported by this browser"
        );
      }
    }
    getLocation();

    /* 
    await fb.auth().onAuthStateChanged(user => {
      console.log("--onAuthStateChanged--");

      if (user) {
        this.$store
          .dispatch("autoLoginUser", { id: user.uid, email: user.email })
          .then(() => {
            if (!user.emailVerified)
              this.$store.commit("setError", {
                msg: "Verification email sent to " + user.email,
                color: "orange"
              });

            // return to prev link
            if (window.history.length > 2) {
              if (this.$route.name == "auth") this.$router.go(-1);
            } else this.$router.push("/");

            this.$store.commit("set", { v: "cards", val: [] });
            this.$store.dispatch("fetchCards");
          });

        // this.$router.push('/')
        // } else {
        // var th = this
        // user.sendEmailVerification().then(function () {
        //  // commit('setError', 'Email send')
        //  th.$store.commit('setError', { msg: 'Verification email sent to ' + user.email, color: 'orange' })
        // }).catch(function (error) {
        //  th.$store.commit('setError', error)
        // });
        // this.$store.commit('setError', 'Please verify your email ' + user.email)
      } else {
        this.$router.push("/auth");
      }
    });
    */
  }
}).$mount("#app")


















import Vue from "vue";
import "./plugins/vuetify";
import router from "./router/index";
import store from "./store/index";
var fb = require("firebase/app");
require("firebase/auth");
import App from "./App.vue";

import CardMongo from "@/components/Cards/CardMongo";
Vue.component("CardMongo", CardMongo);

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAFiLGzijljjjgmnWiDdOb_UzOWO4Zgfek",
    libraries: "places" // necessary for places input
  }
});

Vue.config.productionTip = false;

// Vue.component("Card", Card);

fb.initializeApp({
  apiKey: "AIzaSyB1B2yJmi94g0hGCMvPnpsJ7CbXzR2wL4I",
  authDomain: "sparty-3251e.firebaseapp.com",
  databaseURL: "https://sparty-3251e.firebaseio.com",
  projectId: "sparty-3251e",
  storageBucket: "sparty-3251e.appspot.com",
  messagingSenderId: "435493051386"

  // apiKey: "AIzaSyCh6LNMxHX3cfYBI7zdDXShoaCH0CT1ND4",
  // authDomain: "time-4-event.firebaseapp.com",
  // databaseURL: "https://time-4-event.firebaseio.com",
  // projectId: "time-4-event",
  // storageBucket: "time-4-event.appspot.com",
  // messagingSenderId: "984805020632"
});


fb.auth().onAuthStateChanged(user => {
  new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App),
    async beforeCreate() {

      var self = this;
      window.vu = this
      // await void (function() {
      function getLocation() {
        if (navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(
            position => {
              var cords = [position.coords.latitude, position.coords.longitude];
              self.$store.commit("set", { v: "position", val: cords });
            },
            () => {
              self.$store.commit("setError", "Please accept geo location");
            },
            { enableHighAccuracy: true, timeout: 60000, maximumAge: 600000 }
          );
        } else {
          self.$store.commit(
            "setError",
            "Geolocation is not supported by this browser"
          );
        }
      }
      getLocation();


      if (user) {
        self.$store
          .dispatch("autoLoginUser", {
            id: user.uid,
            email: user.email
          })
          .then(() => {
            // if (!user.emailVerified)
            //   self.$store.commit("setError", {
            //     msg: "Verification email sent to " + user.email,
            //     color: "orange"
            //   });

            // return to prev link
            if (window.history.length > 2) {
              if (self.$route.name == "auth") self.$router.go(-1);
            } else self.$router.push("/");

            // self.$store.commit("set", { v: "cards", val: [] });
            // self.$store.dispatch("fetchCards", { scroll: 0, pageNum: 0, currentState: 'home' });
          });
      } else {
        self.$router.push("/auth");
      }
    }
  });
});













<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 md8 v-for="card in cards" :key="card.id">
        <CardMongo :card="card" />
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-center class="card-wrap">
      <v-flex xs12 md8>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Create new card</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form v-model="valid" ref="form" validation class="mb-3">
              <v-text-field
                name="title"
                label="Title"
                type="text"
                v-model="title"
                required
                :rules="[v => !!v || 'Title is required']"
              ></v-text-field>

              <v-textarea
                name="description"
                label="Description"
                type="text"
                v-model="desc"
                multi-line
                auto-grow
                :rules="[v => !!v || 'Description is required']"
              ></v-textarea>

              <v-text-field
                name="people"
                label="Count people"
                type="text"
                v-model="people"
                :rules="peopleRules"
              ></v-text-field>

              <!-- <v-layout>
                <v-flex sm6>
                  <v-date-picker v-model="date"></v-date-picker>
                </v-flex>
                <v-flex sm6>
                  <v-time-picker
                    v-model="time"
                  />
                </v-flex>
              </v-layout> -->

              <v-dialog
                ref="date"
                v-model="dateModal"
                :return-value.sync="date"
                persistent
                lazy
                full-width
              >
                <v-text-field
                  slot="activator"
                  label="Set a date"
                  readonly
                  v-model="date"
                  :rules="dateRules"
                  clearable
                ></v-text-field>
                <v-date-picker
                  full-width
                  v-model="date"
                  @input="$refs.date.save(date)"
                ></v-date-picker>
              </v-dialog>

              <v-dialog
                ref="time"
                v-model="timeModal"
                :return-value.sync="time"
                persistent
                lazy
                full-width
              >
                <!-- class="dialog" -->
                <!-- width="290px" -->
                <v-text-field
                  slot="activator"
                  v-model="time"
                  label="Set a time"
                  readonly
                  :rules="[v => !!v || 'Time is required']"
                  clearable
                ></v-text-field>
                <v-time-picker v-model="time" full-width format="24hr">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="timeModal = false"
                    >Cancel</v-btn
                  >
                  <v-btn flat color="primary" @click="$refs.time.save(time)"
                    >OK</v-btn
                  >
                </v-time-picker>
              </v-dialog>
            </v-form>
            <v-layout row wrap align-start>
              <v-flex v-for="(img, i) in images" :key="i" d-flex xs12 md6>
                <v-card>
                  <v-img :src="img" class="grey darken-4"></v-img>
                  <v-card-actions>
                    <v-btn fab dark small @click="swap(i, 0)">
                      <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-btn fab dark small @click="swap(i, 2)">
                      <v-icon>arrow_forward</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn fab dark small color="red" @click="deleteImage(i)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout row class="mb-3">
              <v-flex xs12>
                <v-btn dark class="primary" @click="triggerUpload">
                  Upload
                  <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none;"
                  accept="image/*"
                  @change="onFileChange"
                  multiple
                />
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  color="primary"
                  @click="createCard"
                  :disabled="!valid || loading"
                >
                  Create
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CardsService from "@/services/CardsService";
import imageCompression from "browser-image-compression";
import { CardMongo } from "@/mixins/class";

var swap = (a, x, y) => {
  if (a.length === 1) return a;
  // var t = a[x]
  // a[x] = a[y]
  // a[y] = t
  a.splice(y, 1, a.splice(x, 1, a[y])[0]);
  return a;
};

export default {
  data() {
    return {
      cards: [],

      files: [],
      title: "",
      desc: "",
      people: "",
      images: [],
      time: null,
      timeModal: false,
      date: null,
      dateModal: false,

      valid: false,
      dateRules: [
        v => !!v || "Date is required",
        v =>
          new Date(Date.parse(v)) >= new Date(Date.now() - 864e5) ||
          "Date must be more or equal today"
      ],
      peopleRules: [
        v => !!v || "Count people is required",
        v =>
          (!isNaN(v - parseInt(v)) && parseInt(v) > 0) ||
          "Count people must be a number"
      ]
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    async getCards() {
      const response = await CardsService.fetchCards();
      this.cards = response.data.cards;
    },

    async createCard() {
      await this.compressImages();

      if (this.$refs.form.validate()) {
        var d = new Date(
          (this.date + " " + this.time).replace(/-/g, "/")
        ).getTime();

        // const card = {
        //   title: this.title,
        //   desc: this.desc,
        //   time: -d ,
        //   people: this.people,
        //   images: this.images,
        //   files: this.files
        // }

        // this.$store.dispatch('createCard', card)
        //   .then(() => {
        //     this.$router.push('/user/' + this.$store.getters.userId)
        //   })
        //   .catch(() => {})

        const card = new CardMongo(
          this.title,
          this.desc,
          "5ca7414fec99542644721a46",
          -d,
          0,
          0,
          this.people,
          0,
          -Date.now()
        );

        var response = await CardsService.addNewCard(card);

        console.log(response.data.id);

        this.$router.push("/user/" + this.$store.getters.userId);
      }
    },

    triggerUpload() {
      this.$refs.fileInput.click();
    },
    async onFileChange(event) {
      const files = event.target.files;
      console.log("NewCard onFilechange() [files]", files);
      this.images = [];

      for (let i = 0; i < files.length; i++) {
        let read = new FileReader();

        read.onload = e => {
          this.images.push(read.result);
        };

        read.readAsDataURL(files[i]);
      }

      this.files = files;
    },
    async compressImages() {
      var fil = [];

      var options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 640,
        useWebWorker: true
      };
      for (let i = 0; i < this.files.length; i++) {
        try {
          const compressedFile = await imageCompression(this.files[i], options); // maxSizeMB, maxWidthOrHeight are optional
          console.log(
            "compressedFile instanceof Blob",
            compressedFile instanceof Blob
          ); // true
          console.log(
            `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
          ); // smaller than maxSizeMB

          //await uploadToServer(compressedFile); // write your own logic
          fil.push(compressedFile);
        } catch (error) {
          console.log(error);
        }
      }

      this.files = fil;
    },
    deleteImage(i) {
      this.images.splice(i, 1);
    },
    // some stupid methods
    swap(i, way) {
      let len = this.images.length;
      if ((i == 0 && way == 0) || (i == len - 1 && way == 2)) {
        swap(this.images, len - 1, 0);
      } else {
        swap(this.images, i - 1 + way, i);
      }
    }
  },
  mounted() {
    this.getCards();
  }
};
</script>
