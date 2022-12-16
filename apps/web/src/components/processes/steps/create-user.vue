<template>
  <v-container>
    <v-row>
      <v-col>Create User</v-col>
    </v-row>
    <v-row>
      <v-container>
        <v-row>
          <v-col>
            Email
          </v-col>
          <v-col>
            <v-autocomplete v-model="step.meta.user.email.variable" :items="variables"
                            label="Variable" outlined return-object small-chips
            />
          </v-col>
          <v-col>
            <v-autocomplete v-model="step.meta.user.email.field" :items="autocompleteEmailVariableFields"
                            label="Variable Field" outlined return-object small-chips
            />
          </v-col >
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'underscore';
import FieldMapping from '../field-mapping';

export default {
  components: {
    FieldMapping
  },
  props: ['steps', 'step', 'pool', 'objects', 'variables'],
  computed: {
    autocompleteEmailVariableFields() {
      if (this.step.meta.user.email.variable === '') return [];
      if (this.step.meta.user.email.variable) {
        const object = _.findWhere(this.objects, {name: this.step.meta.user.email.variable.value.object });
        console.log('object: ', object);
        if (!object) return [];
        return _.map(object.fields, item => ({
          text: item.label,
          value: item.name,
        }));
      }
    },
  },
};
</script>

<style scoped>

</style>
