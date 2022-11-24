<template>
  <v-app style="background-color: #f5f5f5">
    <v-app-bar class="white red--text" max-height="64px" clipped-left
               app>
      <v-app-bar-nav-icon @click.native.stop="showSideNav = !showSideNav"/>
      <v-app-bar-title>
        <router-link style="cursor: pointer" tag="span" to="/"/>
      </v-app-bar-title>
      <v-app-bar-title>
      <v-container>
        <v-row>
          <v-col cols="1">
            <v-btn color="red darken-2" text type="button" @click="() => {this.$router.back()}">Back</v-btn>
          </v-col>
        </v-row>
      </v-container>
      </v-app-bar-title>
      <v-toolbar-items v-if="!auth" class="hidden-md-and-down">
        <v-btn to="/sign_in" data-test="sign-in-btn-app-bar"
               class="white red--text elevation-0 btn-sign-in" text router>
          Sign In
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="auth" class="hidden-md-and-down">
        <v-btn class="white red--text" elevation="0" @click="showAccountCard = !showAccountCard">
          Account
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-footer
        color="red darken-4" class="justify-center pl-0" app fixed>
      <v-spacer></v-spacer>
      <div class="footer">
        &copy; Copyright {{ new Date().getFullYear() }} Sahani Corp. All rights reserved.
      </div>
    </v-footer>
    <!-- navigation & main -->
    <div>
      <v-layout>
        <v-row>
          <v-col cols="12" sm="1" md="2"
                 v-if="showSideNav">
            <v-navigation-drawer v-if="(auth) && showSideNav"
                                 v-model="sideNav" :hide-overlay="true" permanent
                                 clipped app mobile-break-point="960" style="margin-bottom: 32px;
                         margin-top: 4px;">
              <v-list v-if="!auth" class="sideNavItems">
                <v-list-item v-for="(index, item) in $store.state.sideNavItems"
                             :key="item.title" :to="item.link"
                             active-color="red--text" router color="red">
                  <v-list-item-content
                    :data-test=`side-nav-${index}`
                  >{{ item.title }}</v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list v-if="auth && !designer" class="authenticatedSideNavItems">

                <!--         todo: color does not change to red on click-->
                <v-list-item v-for="(item, i) in  $store.state.sideNavItems" :key="i"
                             @click="routeItems(item)"
                             active-color="red--text" router color="red">
                  <v-list-item-content>{{ item.label }}</v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list v-if="auth && designer" class="designerSideNavItems">
                <v-list-item :to="'/objects/list'" value="true" color="red">
                  <v-list-item-title>Objects</v-list-item-title>
                </v-list-item>
                <v-list-item :to="'/Users/list'" value="true" color="red">
                  <v-list-item-title>Users</v-list-item-title>
                </v-list-item>
                <v-list-item :to="'/studio/list'" value="true" color="red">
                  <v-list-item-title>Studio</v-list-item-title>
                </v-list-item>
                <v-list-group value="true" color="red">
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title class="red--text">Designs</v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item style="margin-left: 56px "
                               v-for="(item, i) in designItems"
                               :key="i" :to="item.link" color="red">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list-group>
                <!--        </v-list-group>-->
              </v-list>
            </v-navigation-drawer>
          </v-col>
          <v-col cols="12" sm="12" :md="showSideNav ? 10 : 12">
            <main :style="styleMain">
              <router-view :key="$route.fullPath"></router-view>
            </main>
          </v-col>
        </v-row>
      </v-layout>
    </div>

    <!--    <div v-if="auth">-->
    <div v-if="showAccountCard"
         :style="{ position: 'absolute', top: 0, right:0, marginTop: '76px',
           marginRight: '24px'}">
      <account-card></account-card>
    </div>
  </v-app>
</template>

<script>
import _ from 'underscore';
import AccountCard from './components/Users/account-card';

