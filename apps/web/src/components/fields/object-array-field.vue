<template>
  <div ref="minH">
    <v-autocomplete v-model="selected" :items="autocomplete" chips dense
                    :disabled="context === 'read'"
                    multiple @input="updateValue(selected)"
                    :label="label" outlined return-object
                    small-chips>
    </v-autocomplete>
  </div>
</template>

<script>
import { _ } from 'vue-underscore';
import CreateInlistForm from '../forms/create-inlist';

export default {
  props: ['object', 'context', 'rootFormFieldIndex', 'label', 'disabled', 'form', 'name'],
  components: {
    CreateInlistForm,
  },
  data() {
    return {
      forms: [{}],
      allRecords: [],
      autocomplete: [],
      selected: [],
    };
  },
  computed: {
    selectedValue() {
      const values = [];
      if (this.allRecords === null) {
        return '';
      }
      _.each(this.selected, (select) => {
        values.push(this.allRecords[select.value].data.name);
      });
      return values;
    },
  },
  methods: {
    updateValue() {
      this.$emit('input', this.selectedValue);
    },
  },
  watch: {
    forms(val) {
      this.$emit('input', val);
      const height = this.$refs.minH.clientHeight + 340;
      if (height !== 0) this.$emit('updateHeight', height, this.rootFormFieldIndex);
      return height;
    },
  },
  async created() {
    if (this.context === 'create' || this.context === 'update') {
      this.allRecords = await this.$store.dispatch('getRecordsByObject', {
        object: this.object.meta.objectArray.text,
      });
      this.label = `Select ${this.object.meta.objectArray.text}`;
    } else {
      this.allRecords = await this.$store.dispatch('getRecordsByObject', {
        object: this.object.text,
      });
      // :label="'Select ' + object.text"
      this.label = `Select ${this.object.text}`;
    }
    if (this.allRecords) {
      _.each(this.allRecords, (record, index) => {
        this.autocomplete.push({ text: `${record.data.name}`, value: index });
      });
      if (this.form[this.name]) {
        _.each(this.allRecords, (record, idx) => {
          _.each((this.form[this.name]), (recordName, i) => {
            if (recordName === record.data.name) {
              this.selected[i] = {
                text: record.data.name,
                value: idx,
              };
            }
          });
        });
      }
    }
  },
};
</script>
