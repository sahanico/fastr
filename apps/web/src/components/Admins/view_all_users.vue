<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-card class="pb-3 mb-3 grey lighten-4">
            <div class="headline text-xs-center red--text pb-5 pt-5">All System Users</div>
            <div>
              <v-text-field v-model="filters.displayAllUsers"
                            label="Filter by Name"></v-text-field>
            </div>
            <v-data-table :headers="displayAllUsersHeaders"
                          :items="filteredAllUsers" class="elevation-1">
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { _ } from 'vue-underscore';

export default {

  data() {
    return {
      dialog: false,
      filters: {
        // outboundDocuments: '',
        displayAllUsers: '',
      },
      // outboundDocuments: [
      displayAllUsersHeaders: [
        { text: 'User Name', align: 'left', value: 'name' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'Phone Number', align: 'left', value: 'phoneNumber' },
        { text: 'User ID', align: 'left', value: 'userId' },
        { text: 'Role', align: 'left', value: 'role' },
        { text: 'Balance', align: 'left', value: 'balance' },
        { text: 'address Line 1', align: 'left', value: 'addressLine1' },
        { text: 'address Line 2', align: 'left', value: 'addressLine2' },
        { text: 'Postal Code', align: 'left', value: 'postalCode' },
        { text: 'Verified', align: 'left', value: 'emailVerified' },
        { text: 'Approved', align: 'left', value: 'approved' },
        { text: 'Accepted Terms', align: 'left', value: 'acceptedTerms' },
        { text: 'Last Signed In', align: 'left', value: 'lastSignedInAt' },
        { text: 'Created At', align: 'left', value: 'created_at' },
      ],
      // outboundDocuments: [],
      displayAllUsers: [],
    };
  },
  computed: {
    filteredAllUsers() {
      if (this.filters.displayAllUsers !== '') {
        return _.select(this.displayAllUsers, (user) => {
          if (user.name !== '' && user.name !==
            undefined) {
            return user.name.toLowerCase()
              .includes(
                this.filters.displayAllUsers.toLowerCase());
          }
          return null;
        });
      }
      return this.displayAllUsers;
    },
  },

  async created() {
    this.displayAllUsers = await this.$store.dispatch('DisplayAllUsers');
  },
};

</script>
