<template>
  <div>


    <v-autocomplete v-model="selected" :items="autocomplete" chips dense color="red"
                    :label="item.value.label" outlined return-object small-chips multiple
                    @input="updateValue(selected)">
    </v-autocomplete>
  </div>
</template>

<script>
import { _ } from 'vue-underscore';

export default {
  props: ['item', 'object', 'context', 'form', 'name'],
  data() {
    return {
      allUsers: [],
      autocomplete: [],
      selected: [],
      value: '',
    };
  },
  computed: {
    /**
     * using selectedValue to see if the emails are populated in the array as texts or not
     *
     * */
    selectedValue() {
      const value = [];
      _.each(this.selected, (select) => {
        value.push(this.allUsers[select.value].email);
      });
      return value;
    },
  },
  methods: {
    updateValue(items) {
      const emails = [];
      _.each(items, (item) => {
        emails.push(this.allUsers[item.value].email);
      });
      // this.$emit('input', this.selectedValue);
      this.$emit('input', emails);
    },
  },
  async created() {
    this.allUsers = await this.$store.dispatch('getAllUsers');
    if (this.allUsers) {
      _.each(this.allUsers, (user, index) => {
        this.autocomplete.push({ text: `${user.name} (${user.email})`, value: index });
      });
    }
    if (this.form[this.item.value.name]) {
      _.each(this.allUsers, (user, index) => {
        _.each(this.form[this.item.value.name], (item) => {
          if (item === user.email) {
            this.selected[index] = index;
          }
        });
      });
    }
  },
};
</script>
