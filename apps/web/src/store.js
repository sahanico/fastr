/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import axiosBase from 'axios';
import db from '@/db';
import $ from 'jquery';
import router from './router/router';
import authHeader from './auth-header';
import { saveAs } from 'file-saver';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);
const BASE_API_URL = `${process.env.BASE_API_URL}/api`;

const axios = axiosBase.create();

axios.defaults.withCredentials = true;

export const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage,
    })],
  state: {
    token: null,
    user: null,
    acceptedTerms: null,
    sideNavItems: [],
    system: {
      user: null,
      account: null,
      account_member: null,
      today: this.today, // 2022-01-30 ; use this format
    },
  },
  mutations: {
    updateAcceptedTerms(state) {
      state = {
        ...state,
        system: {
          ...state.system,
          user: {
            ...state.system.user,
            acceptedTerms: 'true',
          },
        },
      };
    },
    updateJwtToken(state, jwtToken) {
      state.user = {
        ...state.user,
        jwtToken,
      };
    },
    authUser(state, userData) {
      state.user = userData;
    },
    storeUser(state, user) {
      state.user = user.user;
    },
    clearAuthData(state) {
      state.token = null;
      state.user = null;
      state.sideNavItems = [];
      state.system = {
        user: {},
        account: {},
        account_member: {},
      };
    },
    clearSideNav(state) {
      state.sideNavItems = [];
    },
    system(state, payload) {
      const { account, account_member, user } = payload;
      if (account) {
        state.system.account = account;
      }
      if (account_member) {
        state.system.account_member = account_member;
      }
      if (user) {
        state.system.user = user;
      }
    },
  },
  actions: {
    today() {
      const date = new Date();
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    },
    setLogoutTimer({ commit }, expirationTime) {

      let id = window.setTimeout(function () {}, 0);

      while (id--) {
        window.clearTimeout(id); // will do nothing if no timeout with id is present
      }
      setTimeout(async () => {
        // commit('clearAuthData');
        await router.replace('/sign_in_again');
      }, expirationTime);
    },
    async signUp({ dispatch }, authData) {
      const apicall = await axios({
        method: 'put',
        url: `${BASE_API_URL}/user/signup`,
        headers: { contentType: 'application/json' },
        data: authData,
        withCredentials: true,
      });
      if (apicall.data) {
        return apicall.data;
      }
    },
    async logIn({ dispatch, commit }, authData) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/user/authenticate`,
        headers: { contentType: 'application/json' },
        data: {
          email: authData.email,
          password: authData.password,
        },
        withCredentials: true,
      });
      // const res = await fetch(`${BASE_API_URL}/user/authenticate`, {
      //   method: 'POST',
      //   headers: { contentType: 'application/json' },
      //   body: { email: authData.email, password: authData.password },
      //   withCredentials: true,
      // })
      if (res.data === 'Username or password is incorrect') {
        return res.data;
      }
      if (res.data['approved'] === 'false') {
        // return 'your account has not been approved yet. Please contact an administrator'
        return 'not approved';
      }
      if (res.data['emailVerified'] === 'false') {
        // return 'your account has not been approved yet. Please contact an administrator'
        return 'not verified';
      }
      if (res.data['jwtToken']) {
        commit('authUser', res.data);
        dispatch('setLogoutTimer', 1000 * 60 * 60);
        // dispatch('setLogoutTimer', 10 * 1000 ); // 10 seconds
        return res.data;
      }
      return;
    },
    async tryAutoLogin({ commit }) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user['jwtToken']) return;
      const expirationDate = localStorage.getItem('expirationDate');
      if (new Date() >= new Date(expirationDate)) {
        await router.replace('/sign_in');
        return;
      }
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/user/refresh-token`,
        // data: { token: user['jwtToken'] },
        headers: authHeader('json'),
      });

    },

    async resetPassword({ dispatch }, authData) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/user/reset-password/${authData.email}`,
        withCredentials: true,
      });
      // const requestOptions = {
      //   method: 'POST',
      //   headers: {'content-type': 'application/json'},
      //   cors: 'include'
      // };
      //
      // let res = await fetch(`${BASE_API_URL}/user/reset-password`, requestOptions)

      // if (res.data['jwtToken']) {
      //   const now = new Date();
      //   const expirationDate = new Date(now.getTime() + 15 * 1000 * 60);
      //   localStorage.setItem('user', JSON.stringify(res.data));
      //   localStorage.setItem('expirationDate', expirationDate.toString());
      //   commit('authUser', res.data);
      //   dispatch('setLogoutTimer', 15 * 1000 * 60);
      //   return res.data;
      // }
      return res.status === 200 ? res.data : 'reset-failed';

    },
    logout({ commit }, path) {
      commit('clearAuthData');
      sessionStorage.clear();
      localStorage.clear();
      if (path === ('home' || 'logout')) {
        router.replace('/home');
      }
    },
    storeUserInDatabase({ state }, userData) {
      if (!state.token) {
        return;
      }

      db.collection('users').doc(userData.userId).set(userData);
    },
    storeDocument() {

    },
    sendEmail(email) {
      // db.collection('emails').doc().set(email);
    },
    async getUser({ state }, fd) {
      const res = await axios({
        method: 'get',
        url: `${BASE_API_URL}/user/${state.user.userId}`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async sendDocumentToUser({ state }, fd) {
      $.ajax({
        url: `${BASE_API_URL}/admin/${state.user.userId}/send-document`,
        cache: false,
        contentType: false,
        processData: false,
        data: fd,
        type: 'POST',
        headers: authHeader(),
      });

    },
    async uploadDocumentAsUser({ state }, fd) {
      fd.append('fromUserId', state.user.userId);
      let res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/user/${state.user.userId}/send-document`,
        headers: authHeader(),
        mode: 'cors',
        withCredentials: true,
        contentType: 'multipart/form-data',
        data: fd,
      });
      if (res.status === 200) {
        return res.data;
      }
      return false;

    },
    async uploadAttachment({ state }, fd) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/upload-attachment`,
        data: fd,
        headers: authHeader('form-data'),
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
      return false;
    },
    async uploadTemplate({ state }, fd) {
      let res = await $.ajax({
        url: `${BASE_API_URL}/admin/${state.user.userId}/upload-template`,
        cache: false,
        contentType: false,
        processData: false,
        data: fd,
        type: 'POST',
        headers: authHeader(),
      });
      if (res.status === 200) {
        return res.data;
      }
      return false;
    },
    async getAttachmentsByRecordId({ state }, payload) {
      const attachment = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-attachment-by-record-id`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (attachment.status === 200) {
        return attachment.data;
      }
      return false;
    },

    async getAllUsers({ state }) {
      return $.ajax({
        url: `${BASE_API_URL}/user`,
        type: 'GET',
        headers: authHeader(),
        success: (data) => {
          return data;
        },
        error: () => {
        },
      });
    },
    async getAllRoleUser({ state }) {
      return $.ajax({
        url: `${BASE_API_URL}/all-role-user`,
        type: 'GET',
        headers: authHeader(),
        success: (data) => {
          return data;
        },
        error: () => {
        },
      });
    },
    async getAllRoleAdmin({ state }) {
      return $.ajax({
        url: `${BASE_API_URL}/all-role-admin`,
        type: 'GET',
        headers: authHeader(),
        success: (data) => {
          return data;
        },
        error: () => {
        },
      });
    },

    // async updateUserProfile({ state, commit }, payload) {
    //   const apicall = await axios({
    //     method: 'post',
    //     url: `${BASE_API_URL}/user/${state.user.userId}/update-user-info`,
    //
    //     headers: authHeader(),
    //     data: payload,
    //     withCredentials: true,
    //   });
    //   if (apicall.status === 200) {
    //     localStorage.setItem('user', JSON.stringify(apicall.data));
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },

    async getSentDocuments({ state }) {
      const requestOptions = {
        method: 'POST',
        headers: authHeader(),
      };

      return fetch(`${BASE_API_URL}/user/${state.user.id}/sent-documents`, requestOptions).
        then(handleResponse);

    },
    async getReceivedDocuments({ state }) {
      const requestOptions = {
        method: 'POST',
        headers: authHeader(),
      };

      return fetch(`${BASE_API_URL}/user/${state.user.id}/received-documents`, requestOptions).
        then(handleResponse);

    },
    async getInboundDocuments({ state }) {
      const requestOptions = {
        method: 'GET',
        headers: authHeader(),
      };
      return fetch(`${BASE_API_URL}/user/${state.user.userId}/inbound-document`, requestOptions).
        then(handleResponse);
    },
    async getOutboundDocuments({ state }) {
      const requestOptions = {
        method: 'GET',
        headers: authHeader(),
      };
      return fetch(`${BASE_API_URL}/user/${state.user.userId}/outbound-document`, requestOptions).
        then(handleResponse);
    },
    async downloadDocuments({ state }, { path, userId }) {
      return axios({
        method: 'post',
        url: `${BASE_API_URL}/user/${state.user.userId}/download-documents`,
        headers: authHeader(),
        data: { path, userId, stateUser: state.user.userId },
        responseType: 'blob',
      }).then((response) => {
        let blob = new Blob([response.data]);
        saveAs(blob, path.slice(1));
      });
    },
    async downloadAttachment({ state }, payload) {
      return axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/download-attachment`,
        headers: authHeader(),
        data: payload,
        responseType: 'blob',
      }).then((response) => {
        let blob = new Blob([response.data]);
        saveAs(blob, payload.name);
      });
    },

    async getAllInboundDocuments({ state }) {
      const requestOptions = {
        method: 'GET',
        headers: authHeader(),
      };
      return fetch(`${BASE_API_URL}/admin/${state.user.userId}/all-inbound-documents`,
        requestOptions).then(handleResponse);
    },
    async getAllOutboundDocuments({ state }) {
      const requestOptions = {
        method: 'GET',
        headers: authHeader(),
      };
      return fetch(`${BASE_API_URL}/admin/${state.user.userId}/all-outbound-documents`,
        requestOptions).then(handleResponse);
    },
    async getUserApprovals({ state }) {
      const res = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/approval-requests`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async approveUser({ state }, userId) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/approve-user/${userId}`,
        headers: authHeader(),
        data: { user: { id: state.user.userId } },
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async DisplayAllUsers({ state }) {
      const res = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/display-all-users`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
      return false;
    },
    async getUsersForDesigner({ state }) {
      const res = await axios({
        method: 'get',
        url: `${BASE_API_URL}/designer/${state.user.userId}/get-users-for-designers`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
      return false;
    },
    async getUserGroups({ state }) {
      const res = await axios({
        method: 'get',
        url: `${BASE_API_URL}/designer/${state.user.userId}/get-user-groups`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
      return false;
    },

    async getInvoices({ state }) {
      const requestOptions = {
        method: 'GET',
        headers: authHeader(),
      };
      return fetch(`${BASE_API_URL}/user/${state.user.userId}/invoices`, requestOptions).
        then(handleResponse);
    },

    async getPaidInvoices({ state }) {
      const paid = await axios({
        method: 'get',
        url: `${BASE_API_URL}/user/${state.user.userId}/paid-invoices`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (paid.status === 200) {
        return paid.data;
      }
      return false;

    },
    async getAllPaidInvoices({ state }) {

      const paid = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/all-paid-invoices`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (paid.status === 200) {
        return paid.data;
      }
      return false;
    },
    async getOutstandingInvoices({ state }) {
      const outstanding = await axios({
        method: 'get',
        url: `${BASE_API_URL}/user/${state.user.userId}/outstanding-invoices`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (outstanding.status === 200) {
        return outstanding.data;
      }
      return false;
    },
    async getAllOutstandingInvoices({ state }) {
      const outstanding = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/all-outstanding-invoices`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (outstanding.status === 200) {
        return outstanding.data;
      }
      return false;
    },

    async submitInvoice({ state }, invoice) {
      // const created = await postData(`${BASE_API_URL}/admin/${state.user.userId}/create-invoice`,
      //   invoice);
      return axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/create-invoice`,
        headers: authHeader(),
        data: invoice,
        withCredentials: true,
      });

    },
    async downloadInvoice({ state }, { path, userId }) {
      return axios({
        method: 'post',
        url: `${BASE_API_URL}/user/${state.user.userId}/download-invoice`,
        headers: authHeader(),
        data: { path, userId, stateUser: state.user.userId },
        responseType: 'blob',
      }).then((response) => {
        let blob = new Blob([response.data]);
        saveAs(blob, path.slice(1));
      });
    },
    async approveInvoicePayment({ state }, invoicePayload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/approve-invoice-payment`,
        headers: authHeader(),
        data: invoicePayload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async voidInvoice({ state }, invoicePayload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/void-invoice`,
        headers: authHeader(),
        data: invoicePayload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },

    async createAppointmentAsAdmin({ state }, appointment) {
      const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
      };
      return axios({
        method: 'put',
        url: `${BASE_API_URL}/admin/${state.user.userId}/add-appointment`,
        headers: authHeader(),
        //data: appointment,
        data: {
          date: appointment.date,
          title: appointment.title,
          status: appointment.status,
          notes: appointment.notes,
          time: appointment.time,
          userId: appointment.userId,
        },
        withCredentials: true,
      });
    },
    async createAppointment({ state }, appointment) {
      const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
      };
      return axios({
        method: 'put',
        url: `${BASE_API_URL}/user/${state.user.userId}/add-appointment`,
        headers: authHeader(),
        withCredentials: true,
        data: {
          date: appointment.date,
          title: appointment.title,
          status: appointment.status,
          notes: appointment.notes,
          time: appointment.time,
          userId: state.user.userId,
        },
      });
    },
    async getAllAppointments({ state }) {
      const requestOptions = {
        method: 'GET',
        headers: authHeader(),
      };
      return fetch(`${BASE_API_URL}/admin/${state.user.userId}/all-appointments`, requestOptions).
        then(handleResponse);
    },
    async getAppointments({ state }) {
      const appointment = await axios({
        method: 'get',
        url: `${BASE_API_URL}/user/${state.user.userId}/individual-appointments`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (appointment.status === 200) {
        return appointment.data;
      }
      return false;
    },
    async confirmedAppointment({ state }, appointment) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/confirmed-appointment`,
        headers: authHeader(),
        data: appointment,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async cancelledAppointment({ state }, appointment) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/cancelled-appointment`,
        headers: authHeader(),
        data: appointment,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async updateUserTermsAndConditions({ state, commit }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/user/${state.user.userId}`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        // commit("storeUser", res.data);
        localStorage.setItem('user', JSON.stringify(res.data));

        return true;
      } else {
        return false;
      }
    },
    async getAllObjects({ state }) {
      const objects = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-all-objects`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (objects.status === 200) {
        return objects.data;
      }
      return false;
    },
    async createObject({ state }, object) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/create-object`,
        headers: authHeader(),
        data: object,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
      return res.sendStatus(404);

    },
    async getObjectByName({ state }, payload) {
      const object = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-object-by-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (object.status === 200) {
        return object.data;
      }
      return false;
    },
    async getObjectById({ state }, payload) {
      const object = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-object-by-id`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (object.status === 200) {
        return object.data;
      }
      return false;
    },
    async updateObjectById({ state, commit }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/update-object-by-id`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      } else { return false;}
    },
    async deleteObjectById({ state }, id) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/delete-object-by-id`,
        headers: authHeader(),
        data: { id },
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async createObjectFields({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/create-object-field`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res['body'] === 'field-exists' ? 'field-exists' : res.data;
      } else { return false;}

    },
    // async getFieldByObjectName({ state }, payload) {
    //   const res= await axios({
    //     method: 'post',
    //     url: `${BASE_API_URL}/designer/${state.user.userId}/get-field-by-object-name`,
    //     headers: authHeader(),
    //     data: payload,
    //     withCredentials: true,
    //   });
    //   if (res.status === 200) {
    //     return res['body'] === 'field-exists' ? 'field-exists' : res.data;
    //   } else { return false}
    //
    // },
    async updateObjectField({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/update-object-field`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async deleteObjectField({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/delete-object-field`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async getAllDesigns({ state }) {
      const designs = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-all-designs`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (designs.status === 200) {
        return designs.data;
      }
      return false;
    },
    async getDesign({ state }) {
      const objectConfig = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-design`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (objectConfig.status === 200) {
        return objectConfig.data;
      }
      return false;
    },
    async createDesign({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/create-design`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
      return res.sendStatus(404);
    },
    async createUserGroup({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/create-user-group`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
      return res.sendStatus(404);
    },
    async updateDesign({ state }, payload) {
      return axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/update-design`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
    },
    async updateUserGroup({ state }, payload) {
      return axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/update-user-group`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
    },
    async getDesignByName({ state }, payload) {
      const design = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-design-by-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (design.status === 200) {
        return design.data;
      }
      return false;
    },
    async getDesignsByType({ state }, payload) {
      const design = await axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/get-designs-by-type`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (design.status === 200) {
        return design.data;
      }
      return false;
    },
    async getDesignsByObjectName({ state }, payload) {
      const design = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-designs-by-object-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (design.status === 200) {
        return design.data;
      }
      return false;
    },
    async deleteDesignByID({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/delete-design-by-id`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async deleteUserGroupByID({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/delete-user-group-by-id`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async deleteDesignByName({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/delete-design-by-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async getAllDashboardDesigns({ state }) {
      const designs = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-all-dashboard-designs`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (designs.status === 200) {
        return designs.data;
      }
      return false;
    },
    async getDashboardByName({ state }, payload) {
      const dashboard = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-dashboard-by-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (dashboard.status === 200) {
        return dashboard.data;
      }
      return false;
    },
    async getPermissionByName({ state }, payload) {
      const permission = await axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/get-permission-by-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (permission.status === 200) {
        return permission.data;
      }
      return false;
    },
    async createRecord({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/${state.user.userId}/create-record`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      } else { return false;}
    },
    async updateRecord({ state, commit }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/update-record`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      } else { return false;}
    },
    async getAllRecords({ state }) {
      const records = await axios({
        method: 'get',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-all-records`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    /**
     * @param state
     * @param payload { String: object }
     * @returns {Promise<boolean|any>}
     */
    async getRecordsByObject({ state }, payload) {
      const records = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-records-by-object`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    async getRecordsForList({ state }, payload) {
      const records = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-records-for-list`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    async getRecordByObjectAndField({ state }, payload) {
      const records = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-record-by-object-and-field`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    async getRecordByObjectID({ state }, payload) {
      const records = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-record-by-objectID`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    async getRecordsByObjectWithFilter({ state }, payload) {
      const records = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-records-by-object-with-filter`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    async getRecordByName({ state }, payload) {
      const records = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-record-by-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    async getSummaryByObject({ state }, payload) {
      const records = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/get-summary-by-object`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (records.status === 200) {
        return records.data;
      }
      return false;
    },
    async upsertPermission({ state, commit }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/admin/${state.user.userId}/update-permission`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      } else { return false;}
    },
    async getAllDashboardPermission({ state }) {
      const permissions = await axios({
        method: 'get',
        url: `${BASE_API_URL}/user/${state.user.userId}/get-all-dashboard-permission`,
        headers: authHeader(),
        withCredentials: true,
      });
      if (permissions.status === 200) {
        return permissions.data;
      }
      return false;
    },
    async deletePermissionByName({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/designer/${state.user.userId}/delete-permission-by-name`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async runProcess({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/process/run`,
        headers: authHeader(),
        data: payload,
        withCredentials: true,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    //converge pay api
    async postSessionToken({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/payments/getSessionToken`,
        headers: authHeader(),
        data: payload,
      });
      if (res.status === 200) {
        return res.data;
      }
    },
    async postHostedPaymentPage({ state }, payload) {
      const res = await axios({
        method: 'post',
        url: `${BASE_API_URL}/payments/startTransaction`,
        headers: authHeader(),
        data: payload,
      });
      if (res.status === 200) {
        return res.data;
      }
    },

  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.user !== null && state.user.jwtToken !== null;
    },
    token(state) {
      return state.token;
    },
    isAdmin(state) {
      return state.user !== null && state.user.role === 'Admin';
    },
    isUser(state) {
      return state.user !== null && state.user.role === 'User';
    },
    isDesigner(state) {
      return state.user !== null && state.user.role === 'Designer';
    },
    acceptedTerms(state) {
      if (state.user) {
        return state.user.acceptedTerms;
      }
    },
  },
});

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        // logout();
        // location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    headers: authHeader(),

    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data, // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function putData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: authHeader({ 'Content-type': 'application/json' }),
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data, // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

let alertShown = false;

axios.interceptors.response.use((response) => {
    if (response.headers.newauthheader) {
      const jwtToken = response.headers.newauthheader.split(' ')[1];
      store.commit('updateJwtToken', jwtToken);
    }
    return response;
  }, async error => {
    if (error && error.response && error.response.status === 440) {
      if (!alertShown) {
        alertShown = true;
        // Your custom logic for handling a token expiration error
        await store.dispatch('logout', 'logout');
        alert('your session has expired. please log back in.');
        window.location.replace(`${process.env.WEBPACK_PUBLIC_URL || 'taxdollar.ca'}/sign_in`);
        setTimeout(() => {
          alertShown = false;
        }, 60 * 60 * 1000);
      }
    }
  },
);