export default {
  title: 'Factor-e',
  name: 'App',
  components: {
    AccountCard,
  },
  data() {
    return {
      sideNav: false,
      showAccountCard: false,
      showSideNav: true,
      authenticatedSideNavItems: [],
      designerSideNavItems: [],
      designItems: [
        { title: 'Forms', link: '/forms/list' },
        { title: 'Lists', link: '/lists/list' },
        { title: 'Dashboards', link: '/dashboards/list' },
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
        { title: 'Calendars', link: '/calendars/list' },
      ],
      adminItems: [],
      userItems: [],
    };
  },
  methods: {
    myProfile() {
      this.$router.push('/users/user_profile');
    },
    async routeItems(item) {
      const design = await this.$store.dispatch('getDesignByName', {
        name: item.name,
      });
      if (item.type === 'dashboard') {
        await this.$router.push({
          name: 'DashboardRead',
          params: { name: item.name },
        });
      } else if (item.type === 'screen') {
        await this.$router.replace({
          name: 'StudioRead',
          params: { design, name: item.name },
        });
      }
    },
    async authenticateUser() {
      this.$store.commit('clearSideNav');
      if (this.$store.state.user) {
        if (this.$store.state.user.role === 'Designer') {
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
        }
        else if (this.$store.state.user.role === 'Admin') {
          const permissions = await this.$store.dispatch('getAllDashboardPermission');
          _.each(permissions, (permission) => {
            if (permission.admins !== undefined) {
              const adminUserIds = Object.values(permission.admins);
              if (permission.admins === 'all-admins') {
                this.$store.state.sideNavItems.push({
                  name: permission.name,
                  type: permission.type,
                  label: permission.label,
                });
              } else if (adminUserIds.includes(this.user.userId)) {
                this.$store.state.sideNavItems.push({
                  name: permission.name,
                  type: permission.type,
                  label: permission.label,
                });
              }
            }
          });
          if (this.$router.currentRoute.path === '/sign_in') {
            await this.$router.push('/admins/admin_panel');
          }
        }
        else if (this.$store.state.user.role === 'User') {
          const permissions = await this.$store.dispatch('getAllDashboardPermission');
          const userGroups = await this.$store.dispatch('getUserGroups');
          _.each(permissions, (permission) => {
            if (permission.users !== undefined) {
              const userUserIds = Object.values(permission.users);
              if (permission.users === 'all-users') {
                this.$store.state.sideNavItems.push({
                  name: permission.name,
                  type: permission.type,
                  label: permission.label,
                });
              } else if (userUserIds.includes(this.state.user.userId)) {
                this.$store.state.sideNavItems.push({
                  name: permission.name,
                  type: permission.type,
                  label: permission.label,
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
                  name: permission.name,
                  type: permission.type,
                  label: permission.label,
                });
              }
            }
          });
          if (this.$router.currentRoute.path === '/sign_in') {
            await this.$router.push('/signed_in');
          }
        }
      }
    },
  },
  computed: {
    styleMain() {
      const style = 'padding-top: 64px; background-color: #f5f5f5';
      // if (this.showSideNav) {
      //   style += '; padding-left: 256px; padding-bottom: 48px';
      // }
      return style;
    },
    auth() {
      return this.$store.getters.isAuthenticated;
    },
    admin() {
      return this.$store.getters.isAdmin;
    },
    isUser() {
      return this.$store.getters.isUser;
    },
    designer() {
      return this.$store.getters.isDesigner;
    },
    acceptedTerms() {
      return this.$store.getters.acceptedTerms;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  async created() {
    if (this.auth) {
      await this.authenticateUser();
    }
  },
  watch: {
    async auth(val) {
      if (val) {
        await this.authenticateUser();
      } else {
        this.showAccountCard = false;
        this.userItems = [];
        this.adminItems = [];
      }
    },
  },
};


</script>

<style scoped>

.setColor {
  color: red;
}

.footer {
  width: 100%;
  color: white;
  text-indent: 10px;
}

</style>

