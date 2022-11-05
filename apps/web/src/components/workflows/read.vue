<template>
  <div v-if="design && design.meta">
    <div class="headline red--text pt-2 mt-2 pb-2 mb-2">
      {{ this.design.label }}
    </div>
    <div v-if="design.meta && design.meta.pages">
      <v-stepper v-model="stepper" color="red">
        <v-stepper-header>
          <div v-for="(item, index) in design.meta.pages" :key="index">
            <v-stepper-step :complete="stepper > index + 1" :step="index + 1" color="red">
              {{ item.label }}
            </v-stepper-step>
            <v-divider></v-divider>
          </div>
        </v-stepper-header>
        <v-stepper-items>
          <div v-for="(item, index) in design.meta.pages" :key="index">
            <v-stepper-content :step="index + 1">
              <create-form :form-name="item.form"
                           :name="`create-form-${item.form}`" />
              <v-btn dark color="red" @click="stepper = index + 1">Continue</v-btn>
              <v-btn text>Cancel</v-btn>
            </v-stepper-content>
          </div>
        </v-stepper-items>
      </v-stepper>
    </div>
  </div>
</template>

<script>
import CreateForm from '../forms/create';

export default {
  name: 'read',
  components: { CreateForm },
  props: ['obj', 'input', 'designName'],
  data() {
    return {
      design: {},
      stepper: 1,
    };
  },
  computed: {
  },
  async created() {
    this.design = await this.$store.dispatch('getDesignByName', { name: this.designName });
  },
};
</script>

<style scoped>

</style>

