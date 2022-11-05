<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-card class="pb-5 mb-5 grey lighten-4" flat>
            <div class="headline text-xs-center red--text pb-5 pt-5">Approval Requests</div>
            <v-data-table :headers="approvalHeaders"
                          :items="approvals" class="elevation-1">
              <template v-slot:item.approved="{ item, index }">
                <a href="javascript:void(0)" @click="approveUser(item)">
                  Accept
                </a>
              </template>
              <v-icon small class="mr-2">
                mdi-check
              </v-icon>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  data() {
    return {
      approvals: [],
      approvalHeaders: [
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'Phone Number', align: 'left', value: 'phoneNumber' },
        { text: 'Approved?', align: 'left', value: 'approved' },
      ],
      users: [],
    };
  },
  methods: {
    async approveUser(item) {
      const approved = await this.$store.dispatch('approveUser', item.userId);
      if (approved) {
        this.approvals = _.reject(this.approvals, { userId: item.userId });
      }
    },
  },
  async created() {
    this.approvals = await this.$store.dispatch('getUserApprovals');
  },
};
</script>
