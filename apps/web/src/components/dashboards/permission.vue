<template>
  <div>
    <v-card>
      <v-card-title class="headline red white--text" dark primary-title>
        Permissions
      </v-card-title>
      <v-row style="margin: 10px;">
        <v-col>
          <v-radio-group v-model="users">
            <v-radio label="All Users" value="allUsers"></v-radio>
            <v-radio label="Selected User" value="selectedUser"></v-radio>
            <v-radio label="User Groups" value="userGroups"></v-radio>
          </v-radio-group>
          <div v-if="users === 'selectedUser' ">
            <v-autocomplete v-model="selectedUsers" :items="usersAutoComplete" chips dense
                            multiple label="Select User" outlined return-object small-chips>
            </v-autocomplete>
          </div>
          <div v-if="users === 'userGroups'">
            <v-autocomplete v-model="selectedUserGroups" :items="userGroupsAutoComplete" chips dense
                            multiple label="Select User Group" outlined return-object small-chips>
            </v-autocomplete>
          </div>
        </v-col>
        <v-col>
          <v-radio-group v-model="admins">
            <v-radio label="All Admins" value="allAdmins"></v-radio>
            <v-radio label="Selected Admin" value="selectedAdmin"></v-radio>
          </v-radio-group>
          <div v-if="admins === 'selectedAdmin'">
            <v-autocomplete v-model="selectedAdmins" :items="adminsAutoComplete" chips dense
                            multiple label="Select Admin" outlined return-object small-chips>
            </v-autocomplete>
          </div>
        </v-col>
      </v-row>
      <div><br><br></div>
      <div style="margin-left:10px;">
        <v-btn color="red darken-2" dark @click="save">Save</v-btn>
        <v-btn color="red darken-2" dark @click="close">Cancel</v-btn>
      </div>
      <div><br></div>
    </v-card>
  </div>
</template>

<script>
import { _ } from 'vue-underscore';
import UserField from '../fields/user-field';


export default {
  name: 'permission',
  props: ['item'],
  components: {
    UserField,
  },
  data() {
    return {
      users: 1,
      admins: 1,
      allRoleUser: [],
      allRoleAdmin: [],
      userGroups: [],
      usersAutoComplete: [],
      adminsAutoComplete: [],
      userGroupsAutoComplete: [],
      selectedUsers: [],
      selectedAdmins: [],
      permission: [],
      selectedUserGroups: [],
      selectedUsersInfo: {},
      selectedAdminsInfo: {},
      selectedUserGroupInfo: {},
    };
  },
  methods: {
    async save() {
      if (this.admins === 'allAdmins') {
        this.selectedAdminsInfo = 'all-admins';
      } else if (this.admins === 'selectedAdmin') {
        _.each(this.selectedAdmins, (admin, idx) => {
          this.selectedAdminsInfo[idx] = (this.allRoleAdmin[admin.value].userId);
        });
      }
      if (this.users === 'allUsers') {
        this.selectedUsersInfo = 'all-users';
      } else if (this.users === 'userGroups') {
        _.each(this.selectedUserGroups, (userGroup, idx) => {
          this.selectedUserGroupInfo[idx] = (this.userGroups[userGroup.value].groupId);
        });
      } else if (this.users === 'selectedUser') {
        _.each(this.selectedUsers, (user, idx) => {
          this.selectedUsersInfo[idx] = (this.allRoleUser[user.value].userId);
        });
      }
      const payload = {
        name: this.item.name,
        label: this.item.label,
        type: this.item.type,
        users: this.selectedUsersInfo ? this.selectedUsersInfo : 'all-users',
        admins: this.selectedAdminsInfo ? this.selectedAdminsInfo : 'all-admins',
        userGroups: this.selectedUserGroupInfo,
      };

      await this.$store.dispatch('upsertPermission', payload);
      this.close();
    },
    close() {
      this.$emit('showPermissionDialog', false);
      this.selectedUsers = [];
      this.selectedAdmins = [];
    },
  },
  async created() {
    this.allRoleUser = await this.$store.dispatch('getAllRoleUser');
    this.allRoleAdmin = await this.$store.dispatch('getAllRoleAdmin');
    this.userGroups = await this.$store.dispatch('getUserGroups');
    this.permission = await this.$store.dispatch('getPermissionByName', { name: this.item.name });
    if (this.allRoleUser) {
      this.allRoleUser = _.map(this.allRoleUser, (user, index) => {
        this.usersAutoComplete.push({ text: `${user.name}`, value: index });
        return {
          userId: user.userId,
          name: user.name,
        };
      });
    }
    if (this.allRoleAdmin) {
      this.allRoleAdmin = _.map(this.allRoleAdmin, (admin, index) => {
        this.adminsAutoComplete.push({ text: `${admin.name}`, value: index });
        return {
          userId: admin.userId,
          name: admin.name,
        };
      });
    }
    if (this.userGroups) {
      this.userGroups = _.map(this.userGroups, (group, index) => {
        this.userGroupsAutoComplete.push({ text: `${group.label}`, value: index });
        return {
          groupId: group.id,
          label: group.label,
          name: group.name,
        };
      });
    }
    if (this.permission.users !== undefined) {
      if (this.permission.users === 'all-users') {
        this.users = 'allUsers';
      } else {
        this.users = 'selectedUser';
        const tempPermissions = [];
        _.map(this.permission.users, (user) => {
          _.each(this.allRoleUser, (roleUser) => {
            if (user === roleUser.userId) {
              tempPermissions.push(roleUser);
            }
          });
        });
        _.each(tempPermissions, (tempPermission) => {
          _.each(this.usersAutoComplete, (user, idx) => {
            if (tempPermission.name === user.text) {
              this.selectedUsers[idx] = user;
            }
          });
        });
      }
    }
    if (this.permission.admins !== undefined) {
      if (this.permission.admins === 'all-admins') {
        this.admins = 'allAdmins';
      } else {
        this.admins = 'selectedAdmin';
        const tempPermissions = [];
        _.map(this.permission.admins, (admin) => {
          _.each(this.allRoleAdmin, (roleAdmin) => {
            if (admin === roleAdmin.userId) {
              tempPermissions.push(roleAdmin);
            }
          });
        });
        _.each(tempPermissions, (tempPermission) => {
          _.each(this.adminsAutoComplete, (admin, idx) => {
            if (tempPermission.name === admin.text) {
              this.selectedAdmins[idx] = admin;
            }
          });
        });
      }
    }
    if (this.permission.userGroups !== undefined) {
      this.users = 'userGroups';
      const tempPermissions = [];
      _.map(this.permission.userGroups, (group) => {
        _.each(this.userGroups, (userGroup) => {
          if (group === userGroup.groupId) {
            tempPermissions.push(userGroup);
          }
        });
      });
      _.each(tempPermissions, (tempPermission) => {
        _.each(this.userGroupsAutoComplete, (group, idx) => {
          if (tempPermission.label === group.text) {
            this.selectedUserGroups[idx] = group;
          }
        });
      });
    }
  },
};
</script>

<style scoped>

</style>
