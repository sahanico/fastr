<template>
  <v-select color="red" v-model="selected" :items="item.value.meta.dropdownItems" chips dense
            :label="item.value.label" outlined small-chips
            :disabled="context === read || disabled"
            :required="required" @input="updateValue(selected)">
  </v-select>
</template>

<script>

export default {
  props: ['item', 'context', 'name', 'form', 'required', 'disabled', 'default'],
  data() {
    return {
      selected: {},
      value: '',
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  created() {
    if (this.form[this.name]) {
      this.selected = this.item.value.meta.dropdownItems[this.form[this.name]];
    } else if (this.default) {
      if (this.default.type === 'literal') {
        this.selected = this.default.literal;
      }
    }
  },
};
</script>
