<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="input.label" label="Label" />
      </v-col>
      <v-col>
        <v-text-field v-model="input.name" label="Name" />
      </v-col>
      <v-col>
        <v-autocomplete v-model="input.object" label="Object"
                        :items="autocompleteObjects" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['input', 'objects', 'primaryObject'],
  data() {
    return {
    };
  },
  computed: {
    autocompleteObjects() {
      if (!this.objects) return [];
      return _.map(this.objects, object => ({
        text: object.label,
        name: object.name,
      }));
    },
  },
};
</script>
