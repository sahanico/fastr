<template>
  <div class="grey lighten-4 pt-5">
    <v-layout style="margin-top: 68px">
      <v-flex lg4 offset-lg4 offset-lx4 offset-sm3 offset-xs1 sm6 xl4 xs10>
        <v-card style="marginBottom:350px">
          <v-container>
          </v-container>
          <form ref="signInForm" lazy-validation @submit.prevent="onSubmit">
            <v-container fill-height>
              <v-layout>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="email" data-test="email-field"
                                :rules="[rules.required, rules.email]" label="E-mail"
                                required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container fill-height>
              <v-layout>
                <v-flex offset-xs2 xs8>
                  <v-text-field v-model="password" data-test="password-field"
                                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                :rules="[rules.required, rules.min]"
                                :type="show1 ? 'text' : 'password'"
                                counter hint="At least 8 characters" label="Password"
                                name="input-10-1" required @click:append="show1 = !show1"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container>
              <v-flex style="margin-bottom: 10px;">
                <v-card-actions class="justify-center">
                  <v-dialog v-model="termsDialog" :persistent="!acceptedTerms">
                    <template v-slot:activator="{ on }">
                      <v-btn class="white--text" color="red" type="button"
                             data-test="sign-in-btn" @click="onSubmit()">Sign in
                      </v-btn>
                    </template>
                    <div>
                      <v-card style="padding:25px;">
                        <Terms></Terms>
                        <v-btn color="red darken-2 white--text" type="button"
                               @click="acceptTerms()">ACCEPT
                        </v-btn>
                      </v-card>
                    </div>
                  </v-dialog>
                  <v-dialog v-model="failedLoginNotApprovedDialog" width="400">
                    <v-card>
                      <v-card-title class="headline red white--text" dark
                                    primary-title> Sign in Failed
                      </v-card-title>
                      <v-card-text>You cannot log in before an admin approves your account
                        .
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="black" text type="button"
                               @click="failedLoginNotApprovedDialog = false">Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="failedLoginNotemailVarifiedDialog" width="400">
                    <v-card>
                      <v-card-title class="headline red white--text" dark
                                    primary-title> Sign in Failed!
                      </v-card-title>
                      <v-card-text>You cannot log in before you verify your email.
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="black" text type="button"
                               @click="failedLoginNotemailVarifiedDialog = false">Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="failedLoginDialog" width="400">
                    <v-card>
                      <v-card-title class="headline red white--text" dark
                                    primary-title> Sign in Failed
                      </v-card-title>
                      <v-card-text>Failed to sign in. Username or password is incorrect
                        .
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="black" text type="button"
                               @click="failedLoginDialog = false">Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
              </v-flex>
              <v-flex>
                <v-card-actions class="justify-center">
                  <v-dialog v-model="forogtPasswordDialog" width="400">
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" color="red white--text"
                             text small>Forgot Password?
                      </v-btn>
                    </template>
                    <v-card>
                      <form ref="resetPasswordForm"
                            lazy-validation @submit.prevent="sendResetEmail">
                        <v-card-title class="headline">Forgot Password?</v-card-title>
                        <v-card-text>Please write your email and click reset password.
                          Check your junk mail if you have not received
                          a confirmation in a few minutes
                        </v-card-text>
                        <v-text-field v-model="forgotPasswordEmail"
                                      :rules="[rules.required, rules.email]"
                                      label="E-mail" required
                                      style="margin: 0px 20px 40px;"></v-text-field>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="black" text type="button"
                                 @click="forogtPasswordDialog = false">Close
                          </v-btn>
                          <v-btn class="white--text" color="red"
                                 type="submit">Reset Password
                          </v-btn>
                          <v-flex>
                            <v-card-actions class="justify-center mb-3">
                              <template>
                                <div class="text-xs-center">
                                  <v-dialog v-model="passResetSuccessDialog" width="500">
                                    <v-card>
                                      <v-card-title class="headline red white--text" dark
                                                    primary-title> Password reset mail send!
                                      </v-card-title>
                                      <v-card-text> Please check your email for a password reset
                                        link!
                                      </v-card-text>
                                      <v-divider></v-divider>
                                      <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red white--text" flat
                                               @click="passResetSuccessDialog = false">
                                          OK
                                        </v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>
                                  <v-dialog v-model="failedResetPassword" width="400">
                                    <v-card>
                                      <v-card-title class="headline red white--text" dark
                                                    primary-title> Password reset Failed!
                                      </v-card-title>
                                      <v-card-text>Email address does not exist. please try again.
                                      </v-card-text>
                                      <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="black" text type="button"
                                               @click="failedResetPassword = false">Close
                                        </v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </v-dialog>
                                </div>
                              </template>
                            </v-card-actions>
                          </v-flex>
                        </v-card-actions>
                      </form>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
              </v-flex>
              <v-flex>
                <v-card-actions type="button" class="justify-center">
                  <v-btn @click="signUp()" color="red white--text" data-test="sign-up-btn"
                         text small> Sign Up
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-container>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Terms from '../Users/terms';

