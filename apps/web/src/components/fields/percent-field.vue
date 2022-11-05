<template>
  <v-text-field v-model="percentage" type="number" :label="Percentage"
                suffix="%" :disabled="context === 'read'" color="red"
                @input="updateValue(percentage)"></v-text-field>
</template>

<script>
import _ from 'underscore';

/** how would percentage work ? should this be similar to operations(eg. getSum - where we take
 * all values from records of a particular field and then do the calculations?  */
export default {
  props: ['label', 'context', 'name', 'form', 'required', 'default', 'disabled', 'design'],
  data() {
    return {
      percentage: '',
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  async created() {
    if (this.context === 'update') {
      if (this.form[this.name]) {
        this.percentage = this.form[this.name];
      }
    } else if (this.default) {
      if (this.default.type === 'literal') {
        this.percentage = this.default.literal;
      }
      if (this.default.type === 'input') {
        const input = _.findWhere(this.design.meta.inputs, { name: this.default.input.name });
        if (input.feeder === 'system') {
          if (input.system === 'logged_in_user') {
            const user = await this.$store.state.system.user;
            this.percentage = user[this.default.input.field];
            this.$emit('input', this.value);
          }
        }
      }
    }
  },

};
</script>
