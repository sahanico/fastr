<template>
  <v-text-field type="number" v-model="value" :label="label"
                :disabled="context === 'read' || disabled"
                @input="updateValue(value)" :required="required">
  </v-text-field>
</template>

<script>

export default {
  props: ['label', 'context', 'name', 'form', 'required', 'disabled'],
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
  created() {
    // if (this.form.default === true) {
    //   this.value = this.form.meta.default;
    // }
    if (this.context === 'update') {
      if (this.form[this.name]) {
        this.value = this.form[this.name];
      }
    }
  },
};
</script>
