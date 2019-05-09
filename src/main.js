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
              console.log('get position', position);
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
      await getLocation();


    fb.auth().onAuthStateChanged(user => {
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
    });
  }
});