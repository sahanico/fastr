<template>
  <v-container>
    <v-row>
      <v-col>Find PDF</v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="3">
        <v-autocomplete v-model="step.meta.object" :items="autocompletePool" chips dense
                        label="Select Variable" outlined return-object small-chips
        />
      </v-col>
      <v-col cols="12" sm="3">
        <v-autocomplete v-model="step.meta.template" :items="autocompleteTemplates" chips dense
                        label="Select Template" outlined return-object small-chips
        />
      </v-col>
    </v-row>
    <v-row>
      <v-container>
        Field Mappings
        <v-row v-for="(field, index) in templateFields" :key="index">
          <v-col>
            <v-text-field :value="field" :disabled="true" />
          </v-col>
          <v-col>
            <v-select v-model="step.meta.fields[field]" :items="objectFields"/>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'underscore';

export default {
  name: 'create-pdf',
  props: ['steps', 'step', 'pool', 'objects'],
  computed: {
    autocompletePool() {
      return _.map(this.pool, item => ({
        text: item.label,
        value: item.object,
      }));
    },
    objectFields() {
      if (!this.step.meta.object) return [];
      const object = _.findWhere(this.objects, { name: this.step.meta.object.value });
      return _.map(object.fields, field => ({
        text: `${field.label} (${field.name})`,
        value: field.name,
      }));
    },
    autocompleteTemplates() {
      if (!this.step.meta.object) return [];
      const object = _.findWhere(this.objects, { name: this.step.meta.object.value });
      if (!object) return [];
      return _.map(object.templates, template => ({
        text: template.label,
        value: template.name,
        path: template.path,
      }));
    },
    templateFields() {
      if (!this.step.meta.object) return [];
      if (!this.step.meta.template) return [];
      const object = _.findWhere(this.objects, { name: this.step.meta.object.value });
      const template = _.findWhere(object.templates, { name: this.step.meta.template.value });
      return template.fields;
    },
  },
  methods: {
    addStep() {
      this.$emit('addStep', this.step);
      this.cancelStep();
    },
    cancelStep() {
      this.$emit('cancelStep');
    },
  },
  watch: {
    'step.meta.template': {
      handler(val) {
        if (!this.step.meta.object) return;
        if (!this.step.meta.template) return;
        const object = _.findWhere(this.objects, { name: this.step.meta.object.value });
        const template = _.findWhere(object.templates, { label: val.text });
        _.each(template.fields, (field) => {
          const pair = { [field]: '' };
          this.step.meta.fields = { ...this.step.meta.fields, ...pair };
        });
      },
    },
  },
};
</script>
