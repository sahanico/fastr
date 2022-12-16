<template>
  <v-container>
    <v-row>
      <v-col>Create Record Step</v-col>
    </v-row>
    <v-row>
      <v-container>
        Field Mappings
        <v-row v-for="(field, index) in step.meta.fields" :key="index">
          <field-mapping :field="field"
                         :autocomplete-fields="autocompleteFields"
                         :objects="objects"
                         :variables="variables" />
        </v-row>
        <v-row style="padding-bottom: 50px">
          <v-col cols="12">
            <v-btn style="position: absolute; right: 16px" icon
                   @click="step.meta.fields.push(
                     {
                        text: '',
                        value: '',
                        }
                    )">
              <v-icon class="red--text"> mdi-plus</v-icon>
            </v-btn>
            <v-btn style="position: absolute; right: 54px" icon
                   @click="step.meta.fields.pop()">
              <v-icon class="red--text"> mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'underscore';
import FieldMapping from '../field-mapping';

export default {
  components: {
    FieldMapping
  },
  props: ['steps', 'step', 'pool', 'objects', 'variables'],
  computed: {
    autocompleteFields() {
      const object = _.findWhere(this.objects, {name: this.step.object });
      if (!object) return [];
      return _.map(object.fields, item => ({
        text: item.label,
        value: item.name,
        type: item.type
      }));
    },
  },
};
</script>

<style scoped>

</style>
