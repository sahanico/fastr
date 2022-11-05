<template>
  <v-container
    class="px-0"
    fluid
  >
    <v-radio-group row  v-model="radio" @change="updateValue(radio)">
      <v-radio
        v-for="(item, idx) in items" :key="idx"
        :label="item"
        :value="idx"
      ></v-radio>
    </v-radio-group>
  </v-container>

</template>

<script>

export default {
  props: ['items', 'item', 'label', 'context', 'name', 'form', 'required', 'disabled'],
  data() {
    return {
      // radio: 0,
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  created() {
    if (this.form[this.name]) {
      this.radio = this.form[this.name];
    }
  },
};
</script>
