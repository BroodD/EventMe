import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import uk from 'vuetify/es5/locale/uk'
import * as directives from 'vuetify/es5/directives'

Vue.use(Vuetify, {
  iconfont: 'md',
  lang: {
    locales: { uk },
    current: 'uk'
	},
	theme: {
		// primary: '#097275'
		// primary: '#3F51B5'
		// primary: '#28c5b1'
    // primary: '#212139'
    // primary: '#051937'
    // primary: '#37859F',
    // primary: '#3AAF9F',
    primary: '#3AAF9F',

    error: '#D73222'
	},
	directives
})
