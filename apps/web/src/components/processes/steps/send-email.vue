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
                      :items="autocompletePool" chips dense
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
  <!-- Buttons -->
  <v-row class="justify-end">
    <v-col cols="12" sm="1">
      <v-btn color="red darken-2" text type="button"
             @click="cancelStep">Cancel
      </v-btn>
    </v-col>
    <v-col cols="12" sm="1">
      <v-btn color="red darken-2" text type="button"
             @click="addStep">Add Step
      </v-btn>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import _ from 'underscore';


export default {
  props: ['steps', 'step', 'objects', 'pool'],
  data() {
    return {
      toTypes: ['literal', 'variable'],
    };
  },
  computed: {
    autocompletePool() {
      return _.map(this.pool, item => ({
        text: item.label,
        value: item.object,
      }));
    },
    getObjectFields() {
      if (!this.step.meta.email.to.value.variable) return [];
      const object = _.findWhere(this.objects, {
        name: this.step.meta.email.to.value.variable.name.value,
      });
      const fields = [];
      _.each(object.fields, (field) => {
        fields.push(field.name);
      });
      return fields;
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
