<template>
<v-container>
  <v-row>
  <v-col  cols="12" sm="4">
    <v-autocomplete v-model="step.meta.email.to.type" :items="toTypes" chips dense
                    label="To" outlined return-object small-chips >
    </v-autocomplete>
  </v-col>
  <v-col v-if="step.meta.email.to.type === 'literal'"  cols="12" sm="4">
    <v-text-field v-model="step.meta.email.to.value.literal" label = 'Enter email'>

    </v-text-field>
  </v-col>
    <v-col v-if="step.meta.email.to.type === 'variable'"  cols="12" sm="4">
      <v-autocomplete v-model="step.meta.email.to.value.variable.name"
                      :items="variables" chips dense
                      label="Variable" outlined return-object small-chips>
      </v-autocomplete>
    </v-col>
    <v-col v-if= "step.meta.email.to.value.variable.name !== ''"  cols="12" sm="4">
      <v-autocomplete v-model="step.meta.email.to.value.field" :items="getObjectFields" chips dense
                      label="Select field" outlined return-object small-chips>
      </v-autocomplete>
    </v-col>
  </v-row>
  <v-row>
    <v-text-field v-model="step.meta.email.subject" label='Subject' style="margin: 12px;" />
  </v-row>
  <v-row>
    <v-textarea v-model="step.meta.email.message"  auto-grow label='Message' style="margin: 12px" />
  </v-row>
</v-container>
</template>

<script>
import _ from 'underscore';


export default {
  props: ['steps', 'step', 'objects', 'pool', 'variables'],
  data() {
    return {
      toTypes: ['literal', 'variable'],
    };
  },
  computed: {
    getObjectFields() {
      if (!this.step.object) return [];
      const object = _.findWhere(this.objects, { name: this.step.object });
      if (!object) return [];
      return _.map(object.fields, field => ({ text: field.label, value: field.name }) )
    },
  },
  methods: {
    addStep() {
      const step = {
        name: this.name,
        type: this.type,
        meta: {
          email: this.email,
        },
      };

      if (this.email.to.type === 'literal') {
        step.meta.email.to.value = { literal: this.email.to.value.literal };
      } else if (this.email.to.type === 'variable') {
        step.meta.email.to.value = { variable: this.email.to.value.variable };
      }

      this.$emit('addStep', step);
      this.cancelStep();
    },
    cancelStep() {
      this.$emit('cancelStep');
    },
  },
  created() {
    if (this.meta && this.meta.email) {
      this.email = this.meta.email;
    }
  },
};
</script>

<style scoped>

</style>
