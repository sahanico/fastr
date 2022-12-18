<template>
  <v-app style="background-color: #f5f5f5">
    <!-- Mobile -->
    <template>
      <!-- Account Card for mobile-->
      <v-container>
        <account-card class="hidden-md-and-up" v-if="showAccountCard"/>
      </v-container>
      <!-- Overflow Card for mobile-->
      <v-card v-if="showMobileOverflowCard"
              style="position: fixed; bottom: 56px; right: 0; z-index: 2"
              flat>
        <v-list class="white red--text">
          <v-list-item v-for="(item, index) in $store.state.sideNavItems"
                       :to="`${$route.path === '/'
                      ? 'dashboards/read/' + $store.state.sideNavItems[index].name
                       : $store.state.sideNavItems[index].name}`"
                       v-if="index > 1"
                       @click="showMobileOverflowCard = !showMobileOverflowCard"
                       :key="index" router>
            <v-list-item-content align="right">
              <v-list-item-title v-text="item.label"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-{{ item.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-card>
      <!-- Main router for mobile -->
      <main style="paddingTop: 44px"  class="hidden-md-and-up">
        <router-view  v-if="showRouterView" :key="$route.fullPath"></router-view>
      </main>
      <!-- Top app bar for mobile -->
      <v-app-bar class="red white--text hidden-md-and-up" style="position: fixed; top: 0"
                 clipped-left dark>
<!--        <v-toolbar-items>-->
<!--          <v-btn color="white" dark text type="button" style="position: absolute; left: 0"-->
<!--                 @click="() => {this.$router.back()}"><v-icon>mdi-arrow-left</v-icon></v-btn>-->
<!--        </v-toolbar-items>-->
        <v-spacer></v-spacer>
        <v-toolbar-title>Tax Dollar</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-if="auth">
          <v-btn color="white" text dark type="button" style="position: absolute; right: 0"
                 @click="showAccountCard = !showAccountCard"><v-icon>mdi-account</v-icon></v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <!-- Bottom nav for mobile -->
      <v-bottom-navigation
        class="hidden-md-and-up"
        style="position: fixed; bottom: 0"
        v-model="selectedBottomNav"
        background-color="white"
        color="red"
        grow>
        <v-btn router to="/">
          <span>Home</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn v-if="!auth" router to="/sign_in">
          <span>Sign In</span>
          <v-icon>mdi-lock</v-icon>
        </v-btn>
        <v-btn v-if="auth && $store.state.sideNavItems.length >= 4"
               :to="`${$route.path === '/'
              ? 'dashboards/read/' + $store.state.sideNavItems[0].name
               : $store.state.sideNavItems[0].name}`"
               @click="showMobileOverflowCard = false">
          <span>{{ $store.state.sideNavItems[0].label }}</span>
          <v-icon>mdi-{{ $store.state.sideNavItems[0].icon }}</v-icon>
        </v-btn>
        <v-btn v-if="auth && $store.state.sideNavItems.length >= 4"
               :to="`${$route.path === '/'
              ? 'dashboards/read/' + $store.state.sideNavItems[1].name
               : $store.state.sideNavItems[1].name}`"
               @click="showMobileOverflowCard = false">
          <span>{{ $store.state.sideNavItems[1].label }}</span>
          <v-icon>mdi-{{ $store.state.sideNavItems[1].icon }}</v-icon>
        </v-btn>
        <v-btn v-if="auth && $store.state.sideNavItems.length >= 4" @click="showMobileOverflowCard = !showMobileOverflowCard">
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-btn>
        <v-btn v-if="auth && $store.state.sideNavItems.length < 4"
               v-for="(item, index) in $store.state.sideNavItems"
               :to="`${$route.path === '/' ? 'dashboards/read/' + item.name : item.name}`"
               :key="index" router>
          <span>{{ item.label }}</span>
          <v-icon>mdi-{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </template>

    <!-- Desktop -->
    <template>
      <!-- Top app bar for desktop -->
      <v-app-bar class="white red--text hidden-sm-and-down" max-height="64px" clipped-left
                 app>
        <v-app-bar-nav-icon @click.native.stop="showSideNav = !showSideNav"/>
        <v-app-bar-title>
          <router-link style="cursor: pointer" tag="span" to="/"/>
        </v-app-bar-title>
<!--        <v-app-bar-title>-->
<!--          <v-container>-->
<!--            <v-row>-->
<!--              <v-col cols="1">-->
<!--                <v-btn color="red darken-2" text type="button" @click="() => {this.$router.back()}">Back</v-btn>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-container>-->
<!--        </v-app-bar-title>-->
        <v-toolbar-items v-if="!auth" class="hidden-sm-and-down">
          <v-btn to="/sign_in" data-test="sign-in-btn-app-bar"
                 class="white red--text elevation-0 btn-sign-in" text router>
            Sign In
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-if="auth" class="hidden-sm-and-down">
          <v-btn style="position: absolute; right: 0"
                 class="white red--text" elevation="0" @click="showAccountCard = !showAccountCard">
            Account
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <!-- Footer for desktop-->
      <v-footer
        color="red darken-4" class="justify-center pl-0 hidden-sm-and-down" app fixed>
        <v-spacer></v-spacer>
        <div class="footer">
          &copy; Copyright {{ new Date().getFullYear() }} Sahani Corp. All rights reserved.
        </div>
      </v-footer>
      <!-- Nav drawer for desktop-->
      <div class="hidden-sm-and-down">
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
            <v-col cols="9" offset="3">
              <main :style="styleMain">
                <router-view :key="$route.fullPath" />
              </main>
            </v-col>
          </v-row>
        </v-layout>
      </div>
    </template>

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


    <!--    <div v-if="auth">-->
    <div v-if="showAccountCard" class="hidden-sm-and-down"
         :style="{ position: 'absolute', top: 0, right:0, marginTop: '76px',
           marginRight: '24px'}">
      <account-card></account-card>
    </div>
  </v-app>
</template>

<script>
import _ from 'underscore';
import AccountCard from './components/Users/account-card';
import Terms from './components/Users/terms';

export default {
  title: 'Taxdollar',
  name: 'App',
  components: {
    AccountCard,
    Terms
  },
  data() {
    return {
      selectedBottomNav: '',
      sideNav: false,
      showAccountCard: false,
      showMobileOverflowCard: false,
      showSideNav: true,
      termsDialog: false,
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
      acceptedTerms: false
    };
  },
  methods: {
    async acceptTerms() {
      this.termsDialog = false;
      await this.$store.commit('updateAcceptedTerms')
      const acceptedTermsUser = await this.$store.dispatch('updateUserTermsAndConditions', {
        acceptedTerms: 'true',
      });
      if (acceptedTermsUser) {
        await this.$router.push('/signed_in');
      }
    },
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
          const designs = await this.$store.dispatch('getAllDesigns');
          _.each(permissions, (permission) => {
            const design = _.findWhere(designs, { name: permission.name});
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
            await this.$router.push('/');
          }
        }
        else if (this.$store.state.user.role === 'User') {
          const permissions = await this.$store.dispatch('getAllDashboardPermission');
          const designs = await this.$store.dispatch('getAllDesigns');
          const userGroups = await this.$store.dispatch('getUserGroups');
          _.each(permissions, (permission) => {
            const design = _.findWhere(designs, { name: permission.name});
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
            await this.$router.push('/');
          }
        }
      }
    },
  },
  computed: {
    showTermsDialog() {
      if (this.$store.state.system.user && this.$store.state.system.user.acceptedTerms === 'false') {
        this.termsDialog = true;
      } else {
        this.acceptedTerms = false;
      }
    },
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
    user() {
      return this.$store.getters.user;
    },
    showRouterView() {
      // Return false if the screen is medium-sized or larger
      return !this.$vuetify.breakpoint.mdAndUp;
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
.my-toolbar >>> .v-toolbar__content {
  padding: 0;
}
.setColor {
  color: red;
}

.footer {
  width: 100%;
  color: white;
  text-indent: 10px;
}

</style>

