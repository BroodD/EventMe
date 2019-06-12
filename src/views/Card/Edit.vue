<template>
  <v-container grid-list-md fluid v-if="single">
    <v-layout row wrap justify-center>
      <v-flex xs12 md8>
        <v-form v-model="valid" ref="form" validation @submit.prevent="false">
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-avatar
                color="secondary lighten-2"
                class="primary--text"
                size="24"
                v-text="step"
              ></v-avatar>
            </v-toolbar>

            <v-window v-model="step">
              <v-window-item :value="1">
                <v-card-text>
                  <v-text-field
                    box
                    name="title"
                    label="Title"
                    type="text"
                    v-model="title"
                    required
                    :rules="[v => !!v || 'Title is required']"
                  ></v-text-field>

                  <v-textarea
                    box
                    name="description"
                    label="Description"
                    type="text"
                    v-model="desc"
                    multi-line
                    auto-grow
                    :rules="[v => !!v || 'Description is required']"
                  ></v-textarea>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <v-dialog
                    ref="date"
                    v-model="dateModal"
                    :return-value.sync="date"
                    persistent
                    lazy
                    full-width
                  >
                    <v-text-field
                      box
                      slot="activator"
                      label="Set a date"
                      readonly
                      v-model="date"
                      :rules="dateRules"
                      clearable
                    ></v-text-field>
                    <v-date-picker
                      full-width
                      v-model="date"
                      @input="$refs.date.save(date)"
                      first-day-of-week="1"
                    ></v-date-picker>
                  </v-dialog>

                  <v-dialog
                    ref="time"
                    v-model="timeModal"
                    :return-value.sync="time"
                    persistent
                    lazy
                    full-width
                  >
                    <v-text-field
                      box
                      slot="activator"
                      v-model="time"
                      label="Set a time"
                      readonly
                      :rules="[v => !!v || 'Time is required']"
                      clearable
                    ></v-text-field>
                    <v-time-picker v-model="time" full-width format="24hr">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="timeModal = false"
                        >Cancel</v-btn
                      >
                      <v-btn flat color="primary" @click="$refs.time.save(time)"
                        >OK</v-btn
                      >
                    </v-time-picker>
                  </v-dialog>

                  <v-text-field
                    box
                    name="people"
                    label="Count people"
                    type="text"
                    v-model="people"
                    :rules="peopleRules"
                  ></v-text-field>

                  <!-- <v-slider
                    v-model="people"
                    thumb-label
                  >
                  </v-slider> -->
                </v-card-text>
              </v-window-item>

              <v-window-item :value="3">
                <v-card-text>
                  <!-- <v-flex xs12> -->
                  <v-btn dark class="primary" @click="triggerUpload">
                    Upload
                    <v-icon right dark>cloud_upload</v-icon>
                  </v-btn>
                  <input
                    ref="fileInput"
                    type="file"
                    style="display: none;"
                    accept="image/*"
                    @change="onFileChange"
                    multiple
                  />
                  <!-- </v-flex> -->
                </v-card-text>

                <v-layout row wrap align-start>
                  <v-flex v-for="(img, i) in images" :key="i" d-flex xs12 lg6>
                    <v-card class="elevation-0">
                      <v-img :src="img" class="grey darken-4"></v-img>
                      <v-card-actions>
                        <v-btn fab dark small @click="swap(i, 0)">
                          <v-icon>arrow_back</v-icon>
                        </v-btn>
                        <v-btn fab dark small @click="swap(i, 2)">
                          <v-icon>arrow_forward</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          fab
                          dark
                          small
                          color="red"
                          @click="deleteImage(i)"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-window-item>

              <v-window-item :value="4">
                <v-card-text>
                  <map-marker
                    v-if="location != null"
                    @onLocation="setLocation"
                    :position="location"
                  />
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn flat color="accent" :disabled="step === 1" @click="step--">
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="step === 4 ? updateCard() : step++"
              >
                {{ step === 4 ? "Update" : "Next" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import imageCompression from "browser-image-compression";
import MapMarker from "@/components/MapMarker";

var swap = (a, x, y) => {
  if (a.length === 1) return a;
  // var t = a[x]
  // a[x] = a[y]
  // a[y] = t
  a.splice(y, 1, a.splice(x, 1, a[y])[0]);
  return a;
};

export default {
  components: {
    MapMarker
  },
  props: {
    id: String
  },
  data() {
    return {
      step: 1,

      title: "",
      desc: "",
      people: "",
      images: [],
      time: null,
      timeModal: false,
      date: null,
      dateModal: false,

      location: null,

      orderImg: [],
      files: [],

      valid: false,
      dateRules: [
        v => !!v || "Date is required",
        v =>
          new Date(Date.parse(v)) >= new Date(Date.now() - 864e5) ||
          "Date must be more or equal today"
      ],
      peopleRules: [
        v => !!v || "Count people is required",
        v =>
          (!isNaN(v - parseInt(v)) && parseInt(v) > 0) ||
          "Count people must be a number"
      ]
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    single() {
      return this.$store.getters.get("single");
    },
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Update event";
        case 2:
          return "Date & members";
        case 3:
          return "Images";
        default:
          return "Location";
      }
    }
    // complexImg () {
    //   return this.images.length ? this.images : this.single.img;
    // }
  },
  methods: {
    setLocation(location) {
      this.location = location;
    },
    async updateCard() {
      await this.compressImages();

      var d = new Date((this.date + " " + this.time).replace(/-/g, "/"));

      if (this.$refs.form.validate()) {
        var update = {
          title: this.title,
          desc: this.desc,
          time: d.getTime(),
          people: this.people,
          location: [this.location.lat, this.location.lng]
        };

        this.$store
          .dispatch("editCard", {
            id: this.id,
            update,
            orderImg: this.orderImg,
            files: this.files
          })
          .then(() => {
            this.$router.push("/card/" + this.id);
          })
          .catch(() => {});
      }
    },
    triggerUpload() {
      this.$refs.fileInput.click();
      // this.orderImg = []
    },
    async onFileChange(event) {
      this.images = [];
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        let read = new FileReader();

        read.onload = e => {
          console.log(read);
          this.images.push(read.result);
        };

        read.readAsDataURL(files[i]);
      }

      this.files = files;
    },
    async compressImages() {
      var fil = [];

      var options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 650
        // useWebWorker: true,
      };
      try {
        for (let i = 0; i < this.files.length; i++) {
          const compressedFile = await imageCompression(this.files[i], options); // maxSizeMB, maxWidthOrHeight are optional
          console.log(
            "compressedFile instanceof Blob",
            compressedFile instanceof Blob
          ); // true
          console.log(
            `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
          ); // smaller than maxSizeMB

          fil.push(compressedFile);
        }
      } catch (error) {
        console.log(error);
      }

      this.files = fil;
    },
    deleteImage(i) {
      this.images.splice(i, 1);
      this.orderImg.splice(i, 1);
      // this.orderImg = []
    },
    swap(i, way) {
      let len = this.images.length;
      if ((i == 0 && way == 0) || (i == len - 1 && way == 2)) {
        swap(this.images, len - 1, 0);
        swap(this.orderImg, len - 1, 0);
      } else {
        swap(this.images, i - 1 + way, i);
        swap(this.orderImg, i - 1 + way, i);
      }
    }
  },
  async created () {
    await this.$store.dispatch("fetchSingle", { id: this.id }).then(() => {
      console.log(this.single);
      if (this.single) {
        let single = this.single;
        this.title = single.title;
        this.desc = single.desc;
        this.people = single.people;
        this.images = this.single.img;

        let d = new Date(this.single.time);
        this.time = d.toISOString().substr(11, 5);
        this.date = d.toISOString().substr(0, 10);
        console.log('date --- ', this.date)

        let loc = this.single.location;
        console.log(loc);
        this.location = {
          lat: loc[0],
          lng: loc[1]
        };
      }
    });

    // await fb.database().ref('cards/' + this.id).once('value', c => {
    // 	this.title = c.val().title,
    // 	this.desc = c.val().desc,
    // 	this.people =  c.val().people,
    // 	this.orderImg = c.val().img,
    // })
  }
};
</script>
