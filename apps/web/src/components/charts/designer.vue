<template>
  <div id="charts">
    <div>
      <v-dialog v-if="context != 'update'" v-model="selectDialog" width="500px">
        <v-card>
          <v-card-text class="headline red white--text" dark
                       primary-title> Please choose an object and a chart type
          </v-card-text>
          <v-row style="margin: 10px">
            <v-col style="margin-left: 32px">
              <v-autocomplete v-model="selectedObject" :items="autocompleteObject" chips dense
                              outlined return-object small-chips style="max-width: 150px"
                              label="Objects"></v-autocomplete>
            </v-col>
            <v-col>
              <v-select v-model="chartDesign.chartType" :items="chartTypes" chips dense
                        outlined return-object small-chips style="max-width: 150px"
                        label="Chart Types"></v-select>
            </v-col>
          </v-row>
          <v-btn color="red darken-2" text type="button"
                 style="margin-left: 20px" @click="selectDialog = false">OK
          </v-btn>
        </v-card>
      </v-dialog>
      <v-dialog v-model="addFieldDialog" width="580px">
        <v-card>
          <v-card-text class="headline red white--text" dark
                       primary-title> Select a field and it's operation
          </v-card-text>
          <v-row style="margin-top: 4px; margin-left: 12px">
            <v-alert border="top" colored-border type="info" elevation="2" dense>
              Supported field types: text, number, checkbox, date, array, object, datetime
            </v-alert>
          </v-row>
          <v-row style="margin: 10px">
            <v-col style="margin-left: 32px">
              <v-select v-model="selectedField" :items="fieldLabelsForPie" chips dense
                        outlined return-object small-chips style="max-width: 150px"
                        label="Fields"></v-select>
            </v-col>
            <v-col>
              <v-select v-model="selectedOperation" :items="OperationsForPie" chips dense
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
      <v-dialog v-model="updatedDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Design Updated
          </v-card-title>
          <v-card-text> Chart design has been Updated!
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button"
                   @click="updatedDialog = false">Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Design Saved
          </v-card-title>
          <v-card-text> Chart design has been saved!
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
        Charts
      </div>
      <form lazy-validation @submit.prevent="onSubmit">
        <div style="margin: 8px">
          <v-card elevation="1">
            <v-row style="margin: 20px">
              <v-col>
                <v-text-field
                  v-model="object" label="Object" disabled>
                </v-text-field>
              </v-col>
              <v-col>
                <v-select v-model="chartDesign.chartType" :items="chartTypes"
                          label="Chart Type"></v-select>
              </v-col>
              <v-col>
                <v-text-field v-model="chartDesign.chartLabel" label="Label" required />
              </v-col>
              <v-col>
                <v-text-field :disabled="context === 'update'"
                              v-model="chartDesign.chartName" label="Name"
                              required />
              </v-col>
            </v-row>
          </v-card>

        </div>
        <div style="margin: 4px">
          <v-row style="border: 1px dashed black; margin: 4px; min-height: 400px">
            <td style="margin: 4px; width: 75%">
              <div class="headline text-xs-center red--text pb-5 pt-5">
                Fields
              </div>
              <v-btn color="red darken-2" dark style="align: right;"
                     @click="addFieldDialog = true">Add Field
              </v-btn>
              <v-data-table :headers="fieldHeaders" :items="chartFields" class="elevation-1">
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteField(item)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </td>
            <v-col style="border-left: 1px dashed black">

              <v-card-text class="headline  black--text align-center text-center" dark
                           primary-title> Chart Options
              </v-card-text>
              <div><br></div>
              <!--              todo: properly assign the axes for bar and line-->
              <div v-if="chartDesign.chartType === 'bar' || chartDesign.chartType === 'line'">
                <v-row>
                  <v-card-text class="headline  black--text " dark
                               primary-title> Y - Axis
                  </v-card-text>
                  <v-text-field label="Start From (eg. 0)" chips dense outlined return-object
                                small-chips style="margin-right:80px; margin-left: 10px"
                                type="number"
                  ></v-text-field>
                  <v-text-field label="End At (eg. 300)" chips dense outlined return-object
                                small-chips style="margin-right:80px; margin-left: 10px"
                                type="number"
                  ></v-text-field>
                  <v-text-field label="Step Size" chips dense outlined return-object
                                small-chips style="margin-right:80px; margin-left: 10px"
                                type="number"
                  ></v-text-field>
                  <v-checkbox label="reverse">
                  </v-checkbox>
                  <v-select label="Background Color" :items="colorOptions"></v-select>
                </v-row>
                <br>
                <v-row>
                  <v-checkbox v-model="axisX" :label="`X-axis: ${axisX.toString()}`">
                  </v-checkbox>
                  <v-text-field chips dense outlined return-object small-chips style="margin: 12px"
                  ></v-text-field>
                </v-row>
              </div>
            </v-col>
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
        <div>
          <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import conditions from '../conditions/conditions';

