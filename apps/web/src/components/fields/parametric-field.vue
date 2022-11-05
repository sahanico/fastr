<template>
  <v-container style="{margin-bottom: 10px}">
    <v-row>
      <v-col>
        <v-autocomplete v-model="value.parent" :label="label" :disabled="context === 'read'"
                        :items="autocompleteParentRecords" solo dense
                      @input="updateValue(value)" color="red" :required="required">
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete v-model="value.child" :label="label" :disabled="!value.parent"
                        :items="autocompleteChildRecords" solo dense
                        @input="updateValue(value)" color="red" :required="required">
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['label', 'context', 'name', 'form', 'required', 'field'],
  data() {
    return {
      value: {
        parent: '',
        child: '',
      },
      recs: [],
      autocompleteParentRecords: [],
      autocompleteChildRecords: [],
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
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
    'value.parent': {
      handler(value) {
        const objectRecords = [];
        _.each(this.recs, (record) => {
          if (record.object === this.field.value.meta.child) {
            objectRecords.push(record);
          }
        });
        const childRecords = [];
        _.each(objectRecords, (record) => {
          if (record.data[this.field.value.meta.parent] === value) {
            childRecords.push(record);
          }
        });
        this.autocompleteChildRecords = _.map(childRecords, record => ({
          text: record.data.full_name, // todo: fix hardcode
          // eslint-disable-next-line no-underscore-dangle
          value: record._id,
        }));
      },
      deep: true,
    },
  },
  async created() {
    if (this.form[this.name]) {
      this.value = this.form[this.name];
    }
    this.recs = await this.$store.dispatch('getAllRecords');
    const objectRecords = [];
    _.each(this.recs, (record) => {
      if (record.object === this.field.value.meta.parent) {
        objectRecords.push(record);
      }
    });
    this.autocompleteParentRecords = _.map(objectRecords, record => ({
      text: record.data.name,
      // eslint-disable-next-line no-underscore-dangle
      value: record._id,
    }));
  },
};
</script>
