// import axios from 'axios';
//
// const instance = axios.create();
// //
// // instance.interceptors.request.use(
// //   (config) => {
// //     // Get the JWT token from local storage
// //     const token = localStorage.getItem('jwtToken');
// //     // If the token exists, add it to the headers of the request
// //     if (token) {
// //       // eslint-disable-next-line no-param-reassign
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     Promise.reject(error);
// //   }
// // );
//
// instance.interceptors.response.use(
//   (response) => {
//     if (response.headers.authorization) {
//     }
//     return response;
//   },
//   // async error => {
//   //   // Check if the error is a 401 (unauthorized)
//   //   if (error.response.status === 401) {
//   //     // Check if the JWT token is expired
//   //     if (isTokenExpired(error.response.data.token)) {
//   //       // Refresh the token
//   //       const refreshToken = localStorage.getItem('refreshToken');
//   //       const { data } = await instance.post('/refresh', { refreshToken });
//   //       // Update the JWT token in local storage and headers
//   //       localStorage.setItem('jwtToken', data.token);
//   //       instance.defaults.headers.common.Authorization = `Bearer ${data.token}`;
//   //       // Retry the original request
//   //       return instance(error.config);
//   //     } else {
//   //       // Logout if the token is not expired but still invalid
//   //       store.dispatch('logout');
//   //     }
//   //   }
//   //   return Promise.reject(error);
//   // }
// );
//
// export default instance;
