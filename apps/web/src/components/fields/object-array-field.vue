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
    const def = this.object.meta.default;
    if (def && def.type === 'literal') {
      const record = _.findWhere(this.allRecords, { _id: def.literal });
      this.selected = {
        text: record.data.name,
        // eslint-disable-next-line no-underscore-dangle
        value: record._id,
      };
      // eslint-disable-next-line no-underscore-dangle
      this.$emit('input', record._id);
    }
    if (def && def.type === 'input') {
      if (def.input.name === 'logged_in_account') {
        const id = this.$store.state.system.account.id
        const record = _.findWhere(this.allRecords, { id });
        this.selected = {
          text: record.data.name,
          // eslint-disable-next-line no-underscore-dangle
          value: record._id,
        };
        // eslint-disable-next-line no-underscore-dangle
        this.$emit('input', record._id);
      } else if (def.input.name === 'logged_in_account_member') {
        const id = this.$store.state.system.account_member.id
        const record = _.findWhere(this.allRecords, { id });
        this.selected = {
          text: record.data.full_name,
          // eslint-disable-next-line no-underscore-dangle
          value: record._id,
        };
        // eslint-disable-next-line no-underscore-dangle
        this.$emit('input', record._id);
      } else {
        const record = _.findWhere(this.allRecords, { id: this.form[this.name] });
        this.selected = {
          text: record.data.first_name,
          // eslint-disable-next-line no-underscore-dangle
          value: record._id,
        };
      }
    }
  },
};
</script>
