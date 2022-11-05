<template>
  <v-text-field v-model="value" :label="label" :disabled="context === 'read' || this.disabled"
                @input="updateValue(value)" color="red" :required="required">
  </v-text-field>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['item', 'label', 'context', 'name', 'form', 'required', 'default', 'disabled', 'design'],
  data() {
    return {
      value: '',
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  watch: {
    form: {
      handler(form) {
        if (form[this.name] !== this.value) {
          this.value = form[this.name];
        }
      },
      deep: true,
    },
  },
  async created() {
    // if (this.form.default === true) {
    //   // this.value = this.form.meta.default;
    //   this.value = this.default;
    // }
    if (this.context === 'update') {
      if (this.form[this.name]) {
        this.value = this.form[this.name];
      }
    } else if (this.default) {
      if (typeof this.default === 'string') {
        this.value = this.default;
      }
      if (this.default.type === 'literal') {
        this.value = this.default.literal;
      }
      if (this.default.type === 'input') {
        const input = _.findWhere(this.design.meta.inputs, { name: this.default.input.name });
        if (input.feeder === 'system') {
          if (input.system === 'logged_in_user') {
            const user = await this.$store.state.system.user;
            this.value = user[this.default.input.field];
            this.$emit('input', this.value);
          }
        }
      }
    }
  },
};
</script>
