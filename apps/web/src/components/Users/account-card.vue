<template>
  <div>
    <v-card width="400" min-height="440" rounded>
      <div>
        <v-flex offset-xs4 xs8 style="margin-top: 12px;padding-top: 12px;">
          <v-list-item color="red">
            <div v-if="(user) && ((user.userImage === undefined) || (user.userImage === null))">
              <v-list-item-avatar size="100">
                <img src="../../assets/dp.png"/>
              </v-list-item-avatar>
            </div>
            <div v-if="user && user.userImage !== undefined">
              <v-list-item-avatar size="100">
                <img :src="user.userImage">
              </v-list-item-avatar>
            </div>

          </v-list-item>
        </v-flex>
      </div>
      <div class="text-center">
        <strong style="font-size: 20px">{{ user ? user.name : '' }}</strong> <br>
        {{ user ? user.email : '' }} <br>{{ user ? user.phoneNumber : ''  }} <br>{{
         user ? user.addressLine1 : ''
        }} <br>
        <br>
        <v-divider></v-divider>
        <br>
        <v-btn elevation="0" color="white red--text" @click="myProfile">Manage your account</v-btn>
        <br> <br>
        <v-divider></v-divider>
        <br>
        <v-btn elevation="0" color="white red--text" @click="logOut">LOG
          OUT</v-btn>
        <br>
        <br>
        <v-divider></v-divider>
        <br>
        <v-row>
          <v-col>
            <div class="text--center">
              <v-dialog v-model="privacyDialog">
                <template v-slot:activator="{ on, attrs }">
                  <a style="padding-left: 20px; color: red" href="javascript:void(0)"
                     v-bind="attrs" v-on="on">Privacy Policy
                  </a>
                </template>
                <v-card v-model="privacyDialog" style="padding: 25px;">
                  <Privacy></Privacy>
                  <v-btn color="red darken-2 white--text" @click="privacyDialog = false">Close
                  </v-btn>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
          <v-col>
            <div class="text--center">
              <v-dialog v-model="termsDialog">
                <template v-slot:activator="{ on, attrs }">
                  <a style="padding-right: 20px;color: red" href="javascript:void(0)"
                     v-bind="attrs" v-on="on">Terms and Conditions
                  </a>
                </template>
                <v-card v-model="termsDialog" style="padding: 25px;">
                  <Terms></Terms>
                  <v-btn color="red darken-2 white--text" @click="termsDialog = false">Close
                  </v-btn>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>
        <br>
      </div>
    </v-card>
  </div>
</template>
<script>
import Terms from './terms';
import Privacy from './privacy_policy';

export default {
  components: {
    Terms,
    Privacy,
  },
  data() {
    return {
      termsDialog: false,
      privacyDialog: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    myProfile() {
      this.$router.push('/users/user_profile');
    },
    logOut() {
      this.$router.push('/log_out');
    },
  },
};
</script>
