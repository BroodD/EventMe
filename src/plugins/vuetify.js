import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import uk from "vuetify/es5/locale/uk";
import * as directives from "vuetify/es5/directives";

Vue.use(Vuetify, {
  iconfont: "md",
  lang: {
    locales: { uk },
    current: "uk"
  },
  theme: {
    // primary: '#097275'
    // primary: '#3F51B5'
    // primary: '#28c5b1'
    // primary: '#212139'
    // primary: '#051937'
    // primary: '#37859F',
    // primary: '#3AAF9F',

    primary: "#3AAF9F",
    secondary: "#CDD3DA",
    accent: "#FF8A65",
    error: "#D73222"

    // error: '#FF5252',
    // info: '#2196F3',
    // success: '#4CAF50',
    // warning: '#FFC107'
  },
  directives
});
