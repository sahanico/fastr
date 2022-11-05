<template>

  <v-text-field v-model="computed" type="number" :label="computed"
                :disabled="context === 'read'" color="red"
                @input="updateValue(computed)"></v-text-field>
</template>

<script>

export default {
  // props: ['item', 'context'],
  props: ['label', 'context', 'name', 'form', 'required', 'default', 'disabled', 'design'],
  data() {
    return {
      computed: '',
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },


};
</script>
