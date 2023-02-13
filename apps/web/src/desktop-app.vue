<template>
  <div>
    <!-- Top app bar for desktop -->
    <v-app-bar class="white red--text hidden-sm-and-down" max-height="64px" clipped-left app>
      <v-app-bar-nav-icon @click.native.stop="showSideNav = !showSideNav"/>
      <v-app-bar-title>
        <router-link style="cursor: pointer" tag="span" to="/"/>
      </v-app-bar-title>
      <v-toolbar-items v-if="!auth" class="hidden-sm-and-down">
        <v-btn to="/sign_in" data-test="sign-in-btn-app-bar"
               style="position: absolute; right: 0"
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
      color="red darken-4"
      class="justify-center pl-0 hidden-sm-and-down"
      app fixed style="z-index: 5">
      <v-spacer></v-spacer>
      <div class="white--text">
        &copy; Copyright {{ new Date().getFullYear() }} Tax Dollar Inc. All rights reserved.
      </div>
    </v-footer>
    <!-- Nav drawer for desktop-->
    <div class="hidden-sm-and-down">
      <v-layout>
        <v-row>
          <v-col cols="2" v-if="showSideNav">
            <v-navigation-drawer v-if="(auth) && showSideNav"
                                 v-model="sideNav" :hide-overlay="true" permanent
                                 clipped app mobile-break-point="960" style="margin-bottom: 35px;
                         margin-top: 4px;">
              <v-list v-if="auth && !designer">
                <v-list-item v-for="(item, i) in  $store.state.sideNavItems" :key="i"
                             @click="routeItems(item)"
                             active-color="red--text" router color="red">
                  <v-list-item-content>{{ item.label }}</v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list v-if="auth && designer">
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
              </v-list>
            </v-navigation-drawer>
          </v-col>
          <v-col :cols="auth ? 10 : 12" :offset="showSideNav ? 2 : 0" >
            <main style="padding-top: 50px; background-color: #fff">
              <div>
                <breadcrumbs />
              </div>
              <router-view :key="$route.fullPath" />
            </main>
          </v-col>
        </v-row>
      </v-layout>
    </div>
    <div v-if="showAccountCard" class="hidden-sm-and-down"
         :style="{ position: 'absolute', top: 0, right:0, marginTop: '76px',
           marginRight: '24px'}">
      <account-card @hideAccountCard="showAccountCard = false"/>
    </div>
  </div>
</template>

<script>
import AccountCard from './components/Users/account-card';
import Breadcrumbs from './components/breadcrumbs';

export default {
  components: {
    AccountCard,
    Breadcrumbs,
  },
  data() {
    return {
      sideNav: true,
      showSideNav: false,
      showAccountCard: false,
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
    };
  },
  computed: {
    auth() {
      return this.$store.getters.isAuthenticated;
    },
    designer() {
      return this.$store.getters.isDesigner;
    },
  },
  methods: {
    async routeItems(item) {
      const design = await this.$store.dispatch('getDesignByName', {
        name: item.name,
      });
      if (item.type === 'dashboard') {
        await this.$router.push({
          name: 'DashboardRead',
          params: { designName: item.name },
        });
      } else if (item.type === 'screen') {
        await this.$router.replace({
          name: 'StudioRead',
          params: { design, name: item.name },
        });
      }
    },
  },
};

</script>
