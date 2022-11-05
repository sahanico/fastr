<template>
  <v-autocomplete v-model="value" :items="autocompleteDesigns" :label="label"
                  :disabled="context === 'read'"
                  @input="updateValue(value)" color="red" :required="required">
  </v-autocomplete>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['label', 'context', 'name', 'form', 'required', 'typeFilter'],
  data() {
    return {
      value: '',
      designs: [],
    };
  },
  computed: {
    autocompleteDesigns() {
      if (this.designs.length === 0) return [];
      const designs = _.map(this.designs, design => ({
        text: `${design.label} (${design.type})`,
        value: design.name,
        type: design.type,
      }));
      if (this.typeFilter) {
        const filteredDesign = _.where(designs, { type: this.typeFilter });
        return filteredDesign;
      }
      return designs;
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  async created() {
    if ((this.name && this.from && this.form[this.name]) || this.context === 'update') {
      this.value = this.form[this.name];
    }
    this.designs = await this.$store.dispatch('getAllDesigns');
  },
};
</script>
