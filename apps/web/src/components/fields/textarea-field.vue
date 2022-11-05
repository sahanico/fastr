<template>
  <v-textarea :rows="textAreaRows? textAreaRows : 1" row-height="30"
    v-model="value" :label="label" :disabled="context === 'read' || disabled"
    @input="updateValue(value)" color="red" :required="required"
  ></v-textarea>
</template>

<script>

export default {
  props: ['label', 'context', 'name', 'form', 'required', 'textAreaRows', 'disabled'],
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
    if (this.form[this.name]) {
      this.value = this.form[this.name];
    }
  },
};
</script>
