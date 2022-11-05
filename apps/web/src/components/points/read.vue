<template>
  <div>

    <div style="width: 100%; height: 100%">
      <v-card>
        <v-card-title class="justify-center">{{ label }}</v-card-title>
        <v-card-text class="justify-center text-center">{{ value }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  name: 'read',
  props: ['name', 'obj', 'input'],
  data() {
    return {
      point: [],
      records: [],
      label: '',
      value: '',
    };
  },
  async created() {
    this.point = await this.$store.dispatch('getDesignByName', {
      name: this.name,
    });
    // todo: pass in Input and conditions if it exists ( input from props,condition from this.point)
    // points can be undefined but conditions have an object which has empty values
    // todo: rewrite the code to consider multiple objects inside conditions
    if ((this.input !== undefined) && (this.point.meta.conditions[0].lhs !== '')) {
      this.records = await this.$store.dispatch('getSummaryByObject', {
        object: this.point.object,
        fields: this.point.meta.pointField,
        input: this.input,
        conditions: this.point.meta.conditions[0],
      });
    } else if (this.input !== undefined) {
      this.records = await this.$store.dispatch('getSummaryByObject', {
        object: this.point.object,
        fields: this.point.meta.pointField,
        input: this.input,
      });
      // eslint-disable-next-line brace-style
    }
    // todo: rewrite the code to consider multiple objects inside conditions
    // todo: and also rewrite the codes in service, controller to reflect conditions
    else if (this.point.meta.conditions[0].lhs !== '') {
      this.records = await this.$store.dispatch('getSummaryByObject', {
        object: this.point.object,
        fields: this.point.meta.pointField,
        conditions: this.point.meta.conditions[0],
      });
    } else {
      this.records = await this.$store.dispatch('getSummaryByObject', {
        object: this.point.object,
        fields: this.point.meta.pointField,
      });
    }

    this.label = this.point.meta.pointField[0].label;
    const vals = _.keys(this.records[this.point.meta.pointField[0].name]);
    let sum = 0;
    _.each(vals, (val) => {
      if (typeof val === 'string') {
        sum += parseInt(val, 10);
      }
    });
    // this.value = Object.values(this.records);
    this.value = sum;
  },
};
</script>

