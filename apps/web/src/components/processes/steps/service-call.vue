<template>
  <v-container>
    <div id="apiStep">
      Service
      <v-container>
        <v-row>
          <v-col>
            <v-select v-model="step.meta.service.name" label="Service Name" required :items="['user']" />
          </v-col>
          <v-col cols="12" sm="3">
            <v-select v-model="step.meta.service.function" :items="['approveUser', 'inviteUser']"
                      label="Service Function" />
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        Parameters
        <v-row v-for="(param, index) in step.meta.service.parameters" :key="index">
          <v-col>
            <v-autocomplete v-model="param.variable" :items="variables" label="Variable"/>
          </v-col>
          <v-col>
            <v-autocomplete v-model="param.type" :items="['literal', 'field']"/>
          </v-col>
          <v-col v-if="param.type === 'field'">
            <v-autocomplete v-model="param.field" :items="autocompleteFields"
                            label="Variable" outlined return-object small-chips
            />
          </v-col>
          <v-col v-if="param.type === 'literal'">
            <v-text-field v-model="param.value"
                          label="Value" />
          </v-col>
        </v-row>
        <v-row style="padding-bottom: 50px">
          <v-col cols="12">
            <v-btn style="position: absolute; right: 16px" icon
                   @click="step.meta.service.parameters.push(
                     {
                        text: '',
                        value: '',
                      }
                  )">
              <v-icon class="red--text"> mdi-plus</v-icon>
            </v-btn>
            <v-btn style="position: absolute; right: 54px" icon
                   @click="step.meta.service.parameters.pop()">
              <v-icon class="red--text"> mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>

</template>

<script>
import _ from 'underscore';

const blankHeader = {
  key: '',
  value: '',
  type: '',
};
const blankBody = {
  key: '',
  value: '',
  type: '',
};

export default {
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
