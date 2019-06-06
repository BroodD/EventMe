import axios from 'axios';
import store from '@/store'


export default () => {
  const userid = store.getters.userId
  const position = store.getters.get('position')

  const apiClient = axios.create({
    baseURL: 'http://localhost:8081',
    // baseURL: 'https://event-me.herokuapp.com',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      userid,
      position
    }
  });

  apiClient.interceptors.response.use(response => { // Called on response
    return response
  },
    error => {
      if (error.response)
        console.error('--- Server error ---', error.response.data.message);
      return error
    }
  );

  return apiClient;
};
