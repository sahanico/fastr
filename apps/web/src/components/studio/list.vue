<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-row>
            <v-col align="left">
              <div class="headline text-xs-center red--text pb-5 pt-5">Screens</div>
            </v-col>
            <v-col align="right">
              <div>
                <v-btn color="red darken-2" dark style="align: right;" @click="createDesign">
                  Create Studio
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div></div>
          <v-data-table
            :headers="designHeaders"
            :items="designs" class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="readDesign(item)"> mdi-eye</v-icon>
              <v-icon small @click="updateDesign(item)"> mdi-pencil</v-icon>
              <v-icon small @click="openPermissionDialog(item)">mdi-list-status</v-icon>
              <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="deleteDesignDialog" width="580">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          Delete Design
        </v-card-title>
        <v-card-text> Do you want to delete this design?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="deleteDesign()">Delete
          </v-btn>
          <v-btn color="black" text type="button"
                 @click="deleteDesignDialog = false">Cancel
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
import permission from '@/components/dashboards/permission';

export default {
  name: 'list',
  components: {
    permission,
  },
  data() {
    return {
      designs: [],
      permissionToUpdate: {},
      objectDialog: false,
      deleteDesignDialog: false,
      permissionDialog: false,
      designToDelete: {},
      permissionForDesign: {},
      designHeaders: [
        { text: 'Label', align: 'left', value: 'label' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    createDesign() {
      this.$router.push({
        name: 'Studio',
        params: {
          path: 'studio-list',
          context: 'create',
        },
      });
    },
    readDesign(design) {
      this.$router.push({ name: 'readDashboard', params: { design } });
    },
    updateDesign(design) {
      this.$router.push({
        name: 'DashboardDesigner',
        params: {
          path: 'dashboards-list',
          context: 'update',
          design,
        },
      });
    },
    showDeleteDialog(design) {
      this.designToDelete = design;
      this.deleteDesignDialog = !this.deleteDesignDialog;
    },
    // open permission dialog and also fill permissionToUpdate to v-bind with the child comp call
    openPermissionDialog(item) {
      this.permissionToUpdate = item;
      this.permissionDialog = true;
    },
    // used for $emit in child component : permission.vue
    showPermissionDialog(bool) {
      this.permissionDialog = bool;
    },
    deleteDesign() {
      const index = this.designs.indexOf(this.designToDelete);
      this.designs.splice(index, 1);
      this.deleteDesignDialog = false;
      this.$store.dispatch('deleteDesignByID', this.designToDelete);
      this.$store.dispatch('deletePermissionByName', this.designToDelete);
      this.designToDelete = {};
    },
  },
  async created() {
    this.designs = await this.$store.dispatch('getDesignsByType', {
      type: 'screen',
    });
  },
};
</script>
