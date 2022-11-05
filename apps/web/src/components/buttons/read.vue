<template>
  <div>
    <div style="width: 100%; height: 100%">
      <v-btn color="red darken-2" dark @click="triggerProcess">
        {{ buttonDesign.buttonLabel }}
      </v-btn>
    </div>
  </div>
</template>

<script>

export default {
  name: 'button-read',
  props: ['name', 'obj', 'input', 'design'],
  data() {
    return {
      button: [],
      records: [],
      label: '',
      value: '',
      buttonDesign: {
        buttonName: '',
        buttonLabel: '',
      },
      process: '',
    };
  },
  async created() {
    this.button = await this.$store.dispatch('getDesignByName', {
      name: this.name,
    });
    this.buttonDesign.buttonName = this.name;
    this.buttonDesign.buttonLabel = this.design.value.label;
    this.process = this.design.value.meta.process;
  },
  methods: {
    triggerProcess() {
      this.$store.dispatch('runProcess', {
        process: this.design.value.meta.process,
      });
    },
  },
};
</script>

