import axios from "axios";

export default () => {
  return axios.create({
    // baseURL: "http://localhost:8081"
    // baseURL: "https://rocky-fjord-26762.herokuapp.com"
    baseURL: "https://event-me.herokuapp.com"
  });
};
