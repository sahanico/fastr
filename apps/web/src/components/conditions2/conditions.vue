<template>
  <v-container style="padding-bottom: 40px">
    <v-row v-for="(item, idx) in conditions.statements" :key="idx">
      <statement
        :statement="conditions.statements[idx]"
        :variables="variables"
        :objects="objects"
        :steps="steps"
        :pool="pool" />
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn style="position: absolute; right: 16px" icon
               @click="conditions.statements.push(
                 {
                    lhs: {
                      object: '',
                      type: '',
                      value: '',
                    },
                    operator: '',
                    rhs: {
                      type: '',
                      value: '',
                      object: '',
                      field: '',
                    },
                  }
               )">
          <v-icon class="red--text"> mdi-plus</v-icon>
        </v-btn>
        <v-btn style="position: absolute; right: 54px" icon
               @click="conditions.statements.pop()">
          <v-icon class="red--text"> mdi-minus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import statement from './statement';

export default {
  props: ['autocompleteObjects', 'objects', 'conditions', 'pool', 'steps', 'variables'],
  components: { statement },
  model: {
    prop: 'conditions',
  }
};
</script>
