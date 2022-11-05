<template>
  <div class="grey lighten-4">
    <v-container class="m-5 p-5">
      <v-layout>
        <v-flex>
          <v-row>
            <v-col>
              <div class="headline text-xs-center red--text pb-5 pt-5">
                Requests
              </div>
            </v-col>
            <v-col align="right">
              <v-btn color="red darken-2" style="align: right;" dark @click="create()">
                Create New Request
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="requests" class="elevation-1">
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
          Delete Request
        </v-card-title>
        <v-card-text> Do you want to delete this request?</v-card-text>
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
      requests: [],
      deleteDialog: {
        show: false,
        request: '',
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
        name: 'RequestDesigner',
        params: { designs: this.designs, context: 'create' },
      });
    },
    read(request) {
      this.$router.push({
        name: 'RequestRead',
        params: { name: request.name, obj: request.object },
      });
    },
    update(design) {
      this.$router.push({
        name: 'RequestDesigner',
        params: { designs: this.designs, design, context: 'update' },
      });
    },
    showDeleteDialog(request) {
      this.deleteDialog.request = request;
      this.deleteDialog.show = !this.deleteDialog.show;
    },
    trash() {
      this.requests = _.filter(
        this.requests,
        request => request.name === this.deleteDialog.request,
      );
      this.$store.dispatch('deleteDesignByName', this.deleteDialog.request);
      this.deleteDialog = {
        show: false,
        request: '',
      };
    },
  },
  async created() {
    this.designs = await this.$store.dispatch('getAllDesigns');
    this.requests = _.where(this.designs, { type: 'request' });
  },
};
</script>
