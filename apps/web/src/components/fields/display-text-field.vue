<template>
  <div>
    <v-card-title class="body-1" dark primary-title >
      {{ display }}
    </v-card-title>
  </div>

</template>

<script>


export default {
  props: ['item', 'context', 'default', 'form', 'label', 'name'],
  data() {
    return {
      display: '',
      dummy: 'hello',
    };
  },
  methods: {
    // updateValue(value) {
    //   this.$emit('input', value);
    // },
  },

  async created() {
    if (typeof this.default === 'string' && this.default !== '' && this.default !== undefined) {
      this.display = this.default;
      this.form[this.name] = this.display;
    } else {
      /* based on the data structure in object fields at createForm */
      // this.display = this.item.value.meta.displayText;
      /* based on the data structure in updateForm found in invoice at read-Dashboard */
      this.display = this.item.value.meta.value;
    }
  },
};
</script>
