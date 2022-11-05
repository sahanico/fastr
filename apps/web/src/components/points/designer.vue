<template>
  <div id="points">
    <div>
      <v-dialog v-if="context != 'update'" v-model="chooseObjectDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Please choose an object
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-autocomplete v-model="selectedObject" :items="autocompleteObject" chips dense
                            label="Select Object" outlined return-object small-chips
                            style="max-width: 150px"
            >
            </v-autocomplete>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button"
                   @click="chooseObjectDialog = false">Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="addFieldDialog" width="580px">
        <v-card>
          <v-card-text class="headline red white--text" dark
                       primary-title> Please choose an number field and it's operation
          </v-card-text>
          <v-row style="margin: 10px">
            <v-col style="margin-left: 32px">
              <v-select v-model="selectedField" :items="availableFields" chips dense
                        outlined return-object small-chips style="max-width: 150px"
                        label="All Fields"></v-select>
            </v-col>
            <v-col>
              <v-select v-model="selectedOperation" :items="operationTypes" chips dense
                        outlined return-object small-chips style="max-width: 150px"
                        label="Operations"></v-select>
            </v-col>
          </v-row>
          <v-btn color="red darken-2" text type="button"
                 style="margin-left: 20px" @click="addField">OK
          </v-btn>
        </v-card>
      </v-dialog>
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
    </div>
    <div>
      <div class="headline red--text pb-5 pt-5" style="text-align: center">
        Points
      </div>
      <form lazy-validation @submit.prevent="onSubmit">
        <div style="margin: 8px">
          <v-card elevation="1">
            <v-row style="margin: 20px">
              <v-col>
                <v-text-field
                  v-model="objectName" label="Primary Object" disabled>
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="pointLabel" label="Label" required></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="pointName" label="Name" required></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <div style="margin: 4px">
          <div class="headline red--text pb-5 pt-5" style="text-align: left; margin-left: 8px">
            Fields
          </div>
          <v-row style=" margin: 4px; min-height: 200px;">
            <td style="margin: 4px; width: 100%">
              <div v-if="disableButton===false">
                <v-btn color="red darken-2" dark style="align: right;"
                       @click="addFieldDialog = true">Add Field
                </v-btn>
              </div>
              <div v-if="disableButton===true">
                <v-tooltip right color="white" max-width="400px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="grey lighten-1" dark v-bind="attrs" v-on="on">Add Field</v-btn>
                  </template>
                  <v-alert type="warning">Maximum Fields Reached</v-alert>
                </v-tooltip>
              </div>

              <v-data-table :headers="fieldHeaders" :items="pointField" class="elevation-1">
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteField(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </td>
          </v-row>
        </div>
        <div class="headline red--text pb-5 pt-5" style="text-align: left; margin-left: 8px">
          Conditions
        </div>
        <div style="margin: 8px">
          <v-card elevation="1">
            <conditions
              v-bind:objects="allObjects"
              v-bind:primaryObject="allObjects[this.selectedObject.value]"
              :conditions.sync="conditions"
            >
            </conditions>
          </v-card>
        </div>
        <div style="margin-bottom: 48px; margin-top: 12px">
          <v-btn style="margin-left: 8px" color="red darken-2" dark type="submit">Save</v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import conditions from '../conditions/conditions';

export default {

  components: {
    conditions,
  },
  props: ['design', 'path', 'context'],
  data() {
    return {
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
      selectedOperation: '',
      chooseObjectDialog: true,
      addFieldDialog: false,
      designExistsDialog: false,
      createDialog: false,
      selectedObject: {},
      pointLabel: '',
      pointName: '',
      selectedField: {},
      allObjects: [],
      autocompleteObject: [],
      autocompleteField: [],
      fieldHeaders: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Operation', value: 'operation' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      pointField: [],
    };
  },
  computed: {
    fieldLabels() {
      const labels = [];
      if (this.selectedObject.value) {
        const fields = this.allObjects[this.selectedObject.value].fields;
        _.each(fields, (field) => {
          labels.push(field.label);
        });
        return labels;
      }
      return '';
    },
    fields() {
      if (this.selectedObject.value) {
        return this.allObjects[this.selectedObject.value].fields;
      }
      return '';
    },
    objectName() {
      if (this.selectedObject.value) {
        return this.allObjects[this.selectedObject.value].name;
      }
      return '';
    },
    availableFields() {
      const fields = this.fieldLabels;
      const pointField = _.map(this.pointField, item => item.label);
      const remaining = _.filter(fields, item => pointField.indexOf(item) === -1);
      return remaining;
    },
    disableButton() {
      return this.pointField.length === 1;
    },
    operationTypes() {
      const types = [
        'avg',
        'count',
        'max',
        'min',
        'sum',
      ];
      return types;
    },
  },
  methods: {
    async onSubmit() {
      const config = {
        name: this.pointName,
        label: this.pointLabel,
        type: 'point',
        object: this.objectName,
        meta: {
          pointField: this.pointField,
          conditions: this.conditions,
        },
      };
      const newDesign = await this.$store.dispatch('createDesign', config);
      if (newDesign.data === 'design-exists') {
        this.designExistsDialog = true;
      } else {
        this.createDialog = true;
      }
    },
    addField() {
      _.each(this.fields, (field) => {
        if (this.selectedField === field.label) {
          this.pointField.push({
            label: field.label,
            name: field.name,
            type: field.type,
            operation: this.selectedOperation,
          });
        }
      });
      this.addFieldDialog = false;
      this.selectedField = {};
      this.selectedOperation = '';
    },
    deleteField(item) {
      this.pointField.splice(this.pointField.indexOf(item), 1);
    },
    routeToList() {
      this.$router.push('/points/list');
    },
  },
  async created() {
    this.allObjects = await this.$store.dispatch('getAllObjects');
    if (this.allObjects) {
      this.allObjects = _.map(this.allObjects, (object, index) => {
        this.autocompleteObject.push({ text: `${object.name}`, value: index });
        return {
          name: object.name,
          label: object.label,
          fields: object.fields,
        };
      });
    }
    if (this.context === 'update') {
      this.conditions = this.design.meta.conditions;
      this.pointName = this.design.name;
      this.pointLabel = this.design.label;
      this.pointField = this.design.meta.pointField;
      this.selectedOperation = this.design.type;
      this.conditions = this.design.meta.conditions;
      this.selectedObject = _.findWhere(this.autocompleteObject, { text: this.design.object });
      this.availableFields();
    }
  },
};
</script>

<style scoped>
</style>
