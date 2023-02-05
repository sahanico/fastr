<template>
  <v-text-field v-model="phoneNumber"
                :label="label" :disabled="context === 'read' || this.disabled"
                @input="updateValue(phoneNumber)" color="red" :rules="[rules.phone]" >
  </v-text-field>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

export default {
  props: ['item', 'context', 'form', 'required', 'name', 'label', 'disabled'],
  data() {
    return {
      phoneNumber: '',
      rules: {
        phone: (v) => {
          if (this.required) {
            if (!v) return `${this.label} is required`;
            if (v.length > 14) return `${this.label} is not a valid phone number`;
            if (/^\(\d{3}\)\s\d{3}-\d{4}$/.test(v)) return true;
            return `${this.label} is not a valid phone number`;
          }
          return true;
        },
      },
    };
  },
  methods: {
    updateValue(value) {
      const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      const newVal = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      this.$emit('input', newVal);
    },
  },
  watch: {
    form: {
      handler(form) {
        if (form[this.name] !== this.phoneNumber) {
          this.phoneNumber = form[this.name];
        }
      },
      deep: true,
    },
  },
  created() {
    if (this.form[this.name]) {
      this.phoneNumber = this.form[this.name];
    }
  },
};
</script>
