<template>
  <div>
    <!-- Account Card for mobile-->
    <v-container>
      <account-card class="hidden-md-and-up" @hideAccountCard="showAccountCard = false"
                    style="position: fixed; right: 0; z-index: 5; top: 50px;"
                    v-if="showAccountCard"/>
    </v-container>
    <!-- Overflow Card for mobile-->
    <v-card v-if="showMobileOverflowCard"
            style="position: fixed; bottom: 56px; right: 0; z-index: 2"
            flat>
      <v-list class="white red--text">
        <v-list-item v-for="(item, index) in $store.state.sideNavItems"
                     v-if="index > 1"
                     @click="$router.push({
                      path: `${'/dashboards/read/' + $store.state.sideNavItems[index].name}`
                     }); showMobileOverflowCard = !showMobileOverflowCard"
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
      <v-spacer></v-spacer>
      <v-toolbar-title>Tax Dollar</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="auth">
        <v-btn color="white" text dark type="button" style="position: absolute; right: 0"
               @click="showAccountCard = !showAccountCard;">
          <v-icon>mdi-account</v-icon>
        </v-btn>
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
             @click="$router.push({
                      path: `${'/dashboards/read/' + $store.state.sideNavItems[0].name}`
                     }); showMobileOverflowCard = false">
        <span>{{ $store.state.sideNavItems[0].label }}</span>
        <v-icon>mdi-{{ $store.state.sideNavItems[0].icon }}</v-icon>
      </v-btn>
      <v-btn v-if="auth && $store.state.sideNavItems.length >= 4"
             @click="$router.push({
                      path: `${'/dashboards/read/' + $store.state.sideNavItems[1].name}`
                     }); showMobileOverflowCard = false">
        <span>{{ $store.state.sideNavItems[1].label }}</span>
        <v-icon>mdi-{{ $store.state.sideNavItems[1].icon }}</v-icon>
      </v-btn>
      <v-btn v-if="auth && $store.state.sideNavItems.length >= 4"
             @click="showMobileOverflowCard = !showMobileOverflowCard">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
      <v-btn v-if="auth && $store.state.sideNavItems.length < 4"
             v-for="(item, index) in $store.state.sideNavItems"
             @click="$router.push({
                      path: `${'/dashboards/read/' + $store.state.sideNavItems[index].name}`
                     }); showMobileOverflowCard = !showMobileOverflowCard"
             :key="index" router>
        <span>{{ item.label }}</span>
        <v-icon>mdi-{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import AccountCard from './components/Users/account-card';

export default {
  components: {
    AccountCard,
  },
  props: [''],
  data() {
    return {
      selectedBottomNav: '',
      showMobileOverflowCard: false,
      showAccountCard: false,
    };
  },
  computed: {
    showRouterView() {
      // Return false if the screen is medium-sized or larger
      return !this.$vuetify.breakpoint.mdAndUp;
    },
    auth() {
      return this.$store.getters.isAuthenticated;
    },
  },
};

</script>
