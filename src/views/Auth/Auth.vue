<!-- https://vuetifyjs.com/ru/components/windows -->



<template>
  <v-container grid-list-md>
    <div class="auth">
      <v-layout align-stretch justify-center>

        <!-- <transition name="flip-left" mode="in-out"> -->
          
        <!-- </transition> -->

        <v-flex sm4 class="auth_over" pa-0>
          <v-card dark class="bg-gra-primary elevation-0 d-flex align-center h-100">
            <v-card-text class="text-center">
              <h2 class="fz-40">{{ greeting.title }}</h2>
              <p class="fw-300 mt-3 mb-4">{{ greeting.under }}</p>
              <v-btn 
                outline 
                round 
                large
                @click="state = !state"
              >Sing {{ state ? 'in' : 'up' }}</v-btn>
                <!-- @click="state = !state" -->
            </v-card-text>
          </v-card>
        </v-flex>

        <transition name="flip">
          <v-flex v-if="state" key="in" sm4 class="auth_over" pa-0 >
            <v-card class="elevation-0 h-100 d-flex align-center">
              <v-card-text class="text-center">
                <h2 class="fz-40 primary--text">Sing in to Eventtime</h2>
                <p class="fw-300 mt-3 mb-4">Use your email for login</p>

                <v-form v-model="valid" ref="formLog" validation>
                  <v-text-field
                    box
                    prepend-inner-icon="mail"
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    box
                    prepend-inner-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="passwordRules"
                    validate-on-blur
                  ></v-text-field>
                </v-form>
                <v-btn 
                  round 
                  large
                  flat
                  :disabled="loading"
                  @click="onLogin"
                >Sing in</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-else key="out" sm4 class="auth_over" pa-0>
            <v-card class="elevation-0">
              <v-card-text class="text-center">
                <h2 class="fz-40 primary--text">Create Account</h2>
                <p class="fw-300 mt-3 mb-4">Use your email for registration</p>

                <v-form v-model="valid" ref="formLog" validation>
                  <v-text-field
                    box
                    prepend-inner-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="login"
                    :rules="[ v => !!v || 'Login is required' ]"
                    validate-on-blur
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    box
                    prepend-inner-icon="mail"
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    box
                    prepend-inner-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="passwordRules"
                    validate-on-blur
                  ></v-text-field>
                </v-form>
                <v-btn 
                round 
                large
                flat
                :disabled="loading"
                @click="onRegistration"
                >Sing up</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </transition>

      </v-layout>
    </div>
	</v-container>
</template>

						
<script>
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/

  export default {
    data () {
      return {
        state: true,

        valid: false,
        image: '',
        hasImg: false,

        login: '',
        name: '',
        password: '',
        email: '',
        password: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => emailRegex.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 6) || 'Password must be equal or more than 6 characters'
        ],
      }
    },
    computed: {
      greeting () {
        if (this.state) {
          return {
            title: 'Hello Friend!',
            under: 'Enter your personal details and start journey'
          }
        } else {
          return {
            title: 'Welcome Back!',
            under: 'To keep connected with us please login with personal info'
          }
        }
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLogin () {
        console.log('login');
        // if (this.$refs.formLog.validate()) {
        //   const user = {
        //     email: this.email,
        //     password: this.password
        //   }

        //   this.$store.dispatch('loginUser', user)
        //     // .then(() => {
        //     //   this.$router.push('/')
        //     // })
        //     // .catch(() => {})
        // }
      },
      onRegistration () {
        console.log('rega');
        // if (this.$refs.formReg.validate() && this.image) {
        //   const user = {
        //     email: this.email,
        //     password: this.password,
        //     login: this.login,
        //     name: this.name,
        //     img: this.image,
        //   }

        //   this.$store.dispatch('registerUser', user)
        //     // .then(() => {
        //     //   this.$router.push('/')
        //     // })
        //     // .catch(() => {})
        // }
      },
    },
    created () {
      if (this.$route.query['loginError']) {
        this.$store.dispatch('setError', 'Please log in to access this page.')
      }
    }
  }
</script>