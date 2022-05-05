import axios from 'axios';

let cancelToken = axios.CancelToken.source();
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept',
};
export const getRequest = (url, headers = {}, otherParams = {}) => {
  const token = localStorage.getItem('token');
  return axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...corsHeaders,
      ...headers,
    },
    ...otherParams,
    cancelToken: cancelToken.token,
  });
};

export const postRequest = (url, payload, headers = {}, config = {}) => {
  const token = localStorage.getItem('token') || '';
  return axios.post(`${url}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...corsHeaders,
      ...headers,
    },
    ...config,
  });
};

export const putRequest = (url, payload, headers = {}) => {
  const token = localStorage.getItem('token');
  return axios.put(`${url}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...corsHeaders,
      ...headers,
    },
  });
};

export const deleteRequest = (url, payload = {}, headers = {}) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...corsHeaders,
      ...headers,
    },
    data: { ...payload },
  });
};

export const cancelRequest = () => {
  if (typeof cancelToken != typeof undefined) {
    cancelToken.cancel('Operation canceled by the user.');

    cancelToken = axios.CancelToken.source();
  }
};