export default {

  components: { conditions },
  props: ['design', 'path', 'context'],
  data() {
    return {
      backGroundColor: '',
      selectDialog: true,
      updatedDialog: false,
      addFieldDialog: false,
      designExistsDialog: false,
      createDialog: false,
      chartDesign: {
        chartName: '',
        chartLabel: '',
        chartType: '',
      },
      selectedType: '',
      selectedObject: {},
      chartLabel: '',
      chartName: '',
      selectedField: {},
      selectedOperation: '',
      allObjects: [],
      autocompleteObject: [],
      autocompleteField: [],
      axisX: false,
      axisY: false,
      fieldHeaders: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Operation', value: 'operation' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      chartFields: [],
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
    object() {
      if (this.selectedObject.value) {
        return this.allObjects[this.selectedObject.value].name;
      }
      return '';
    },
    chartTypes() {
      const types = [
        'pie',
        'bar',
        'line',
      ];
      return types;
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
    colorOptions() {
      const colorNames = [
        'red',
        'green',
        'blue',
        'black',
        'yellow',
        'bluebird',
        'cornflowerblue',
      ];
      return colorNames;
    },
    availableFields() {
      const fields = this.fieldLabels;
      const chartFields = _.map(this.chartFields, item => item.label);
      const remaining = _.filter(fields, item => chartFields.indexOf(item) === -1);
      return remaining;
    },
    fieldLabelsForPie() {
      const labels = [];
      if (this.selectedObject.value) {
        const fields = this.allObjects[this.selectedObject.value].fields;
        _.each(fields, (field) => {
          if ((field.type === 'text') || (field.type === 'number') || (field.type === 'checkbox')
            || (field.type === 'date') || (field.type === 'array') || (field.type === 'object')
            || (field.type === 'date_time') || (field.type === 'dropdown')) {
            labels.push(field.label);
          }
        });
        return labels;
      }
      return '';
    },
    getTypeFromFieldLabel() {
      let type = '';
      _.each(this.fields, (field) => {
        if (field.label === this.selectedField) {
          // test.push(field.type)
          type = (field.type);
        }
      });
      return type;
    },
    OperationsForPie() {
      if (this.getTypeFromFieldLabel === 'text') {
        return ['count'];
      } else if (this.getTypeFromFieldLabel === 'number') {
        return ['count', 'avg', 'sum', 'min', 'max'];
      } else if (this.getTypeFromFieldLabel === 'checkbox') {
        return ['count'];
      } else if (this.getTypeFromFieldLabel === 'date') {
        return ['count'];
      } else if (this.getTypeFromFieldLabel === 'object') {
        return ['count'];
      } else if (this.getTypeFromFieldLabel === 'dropdown') {
        return ['count'];
      } else if (this.getTypeFromFieldLabel === 'date_time') {
        return ['group_by_date'];
      }
      return [''];
    },
  },
  methods: {
    async onSubmit() {
      const config = {
        name: this.chartDesign.chartName,
        label: this.chartDesign.chartLabel,
        type: 'chart',
        object: this.object,
        meta: {
          chartType: this.chartDesign.chartType,
          chartFields: this.chartFields,
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
        if (field.label === this.selectedField) {
          this.chartFields.push({
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
      this.chartFields.splice(this.chartFields.indexOf(item), 1);
    },
    routeToList() {
      this.$router.push('/charts/list');
    },
  },
  async created() {
    this.allObjects = await this.$store.dispatch('getAllObjects');
    if (this.allObjects) {
      this.allObjects = _.map(this.allObjects, (object, index) => {
        this.autocompleteObject.push({ text: `${object.name}`, value: index });
        return {
          name: object.name,
          fields: object.fields,
          label: object.label,
        };
      });
    }
    if (this.context === 'update') {
      this.chartDesign.chartName = this.design.name;
      this.chartDesign.chartLabel = this.design.label;
      this.chartDesign.chartType = this.design.meta.chartType;
      this.chartFields = this.design.meta.chartFields;
      this.object = this.design.object;
    }
  },
};
</script>

<style scoped>
</style>
