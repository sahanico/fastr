<template>
  <v-menu
    v-model="menu" :close-on-content-click="false" :nudge-right="40"
    transition="scale-transition" offset-y min-width="290px">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field color="red" :label="label" prepend-icon="event"
                    v-bind="attrs" v-on="on" v-model="date" @input="updateValue(date)">
      </v-text-field>
    </template>
    <v-date-picker v-model="date" color="red" @input="updateDatepickerValue(date)"
                  :disabled="disabled || context === 'read'">
    </v-date-picker>
  </v-menu>
</template>

<script>

export default {
  props: ['label', 'context', 'name', 'form', 'required', 'disabled', 'default'],
  data() {
    return {
      date: '',
      menu: null,
      rules: {
        date: v => (this.required ? !!v || `${this.label} is required` : true),
      },
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
    updateDatepickerValue(value) {
      this.menu = false;
      this.$emit('input', value);
    },
  },
  computed: {
    todayDate() {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();

      today = `${yyyy}-${mm}-${dd}`;
      return today;
    },
  },
  created() {
    if (this.context === 'update') {
      if (this.form[this.name]) {
        this.date = this.form[this.name].value;
      }
    }
    if (this.context === 'create') {
      if (this.default !== undefined) {
        if (this.default.date === 'today') {
          this.date = this.todayDate;
        }
        if (this.default.date === 'empty') {
          this.date = ''
        }
      }
      this.form[this.name] = this.date;
    }
  },
};
</script>
