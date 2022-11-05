<template>
  <div>
<!--    <v-autocomplete v-model="selected" :items="item.value.meta.items" chips dense multiple-->
<!--                    label="Select One Or More" outlined return-object small-chips>-->
<!--    </v-autocomplete>-->
    <v-select color="red" v-model="selected" :items="item.value.meta.dropdownArrayItems" chips dense
              :label="item.value.label" outlined small-chips
              :disabled="context === read || disabled" multiple
              :required="required" @input="updateValue(selected)">
    </v-select>
  </div>
</template>

<script>

export default {
  props: ['item', 'context', 'disabled', 'required', 'form', 'name'],
  data() {
    return {
      selected: [],
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
