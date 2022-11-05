<template>
  <v-container>
    <v-row>
      <v-col>Find Record Step</v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="3">
        <v-autocomplete v-model="findRecord.object" :items="autocompleteObject" chips dense
                        label="Select Object" outlined return-object small-chips
        />
      </v-col>
    </v-row>
    <v-row v-if=" (type === 'find_record')&& (Object.keys(findRecord.object).length !== 0)">
      <div class="title red--text">Conditions</div>
      <table style="width: 100%; padding-bottom: 32px;">
        <thead>
        <td>
          <v-row>
            <v-col cols="12" sm="3">
              LHS
            </v-col>
            <v-col cols="12" sm="3">
              Equality
            </v-col>
            <v-col cols="12" sm="6">
              RHS
            </v-col>
          </v-row>
        </td>
        </thead>
        <tr>
          <td>
            <div v-for="(item, idx) in findRecord.conditions" :key="idx">
              <v-row>
                <v-col cols="12" sm="3">
                  <v-select v-model="findRecord.conditions[idx].lhs.value"
                            :items="fieldNames"
                            chips dense outlined return-object small-chips
                            label="Field"></v-select>
                </v-col>
                <v-col v-if="getFieldType(findRecord.conditions[idx].lhs.value) === 'text'"
                       cols="12" sm="3"
                >
                  <v-select v-model="findRecord.conditions[idx].equality.condition"
                            :items="conditionsForString"
                            chips dense outlined return-object small-chips
                            label="Eqality"></v-select>
                </v-col>
                <v-col v-if="getFieldType(findRecord.conditions[idx].lhs.value) === 'number'"
                       cols="12" sm="3"
                >
                  <v-select v-model="findRecord.conditions[idx].equality.condition"
                            :items="conditionsForNumber"
                            chips dense outlined return-object small-chips
                            label="Equality"></v-select>
                </v-col>
                <v-col v-if="getFieldType(findRecord.conditions[idx].lhs.value) !== ''"
                       cols="12" sm="3"
                >
                  <v-select v-model="findRecord.conditions[idx].rhs.type"
                            :items="comparison"
                            chips dense outlined return-object small-chips
                            label=" Type"></v-select>
                </v-col>
                <v-col v-if="(getFieldType(findRecord.conditions[idx].lhs.value) === 'text') &&
                                        (findRecord.conditions[idx].rhs.type === 'literal')"
                       cols="12" sm="3"
                >
                  <v-text-field v-model="findRecord.conditions[idx].rhs.value"
                                chips dense outlined return-object small-chips
                                label="Literal"></v-text-field>
                </v-col>
                <v-col v-if="(getFieldType(findRecord.conditions[idx].lhs.value) === 'number') &&
                                        (findRecord.conditions[idx].rhs.type === 'literal')"
                       cols="12" sm="3"
                >
                  <v-text-field v-model="findRecord.conditions[idx].rhs.value"
                                chips dense outlined return-object small-chips
                                label="Literal" type="number"></v-text-field>
                </v-col>
              </v-row>
            </div>
          </td>
        </tr>
        <tfoot>
        <td>
          <v-row>
            <v-col cols="12" offset-sm="11">
              <v-btn icon
                     @click="addCondition">
                <v-icon class="red--text"> mdi-plus</v-icon>
              </v-btn>
              <v-btn icon
                     @click="findRecord.conditions.pop()">
                <v-icon class="red--text"> mdi-minus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </td>
        </tfoot>
      </table>
    </v-row>
    <v-row v-if="findRecord.conditions.length > 1">
      <v-col>
        <v-text-field v-model="combinatorValue" label="combinator"/>
      </v-col>
    </v-row>
    <!-- Buttons -->
    <v-row class="justify-end">
      <v-col cols="12" sm="1">
        <v-btn color="red darken-2" text type="button"
               @click="cancelStep">Cancel
        </v-btn>
      </v-col>
      <v-col cols="12" sm="1">
        <v-btn color="red darken-2" text type="button"
               @click="addStep">Add Step
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import _ from 'underscore';

const blankCondition = {
  lhs: {
    type: 'field',
    value: '',
  },
  equality: {
    condition: '',
  },
  rhs: {
    type: '',
    value: '',
  },
};
const blankFindRecord = {
  object: {},
  conditions: [],
  combinator: [],
};

export default {
  props: ['steps', 'objects', 'type', 'autocompleteObject', 'name', 'meta', 'pool'],
  data() {
    return {
      findRecord: { ...blankFindRecord },
      conditionsForString: [
        '==',
        '!=',
        'Like',
        '!Like',
      ],
      conditionsForNumber: [
        '==',
        '!=',
        '>',
        '<',
        '>=',
        '<=',
      ],
      comparison: [
        'literal',
        'variable',
        'input',
      ],
      condition: { ...blankCondition },
    };
  },
  computed: {
    fields() {
      if (this.findRecord.object.value) {
        return [this.objects[this.findRecord.object.value].fields];
      }
      return '';
    },
    fieldNames() {
      const names = [];
      if (this.findRecord.object.value) {
        const fields = this.objects[this.findRecord.object.value].fields;
        _.each(fields, (field) => {
          names.push(field.name);
        });
        return names;
      }
      return '';
    },
  },
  methods: {
    addStep() {
      const step = {
        name: this.name,
        type: this.type,
        meta: {
          findRecord: this.findRecord,
        },
      };
      this.$emit('addStep', step);
      this.cancelStep();
    },
    cancelStep() {
      this.$emit('cancelStep');
      this.findRecord = { ...blankFindRecord };
    },
    getFieldType(value) {
      let fieldType = '';
      _.each(this.fields, (keys) => {
        _.each(keys, (field) => {
          if (value === field.name) {
            fieldType = field.type;
          }
        });
      });
      return fieldType;
    },
    addCondition() {
      this.findRecord.conditions.push(this.condition);
      this.condition = { ...blankCondition };
    },
    combinatorValue() {
      const names = [];
      _.each(this.findRecord.conditions, (data) => {
        names.push(data.selectedField);
      });
      return names;
    },
  },
  created() {
    if (this.meta && this.meta.findRecord) {
      this.findRecord = this.meta.findRecord;
    }
  },
};
</script>

<style scoped>

</style>
