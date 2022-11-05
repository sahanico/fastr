<template>
  <div class="grey lighten-4">
    <v-container fluid>
      <v-layout>
        <v-flex lg4 offset-lg4 offset-sm3 offset-xs1 sm6 xs10>
          <v-card style="padding: 10px; ">
            <div class="subheading red--text mt-4 mb-4" strong style="textAlign: center; ">
              Update Profile
            </div>
            <form ref="signUpForm" lazy-validation @submit.prevent="onSubmit">
              <div>
                <v-flex offset-xs3 xs8>
                  <div v-if="(user.userImage === undefined) || (user.userImage === null)">
                    <v-list-item-avatar size="200">
                      <img src="../../assets/dp.png"/>
                    </v-list-item-avatar>
                  </div>
                  <div v-if="user.userImage !== undefined">
                    <v-list-item-avatar size="200">
                    <v-img style="border-radius: 50%" :src="user.userImage"></v-img>
                      </v-list-item-avatar>
                  </div>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-file-input @change="encodeImage" v-model="user.userImage"
                                  label="Change Picture"
                                  accept="image/png, image/jpeg, image/svg">
                    </v-file-input>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="user.name" :rules="[rules.required]"
                                class="mb-3" label="Name" required>
                  </v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="user.phoneNumber" type="number"
                                :rules="[rules.required]"
                                class="mb-3" label="Phone Number" required>
                  </v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="user.email" disabled
                                class="mb-3" label="E-mail" required></v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="user.addressLine1"
                                class="mb-3" label="Address Line 1"></v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="user.addressLine2"
                                class="mb-3" label="Address Line 2"></v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="user.postalCode"
                                class="mb-3" label="Postal Code"></v-text-field>
                </v-flex>

                <v-flex>
                  <v-card-actions class="justify-center mb-3">
                    <v-btn type="submit" color="red" dark>SUBMIT</v-btn>

                  </v-card-actions>
                </v-flex>
                <v-flex>
                  <v-card-actions class="justify-center mb-3">
                    <template>
                      <div class="text-xs-center">
                        <v-dialog v-model="successDialog" width="500">
                          <v-card>
                            <v-card-title class="headline red white--text" dark
                                          primary-title> Update Successful
                            </v-card-title>
                            <v-card-text> Your profile has been updated !</v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="red white--text" flat @click="successDialog = false">
                                OK
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </template>
                  </v-card-actions>
                </v-flex>
              </div>
            </form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Terms from '../Users/terms';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  components: {
    Terms,
  },
  data() {
    return {
      dialog: false,
      successDialog: false,
      failDialog: false,
      show1: false,
      show2: false,
      checkbox: false,
      postalCode: '',
      user: {
        addressLine1: '',
        addressLine2: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        userImage: null,
      },
      url: null,
      rules: {
        required: value => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
      },
    };
  },
  methods: {
    async onSubmit() {
      const formData = {
        name: this.user.name,
        phoneNumber: this.user.phoneNumber,
        addressLine1: this.user.addressLine1,
        addressLine2: this.user.addressLine2,
        postalCode: this.user.postalCode,
        userImage: this.user.userImage,

      };
      await this.$store.dispatch('updateUserProfile', formData);
      this.successDialog = true;
    },
    async encodeImage(file) {
      this.url = URL.createObjectURL(this.user.userImage);
      const data = await getBase64(file);
      this.user.userImage = data;
    },
  },
  async created() {
    this.user = this.$store.getters.user;
  },
};
</script>

<style scoped>
.my-button {
  align-self: center;
}
</style>
