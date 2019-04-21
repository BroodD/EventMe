<!-- https://vuetifyjs.com/ru/components/windows -->

<template>
  <v-container grid-list-md class="h-100">
    <div class="auth d-flex align-center">
      <v-layout row wrap align-stretch justify-center>
        <v-flex xs12 class="hidden-md-and-up text-center">
          <v-btn type="submit" flat round large @click="state = !state"
            >Sign up / Sign in</v-btn
          >
        </v-flex>

        <v-flex xs4 class="auth__toggle hidden-sm-and-down" pa-0>
          <v-card
            dark
            class="bg-gra-primary elevation-0 d-flex align-center h-100"
          >
            <v-card-text class="text-center">
              <h2 class="fz-40">{{ greeting.title }}</h2>
              <p class="fw-300 mt-3 mb-4">{{ greeting.under }}</p>
              <v-btn outline round large @click="state = !state"
                >Sing {{ state ? "up" : "in" }}</v-btn
              >
              <!-- @click="state = !state" -->
            </v-card-text>
          </v-card>
        </v-flex>

        <transition name="flip">
          <v-flex v-if="state" key="in" md6 lg4 pa-0>
            <v-card class="elevation-0 h-100 d-flex align-center">
              <v-card-text class="text-center">
                <h2 class="fz-40 primary--text">Sing in to EventMe</h2>
                <p class="fw-300 mt-3 mb-4">Use your email for login</p>

                <v-form
                  v-model="valid"
                  ref="formLog"
                  validation
                  @submit.prevent="onLogin"
                  id="form-log"
                >
                  <v-text-field
                    box
                    prepend-inner-icon="mail"
                    name="email"
                    label="Email"
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                    validate-on-blur
                    autofocus
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
                  :loading="loading"
                  type="submit"
                  form="form-log"
                  >Sing in</v-btn
                >
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex v-else key="out" sm6 lg4 pa-0>
            <v-card class="elevation-0 h-100 d-flex align-center">
              <v-card-text class="text-center">
                <h2 class="fz-40 primary--text">Create Account</h2>
                <p class="fw-300 mt-3 mb-4">Use your email for registration</p>

                <v-form
                  v-model="valid"
                  ref="formReg"
                  validation
                  @submit.prevent="onLogin"
                  id="form-reg"
                >
                  <v-dialog v-model="dialog" max-width="450px">
                    <!-- <v-toolbar dark color="primary">
                      <v-toolbar-title>Change avatar</v-toolbar-title>
                    </v-toolbar> -->
                    <v-card>
                      <v-card-text v-show="hasImg">
                        <div
                          style="width: auto; height: auto; display: inline-block;"
                        >
                          <vue-cropper
                            ref="cropper"
                            @cropmove="setImage"
                            :view-mode="1"
                            drag-mode="crop"
                            :background="false"
                            :aspectRatio="1 / 1"
                            :initialAspectRatio="1 / 1"
                            :src="cropImg"
                            :img-style="{ width: 'auto', height: 'auto' }"
                          ></vue-cropper>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <input
                          ref="cropInput"
                          type="file"
                          accept="image/*"
                          @change="setImage"
                          style="display: none;"
                        />
                        <v-btn color="primary" @click="$refs.cropInput.click()"
                          >Choose new</v-btn
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          @click="cropImage"
                          v-show="hasImg"
                          >Done</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-avatar
                    class="mb-3 elevation-7"
                    :tile="false"
                    :size="120"
                    @click="avatarClick"
                  >
                    <img :src="cropImg" alt="avatar" />
                  </v-avatar>

                  <v-text-field
                    box
                    prepend-inner-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    v-model="login"
                    :rules="[v => !!v || 'Login is required']"
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
                  type="submit"
                  form="form-log"
                  >Sing up</v-btn
                >
              </v-card-text>
            </v-card>
          </v-flex>
        </transition>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import VueCropper from "vue-cropperjs";
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;

export default {
  components: { VueCropper },
  data() {
    return {
      state: false,

      valid: false,
      dialog: false,
      image: "",
      hasImg: false,
      cropImg: require("@/assets/choose_img.svg"),

      login: "",
      name: "",
      password: "",
      email: "test@gmail.com",
      password: "testtest",
      emailRules: [
        v => !!v || "E-mail is required",
        v => emailRegex.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length >= 6) ||
          "Password must be equal or more than 6 characters"
      ]
    };
  },
  computed: {
    greeting() {
      if (this.state) {
        return {
          title: "Hello Friend!",
          under: "Enter your personal details and start journey with us"
        };
      } else {
        return {
          title: "Welcome Back!",
          under: "To keep connected with us please login with personal info"
        };
      }
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    onLogin() {
      if (this.$refs.formLog.validate()) {
        const user = {
          email: this.email,
          password: this.password
        };

        this.$store
          .dispatch("loginUser", user)
          .then(() => {
            this.$router.push("/");
          })
          .catch(() => {});
      }
    },
    onRegistration() {
      if (this.$refs.formReg.validate() && this.image) {
        const user = {
          email: this.email,
          password: this.password,
          login: this.login,
          name: this.name,
          img: this.image
        };

        this.$store
          .dispatch("registerUser", user)
          .then(() => {
            this.$router.push("/");
          })
          .catch(() => {});
      }
    },

    avatarClick() {
      if (this.hasImg) this.dialog = true;
      else {
        this.$refs.cropInput.click();
        this.dialog = true;
      }
    },
    setImage(e) {
      const file = e.target.files[0];
      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = event => {
          this.hasImg = true;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
        this.image = file;
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.dialog = false;
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
        this.image = blob;
      });
    }
  },
  created() {
    if (this.$route.query["loginError"]) {
      this.$store.dispatch("setError", "Please log in to access this page.");
    }
  }
};
</script>

<style lang="sass">
@import '@/assets/sass/_mixins.sass'

.auth
  perspective: 1000px
  min-height: 100%
  // perspective-origin: right
  &__toggle
    position: relative
    z-index: 2
    min-height: 460px
    .v-card__text
      padding-left: torem(50)
      padding-right: torem(50)

  // btn
  .v-btn--large
    padding: 0 50px
    text-transform: uppercase
    background-image: linear-gradient(to right top, #3aaf9f, #3aaf9f, #3aaf9f, #3aaf9f, #3aaf9f)
    color: #fff !important
// inputs
.v-text-field--box > .v-input__control > .v-input__slot
  // border-radius: 4px
  &:before, &:after
    display: none


.flip
  &-enter
    // transform: translateX(-100%)
    &-active
      animation: flipX 400ms linear
      transform-origin: left
      // position: absolute

  &-leave
    &-active
      // animation: flipXOut 0.3s linear
      // transform-origin: left
      display: none


@keyframes flipX
  from
    transform: rotateY(-45deg)
  to
    transform: rotateY(0deg)

@keyframes flipXOut
  from
    transform: rotateY(0deg)
  to
    transform: rotateY(-45deg)
</style>
