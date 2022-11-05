<template>
  <div>
    <v-card class="grey lighten-4 pt-5 "
            style="paddingBottom:1250px;"
    >
      <div>
        <div class="headline red--text"
             strong
             style="textAlign: center; margin: 20px;">
          Admin Panel
        </div>
      </div>
      <v-flex offset-sm5 offset-xs2 sm2 xs8>
        <div class="mt-5">
          <v-card class="mb-4">
            <div class="subheading red--text mb-4"
                 style="textAlign: center; padding: 20px; color: red; cursor: pointer;"
                 @click="viewAllDocumentsBtn()">
              View All Documents
            </div>
          </v-card>
          <v-card>
            <div>
              <div class="subheading red--text mb-4"
                   style="textAlign: center; padding: 20px; color: red; cursor: pointer;"
                   @click="viewAllAppointments()">
                View All Appointments
              </div>
            </div>
          </v-card>
          <v-card>
            <div>
              <div class="subheading red--text mb-4"
                   style="textAlign: center; padding: 20px; color: red; cursor: pointer;"
                   @click="addAppointments()">
                Add Appointments
              </div>
            </div>
          </v-card>
          <v-card>
            <div>
              <div class="subheading red--text mb-4"
                   style="textAlign: center; padding: 20px; color: red; cursor: pointer;"
                   @click="payments()">
                Invoices
              </div>
            </div>
          </v-card>
          <v-card>
            <div>
              <div class="subheading red--text mb-4"
                   style="textAlign: center; padding: 20px; color: red; cursor: pointer;"
                   @click="userApprovalRequests()">
                User Approval Requests
              </div>
            </div>
          </v-card>
          <v-card class="mb-4">
            <div class="subheading red--text mb-4"
                 style="textAlign: center; padding: 20px; color: #ff0000; cursor: pointer;"
                 @click="viewAllUsersBtn()">
              View All Users
            </div>
          </v-card>
        </div>
      </v-flex>
    </v-card>
  </div>
</template>

<script>
export default {

  methods: {
    viewAllDocumentsBtn() {
      this.$router.push('/admins/view_all_documents');
    },
    viewAllAppointments() {
      this.$router.push('/admins/view_all_appointments');
    },
    addAppointments() {
      this.$router.push('/admins/add_appointments');
    },
    payments() {
      this.$router.push('/admins/payments');
    },
    userApprovalRequests() {
      this.$router.push('/admins/user_approval_requests');
    },
    viewAllUsersBtn() {
      this.$router.push('/admins/view_all_users');
    },
  },
};
</script>

<style>

</style>
