<template>
  <v-checkbox v-model="checkbox"  :label="label"  @change="updateValue(checkbox)"/>
</template>

<script>

export default {
  props: ['label', 'context', 'name', 'form', 'disabled', 'item'],
  data() {
    return {
      checkbox: false,
    };
  },
  methods: {
    updateValue(value) {
      // change value to string instead of boolean
      // console.log(typeof value);
      this.$emit('input', value);
    },
  },
  async created() {
    if ((this.name && this.from && this.form[this.name]) || this.context === 'update') {
      this.checkbox = this.form[this.name];
    }
  },
};
</script>
