<template>
  <div>
    <v-select v-model="selected" :items="autocomplete" chips dense color="red"
              outlined return-object small-chips label="Select User"
              :required="required" @input="updateValue(selected)">
    </v-select>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['item', 'object', 'context', 'form', 'name', 'required'],
  data() {
    return {
      allUsers: [],
      autocomplete: [],
      selected: {},
    };
  },
  computed: {
    selectedValue() {
      const firstName = this.allUsers[this.selected.value].data.firstName;
      const lastName = this.allUsers[this.selected.value].data.lastName;
      return `${firstName} ${lastName}`;
    },
  },
  methods: {
    updateValue() {
      this.$emit('input', this.selectedValue);
    },
  },
  async created() {
    this.allUsers = await this.$store.dispatch('getRecordsByObject', {
      object: 'user',
    });
    if (this.allUsers) {
      _.each(this.allUsers, (user, index) => {
        this.autocomplete.push({ text: `${user.data.firstName} ${user.data.lastName}`, value: index });
      });
    }
    if (this.form[this.name]) {
      _.each(this.allUsers, (user, idx) => {
        const firstName = user.data.firstName;
        const lastName = user.data.lastName;
        const fullName = `${firstName} ${lastName}`;
        if (fullName === this.form[this.name]) {
          this.selected = {
            text: fullName,
            value: idx,
          };
        }
      });
    }
  },
};
</script>
