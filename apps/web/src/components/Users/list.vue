<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-row>
            <v-col align="left">
              <div class="headline text-xs-center red--text pb-5 pt-5">
                Users
              </div>
            </v-col>
            <v-col align="right">
              <div>
                <v-btn color="red darken-2" dark style="align: right;" @click="createUserGroup">
                  Create New User Group
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div></div>
          <div>
            <v-text-field v-model="filters.users" label="Filter by Name"></v-text-field>
          </div>
          <v-data-table
            :items-per-page="10"
            :headers="usersHeaders"
            :items="filteredUsers" class="elevation-1">
          </v-data-table>
          <div><br></div>
          <div class="headline text-xs-center red--text pb-5 pt-5">
            User Groups
          </div>
          <v-data-table
            :items-per-page="5"
            :headers="userGroupsHeaders"
            :items="userGroups" class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="updateUserGroup(item)">mdi-pencil</v-icon>
              <v-icon small @click="showGroupDeleteDialog(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
          <div><br></div>
          <div class="headline text-xs-center red--text pb-5 pt-5">
            Permissions
          </div>
          <v-data-table
            :items-per-page="5"
            :headers="permissionHeaders"
            :items="permissions" class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="openPermissionDialog(item)">mdi-list-status</v-icon>
              <v-icon small @click="showPermissionDeleteDialog(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="deleteGroupDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title> Delete group
        </v-card-title>
        <v-card-text> Do you want to delete this group?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="deleteGroup()">Delete
          </v-btn>
          <v-btn color="black" text type="button"
                 @click="deleteGroupDialog = false">Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deletePermissionDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title> Delete Permission
        </v-card-title>
        <v-card-text> Do you want to delete this Permission?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="deletePermission()">Delete
          </v-btn>
          <v-btn color="black" text type="button"
                 @click="deletePermissionDialog = false">Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="permissionDialog" width="800px" :retain-focus="false">
      <div>
        <permission
          @showPermissionDialog="showPermissionDialog"
          v-bind:item="this.permissionToUpdate">
        </permission>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { _ } from 'vue-underscore';
import permission from '@/components/dashboards/permission';

export default {
  name: 'list',
  components: {
    permission,
  },
  data() {
    return {
      users: [],
      userGroups: [],
      objectDialog: false,
      deleteGroupDialog: false,
      deletePermissionDialog: false,
      itemToDelete: {},
      permissionToUpdate: {},
      permissionDialog: false,
      filters: {
        users: '',
      },
      userGroupsHeaders: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions' },
      ],
      usersHeaders: [
        { text: 'User Name', align: 'left', value: 'name' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'Phone Number', align: 'left', value: 'phoneNumber' },
        { text: 'User ID', align: 'left', value: 'userId' },
        { text: 'Role', align: 'left', value: 'role' },
        // { text: 'Balance', align: 'left', value: 'balance' },
        // { text: 'address Line 1', align: 'left', value: 'addressLine1' },
        // { text: 'address Line 2', align: 'left', value: 'addressLine2' },
        // { text: 'Postal Code', align: 'left', value: 'postalCode' },
        { text: 'Verified', align: 'left', value: 'emailVerified' },
        { text: 'Approved', align: 'left', value: 'approved' },
        { text: 'Accepted Terms', align: 'left', value: 'acceptedTerms' },
        { text: 'Last Signed In', align: 'left', value: 'lastSignedInAt' },
        { text: 'Created At', align: 'left', value: 'createdAt' },
      ],
      permissionHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Actions', value: 'actions' },
      ],
      permissions: [],
    };
  },
  methods: {
    createUserGroup() {
      this.$router.push('/Users/user-group-create');
    },
    showGroupDeleteDialog(group) {
      this.itemToDelete = group;
      this.deleteGroupDialog = !this.deleteGroupDialog;
    },
    showPermissionDeleteDialog(perm) {
      this.itemToDelete = perm;
      this.deletePermissionDialog = !this.deletePermissionDialog;
    },
    openPermissionDialog(item) {
      this.permissionToUpdate = item;
      this.permissionDialog = true;
    },
    showPermissionDialog(bool) {
      this.permissionDialog = bool;
    },
    deleteGroup() {
      const index = this.userGroups.indexOf(this.itemToDelete);
      this.userGroups.splice(index, 1);
      this.deleteGroupDialog = false;
      this.$store.dispatch('deleteUserGroupByID', this.itemToDelete);
      this.itemToDelete = {};
    },
    deletePermission() {
      const index = this.permissions.indexOf(this.itemToDelete);
      this.permissions.splice(index, 1);
      this.deletePermissionDialog = false;
      this.$store.dispatch('deletePermissionByName', this.itemToDelete);
      this.itemToDelete = {};
    },
    updateUserGroup(group) {
      this.$router.push({ name: 'UpdateUserGroup', params: { group } });
    },
  },
  computed: {
    filteredUsers() {
      if (this.filters.users !== '') {
        return _.select(this.users, (user) => {
          if (user.data.name !== '' && user.data.name !== undefined) {
            return user.data.name.toLowerCase().includes(this.filters.users.toLowerCase());
          }
          return null;
        });
      }
      return _.map(this.users, user => user.data);
    },
  },
  async created() {
    this.users = await this.$store.dispatch('getRecordsByObject', { object: 'user' });
    this.userGroups = await this.$store.dispatch('getUserGroups');
    this.permissions = await this.$store.dispatch('getAllDashboardPermission');
  },
};
</script>

