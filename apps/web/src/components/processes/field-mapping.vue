<template>
  <v-row>
    <v-col>
      <v-autocomplete v-model="field.text" :items="autocompleteFields"/>
    </v-col>
    <v-col>
      <v-autocomplete v-model="field.type" :items="['literal', 'field']"/>
    </v-col>
    <v-col v-if="field.type === 'field'">
      <v-autocomplete v-model="field.variable" :items="variables"
                      label="Variable" outlined return-object small-chips
      />
    </v-col>
    <v-col v-if="field.type === 'field'">
      <v-autocomplete v-model="field.field" :items="autocompleteVariableFields"
                      label="Variable Field" outlined return-object small-chips
      />
    </v-col >
    <v-col v-if="field.type === 'literal'">
      <v-text-field v-model="field.value"
                    label="Value" />
    </v-col>
  </v-row>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['field', 'variables', 'autocompleteFields', 'objects'],
  computed: {
    autocompleteVariableFields() {
      if (this.field.variable) {
        const object = _.findWhere(this.objects, {name: this.field.variable.value.object });
        if (!object) return [];
        return _.map(object.fields, item => ({
          text: item.label,
          value: item.name,
        }));
      }
    }
  }
}
</script>
