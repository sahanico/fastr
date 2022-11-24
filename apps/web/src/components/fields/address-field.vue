<template>
  <v-text-field :id="name" v-model="value" :disabled="context === 'read'" :label="label"
                 color="red" :required="required" @input="updateValue(value)"
                :ref="name"  placeholder="">
  </v-text-field>
</template>

<script>

export default {
  props: ['label', 'context', 'name', 'form', 'required', 'autocomplete', 'disabled', 'design'],
  data() {
    return {
      value: '',
    };
  },
  mounted() {
    // eslint-disable-next-line no-undef
    const originAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById(this.name),
    );
    originAutocomplete.setComponentRestrictions({
      country: ['ca'],
    });
    originAutocomplete.addListener('place_changed', () => {
      const place = originAutocomplete.getPlace();
      this.value = place.formatted_address;
      this.updateValue(this.value);
    });
  },
  watch: {
    form: {
      handler(form) {
        if (form[this.name] !== this.value) {
          this.value = form[this.name];
        }
      },
      deep: true,
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  created() {
    if (this.form[this.name]) {
      this.value = this.form[this.name];
    }
  },
};
</script>
