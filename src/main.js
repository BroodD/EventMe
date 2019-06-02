import Vue from 'vue';
import './plugins/vuetify';
import router from './router/index';
import store from './store/index';
const fb = require('firebase/app');
require('firebase/auth');
import App from './App.vue';

import CardMongo from '@/components/Cards/CardMongo';
Vue.component('CardMongo', CardMongo);

import * as VueGoogleMaps from 'vue2-google-maps';
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAFiLGzijljjjgmnWiDdOb_UzOWO4Zgfek',
    libraries: 'places' // necessary for places input
  }
});

Vue.config.productionTip = false;

// Vue.component("Card", Card);

fb.initializeApp({
  apiKey: 'AIzaSyB1B2yJmi94g0hGCMvPnpsJ7CbXzR2wL4I',
  authDomain: 'sparty-3251e.firebaseapp.com',
  databaseURL: 'https://sparty-3251e.firebaseio.com',
  projectId: 'sparty-3251e',
  storageBucket: 'sparty-3251e.appspot.com',
  messagingSenderId: '435493051386'

  // apiKey: "AIzaSyCh6LNMxHX3cfYBI7zdDXShoaCH0CT1ND4",
  // authDomain: "time-4-event.firebaseapp.com",
  // databaseURL: "https://time-4-event.firebaseio.com",
  // projectId: "time-4-event",
  // storageBucket: "time-4-event.appspot.com",
  // messagingSenderId: "984805020632"
});

let app = null
console.log('1 before fb');

fb.auth().onAuthStateChanged(async user => {

  if (user) {
    console.log('2 have user');

    // if (user.emailVerified) {
      await store
        .dispatch('autoLoginUser', {
          id: user.uid,
          email: user.email
        })

      async function getLocation() {
        if (navigator.geolocation) {
          await window.navigator.geolocation.getCurrentPosition(
            position => {
              var cords = [position.coords.latitude, position.coords.longitude];
              store.commit('set', { v: 'position', val: cords });
              console.log('3 get loc');
              // router.push('/');

              if (!app) {
                console.log('4.5 create vue');
                app = new Vue({
                  el: '#app',
                  router,
                  store,
                  render: h => h(App)
                });
              }
            },
            () => {
              store.commit('setError', 'Please accept geo location');
            },
            { enableHighAccuracy: true, timeout: 60000, maximumAge: 600000 }
            );
        } else {
          store.commit('setError', 'Geolocation is not supported by this browser');
        }
      }
      await getLocation();
    // } else {
    //   store.commit('setError', 'Geolocation is not supported by this browser');
    // }
    
    
  } else {
    if (!app) {
      console.log('4 no login create vue');
      app = new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App)
      });
    }

    router.push('/auth');
  }
})

// function renderVue (self) {
//     if (user) {
//       store
//         .dispatch('autoLoginUser', {
//           id: user.uid,
//           email: user.email
//         })
//         // .then(() => {
//         //   // if (!user.emailVerified)
//         //   //   store.commit("setError", {
//         //   //     msg: "Verification email sent to " + user.email,
//         //   //     color: "orange"
//         //   //   });

//         //   // return to prev link
//         //   if (window.history.length > 2) {
//         //     if (self.$route.name == 'auth') self.$router.go(-1);
//         //   } else self.$router.push('/');

//         //   store.commit('clearCards');

//         //   let route = self.$route.name;
//         //   switch (route) {
//         //     case 'user':
//         //       break;
//         //     case 'visit':
//         //       store.dispatch('visitCards', { scroll: 0, pageNum: 0 });
//         //       store.commit('set', { v: 'currentState', val: 'visit' });
//         //       break;
//         //     default:
//         //       store.dispatch('fetchCards', { scroll: 0, pageNum: 0 });
//         //       store.commit('set', { v: 'currentState', val: 'home' });
//         //   }

//         //   store.commit("set", { v: "cards", val: [] });
//         // });
//     } else {
//       self.$router.push('/auth');
//     }
// }


