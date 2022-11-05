<template>
  <div class="grey lighten-4">
    <v-layout>
      <v-flex>
        <v-card class=" pt-5" color="grey lighten-4" style="paddingBottom:250px;">
          <div>
            <div class="headline red--text" strong style="textAlign: center; margin: 20px;">
              Welcome back {{ user.name }}<br>
              Your outstanding balance is ${{ user.balance.toFixed(2) }}<br>
              <a
                href='https://www.convergepay.com/hosted-payments?ssl_txn_auth_token=jMQU%2FW%2BWRuGAoqv4QwrlyAAAAXfAkCpM'
                style='color:#ff0000; font-size:18px; font-family:Trebuchet MS;
        font-weight:normal; text-decoration:underline; '>PAY ONLINE WITH CREDIT CARD</a>
            </div>
          </div>
          <v-flex offset-sm5 offset-xs2 sm2 xs8>
            <div class="mt-5">
              <v-card class="mb-4">
                <input ref="fileInput" style="display: none" type="file"
                       @change="onFileSelected" multiple>
                <div class="subheading red--text" @click="$refs.fileInput.click()"
                     style="textAlign: center; padding: 20px; cursor: pointer;">
                  Upload A Document
                </div>
              </v-card>
              <v-flex offset-sm3 offset-xs2 sm6 xs8>
                <v-progress-linear v-show="uploading" :indeterminate="true" color="red">
                </v-progress-linear>
              </v-flex>
              <v-card class="mb-4">
                <div class="subheading red--text mb-4" @click="viewDocumentsBtn()"
                     style="textAlign: center; padding: 20px; color: red; cursor: pointer;">
                  View Documents
                </div>
              </v-card>
            </div>
          </v-flex>
          <v-flex offset-sm5 offset-xs2 sm2 xs8>
            <v-card>
              <div>
                <div class="subheading red--text mb-4" @click="bookAppointment()"
                     style="textAlign: center; padding: 20px; color: red; cursor: pointer;">
                  Book An Appointment
                </div>
              </div>
            </v-card>
            <v-card>
              <div>
                <div class="subheading red--text mb-5" @click="viewAppointments()"
                     style="textAlign: center; padding: 20px; color: red; cursor: pointer;">
                  View Appointments
                </div>
              </div>
            </v-card>
            <v-card>
              <div>
                <div class="subheading red--text mb-5" @click="payments()"
                     style="textAlign: center; padding: 20px; color: red; cursor: pointer;">
                  Invoices
                </div>
              </div>
            </v-card>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

export default {
  data() {
    return {
      selectedFile: null,
      uploading: false,
      // i need to bind this to the dom
      myUsername: {
        email: '',
        name: '',
        userId: '',
      },
      user: {},
    };
  },
  methods: {
    async onFileSelected(event) {
      this.uploading = true;
      this.selectedFile = event.target.files;
      const fd = new FormData();
      const paths = [];
      Array.prototype.forEach.call(this.selectedFile, (file) => {
        fd.append(file.name, file, file.name);
        paths.push(`${file.name}`);
      });

      const fileData = {
        transaction: 'inbound',
        path: paths,
      };
      fd.append('transaction', fileData.transaction);
      const res = await this.$store.dispatch('uploadDocumentAsUser', fd);
      if (res) {
        this.uploading = false;
      }
    },
    viewDocumentsBtn() {
      this.$router.push('/users/files_uploaded');
    },
    bookAppointment() {
      this.$router.push('/users/book_appointment');
    },
    viewAppointments() {
      this.$router.push('/users/my_appointments');
    },
    payments() {
      this.$router.push('/users/payments');
    },
    UserProfile() {
      this.$router.push('/users/user_profile');
    },
  },
  created() {
    this.user = this.$store.getters.user;
  },

};
</script>

<style>

</style>
