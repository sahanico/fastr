<template>
  <VuePhoneNumberInput v-model="phoneNumber"  color="red"
                       no-validator-state :disabled="context === 'read'" :no-country-selector="true"
                       @input="updateValue(phoneNumber)" :no-example="true"/>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

export default {
  props: ['item', 'context', 'form', 'required', 'name'],
  components: {
    VuePhoneNumberInput,
  },
  data() {
    return {
      phoneNumber: '',
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
