<template>
  <form ref="sendFileForm" lazy-validation @submit.prevent="onSubmit">
    <v-dialog v-model="designExistsDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title> Design create failed
        </v-card-title>
        <v-card-text> A design with this name already exists.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="designExistsDialog = false">Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title> Design Saved
        </v-card-title>
        <v-card-text> List design has been saved!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="routeToList">Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-row>
        <v-col cols="12" sm="3">
          <v-text-field v-model="eventDesign.eventLabel" label="Event Label"></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field :disabled="context === 'update'"
                        v-model="eventDesign.eventName"
                        label="Event Name"/>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select v-model="eventDesign.eventType" :items="eventTypeList" label="Type">

          </v-select>
        </v-col>
        <v-col cols="12" sm="3">
          <v-autocomplete v-model="selectedObject" :items="autocompleteObjects" label="Object">

          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
    <div style="margin: 8px 0px 54px 12px">
      <v-btn color="red darken-2" dark type="submit">Save</v-btn>
    </div>
    <div class="headline red--text pb-5 pt-5" style="text-align: left; margin-left: 8px">
      Processes
    </div>
    <div style="margin: 8px">
      <v-card elevation="1">
        <v-autocomplete v-model="selectedProcess" :items="autocompleteProcess" chips dense
                        label="Select Proccess" outlined return-object small-chips
                        style="max-width: 150px"
        >
        </v-autocomplete>
      </v-card>
    </div>
    <div style="margin: 8px 0px 54px 12px">
      <v-btn color="red darken-2" dark type="submit">Save</v-btn>
    </div>
  </form>
</template>

<script>
import { _ } from 'vue-underscore';

export default {

  components: {},
  props: ['context', 'design'],
  data() {
    return {
      eventDesign: {
        eventName: '',
        eventLabel: '',
        eventType: null,
      },
      conditions: [
        {
          lhs: '',
          operator: '',
          rhs: {
            type: '',
            object: '',
            value: '',
          },
        },
      ],
      index: 0,
      column: 1,
      height: 196,
      allObjects: [],
      processes: [],
      autocompleteObject: [],
      selectedObject: {},
      autocompleteProcess: [],
      selectedProcess: {},
      chooseObjectDialog: true,
      clickedItem: {},
      createDialog: false,
      executionDialog: false,
      designExistsDialog: false,
      listType: '',
      setFieldOptionsDialog: false,
      eventTypeList: ['Create Record', 'Update Record', 'Delete Record'],
    };
  },
  computed: {
    autocompleteObjects() {
      if (!this.allObjects) return [];
      return _.map(this.allObjects, object => ({ text: object.label, value: object.name}));
    },
    fields() {
      if (this.selectedObject.value) {
        return this.allObjects[this.selectedObject.value].fields;
      }
      return '';
    },
    fieldLabels() {
      const labels = [];
      _.each(this.fields, (field) => {
        labels.push(field.label);
      });
      return labels;
    },
    object() {
      if (this.selectedObject.value) {
        return this.allObjects[this.selectedObject.value].name;
      }
      return '';
    },
    process() {
      if (this.selectedProcess.value) {
        return this.processes[this.selectedProcess.value].name;
      }
      const processVal = _.findWhere(this.processes, { name: this.selectedProcess }).name;
      return processVal.name;
    },
  },
  methods: {
    setDialog(bool) {
      this.executionDialog = bool;
    },
    async onSubmit() {
      const layout = {
        name: this.eventDesign.eventName,
        label: this.eventDesign.eventLabel,
        type: 'event',
        meta: {
          type: this.eventDesign.eventType,
          object: this.selectedObject,
          conditions: this.conditions,
          process: this.process,
        },
      };
      if (this.context === 'update') {
        this.$store.dispatch('updateDesign', layout);
        this.updatedDialog = true;
      } else {
        const newDesign = await this.$store.dispatch('createDesign', layout);
        if (newDesign.data === 'design-exists') {
          this.designExistsDialog = true;
        } else {
          this.createDialog = true;
        }
      }
    },
    itemTitle(item) {
      let result = item.i;
      if (item.static) {
        result += ' - static';
      }
      return result;
    },
    routeToList() {
      this.$router.push('/events/list');
    },
  },
  async created() {
    this.allObjects = await this.$store.dispatch('getAllObjects');
    if (this.allObjects) {
      this.allObjects = _.map(this.allObjects, (object, index) => {
        return {
          name: object.name,
          fields: object.fields,
          label: object.label,
          attachment: object.attachment,
        };
      });
    }

    this.processes = await this.$store.dispatch('getDesignsByType', {
      type: 'process',
    });
    if (this.processes) {
      this.processes = _.each(this.processes, (process, index) => {
        this.autocompleteProcess.push({ text: `${process.name}`, value: index });
      });
    }

    if (this.context === 'update') {
      this.eventDesign.eventName = this.design.name;
      this.eventDesign.eventLabel = this.design.label;
      this.eventDesign.eventType = this.design.meta.type;
      this.selectedProcess = _.findWhere(this.autocompleteProcess, {
        text: this.design.meta.process,
      });
    }
  },
};
</script>

