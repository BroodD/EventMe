import api from "@/services/api";

export default {
  fetchCards(params) {
    return api().get("cards", { params: params });
  },
  findById(params) {
    return api().get(`card/${params.id}`, { params: params });
  },
  addNewCard(params) {
    return api().post("card", params);
  },
  updateCard(params) {
    return api().put(`card/update/${params.id}`, params);
  },
  deleteCard(params) {
    return api().delete(`card/${params.id}`, params);
  },
  updateLikeVisitCard(params) {
    return api().put(`card/like_visit/${params.id}`, params);
  },
  addComment(params) {
    return api().put(`card/comment/${params.id}`, params);
  },
  fetchMembers(params) {
    return api().get(`card/members/${params.id}`, { params: params });
  },
  fetchComments(params) {
    return api().get(`card/comments/${params.id}`, { params: params });
  }
};
