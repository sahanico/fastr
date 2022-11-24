<template>
  <v-container>
    <v-row>
      <conditions :variables="variables" :conditions="step.meta.conditions" :objects="objects" :steps="steps"
                  :autocomplete-objects="autocompleteObjects" :pool="pool"/>
    </v-row>
    <v-container>
      <v-row>
        <if-steps :variables="variables" :steps="step.meta ? step.meta ? step.meta.steps : null : null"
                  :objects="objects" :pool="pool" :autocomplete-objects="autocompleteObjects"  :ifstep="true"/>
      </v-row>
    </v-container>
  </v-container>
</template>


<script>

import _ from 'underscore';

export default {
  name: 'IfStep',
  components: {
    'if-steps': () => import('../steps.vue'),
    Conditions: () => import('../../conditions2/conditions.vue'),
  },
  props: {
    step: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'if',
        meta: {
          steps: [],
        },
      }),
    },
    objects: Array,
    autocompleteObjects: Array,
    pool: Array,
    steps: Array,
    variables: Array,
  },
  computed: {
    autocompleteLHSPoolItems() {
      if (this.step.meta.lhs_type === 'pool') {
        return _.map(this.pool, item => ({ text: item.label, value: item.name }));
      }
      return [];
    },
    autocompleteLHSPoolItemFields() {
      if (this.step.meta.lhs_pool_item) {
        const poolItem = _.findWhere(this.pool, { name: this.step.meta.lhs_pool_item })
        console.log('object: ', object);
        const object = _.findWhere(this.objects, { name: poolItem.object });
        console.log('object: ', object);
        if(!object) return [];
        return _.map(object.fields, field => ({ text: field.label, value: field.name }));
      }
      return [];
    },
    autocompleteRHSObjectFields() {
      if (this.step.meta.rhs_object) {
        const object = _.findWhere(this.objects, { name: this.step.meta.rhs_object });

        return _.map(object.fields, field => ({ text: field.label, value: field.name }));
      }
      return [];
    },
    autocompletebjectFields() {
      if (this.step.meta.rhs_object) {
        const object = _.findWhere(this.objects, { name: this.step.meta.rhs_object });

        return _.map(object.fields, field => ({ text: field.label, value: field.name }));
      }
      return [];
    },
  },
}
</script>
