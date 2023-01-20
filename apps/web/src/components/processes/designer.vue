<template>
  <v-container id="process" :color="'#aaa'">
    <div>
      <div class="headline red--text pb-5 pt-5" style="text-align: center">
        {{ context === 'create' ? 'Create ' : 'Update ' }}Process
      </div>
      <form @submit.prevent="onSubmit">
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="design.label" label="Label" required/>
            </v-col>
            <v-col>
              <v-text-field :disabled="context === 'update'" v-model="design.name" label="Name"
                            required/>
            </v-col>
          </v-row>
          <v-row>
            <pool :pool="design.meta.pool" :objects="objects" :autocomplete-objects="autocompleteObjects"/>
          </v-row>
          <v-row>
            <steps :variables="variables" :steps="design.meta.steps" :pool="design.meta.pool" :objects="objects"
                   :autocomplete-objects="autocompleteObjects" />
          </v-row>
        </v-container>
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
          <v-card-text> Process design has been saved!
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button"
                   @click="routeToList">Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import _ from 'underscore';
import Step from './step';
import Steps from './steps.vue';
import Pool from '../pool/pool';

export default {
  components: {
    Steps,
    Pool,
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
          pool: [],
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
      stepTypes: [
        {
          value: 'find_record',
          text: 'Find Record',
        },
        {
          value: 'create_record',
          text: 'Create Record',
        },
        {
          value: 'update_record',
          text: 'Update Record',
        },
        {
          value: 'send_email',
          text: 'Send Email',
        },
        {
          value: 'api_call',
          text: 'API Call',
        },
        {
          value: 'service_call',
          text: 'Service Call',
        },
        {
          value: 'create_pdf',
          text: 'Create PDF',
        },
      ],
    };
  },
  computed: {
    variables() {
      const poolVariables = _.map(this.design.meta.pool, item => ({
        text: item.label, value: {
          name: item.name,
          object: item.object,
        }
      }));
      const stepVariables = _.map(this.design.meta.steps, step => {
        if(step.type === 'if') {
          _.each(step.meta.steps, item =>  ({ text: item.label, value: item.name }));
        } else {
          return { text: step.label, value: { name: step.name, object: step.object } }
        }
      });
      return [...poolVariables, ...stepVariables];
    },
    formTitle() {
      if (this.context === 'update') {
        return 'Update Process';
      }
      return 'New Process';
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
