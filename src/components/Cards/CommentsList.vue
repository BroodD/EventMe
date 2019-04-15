<template>
  <v-card class="round elevation-10" id="comments">
    <v-card-title>
      <div class="headline">
        Comments <small class="primary--text">{{ length }}</small>
      </div>
    </v-card-title>
    <v-list>
      <template v-for="c in comments">
        <!-- <v-divider 	:key="c.id"></v-divider> -->
        <v-list-tile avatar>
          <router-link :to="'/user/' + c.user._id">
            <v-list-tile-avatar>
              <v-img
                position="top left"
                :src="c.user.img"
                alt="avatar"
                size="100"
              />
            </v-list-tile-avatar>
          </router-link>

          <v-list-tile-content>
            <router-link :to="'/user/' + c.user._id">
              <v-list-tile-title v-html="c.user.login"></v-list-tile-title>
            </router-link>
            <v-list-tile-sub-title v-html="c.text"></v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn small flat fab>
              <v-icon>reply</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>

        <template v-for="r in c.reply">
          <!-- <v-divider   :key="c.id"></v-divider> -->
          <v-list-tile avatar class="pl-5">
            <router-link :to="'/user/' + r.user._id">
              <v-list-tile-avatar>
                <v-img
                  position="top left"
                  :src="r.user.img"
                  alt="avatar"
                  size="100"
                />
              </v-list-tile-avatar>
            </router-link>

            <v-list-tile-content>
              <router-link :to="'/user/' + r.user._id">
                <v-list-tile-title v-html="r.user.login"></v-list-tile-title>
              </router-link>
              <v-list-tile-sub-title v-html="r.text"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </template>
    </v-list>

    <v-card-actions>
      <v-btn flat :disabled="pn <= 0" @click="fetchComments(false)">
        <v-icon left>keyboard_arrow_left</v-icon>
        <span>Prev</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        flat
        :disabled="length <= (pn + 1) * pz"
        @click="fetchComments(true)"
      >
        <span>Next</span>
        <v-icon right>keyboard_arrow_right</v-icon>
      </v-btn>
    </v-card-actions>

    <v-card-text>
      <v-textarea
        box
        label="Your comment"
        v-model="text"
        class="mt-2"
        auto-grow
      ></v-textarea>
      <v-btn color="primary" @click="addComment">Send</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import CardsService from "@/services/CardsService";

export default {
  name: "CommentsList",
  props: {
    id: String,
    length: Number
  },
  data() {
    return {
      comments: [],
      text: "",
      pn: 0,
      pz: 10
    };
  },
  methods: {
    async addComment() {
      if (this.text) {
        var st = this.$store;
        var user = st.getters.userId;

        try {
          if (user) {
            this.$emit("incLength");
            // this.length++;

            const responce = await CardsService.addComment({
              id: this.id,
              user_id: user,
              text: this.text
            });
            console.log(responce.data.id);
          } else {
            st.commit("setError", "You must be logined");
          }
        } catch (error) {
          st.commit("setError", error.message);
        }
        this.text = "";
      } else {
        st.commit("setError", "Please input text");
      }
    },
    async fetchComments(step) {
      try {
        if (step === true) this.pn++;
        if (step === false) this.pn--;
        const response = await CardsService.fetchComments({
          id: this.id,
          pn: this.pn,
          pz: this.pz
        });
        this.comments = response.data.comments;
      } catch (error) {
        this.$store.commit("setError", error.message);
        throw error;
      }
    }
  },
  async created() {
    this.fetchComments();
  }
};
</script>
