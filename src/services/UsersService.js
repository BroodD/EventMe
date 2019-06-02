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
    return api().put(`user`, params);
  },
  deleteUser(params) {
    return api().delete(`user`, { params });
  },
  userCards(params) {
    return api().get(`user/cards/beta`, { params });
  },
  visitCards(params) {
    return api().get(`user/visit/beta`, { params });
  }
};
