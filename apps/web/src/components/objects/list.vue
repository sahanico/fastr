<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-row>
            <v-col align="left">
              <div class="headline text-xs-center red--text pb-5 pt-5">
                Object Dictionary
              </div>
            </v-col>
            <v-col align="right">
              <v-btn @click="createObject()" color="red darken-2"
                     dark style="align: right;">
                Create object
              </v-btn>
            </v-col>
          </v-row>
          <div></div>
          <v-data-table
            :headers="objectHeaders"
            :items="objects" class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="updateObject(item)"> mdi-pencil</v-icon>
              <v-icon small @click="showObjectDeleteDialog(item)">mdi-delete</v-icon>
              <v-icon small @click="listAvailableRecords(item)">mdi-view-list-outline</v-icon>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="objectExistsDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title> Object create failed
        </v-card-title>
        <v-card-text> Object already exists.
          .
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="objectExistsDialog = false">Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteObjectDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title> Delete Object
        </v-card-title>
        <v-card-text> Do you want to delete this object?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="deleteObject()">Delete
          </v-btn>
          <v-btn color="black" text type="button"
                 @click="deleteObjectDialog = false">Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Object from './object';

export default {
  name: 'list',
  components: {
    Object,
  },
  data() {
    return {
      objects: [],
      dashboardDesigns: [],
      dashboardPermissions: [],
      designAndPermission: [],
      objectDialog: false,
      deleteObjectDialog: false,
      objectExistsDialog: false,
      objectToDelete: {},
      objectHeaders: [
        { text: 'Label', align: 'left', value: 'label' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Description', align: 'left', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      dashboardDesignHeaders: [
        { text: 'Label ', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    createObject() {
      this.$router.push({ name: 'Object',
        params: { objects: this.objects, context: 'create' },
      });
    },
    updateObject(item) {
      this.$router.push({ name: 'Object',
        params: { objects: this.objects, name: item.name, context: 'update' },
      });
    },
    showObjectDeleteDialog(object) {
      this.objectToDelete = object;
      this.deleteObjectDialog = !this.deleteObjectDialog;
    },
    deleteObject() {
      const index = this.objects.indexOf(this.objectToDelete);
      this.objects.splice(index, 1);
      this.deleteObjectDialog = false;
      this.$store.dispatch('deleteObjectById', this.objectToDelete);
      this.objectToDelete = {};
    },
    listAvailableRecords(records) {
      this.$router.push({ name: 'ListRecord', params: { name: records.name } });
    },
  },
  async created() {
    this.objects = await this.$store.dispatch('getAllObjects');
    this.dashboardDesigns = await this.$store.dispatch('getAllDashboardDesigns');
    this.dashboardPermissions = await this.$store.dispatch('getAllDashboardPermission');
  },
  computed: {
  },
};
</script>