export default {
  components: {
    Terms,
  },
  data() {
    return {
      passResetSuccessDialog: false,
      forogtPasswordDialog: false,
      failedLoginDialog: false,
      failedLoginNotApprovedDialog: false,
      failedLoginNotemailVarifiedDialog: false,
      termsDialog: false,
      failedResetPassword: false,
      forgotPasswordEmail: '',
      show1: false,
      show2: false,
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
      acceptedTerms: true,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => ('The email and password you entered don\'t match'),
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
      },
      resetPasswordRules: {
        required: value => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
      },
    };
  },
  methods: {
    signUp() {
      this.$router.push('/sign_up');
    },
    async acceptTerms() {
      this.termsDialog = false;
      const acceptedTermsUser = await this.$store.dispatch('updateUserTermsAndConditions', {
        acceptedTerms: true,
      });
      if (acceptedTermsUser) {
        await this.$router.push('/signed_in');
      }
    },
    async onSubmit() {
      const formData = {
        userId: this.userId,
        email: this.email,
        password: this.password,
        fullName: this.fullName,
        confirmPassword: this.confirmPassword,
        acceptedTerms: this.acceptedTerms,
      };
      const signedInUser = await this.$store.dispatch('logIn', {
        email: formData.email, password: formData.password,
      });
      if (signedInUser === 'Username or password is incorrect') {
        this.failedLoginDialog = true;
        this.$nextTick(() => {
          this.termsDialog = false;
        });
      }
      this.acceptedTerms = signedInUser.acceptedTerms;
      this.termsDialog = !signedInUser.acceptedTerms;
      if (signedInUser.acceptedTerms === 'false') {
        this.termsDialog = true;
      }
      if (signedInUser === 'not approved') {
        this.failedLoginNotApprovedDialog = true;
        this.$nextTick(() => {
          this.termsDialog = false;
        });
      }
      if (signedInUser === 'not verified') {
        this.failedLoginNotemailVarifiedDialog = true;
        this.$nextTick(() => {
          this.termsDialog = false;
        });
      }
      this.$store.commit('system', { user: signedInUser });
      const now = new Date();
      const expirationDate = new Date(now.getTime() + (15 * 1000 * 60));
      localStorage.setItem('user', JSON.stringify(signedInUser));
      localStorage.setItem('expirationDate', expirationDate.toString());

      const signedInAccountMember = await this.$store.dispatch('getRecordByObjectAndField', {
        object: 'account_member',
        field: 'user',
        value: signedInUser.userId,
      });

      this.$store.commit('system', { account_member: signedInAccountMember });
      const signedInAccount = await this.$store.dispatch('getRecordByObjectAndField', {
        object: 'account',
        field: 'account_member',
        // eslint-disable-next-line no-underscore-dangle
        value: signedInAccountMember._id,
      });
      this.$store.commit('system', { account: signedInAccount });
      localStorage.setItem('system', JSON.stringify({
        user: signedInUser,
        account_member: signedInAccountMember,
        account: signedInAccount,
      }));
    },
    async sendResetEmail() {
      const emailAddress = this.forgotPasswordEmail;
      const emailExists = await this.$store.dispatch('resetPassword', {
        email: emailAddress,
      });
      if (emailExists === 'reset-failed') {
        this.failedResetPassword = true;
      } else if (emailExists === 'reset-successful') {
        this.passResetSuccessDialog = true;
      }
      return true;
    },
    resetPasswordValidate() {
      if (this.$refs.resetPasswordForm.validate()) {
        this.snackbar = true;
      }
    },
    signInValidate() {
      if (this.$refs.signInForm.validate()) {
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

