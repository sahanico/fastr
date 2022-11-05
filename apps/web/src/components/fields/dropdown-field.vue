<template>
<!--  <v-select color="red" v-model="selected" :items="item.value.meta.dropdownItems" chips dense-->
<!--            :label="item.value.label" outlined small-chips-->
<!--            :disabled="context === read || disabled"-->
<!--            :required="required" @input="updateValue(selected)">-->
<!--  </v-select>-->
  <v-select color="red" v-model="selected" :items="item.value.meta.dropdownItems" chips dense
            :label="item.value.label" outlined small-chips
            :disabled="context === read || disabled"
            :required="required" @input="updateValue(selected)">
  </v-select>
</template>

<script>

export default {
  props: ['item', 'context', 'name', 'form', 'required', 'disabled'],
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
      this.selected = this.form[this.name];
    }
  },
};
</script>
