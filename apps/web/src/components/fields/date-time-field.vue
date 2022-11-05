<template>
  <v-text-field v-model="value" :label="label" :disabled="disabled || context === 'read'"
                @input="updateValue(value)" prepend-icon="event" color="red" >
  </v-text-field>
</template>

<script>

export default {
  props: ['label', 'context', 'disabled', 'form', 'name'],
  data() {
    return {
      value: '',
    };
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
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  created() {
    if (this.context === 'update') {
      if (this.form[this.name]) {
        this.value = this.form[this.name];
      }
    }
  },
};
</script>
