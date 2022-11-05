<template>
  <div>
    <v-row>
      <v-col>
        <v-autocomplete v-model="condition.lhs.field" label="Primary Object Field"
                  :items="autocompleteFields" />
      </v-col>
      <v-col>
        <v-select v-model="condition.operator" label="Operator"
                  :items="['==', '!=', '>', '<']" />
      </v-col>
      <v-col>
        <v-select v-model="condition.rhs.type" label="Type"
                  :items="['literal', 'input', 'system']" />
      </v-col>
      <v-col v-if="condition.rhs.type === 'literal'">
        <v-text-field v-model="condition.rhs.value" label="Value" />
      </v-col>
      <v-col v-if="condition.rhs.type === 'input'">
        <v-autocomplete v-model="condition.rhs.object" :items="autocompleteObjects"
                  label="Object" />
      </v-col>
      <v-col v-if="condition.rhs.type === 'system'">
        <v-autocomplete v-model="condition.rhs.systemField" :items="getSystemFields"
                  label="System Field" />
      </v-col>
      <v-col v-if="(condition.rhs.object) && (condition.rhs.type === 'input')">
        <v-autocomplete v-model="condition.rhs.field"
                  :items="autocompleteFields"
                  label="Field" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['condition', 'objects', 'primaryObject'],
  computed: {
    getObjectLabels() {
      const labels = [];
      _.each(this.objects, (object) => {
        labels.push(object.label);
      });
      return labels;
    },
    getSystemFields() {
      return [
        { text: 'Logged In User', value: 'logged_in_user' },
        { text: 'Logged In Account', value: 'logged_in_account' },
      ];
    },
    autocompleteFields() {
      const autocomplete = [];
      if (!this.primaryObject) return autocomplete;
      _.each(this.primaryObject.fields, (field) => {
        if ((field.type === 'text') || (field.type === 'number' || (field.type === 'dropdown')
          || (field.type === 'object') || (field.type === 'checkbox'))) {
          autocomplete.push({
            value: field.name,
            text: field.label,
          });
        }
      });
      return autocomplete;
    },
    autocompleteObjects() {
      return _.map(this.objects, object => ({ text: object.label, value: object.name }));
    },
  },
};
</script>
