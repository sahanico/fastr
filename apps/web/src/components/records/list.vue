<template>
  <div>
    <form ref="recordByObject" lazy-validation>
      <v-card style="margin: 20px">
        <v-card-title><span class="headline">Records of {{name}}</span></v-card-title>
        <v-data-table :headers="headers" :items="records" >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="viewRecord(item)"> mdi-eye</v-icon>
            <v-icon small @click="editRecord(item)">mdi-pencil</v-icon>
          </template>
        </v-data-table>
      </v-card>

    </form>
  </div>
</template>

<script>


export default {
  props: ['name'],
  data() {
    return {
      records: [],
      headers: [
        { text: 'ID', value: 'record.id' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      // chooseRecordDialog: true,
      // selectedRecord: {},
      // autocompleteRecord: [],
    };
  },
  async created() {
    this.records = await this.$store.dispatch('getRecordsByObject', {
      object: this.name,
    });
  },
  methods: {
    viewRecord(record) {
      this.$router.push({ name: 'readRecord', params: { record } });
    },
  },
  computed: {
    objectName(name) {
      return name;
    },
  },

};
</script>

<style scoped>

</style>
