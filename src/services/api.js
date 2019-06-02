import axios from 'axios';
import store from '@/store'


export default () => {
  const userid = store.getters.userId
  
  return axios.create({
    // baseURL: 'http://localhost:8081',
    baseURL: 'https://event-me.herokuapp.com',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      userid
    }
  });
};
