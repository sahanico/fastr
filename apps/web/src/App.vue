<template>
  <v-app style="background-color: #fff">
    <!-- Mobile -->
    <MobileApp />
    <!-- Desktop -->
    <DesktopApp />
    <template>
      <v-dialog v-model="termsDialog" :persistent="!acceptedTerms">
        <div>
          <v-card style="padding:25px;">
            <Terms></Terms>
            <v-btn color="red darken-2 white--text" type="button"
                   @click="acceptTerms()">ACCEPT
            </v-btn>
          </v-card>
        </div>
      </v-dialog>
    </template>
  </v-app>
</template>

<script>
import _ from 'underscore';
import AccountCard from './components/Users/account-card';
import Terms from './components/Users/terms';
import MobileApp from './mobile-app';
import DesktopApp from './desktop-app';

export default {
  title: 'Taxdollar',
  name: 'App',
  components: {
    DesktopApp,
    MobileApp,
    AccountCard,
    Terms,
  },
  data() {
    return {
      termsDialog: false,
      acceptedTerms: false,
    };
  },
  methods: {
    async acceptTerms() {
      this.termsDialog = false;
      await this.$store.commit('updateAcceptedTerms');
      const acceptedTermsUser = await this.$store.dispatch('updateUserTermsAndConditions', {
        acceptedTerms: 'true',
      });
      if (acceptedTermsUser) {
        await this.$router.push('/dashboards/read/home_dashboard');
      }
    },
    async authenticate() {
      if (this.$store.state.user.role === 'Designer') {
        await this.authenticateDesigner();
      } else if (this.$store.state.user.role === 'Admin') {
        await this.authenticateAdmin();
      } else if (this.$store.state.user.role === 'User') {
        await this.authenticateUser();
      }
    },
    async authenticateAdmin() {
      this.$store.commit('clearSideNav');
      const permissions = await this.$store.dispatch('getAllDashboardPermission');
      const designs = await this.$store.dispatch('getAllDesigns');
      _.each(permissions, (permission) => {
        const design = _.findWhere(designs, { name: permission.name });
        if (permission.admins !== undefined) {
          const adminUserIds = Object.values(permission.admins);
          if (permission.admins === 'all-admins') {
            this.$store.state.sideNavItems.push({
              name: design.name,
              type: design.type,
              label: design.label,
              icon: design.icon || '',
            });
          } else if (adminUserIds.includes(this.user.userId)) {
            this.$store.state.sideNavItems.push({
              name: design.name,
              type: design.type,
              label: design.label,
              icon: design.icon || '',
            });
          }
        }
      });
      if (this.$router.currentRoute.path === '/sign_in') {
        await this.$router.push('/dashboards/read/home_dashboard');
      }
    },
    authenticateDesigner() {
      this.$store.state.sideNavItems = [
        { title: 'Forms', link: '/forms/list' },
        { title: 'Lists', link: '/lists/list' },
        { title: 'Screens', link: '/dashboards/list' },
        { title: 'Workflows', link: '/workflows/list' },
        { title: 'Processes', link: '/processes/list' },
        { title: 'Requests', link: '/requests/list' },
        { title: 'Buttons', link: '/buttons/list' },
        { title: 'Filters', link: '/filters/list' },
        { title: 'Actions', link: '/actions/list' },
        { title: 'Events', link: '/events/list' },
        { title: 'Charts', link: '/charts/list' },
        { title: 'Points', link: '/points/list' },
        { title: 'Tabs', link: '/tabs/list' },
      ];
    },
    async authenticateUser() {
      this.$store.commit('clearSideNav');
      const permissions = await this.$store.dispatch('getAllDashboardPermission');
      const designs = await this.$store.dispatch('getAllDesigns');
      const userGroups = await this.$store.dispatch('getUserGroups');
      _.each(permissions, (permission) => {
        const design = _.findWhere(designs, { name: permission.name });
        if (permission.users !== undefined) {
          const userUserIds = Object.values(permission.users);
          if (permission.users === 'all-users') {
            this.$store.state.sideNavItems.push({
              name: design.name,
              type: design.type,
              label: design.label,
              icon: design.icon,
            });
          } else if (userUserIds.includes(this.state.user.userId)) {
            this.$store.state.sideNavItems.push({
              name: design.name,
              type: design.type,
              label: design.label,
              icon: design.icon,
            });
          }
        } else if (permission.userGroups !== undefined) {
          const tempGroupUsers = [];
          const tempIds = [];
          const groupIds = Object.values(permission.userGroups);
          _.each(groupIds, (groupId) => {
            _.each(userGroups, (group) => {
              if (groupId === group.id) {
                tempGroupUsers.push(group.users);
              }
            });
          });
          _.each(tempGroupUsers, (group) => {
            _.each(group, (user) => {
              tempIds.push(user.userId);
            });
          });
          if (tempIds.includes(this.state.user.userId)) {
            this.$store.state.sideNavItems.push({
              name: design.name,
              type: design.type,
              label: design.label,
              icon: design.icon,
            });
          }
        }
      });
      if (this.$router.currentRoute.path === '/sign_in') {
        await this.$router.push('/dashboards/read/home_dashboard');
      }
    },
  },
  computed: {
    auth() {
      return this.$store.getters.isAuthenticated;
    },
    admin() {
      return this.$store.getters.isAdmin;
    },
    designer() {
      return this.$store.getters.isDesigner;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  async created() {
    if (this.auth) {
      await this.authenticate();
    }
  },
  watch: {
    async auth(val) {
      if (val) {
        await this.authenticate();
      }
    },
  },
};


</script>

<style scoped>

.my-toolbar >>> .v-toolbar__content {
  padding: 0;
}

</style>

