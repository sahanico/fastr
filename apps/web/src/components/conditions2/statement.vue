<template>
  <v-container>
    <v-row>
      <v-col>
        <v-autocomplete v-model="statement.lhs.variable" label="Variable"
                  :items="variables" />
      </v-col>
      <v-col>
        <v-autocomplete v-model="statement.lhs.field" label="Variable Field"
                        :items="autocompleteLHSVariableFields" />
      </v-col>
      <v-col cols="auto"/>
      <v-col>
        <v-select v-model="statement.operator" label="Operator"
                  :items="['==', '!=', '>', '<', 'where']" />
      </v-col>
      <v-col cols="auto"/>
      <v-col>
        <v-select v-model="statement.rhs.type" label="Type"
                  :items="['literal', 'object', 'system', 'input']" />
      </v-col>
      <v-col v-if="statement.rhs.type === 'literal'">
        <v-text-field v-model="statement.rhs.literal" label="Value" />
      </v-col>
      <v-col v-if="statement.rhs.type === 'object' || statement.rhs.type === 'input'">
        <v-autocomplete v-model="statement.rhs.object" :items="autocompleteRHSObjects"
                  label="Object" />
      </v-col>
      <v-col v-if="statement.rhs.object">
        <v-autocomplete v-model="statement.rhs.field" :items="autocompleteRHSObjectFields"
                  label="Field" />
      </v-col>
      <v-col v-if="statement.rhs.type === 'system'">
        <v-autocomplete v-model="statement.rhs.systemField" :items="getSystemFields"
                  label="System Field" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['statement', 'objects', 'pool', 'steps', 'variables'],
  model: {
    prop: 'statement',
  },
  computed: {
    autocompleteLHSVariables() {
      const poolVariables = _.map(this.pool, item => ({ text: item.label, value: item.name }));
      const stepVariables = _.map(this.steps, step => {
        if(step.type === 'if') {
          _.each(step.meta.steps, item =>  ({ text: item.label, value: item.name }));
        } else {
          return { text: step.label, value: step.name }
        }
      });
      return [...poolVariables, ...stepVariables];
    },
    autocompleteLHSVariableFields() {
      if (this.statement.lhs.variable) {
        const object = _.findWhere(this.objects, { name: this.statement.lhs.variable.object });
        if(!object) return [];
        return _.map(object.fields, field => ({ text: field.label, value: field.name }));
      }
      return [];
    },
    getSystemFields() {
      return [
        { text: 'Logged In User', value: 'logged_in_user' },
        { text: 'Logged In User', value: 'logged_in_user' },
        { text: 'Logged In Account', value: 'logged_in_account' },
      ];
    },
    autocompleteRHSObjectFields() {
      const object = _.findWhere(this.objects, { name: this.statement.rhs.object })
      if (!object) return [];
      return _.map(object.fields, (field) => ({
        text: field.label,
        value: field.name,
      }));
    },
    autocompleteRHSObjects() {
      return _.map(this.objects, object => ({ text: object.label, value: object.name }));
    },
  },
};
</script>
