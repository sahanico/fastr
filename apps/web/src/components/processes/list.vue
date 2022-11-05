<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-row>
            <v-col align="left">
              <div class="headline text-xs-center red--text pb-5 pt-5">
                Processes
              </div>
            </v-col>
            <v-col align="right">
              <div>
                <v-btn color="red darken-2" dark style="align: right;" @click="createDesign">
                  Create New Design
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div></div>
          <v-data-table
            :headers="processHeaders"
            :items="designs" class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="updateDesign(item)"> mdi-pencil</v-icon>
              <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="deleteDesignDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title> Delete Design
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
  </div>
</template>

<script>
export default {
  name: 'list',
  data() {
    return {
      designs: [],
      processHeaders: [
        { text: 'Label', align: 'left', value: 'label' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      designToDelete: {},
      deleteDesignDialog: false,
    };
  },
  methods: {
    createDesign() {
      this.$router.push({ name: 'ProcessDesigner',
        params: {
          context: 'create',
          path: 'processes-list' },
      });
    },
    updateDesign(design) {
      this.$router.push({ name: 'ProcessDesigner',
        params: {
          context: 'update',
          design,
          path: 'processes-list' },
      });
    },
    showDeleteDialog(design) {
      this.designToDelete = design;
      this.deleteDesignDialog = !this.deleteDesignDialog;
    },
    deleteDesign() {
      const index = this.designs.indexOf(this.designToDelete);
      this.designs.splice(index, 1);
      this.deleteDesignDialog = false;
      this.$store.dispatch('deleteDesignByID', this.designToDelete);
      this.designToDelete = {};
    },
  },
  async created() {
    this.designs = await this.$store.dispatch('getDesignsByType', {
      type: 'process',
    });
  },
};
</script>
