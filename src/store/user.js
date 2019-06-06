import firebase from "firebase/app";
require("firebase/auth");
require("firebase/storage");

import { User, UserMongo } from "@/mixins/class";
import UsersService from "@/services/UsersService";

export default {
  state: {
    user: null,
    otherUser: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setOtherUser(state, payload) {
      state.otherUser = payload;
    }
  },
  actions: {
    async loginUser({ commit }, { email, password }) {
      commit("clearError");
      commit("setLoading", true);
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async registerUser({ commit }, { email, password, login, name, img }) {
      commit("clearError");
      commit("setLoading", true);
      try {
        // check login is free
        const responce = await UsersService.findByLoginMin({ login: login });

        if (responce.data.user == null) {
          // const responce = await UsersService.addNewUser({
          //   login,
          //   name,
          //   bio: ""
          // });
          // const id = responce.data.id;

          const userFb = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);
          const key = userFb.user.uid;

          // some stuff with img
          let imageSrc;
          let imageExt = img.type.slice(img.type.lastIndexOf("/") + 1);
          await firebase
            .storage()
            .ref(`users/${key}.${imageExt}`)
            .put(img)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => (imageSrc = url));

          const responce = await UsersService.addNewUser({
            fbid: key,
            login,
            name,
            bio: "",
            img: imageSrc
          });
          const id = responce.data.id;

          // await UsersService.updateUser({ id: id, fbid: key, img: imageSrc });

          // send email verifi letter
          var u = await firebase.auth().currentUser;
          u.sendEmailVerification()
            .then(() => {
              commit("setError", {
                msg: "Verification email sent to " + u.email,
                color: "orange"
              });
            })
            .catch(error => {
              commit("setError", error);
            });

          commit("setUser", new User(id, login, name, imageSrc, "", email));
        } else {
          commit("setError", "Login already exists");
        }
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async autoLoginUser({ commit }, { id, email }) {
      commit("clearError");
      commit("setLoading", true);
      try {
        const responce = await UsersService.findByFbId({ id: id });
        const user = responce.data.user;

        if (user)
          commit(
            "setUser",
            new User(user._id, user.login, user.name, user.img, user.bio, email)
          );
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    async changeUserInfo(
      { commit, getters },
      { login, name, image, bio, email }
    ) {
      commit("clearError");
      commit("setLoading", true);

      var user = getters.user;

      try {
        // https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
        // change email
        // console.log(email, getters.user.email)
        // if (email !== getters.user.email) {
        //       var u = firebase.auth().currentUser;
        //       firebase.auth.EmailAuthProvider.credential(u.email, currentPassword)
        //         .then()
        // 	await firebase.auth().currentUser.updateEmail(email)
        // }

        var imageSrc;
        if (typeof image == "object") {
          // get old image
          let img = user.img;
          let indq = img.indexOf("?");
          let inde = img.lastIndexOf("users%2F", indq) + 8;
          let name = img.slice(inde, indq);

          // delete old image
          try {
            await fb
              .storage()
              .ref("users/" + name)
              .delete();
          } catch (e) {}

          // put new image
          var imageExt = image.type.slice(image.type.lastIndexOf("/") + 1);
          await firebase
            .storage()
            .ref(`users/${user._id}.${imageExt}`)
            .put(image)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => (imageSrc = url));
        } else {
          imageSrc = image;
        }

        // check login is free
        const responce = await UsersService.findByLoginMin({ login: login });

        // if userId != user.id where login is this.login
        if ( responce.data.user == null || responce.data.user._id == user._id) {

          await UsersService.updateUser({
            id: user._id,
            login,
            name,
            bio,
            img: imageSrc
          });

          commit(
            "setUser",
            new User(user._id, login, name, imageSrc, bio, email)
          );
        } else {
          commit("setError", "This login isn't available. Please try another.");
        }
        commit("setLoading", false);
      } catch (error) {
        commit("setLoading", false);
        commit("setError", error.message);
        throw error;
      }
    },
    logoutUser({ commit }) {
      firebase.auth().signOut();
      commit("setUser", null);
    },
    async otherUser({ commit, getters }, id) {
      console.log("otherUser [id]", id);
      const responce = await UsersService.findById({ id: id });
      const user = responce.data.user;

      commit("setOtherUser", user);
    },

    async userCards({ commit, getters }, { id, scroll, pageNum }) {
      commit("clearError");
      commit("setLoading", true);

      try {
        var resultCards = [];
        const response = await UsersService.userCards({
          id,
          position: getters.get("position"),
          pageNum
        });

        commit('setScrollAndPageNum', { scroll, pageNum: pageNum + 1 });
        commit("loadCards", response.data.cards);
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async visitCards({ commit, getters }, { scroll, pageNum }) {
      commit("clearError");
      commit("setLoading", true);

      console.log('visitCards [scroll, pageNum]', scroll, pageNum);

      try {
        var id = getters.userId;
        const response = await UsersService.visitCards({ 
          id, 
          position: getters.get("position"),
          pageNum
        });

        commit('setScrollAndPageNum', { scroll, pageNum: pageNum + 1 });
        commit("loadCards", response.data.cards);
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    }
  },
  getters: {
    user(state) {
      return state.user || new User();
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    },
    userId(state) {
      return state.user !== null ? state.user._id : null;
      // return (state.user !== null) ? state.user.id : null
    },
    otherUser(state) {
      return state.otherUser || new User();
    }
  }
};
