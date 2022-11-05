<template>
  <div class="grey lighten-4">
    <v-container fluid>
      <v-layout>
        <v-flex lg4 offset-lg4 offset-sm3 offset-xs1 sm6 xs10>
          <v-card style="padding: 10px; ">
            <div class="subheading red--text mt-4 mb-4" style="textAlign: center;">
              SIGN UP
            </div>
            <form ref="signUpForm" @submit.prevent="onSubmit">
              <div>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="firstName" :rules="[rules.required]"
                                class="mb-3" label="First Name" required>
                  </v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="lastName" :rules="[rules.required]"
                                class="mb-3" label="Last Name" required>
                  </v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <VuePhoneNumberInput v-model="phoneNumber" label="Phone Number"
                                       color="red" no-validator-state required
                                       :no-country-selector="true" :no-example="true"/>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <address-field v-model="address" class="mb-3" label="Address" :required="true" />
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="email" :rules="[rules.required, rules.email]"
                                class="mb-3" label="E-mail" required></v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="password"
                                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                :rules="[rules.required, rules.min]"
                                :type="show1 ? 'text' : 'password'"
                                class="mb-3"
                                counter hint="At least 8 characters" label="Password"
                                name="input-10-1" required @click:append="show1 = !show1"
                  ></v-text-field>
                </v-flex>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="confirmPassword"
                                :append-icon="show2 ? 'visibility_off' : 'visibility'"
                                :rules="[rules.required, rules.min]"
                                :type="show2 ? 'text' : 'password'"
                                class="mb-3"
                                counter hint="At least 8 characters" label="Confirm Password"
                                name="input-10-1" required @click:append="show2 = !show2"
                  ></v-text-field>
                  <div>
                    <v-dialog v-model="acceptedTerms">
                      <template v-slot:activator="{ on, attrs }">
                        <v-row>
                          <v-checkbox v-model="checkbox"
                                      :rules="[rules.required]"
                                      color="red" required></v-checkbox>
                          <a style="padding-top: 20px;" href="javascript:void(0)" v-bind="attrs"
                             v-on="on">
                            Terms and Conditions
                          </a>
                        </v-row>
                      </template>
                      <v-card v-model="acceptedTerms" style="padding: 25px;">
                        <Terms></Terms>
                        <v-btn color="red darken-2 white--text"
                               @click="acceptedTerms = false">
                          Close
                        </v-btn>
                      </v-card>
                    </v-dialog>
                  </div>

                </v-flex>
                <v-flex>
                  <v-card-actions class="justify-center mb-3">
                    <v-btn type="submit" color="red" dark>SUBMIT</v-btn>
                    <template>
                      <div class="text-xs-center">
                        <v-dialog v-model="dialog" width="500">
                          <v-card>
                            <v-card-title class="headline red white--text" dark
                                          primary-title>Password Mismatch
                            </v-card-title>
                            <v-card-text>Your passwords don't match. Please try again.</v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="primary" flat @click="dialog = false">OK</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </div>
                    </template>
                  </v-card-actions>
                </v-flex>
                <v-flex>
                  <v-card-actions class="justify-center mb-3">
                    <template>
                      <div class="text-xs-center">
                        <v-dialog v-model="successDialog" width="500">
                          <v-card>
                            <v-card-title class="headline red white--text" dark
                                          primary-title> Signup Success!
                            </v-card-title>
                            <v-card-text>{{ this.successResponse[0] }}
                              <b>{{ this.successResponse[1] }}</b>
                            </v-card-text>
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
                <v-flex>
                  <v-card-actions class="justify-center mb-3">
                    <template>
                      <div class="text-xs-center">
                        <v-dialog v-model="failDialog" width="500">
                          <v-card>
                            <v-card-title class="headline red white--text" dark
                                          primary-title> Signup Failure
                            </v-card-title>
                            <v-card-text>{{ this.failResponse[0] }}
                              <b>{{ this.failResponse[1] }}</b>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="red white--text" flat @click="failDialog = false">
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
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import Terms from '../Users/terms';
import AddressField from '../fields/address-field';

export default {
  components: {
    Terms,
    AddressField,
    VuePhoneNumberInput,
  },
  data() {
    return {
      dialog: false,
      successDialog: false,
      failDialog: false,
      show1: false,
      show2: false,
      checkbox: false,
      email: '',
      password: '',
      acceptedTerms: false,
      address: '',
      fullName: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      confirmPassword: '',
      signupResponse: null,
      failResponse: ['', ''],
      successResponse: ['', ''],
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => ('The email and password you entered don\'t match'),
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
      },
    };
  },
  methods: {
    updateValue(value) {
      this.phoneNumber = value;
    },
    async onSubmit() {
      const formData = {
        email: this.email,
        password: this.password,
        fullName: `${this.firstName} ${this.lastName}`,
        confirmPassword: this.confirmPassword,
        phoneNumber: this.phoneNumber,
        checkbox: this.checkbox,
        address: this.address,
      };
      if (this.confirmPassword === this.password) {
        const signupResponse = await this.$store.dispatch('signUp', {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: `${this.firstName}`,
          lastName: `${this.lastName}`,
          phoneNumber: formData.phoneNumber,
          acceptedTerms: formData.checkbox,
          address: this.address,
        });
        if (signupResponse.success) {
          this.successResponse = signupResponse.message;
          this.successDialog = true;
        } else {
          this.failResponse = signupResponse.message;
          this.failDialog = true;
        }
        // clear fields.
      } else {
        this.dialog = true;
      }
    },
    signUpValidate() {
      if (this.$refs.signUpForm.validate()) {
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped>
.my-button {
  align-self: center;
}
</style>
