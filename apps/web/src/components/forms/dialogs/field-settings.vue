<template>
  <v-dialog v-model="fieldDialog" width="400" v-if="field.value">
    <v-card>
      <v-card-title class="headline red white--text" dark primary-title>
        Field Options
      </v-card-title>
      <v-container v-if="field.value.type === 'display_text'">
        <v-text-field v-model="field.value.meta.value" label="Value" />
        <v-text-field type="number" v-model="field.value.meta.size" label="Size" />
      </v-container>
      <v-container  v-if="field.value.type !== 'display_text'">>
        <v-row>
          <v-col>
            <v-checkbox v-model="field.value.meta.required" label="Required" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="field.value.meta.disabled" label="Disabled" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>Default</v-col>
        </v-row>
        <v-row v-if="field.value.type === 'date'">
          <v-col>
            <v-select
              v-model="field.value.meta.default.date"
              :items="['empty', 'today']"
              label="Default Date" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select v-model="field.value.meta.default.type"
                      :items="['input', 'literal', 'system']" label="Type" />
          </v-col>
          <v-col v-if="field.value.meta.default.type === 'literal'">
            <div v-if="field.value.type === 'object'">
              <v-autocomplete v-model="field.value.meta.default.literal"
                              :items="autocompleteDefaultObjectRecords" />
            </div>
            <div v-if="field.value.type !== 'object'">
              <v-text-field v-model="field.value.meta.default.literal" label="Default Value"/>
            </div>
          </v-col>
          <v-col v-if="field.value.meta.default.type === 'input'">
            <v-select v-model="field.value.meta.default.input.name" :items="inputNames"
                      label="Input" />
            <div v-if-="field.value.meta.default.input.type === 'selection'">
              <v-autocomplete v-model="field.value.meta.default.input.field"
                              :items="autocompleteObjectFields" label="Input Field"/>
            </div>
          </v-col>
          <v-col v-if="field.value.meta.default.type === 'system'">
            <v-select v-model="field.value.meta.default.system" :items="systemNames"
                      label="Value" />
          </v-col>
        </v-row>
        <v-row v-if="field.value.type === 'object' || field.value.type === 'object_array'">
          <v-col cols="12" md="12">
            <v-autocomplete v-model="field.value.meta.inlistForm"
                            :items="autocompleteInlistForms" label="Inlist Form"/>
          </v-col>
        </v-row>
        <v-row v-if="field.value.type === 'textarea'">
          <v-col>
            <v-text-field v-model="field.value.meta.textareaRows" type="number"
                          label="Textarea Rows" chips dense outlined
                          style="margin-left: 20px; max-width: 140px"/>
          </v-col>
        </v-row>
        <v-row v-if="field.value.type === 'parametric'">
          Parametric
        </v-row>
        <v-row v-if="field.value.type === 'parametric'">
          <v-col>
            <v-autocomplete v-model="field.value.meta.parent" :items="autocompleteObjects"
                          label="Parent" chips dense
                          style="margin-left: 20px; max-width: 140px"/>
          </v-col>
          <v-col>
            <v-autocomplete v-model="field.value.meta.child" :items="autocompleteObjects"
                          label="Parent" chips dense
                          style="margin-left: 20px; max-width: 140px"/>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black" text type="button" @click="save">
          Save
        </v-btn>
        <v-btn color="black" text type="button" @click="close">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'underscore';

export default {
  props: {
    objects: Array,
    designs: Array,
    design: Object,
    dialog: Boolean,
    field: Object,
  },
  data() {
    return {
      inputObject: '',
      autocompleteDefaultObjectRecords: [],
    };
  },
  computed: {
    fieldDialog() {
      return this.dialog;
    },
    autocompleteInlistForms() {
      const designs = _.where(this.designs, { object: this.field.value.meta.object, type: 'form' });
      const inlistForm = [];
      _.each(designs, (design) => {
        inlistForm.push({
          text: design.label,
          value: design.name,
        });
      });
      return inlistForm;
    },
    inputNames() {
      return _.map(this.design.meta.inputs, input => input.name);
    },
    systemNames() {
      return ['today'];
    },
    // inputObject() {
    //   if (this.field.value.meta.default.input.name) {
    //     console.log('ping');
    //     const input = _.findWhere(this.design.meta.inputs, {
    //       name: this.field.value.meta.default.input.name,
    //     });
    //     return input.object;
    //   }
    //   return '';
    // },
    autocompleteObjects() {
      return _.map(this.objects, object => ({
        text: object.label,
        value: object.name,
      }));
    },
    autocompleteObjectFields() {
      console.log('this.inputObject: ', this.inputObject);
      if (this.inputObject) {
        const object = _.findWhere(this.objects, { name: this.inputObject });

        return _.map(object.fields, field => ({ text: field.label, value: field.name }));
      }
      return [];
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      this.$emit('save');
    },
  },
  watch: {
    'field.value.meta.default.input.name': {
      handler(name) {
        const input = _.findWhere(this.design.meta.inputs, { name });
        if (input && input.feeder === 'selection' || input && input.feeder === 'pool') {
          this.inputObject = input.object;
        } else if (input && input.feeder === 'system') {
          if (input.system === 'logged_in_user') {
            this.inputObject = 'user';
          } else if (input.system === 'logged_in_account') {
            this.inputObject = 'account';
          } else if (input.system === 'logged_in_account_member') {
            this.inputObject = 'account_member';
          }
        }
      },
      deep: true,
    },
    'field.value.type': {
      async handler(type) {
        if (type === 'object') {
          const records = await this.$store.dispatch('getRecordsByObject',
            { object: this.field.value.name });
          this.autocompleteDefaultObjectRecords = _.map(records, record => ({
            text: record.data.name,
            // eslint-disable-next-line no-underscore-dangle
            value: record._id,
          }));
        }
      },
      deep: true,
    },
  },
};
</script>
