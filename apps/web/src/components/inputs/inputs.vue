<template>
  <v-container>
    <v-row>
      <div class="headline text-xs-center red--text pb- pt-5">
        Inputs
      </div>
    </v-row>
    <v-row v-for="(item, index) in design.meta.inputs" :key="index">
      <v-col>
        <v-text-field v-model="item.label" label="label"/>
      </v-col>
      <v-col>
        <v-text-field v-model="item.name" label="Name"/>
      </v-col>
      <v-col>
        <v-select v-model="item.feeder" :items="['selection', 'system']"
                  label="Source"/>
      </v-col>
      <v-col v-if="item.feeder === 'system'">
        <v-select v-model="item.system" :items="['logged_in_user',
                      'logged_in_account', 'logged_in_account_member']"
                  label="Source Input"/>
      </v-col>
      <div v-if="item.feeder === 'selection'">
        <v-col>
          <v-select v-model="item.type" :items="['object', 'literal']" label="Type"/>
        </v-col>
        <v-col>
          <div v-if="item.type === 'object'">
            <v-select v-model="item.object" :items="autocompleteObjects"
                      label="Object"/>
          </div>
        </v-col>
        <v-col>
          <div v-if="item.type === 'literal'">
            <v-text-field v-model="item.value" label="Value"/>
          </div>
        </v-col>
      </div>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn style="position: absolute; right: 16px" icon
               @click="design.meta.inputs.push({})">
          <v-icon class="red--text"> mdi-plus</v-icon>
        </v-btn>
        <v-btn style="position: absolute; right: 54px" icon
               @click="design.meta.inputs.pop()">
          <v-icon class="red--text"> mdi-minus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import input from './input';

export default {
  props: ['design', 'autocompleteObjects'],
  components: { in: input },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
