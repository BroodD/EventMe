import Vue from "vue";
import Router from "vue-router";
import AuthGuard from "./auth-guard";

import Home from "@/views/Home.vue";
import Auth from "@/views/Auth/Auth";
import User from "@/views/User/User";
import Visit from "@/views/User/Visit";
import Settings from "@/views/User/Settings";
import Single from "@/views/Card/Single";
import NewCard from "@/views/Card/NewCard";
import Edit from "@/views/Card/Edit";

const fb = require('firebase/app')
require('firebase/auth')

import store from "@/store"

Vue.use(Router);

const router = new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  // saveScrollPosition: false,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash };
    }
    
    return {
      x: 0,
      y: 0
    };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth
    },
    {
      path: "/user/:id",
      props: true,
      name: "user",
      component: User
    },
    {
      path: "/visit",
      name: "visit",
      component: Visit
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
      beforeEnter: AuthGuard
    },
    {
      path: "/card/:id",
      props: true,
      name: "card",
      component: Single
    },
    {
      path: "/new",
      props: true,
      name: "new",
      component: NewCard,
      beforeEnter: AuthGuard
    },
    {
      path: "/edit/:id",
      props: true,
      name: "edit",
      component: Edit,
      beforeEnter: AuthGuard
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

// let p = new Promise((resolve, reject) => {
//   fb.auth().onAuthStateChanged(user => {
//     console.log('auth ');
//     resolve("result");
//   })
// })

// router.beforeEach(async (to, from, next) => {
//   console.log('beforeAuth')

//   const u = await fb.auth().currentUser
//   if (!u) {
//     console.log('has u')
//     fb.auth().onAuthStateChanged(user => {
//       if (user) {
//         console.log('has user')
//         store
//           .dispatch('autoLoginUser', {
//             id: user.uid,
//             email: user.email
//           })
//           .then(() => {
//             next()

//             // if (!user.emailVerified)
//             //   store.commit("setError", {
//             //     msg: "Verification email sent to " + user.email,
//             //     color: "orange"
//             //   });

//             // return to prev link
//             // if (window.history.length > 2) {
//             //   if (to.name == 'auth') self.$router.go(-1);
//             // } else self.$router.push('/');

//             // store.commit('clearCards');

//             // let route = self.$route.name;
//             // switch (route) {
//             //   case 'user':
//             //     break;
//             //   case 'visit':
//             //     store.dispatch('visitCards', { scroll: 0, pageNum: 0 });
//             //     store.commit('set', { v: 'currentState', val: 'visit' });
//             //     break;
//             //   default:
//             //     store.dispatch('fetchCards', { scroll: 0, pageNum: 0 });
//             //     store.commit('set', { v: 'currentState', val: 'home' });
//             // }

//             // store.commit("set", { v: "cards", val: [] });
//           });
//       } else if (from.name != 'auth') {
//         // router.push('/auth');
//         next('auth')
//       }
//     });
//   } else next()
// })

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   const isAuthenticated = fb.auth().currentUser
//   if (requiresAuth && !isAuthenticated) {
//     next('/settings')
//   } else {
//     next()
//   }
// })

export default router