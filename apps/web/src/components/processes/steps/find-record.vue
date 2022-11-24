<template>
  <v-container>
    <v-row>
      <conditions :variables="variables" :conditions="step.meta.conditions" :objects="objects" :pool="pool"
                  :autocomplete-objects="autocompleteObject" :steps="steps"/>
    </v-row>
  </v-container>
</template>

<script>
import Conditions from '../../conditions2/conditions'

export default {
  components: {
    Conditions,
  },
  model: {
    prop: 'step'
  },
  props: ['steps', 'objects', 'autocompleteObject', 'step', 'pool', 'variables'],
};
</script>

<style scoped>

</style>
