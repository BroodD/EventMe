import firebase from "firebase/app";
require("firebase/storage");

import { Cards, CardMongo } from "@/mixins/class";
import CardsService from "@/services/CardsService";

export default {
  state: {
    cards: [],
    end: null,
    userEnd: null,
    visitEnd: null,
    single: null,

    userCards: [],
    visitCards: []
  },
  mutations: {
    createCard(state, payload) {
      state.cards.unshift(payload);
    },
    loadCards(state, payload) {
      state.cards = state.cards.concat(payload);
      // state.cards = payload
    },
    set(state, { v, val }) {
      state[v] = val;
    }
  },
  actions: {
    async createCard({ commit, getters }, payload) {
      commit("clearError");
      commit("setLoading", true);

      try {
        const newCard = new CardMongo(
          payload.title,
          payload.desc,
          getters.userId,
          payload.time,
          payload.people,
          payload.location
        );

        const response = await CardsService.addNewCard(newCard);
        const key = response.data.id;

        const files = payload.files;
        var imageSrc = [];

        for (let i = 0; i < files.length; i++) {
          let imageExt = files[i].name.slice(
            files[i].name.lastIndexOf(".") + 1
          );
          let path = `cards/${key}_${i}.${imageExt}`;

          let fileData = await firebase
            .storage()
            .ref(path)
            .put(files[i])
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => imageSrc.push(url));
        }

        newCard.img = imageSrc;

        if (imageSrc.length)
          CardsService.updateCard({ id: key, img: imageSrc });

        // commit('createCard', newCard)
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },

    async deleteCard({ commit, getters }, { id, ownerId, images }) {
      commit("clearError");
      commit("setLoading", true);

      var userId = getters.userId;

      try {
        if (userId === ownerId) {
          await CardsService.deleteCard({ id: id, user_id: userId });

          if (images) {
            images.forEach(s => {
              let indq = s.indexOf("?");
              let inde = s.lastIndexOf("cards%2F", indq) + 8;
              let name = s.slice(inde, indq);
              firebase
                .storage()
                .ref("cards/" + name)
                .delete();
            });
          }

          commit("setLoading", false);
          commit("setError", { msg: "Card delete", color: "red" });
        } else {
          commit("setLoading", false);
          commit("setError", "You must be author this card");
        }
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async editCard({ commit, getters }, { id, update, orderImg, files }) {
      // TODO check security

      commit("clearError");
      commit("setLoading", true);

      // var uid = getters.userId
      // console.log('deleteCard [id, ownerId, images]', id, ownerId, images)

      try {
        // if (uid === ownerId) {
        console.log(
          "EditCard [id, update, orderImg, files]",
          id,
          update,
          orderImg,
          files
        );

        if (files.length) {
          console.log("files true");
          var response = await CardsService.findById({ id });
          if (response.data.card) {
            var img = response.data.card.img;

            if (img) {
              console.log("img true");
              for (let i = 0; i < img.length; i++) {
                console.log("deleteImg", i);
                let indq = img[i].indexOf("?");
                let inde = img[i].lastIndexOf("cards%2F", indq) + 8;
                let name = img[i].slice(inde, indq);
                await fb
                  .storage()
                  .ref("cards/" + name)
                  .delete();
              }
            }

            var imageSrc = [];
            for (let i = 0; i < files.length; i++) {
              console.log("filePut", i);
              let imageExt = files[i].name.slice(
                files[i].name.lastIndexOf(".") + 1
              );
              let path = `cards/${id}_${i}.${imageExt}`;

              await firebase
                .storage()
                .ref(path)
                .put(files[i])
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(url => imageSrc.push(url));
            }
            await CardsService.updateCard({
              id,
              ...update,
              img: imageSrc
            });
          }
        } else if (orderImg.length) {
          console.log("orderImg true");
          await CardsService.updateCard({
            id,
            ...update,
            img: imageSrc
          });
        } else {
          console.log("else true");
          await CardsService.updateCard({
            id,
            ...update
          });
        }

        commit("setLoading", false);
        commit("setError", { msg: "Card update", color: "primary" });
        // } else {
        // 	commit('setLoading', false)
        // 	commit('setError', 'You must be author this card')
        // }
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async fetchCards({ commit, getters }, pn) {
      commit("clearError");
      commit("setLoading", true);

      try {
        console.log(pn, getters.get("position"));
        const response = await CardsService.fetchCards({
          user_id: getters.userId,
          position: getters.get("position"),
          pn
        });
        const resultCards = response.data.cards;

        commit("loadCards", resultCards);
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async fetchSingle({ commit, getters }, { id }) {
      commit("clearError");
      commit("setLoading", true);

      console.log("fetchSingle [id]", id);

      try {
        const response = await CardsService.findById({
          id: id,
          user_id: getters.userId
        });
        const resultCards = response.data.card[0];

        commit("set", { v: "single", val: resultCards });
        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },

    async toggleLike({ commit, getters }, { id, has }) {
      commit("clearError");
      commit("setLoading", true);

      var user_id = getters.userId;

      try {
        if (user_id) {
          // type true -- like
          await CardsService.updateLikeVisitCard({
            id,
            has,
            user_id,
            type: true
          });

          // commit('toggleLike', { id, red })
          commit("setLoading", false);
        } else {
          commit("setLoading", false);
          commit("setError", "You must be logined");
        }
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    },
    async toggleVisit({ commit, getters }, { id, has }) {
      commit("clearError");
      commit("setLoading", true);

      var user_id = getters.userId;

      try {
        if (user_id) {
          // type true -- like
          console.log(id, has, user_id);
          await CardsService.updateLikeVisitCard({
            id,
            has,
            user_id,
            type: false
          });

          commit("setLoading", false);
        } else {
          commit("setLoading", false);
          commit("setError", "You must be logined");
        }
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
        throw error;
      }
    }
  },
  getters: {
    cards(state) {
      return state.cards;
    },
    get(state) {
      return type => {
        return state[type];
      };
    }
  }
};
