<template>
  <div id="points">
    <div>
      <v-dialog v-model="addUserDialog" width="400px">
        <v-card>
          <v-card-text class="headline red white--text" dark
                       primary-title> Please choose users
          </v-card-text>
          <div style="margin-left: 32px">
            <v-autocomplete multiple v-model="selectedUsers"
                            :items="autocompleteUsers" chips dense
                            outlined return-objects small-chips style="max-width: 150px"
                            label="Choose Users"></v-autocomplete>
          </div>
          <v-btn color="red darken-2" text type="button"
                 style="margin-left: 20px" @click="addUserDialog = false">Cancel
          </v-btn>
          <v-btn color="red darken-2" text type="button"
                 style="margin-left: 20px" @click="addUsers">OK
          </v-btn>
        </v-card>
      </v-dialog>
      <v-dialog v-model="groupExistsDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark primary-title>Create failed!
          </v-card-title>
          <v-card-text> A user group with this name already exists.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button" @click="groupExistsDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="userExistsDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark primary-title>Add user Failed
          </v-card-title>
          <v-card-text> Failed to add {{ existingUser.join(', ') }} since data already
            exists in the table.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button" @click="clearExistingUser()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark primary-title> User Group Saved
          </v-card-title>
          <v-card-text> User Group has been saved!</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button" @click="routeToList">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteUserDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Delete user
          </v-card-title>
          <v-card-text> Do you want to delete this user?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button"
                   @click="deleteItem()">Delete
            </v-btn>
            <v-btn color="black" text type="button"
                   @click="deleteUserDialog = false">Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <form lazy-validation @submit.prevent="onSubmit">
        <div class="headline text-center red--text pb-5 pt-5">
          Create User Group
        </div>
        <div style="margin:0 20% 0;">
          <v-card elevation="1" style="padding: 16px">
            <v-row>
              <v-col>
                <v-text-field v-model="label" label="Label" required></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="name" label="Name" required></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="description" label="Description" required></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <div style="margin: 4px">
          <v-row style="margin: 4px; min-height: 200px;">
            <td style="margin: 4px; width: 100%">
              <div class="headline red--text pb-5 pt-5">Users</div>
              <v-btn color="red darken-2" dark style="align: right;"
                     @click="addUserDialog = true">Add User
              </v-btn>
              <v-data-table :headers="UsersHeaders" :items="addedUsers" class="elevation-1">
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </td>
          </v-row>
        </div>
        <div>
          <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';

export default {

  components: {},
  data() {
    return {
      deleteUserDialog: false,
      addUserDialog: false,
      groupExistsDialog: false,
      createDialog: false,
      userExistsDialog: false,
      name: '',
      label: '',
      description: '',
      users: [],
      autocompleteUsers: [],
      selectedUsers: [],
      addedUsers: [],
      UsersHeaders: [
        { text: 'User Name', align: 'left', value: 'name' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'User ID', align: 'left', value: 'userId' },
        { text: 'Role', align: 'left', value: 'role' },
        { text: 'Actions', align: 'left', value: 'actions' },

      ],
      userToDelete: {},
      existingUser: [],
    };
  },
  methods: {
    async onSubmit() {
      const userGroup = {
        name: this.name,
        label: this.label,
        description: this.description,
        users: this.addedUsers,
      };
      const newDesign = await this.$store.dispatch('createUserGroup', userGroup);
      if (newDesign === 'user-group-exists') {
        this.groupExistsDialog = true;
      } else {
        this.createDialog = true;
      }
    },
    showDeleteDialog(user) {
      this.userToDelete = user;
      this.deleteUserDialog = !this.deleteUserDialog;
    },
    deleteItem() {
      const index = this.addedUsers.indexOf(this.userToDelete);
      this.addedUsers.splice(index, 1);
      this.deleteUserDialog = false;
      this.userToDelete = {};
    },
    addUsers() {
      /** todo: user already exists dialog* */
      const usersInTable = _.map(this.addedUsers, addedUser => addedUser.userId);
      _.each(this.selectedUsers, (user) => {
        if (!usersInTable.includes(this.users[user].userId)) {
          this.addedUsers.push({
            name: this.users[user].name,
            email: this.users[user].email,
            userId: this.users[user].userId,
            role: this.users[user].role,
          });
        } else {
          this.existingUser.push(this.users[user].name);
          this.userExistsDialog = true;
        }
      });
      this.addUserDialog = false;
      this.selectedUsers = [];
    },
    routeToList() {
      this.$router.push('/Users/list');
    },
    clearExistingUser() {
      this.userExistsDialog = false;
      this.existingUser = [];
    },
  },
  async created() {
    this.users = await this.$store.dispatch('getUsersForDesigner');
    if (this.users) {
      this.users = _.map(this.users, (user, index) => {
        this.autocompleteUsers.push({ text: `${user.name} (${user.email})`, value: index });
        return {
          name: user.name,
          email: user.email,
          userId: user.userId,
          role: user.role,
        };
      });
    }
  },
};
</script>

<style scoped>
</style>
