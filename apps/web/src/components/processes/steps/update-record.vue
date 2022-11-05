<template>
  <v-container>
    <v-row>
      <v-col>Update Record Step</v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="3">
        <v-autocomplete v-model="step.meta.object" :items="autocompletePool" chips dense
                        label="Select Variable" outlined return-object small-chips
        />
      </v-col>
    </v-row>
    <v-row>
      <v-container>
        Field Mappings
        <v-row v-for="(field, index) in objectFields" :key="index">
          <v-col>
            <v-text-field :value="field.text" :disabled="true" />
          </v-col>
          <v-col>
            <v-text-field v-model="step.meta.fields[field.value]"
                         label="Value" />
          </v-col>
        </v-row>
      </v-container>
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

export default {
  props: ['steps', 'step', 'pool', 'objects'],
  computed: {
    autocompletePool() {
      return _.map(this.pool, item => ({
        text: item.label,
        value: item.object,
      }));
    },
    objectFields() {
      if (!this.step.meta.object) return [];
      const object = _.findWhere(this.objects, { name: this.step.meta.object.value });
      if (!object && !object.fields) return [];
      return _.map(object.fields, field => ({
        text: field.label,
        value: field.name,
      }));
    },
  },
  methods: {
    addStep() {
      this.$emit('addStep', this.step);
      this.cancelStep();
    },
    cancelStep() {
      this.$emit('cancelStep');
    },
  },
};
</script>

<style scoped>

</style>
