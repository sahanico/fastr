<template>
  <div id="process">
    <div>
    </div>
    <div>
      <div class="headline red--text pb-5 pt-5" style="text-align: center">
        {{ context === 'create' ? 'Create ' : 'Update '}}Process
      </div>
      <form @submit.prevent="onSubmit">
        <div style="margin: 12px">
          <v-card elevation="1">
            <v-row style="margin: 20px">
              <v-col>
                <v-text-field v-model="design.label" label="Label" required />
              </v-col>
              <v-col>
                <v-text-field :disabled="context === 'update'" v-model="design.name" label="Name"
                              required />
              </v-col>
            </v-row>
          </v-card>
          <inputs :design="design" :autocomplete-objects="autocompleteObjects"></inputs>
          <div class="headline text-xs-center red--text pb-5 pt-5">Steps</div>
        </div>
        <div>
          <v-row>
            <v-btn style="margin-left: 28px" color="red darken-2" dark class="mb-2"
                   @click="addStep()">Add Step
            </v-btn>
          </v-row>
        </div>
        <div style="margin:12px">
          <v-data-table
            :headers="stepHeader"
            :items="this.design.meta.steps"
            class="elevation-1">
            <template v-slot:item.actions="{ item, index }">
              <v-icon small @click="editStep(index)"> mdi-pencil</v-icon>
              <v-icon small @click="deleteStep(index)">mdi-delete</v-icon>
            </template>
            <template v-slot:item.number="{ item, index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.type="{ item, index }">
              {{ item.type.text }}
            </template>
          </v-data-table>
        </div>
        <div>
          <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
        </div>
      </form>
    </div>
    <div>
      <v-dialog v-model="createDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Design Saved
          </v-card-title>
          <v-card-text> Form design has been saved!
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button"
                   @click="routeToList">Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="stepDialog">
        <v-card>
          <div style="width: 100%">
            <step :steps="design.meta.steps"
                  :step="selectedStepIndex >= 0 ? design.meta.steps[selectedStepIndex] : undefined"
                  :context="context" :pool="pool" :objects="objects"
                  @createStep="createStep" @updateStep="updateStep" @dialog="dialog">
            </step>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import Step from './step';
import Inputs from '../inputs/inputs';

export default {
  components: {
    Step,
    Inputs,
  },
  props: {
    context: String,
    design: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'process',
        meta: {
          inputs: [],
          steps: [],
        },
      }),
    },
  },
  data() {
    return {
      createDialog: false,
      stepDialog: false,
      objects: [],
      stepHeader: [
        { text: 'Number', value: 'number', sortable: false, width: '50px' },
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Label', value: 'label', sortable: false },
        { text: 'Type', value: 'type', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
      ],
      selectedStepIndex: -1,
    };
  },
  computed: {
    formTitle() {
      if (this.context === 'update') {
        return 'Update Process';
      }
      return 'New Process';
    },
    pool() {
      return [...this.design.meta.inputs, ...this.design.meta.steps];
    },
    autocompleteObjects() {
      return _.map(this.objects, object => ({
        text: object.label,
        value: object.name,
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
          this.createDialog = true;
        }
      } else if (this.context === 'update') {
        const updatedDesign = await this.$store.dispatch('updateDesign', this.design);
        if (updatedDesign) {
          this.createDialog = true;
        }
      }
    },
    deleteStep(index) {
      this.design.meta.steps.splice(index, 1);
      this.selectedStepIndex = -1;
    },
    routeToList() {
      this.$router.push('/processes/list');
    },
    cancelStep() {
      this.stepDialog = false;
      this.selectedStepIndex = -1;
    },
    createStep(step) {
      this.design.meta.steps.push(step);
      this.selectedStepIndex = -1;
    },
    addStep() {
      this.selectedStepIndex = -1;
      this.stepDialog = true;
    },
    editStep(index) {
      this.selectedStepIndex = index;
      this.stepDialog = true;
    },
    updateStep() {
      this.selectedStepIndex = -1;
    },
    dialog(bool) {
      this.stepDialog = bool;
      this.selectedStepIndex = -1;
    },
  },
  async created() {
    this.objects = await this.$store.dispatch('getAllObjects');
  },
};
</script>
