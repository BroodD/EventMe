import api from "@/services/api";

export default {
  findByFbId(params) {
    return api().get(`user/fb/${params.id}`);
  },
  findById(params) {
    return api().get(`user/${params.id}`);
  },
  findByLoginMin(params) {
    return api().get(`user/min/login/${params.login}`);
  },
  addNewUser(params) {
    return api().post("user", params);
  },
  updateUser(params) {
    return api().put(`user/${params.id}`, params);
  },
  deleteUser(params) {
    return api().delete(`user/${params.id}`);
  },
  userCards(params) {
    return api().put(`user/cards/${params.id}`, params);
  },
  visitCards(params) {
    return api().put(`user/visit/${params.id}`, params);
  }
};
