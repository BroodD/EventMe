import Vue from "vue";
import Vuetify from "./plugins/vuetify";
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
    // await void (function() {
    function getLocation() {
      if (navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          position => {
            var cords = [position.coords.latitude, position.coords.longitude];
            self.$store.commit("set", { v: "position", val: cords });

            fb.auth().onAuthStateChanged(user => {
              console.log("--onAuthStateChanged--");

              if (user) {
                self.$store
                  .dispatch("autoLoginUser", {
                    id: user.uid,
                    email: user.email
                  })
                  .then(() => {
                    if (!user.emailVerified)
                      self.$store.commit("setError", {
                        msg: "Verification email sent to " + user.email,
                        color: "orange"
                      });

                    // return to prev link
                    if (window.history.length > 2) {
                      if (self.$route.name == "auth") self.$router.go(-1);
                    } else self.$router.push("/");

                    self.$store.commit("set", { v: "cards", val: [] });
                    self.$store.dispatch("fetchCards");
                  });
              } else {
                self.$router.push("/auth");
              }
            });
          },
          error => {
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
        // 	// commit('setError', 'Email send')
        // 	th.$store.commit('setError', { msg: 'Verification email sent to ' + user.email, color: 'orange' })
        // }).catch(function (error) {
        // 	th.$store.commit('setError', error)
        // });
        // this.$store.commit('setError', 'Please verify your email ' + user.email)
      } else {
        this.$router.push("/auth");
      }
    });
    */
  }
})
