<template>
  <div id="requests">
    <v-dialog v-model="designExistsDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Request create failed
        </v-card-title>
        <v-card-text>
          A design with this name already exists.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="designExistsDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="updatedDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Request Updated
        </v-card-title>
        <v-card-text>
          Request has been Updated!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="routeToList">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createdDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Request Saved
        </v-card-title>
        <v-card-text>
          Request has been saved!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="routeToList">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <div class="headline red--text pb-5 pt-5" style="text-align: center">
        {{context === 'create'? 'Create ' : 'Update '}}Request
      </div>
      <form @submit.prevent="onSubmit">
        <v-card elevation="1" class="pa-5 ma-5">
          <v-row>
            <v-col>
              <v-text-field v-model="design.label" label="Label" required/>
            </v-col>
            <v-col>
              <v-text-field :disabled="context === 'update'" v-model="design.name" label="Name"
                            required/>
            </v-col>
          </v-row>
        </v-card>
        <div class="headline text-xs-center red--text pb- pt-5">
          Requests
        </div>
        <v-card class="pa-5 ma-5 pb-9">
          <v-row>
            <v-col>
              <v-text-field v-model="design.meta.request.label" label="Label"/>
            </v-col>
            <v-col>
              <v-text-field v-model="design.meta.request.name" label="Name" />
            </v-col>
            <v-col>
              <v-select v-model="design.meta.request.design"
                        :items="autocompleteDesigns" label="Design"/>
            </v-col>
          </v-row>
        </v-card>
        <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  props: {
    designs: Array,
    design: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'request',
        meta: {
          request: {
            name: '',
            label: '',
            design: '',
          },
        },
      }),
    },
    context: String,
  },
  data() {
    return {
      updatedDialog: false,
      designExistsDialog: false,
      createdDialog: false,
    };
  },
  computed: {
    autocompleteDesigns() {
      return _.map(this.designs, design => ({
        text: design.label,
        value: design.name,
      }));
    },
    processes() {
      const processes = _.where(this.designs, { type: 'process' });
      return _.map(processes, process => ({
        text: process.label,
        value: process.name,
      }));
    },
  },
  methods: {
    async onSubmit() {
      if (this.context === 'create') {
        const newDesign = await this.$store.dispatch('createDesign', this.design);
        if (newDesign.data === 'design-exists') {
          this.designExistsDialog = true;
        } else {
          this.createdDialog = true;
        }
      } else if (this.context === 'update') {
        const updatedDesign = await this.$store.dispatch('updateDesign', this.design);
        if (updatedDesign) {
          this.updatedDialog = true;
        }
      }
    },
    routeToList() {
      this.$router.push('/requests/list');
    },
  },
};
</script>
