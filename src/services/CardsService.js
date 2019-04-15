import api from "@/services/api";

export default {
  fetchCards(params) {
    return api().put("cards", params);
  },
  findById(params) {
    return api().put(`card/${params.id}`, params);
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
    return api().put(`card/members/${params.id}`, params);
  },
  fetchComments(params) {
    return api().put(`card/comments/${params.id}`, params);
  }
};
