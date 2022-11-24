<template>
  <v-text-field :label="label" :disabled="context === 'read' || disabled"
                v-model="value"
                prefix="$" :required="required" @input="updateValue(value)"/>
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
    if (this.context === 'update' || this.context === 'create') {
      if (this.form[this.name]) {
        this.value = this.form[this.name];
      }
    }
  },
};
</script>
