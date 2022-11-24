<template>
  <v-container>
    <v-row>
      <v-col>Update Record Step</v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-autocomplete v-model="step.meta.variable" :items="variables"
                        label="Variable" outlined return-object small-chips
        />
      </v-col>
    </v-row>
    <v-row>
      <v-container>
        Field Mappings
        <v-row v-for="(field, index) in step.meta.fields" :key="index">
          <v-col>
            <v-autocomplete v-model="field.text" :items="autocompleteFields"/>
          </v-col>
          <v-col>
            <v-text-field v-model="field.value"
                         label="Value" />
          </v-col>
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

export default {
  props: ['steps', 'step', 'pool', 'objects', 'variables'],
  computed: {
    autocompleteFields() {
      const object = _.findWhere(this.objects, {name: this.step.object });
      if (!object) return [];
      return _.map(object.fields, item => ({
        text: item.label,
        value: item.name,
      }));
    },
  },
};
</script>

<style scoped>

</style>
