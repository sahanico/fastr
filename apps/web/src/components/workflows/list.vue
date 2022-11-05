<template>
  <div class="grey lighten-4">
    <v-container class="m-5 p-5">
      <v-layout>
        <v-flex>
          <v-row>
            <v-col>
              <div class="headline text-xs-center red--text pb-5 pt-5">
                Workflows
              </div>
            </v-col>
            <v-col align="right">
              <v-btn color="red darken-2" style="align: right;" dark @click="create()">
                Create New Workflow
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="workflows" class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="read(item)"> mdi-eye</v-icon>
              <v-icon small @click="update(item)"> mdi-pencil</v-icon>
              <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="deleteDialog.show" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          Delete Workflow
        </v-card-title>
        <v-card-text> Do you want to delete this workflow?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button" @click="trash()">
            Delete
          </v-btn>
          <v-btn color="black" text type="button" @click="deleteDialog.show = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  name: 'list',
  data() {
    return {
      designs: [],
      workflows: [],
      deleteDialog: {
        show: false,
        workflow: '',
      },
      headers: [
        { text: 'Label', align: 'left', value: 'label' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    create() {
      this.$router.push({
        name: 'WorkflowDesigner',
        params: { designs: this.designs, context: 'create' },
      });
    },
    read(workflow) {
      this.$router.push({
        name: 'WorkflowRead',
        params: { name: workflow.name, obj: workflow.object },
      });
    },
    update(design) {
      this.$router.push({
        name: 'WorkflowDesigner',
        params: { designs: this.designs, design, context: 'update' },
      });
    },
    showDeleteDialog(workflow) {
      this.deleteDialog.workflow = workflow;
      this.deleteDialog.show = !this.deleteDialog.show;
    },
    trash() {
      this.workflows = _.filter(
        this.workflows,
        workflow => workflow.name === this.deleteDialog.workflow,
      );
      this.$store.dispatch('deleteDesignByName', this.deleteDialog.workflow);
      this.deleteDialog = {
        show: false,
        workflow: '',
      };
    },
  },
  async created() {
    this.designs = await this.$store.dispatch('getAllDesigns');
    this.workflows = _.where(this.designs, { type: 'workflow' });
  },
};
</script>
