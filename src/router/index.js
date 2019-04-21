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

import Test from "@/views/Test";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  // saveScrollPosition: true,
  scrollBehavior(to, from, savedPosition) {
    // document.getElementById('app').scrollIntoView();
    //     return null;

    console.log("savedPosition, to.hash", savedPosition, to.hash);
    if (savedPosition) {
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
      component: Home
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
      path: "/test",
      name: "test",
      component: Test
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
