import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://taxdollar-a390f.firebaseio.com',
});

export default instance;
