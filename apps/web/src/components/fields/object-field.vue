<template>
  <div ref="minH">
    <v-autocomplete v-model="selected" :items="autocomplete" chips dense :value="value"
                    :disabled="context === 'read' || disabled" color="red"
                    @input="updateValue(selected)"
                    :label="label" outlined small-chips return-object>
    </v-autocomplete>
  </div>
</template>

<script>
import { _ } from 'vue-underscore';
import CreateInlistForm from '../forms/create-inlist';

export default {
  components: {
    CreateInlistForm,
  },
  props: ['object', 'context', 'rootFormFieldIndex', 'label', 'disabled', 'form', 'name'],
  data() {
    return {
      allRecords: [],
      autocomplete: [],
      selected: {},
      value: '',
    };
  },
  computed: {
    selectedValue() {
      if (this.allRecords === null) {
        return '';
      }
      return this.allRecords[this.selected.value].data.name;
    },
    // testGetObjectName() {
    // this.form.account is returning an undefined error
    //   // return this.form;
    //   //   const test = [];
    //   //   let test1;
    //   //   for (const {key, value} of Object.keys(this.form)) {
    //   //     if( key === this.name){
    //   //       test1 = value
    //   //
    //   //     }
    //   //     // test.push(key); // John, then 30
    //   //   }
    //   //   return test1
    //   // }
    //   return this.form.account;
    //   // return this.form.bill_to_phone;
    //   // return this.form.bill_to_email;
    // },
  },
  methods: {
    updateValue() {
      this.$emit('input', this.selectedValue);
    },
  },
  // watch: {
  //   form: {
  //     handler(form) {
  //       // if (form[this.name] !== this.value) {
  //       //   this.value = form[this.name];
  //       // }
  //       // const height = this.$refs.minH.clientHeight;
  //       // if (height !== 0) this.$emit('updateHeight', height, this.rootFormFieldIndex);
  //       // return height;
  //       if (form[this.name] !== this.selected) {
  //         _.each(this.allRecords, (record, idx) => {
  //           if (record.data.name === this.form[this.name]) {
  //             this.selected = {
  //               text: record.data.name,
  //               value: idx,
  //             };
  //           }
  //         });
  //         // this.value = form[this.name];
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  async created() {
    if (this.context === 'create' || this.context === 'update') {
      if (typeof this.object.meta.object === 'string') {
        this.allRecords = await this.$store.dispatch('getRecordsByObject', {
          object: this.object.meta.object,
          // object: this.object.meta.object,
        });
        this.label = `Select ${this.object.meta.object}`;
      } else {
        this.allRecords = await this.$store.dispatch('getRecordsByObject', {
          object: this.object.meta.object.text,
          // object: this.object.meta.object,
        });
        this.label = `Select ${this.object.meta.object.text}`;
        // this.label = `Select ${this.object.meta.object}`;
      }
    } else {
      this.allRecords = await this.$store.dispatch('getRecordsByObject', {
        object: this.object.text,
      });
      this.label = `Select ${this.object.text}`;
    }
    if (this.allRecords) {
      _.each(this.allRecords, (record, index) => {
        // eslint-disable-next-line no-underscore-dangle
        this.autocomplete.push({ text: `${record.data.name}`, value: index });
      });
    }
    if (this.form[this.name]) {
      _.each(this.allRecords, (record, idx) => {
        if (record.data.name === this.form[this.name]) {
          this.selected = {
            text: record.data.name,
            value: idx,
          };
        }
      });
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
    // }
  },
};
</script>
