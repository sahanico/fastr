<template>
  <div>
    <v-text-field v-model="email" :rules="[rules.email]"  color="red" :label="label"
                  :disabled="context === 'read' || disabled" @input="updateValue(email)" />
  </div>

</template>

<script>

export default {
  props: ['item', 'context', 'form', 'required', 'name', 'label', 'disabled'],
  data() {
    return {
      email: '',
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
      },
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
        if (form[this.name] !== this.email) {
          this.email = form[this.name];
        }
      },
      deep: true,
    },
  },
  created() {
    if (this.form[this.name]) {
      this.email = this.form[this.name];
    }
  },
};
</script>
