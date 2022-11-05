<template>
  <v-menu
    v-model="menu" :close-on-content-click="false" :nudge-right="40"
    transition="scale-transition" offset-y min-width="290px">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field color="red" :label="label" prepend-icon="schedule" readonly
                    v-bind="attrs" v-on="on"  v-model="time" @input="updateValue(time)">
      </v-text-field>
    </template>
<!--    <v-time-picker color="red" v-model="time" @input="menu = false" ></v-time-picker>-->
    <v-time-picker color="red" v-model="time" @input="updateTimepickerValue(time)" ></v-time-picker>
  </v-menu>
</template>

<script>

export default {
  props: ['label', 'context', 'name', 'form'],
  data() {
    return {
      time: '',
      menu: null,
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
    updateTimepickerValue(value) {
      this.menu = false;
      this.$emit('input', value);
    },
  },
  created() {
    if (this.form[this.name]) {
      this.time = this.form[this.name];
    }
  },
};
</script>
