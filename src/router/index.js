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


var fb = require("firebase/app");
require("firebase/auth");

Vue.use(Router);

const router = new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  // saveScrollPosition: true,
  scrollBehavior(to, from, savedPosition) {
    // document.getElementById('app').scrollIntoView();
    //     return null;

    // console.log("savedPosition, to.hash", savedPosition, to.hash);
    if (savedPosition !== null) {
      return savedPosition;
    } else if (to.hash) {
      return { selector: to.hash };
    }

    return {
      x: 0,
      y: 0
    };

    // if(to.path != '/') {
    // 	return {
    // 		x: 0,
    // 		y: 0
    // 	}
    // }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      // meta: { requiresAuth: true }
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