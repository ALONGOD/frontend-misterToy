import Axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api/'
  : '//localhost:3030/api/';

const axios = Axios.create({
  withCredentials: true
});

export const httpService = {
  async get(endpoint, data) {
    return ajaxWithAsyncAwait(endpoint, 'GET', data);
  },
  async post(endpoint, data) {
    return ajaxWithAsyncAwait(endpoint, 'POST', data);
  },
  async put(endpoint, data) {
    return ajaxWithAsyncAwait(endpoint, 'PUT', data);
  },
  async delete(endpoint, data) {
    return ajaxWithAsyncAwait(endpoint, 'DELETE', data);
  }
};

async function ajaxWithAsyncAwait(endpoint, method = 'GET', data = null) {
  try {
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: (method === 'GET') ? data : null
    });
    return res.data;
  } catch (err) {
    console.log(`Had issues ${method}ing to the backend, endpoint: ${endpoint}, with data:`, data);
    console.dir(err);
    if (err.response && err.response.status === 401) {
      sessionStorage.clear();
      window.location.assign('/');
      // Depending on routing strategy - hash or history
      // window.location.assign('/#/login')
      // window.location.assign('/login')
      // router.push('/login')
    }
    throw err;
  }
}
