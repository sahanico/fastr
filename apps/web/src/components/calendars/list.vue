<template>
  <div class="grey lighten-4">
    <v-container class="m-5 p-5">
      <v-layout>
        <v-flex>
          <v-row>
            <v-col>
              <div class="headline text-xs-center red--text pb-5 pt-5">
                Calendars
              </div>
            </v-col>
            <v-col align="right">
              <v-btn color="red darken-2" style="align: right;" dark @click="create()">
                Create New Calendar
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="calendars" class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="read(item)"> mdi-eye</v-icon>
              <v-icon small @click="update(item)"> mdi-pencil</v-icon>
              <v-icon small @click="showDeleteDialog(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="deleteDialog.show" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          Delete Calendar
        </v-card-title>
        <v-card-text> Do you want to delete this calendar?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button" @click="trash()">
            Delete
          </v-btn>
          <v-btn color="black" text type="button" @click="deleteDialog.show = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  name: 'list',
  data() {
    return {
      designs: [],
      calendars: [],
      deleteDialog: {
        show: false,
        calendar: '',
      },
      headers: [
        { text: 'Label', align: 'left', value: 'label' },
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    create() {
      this.$router.push({
        name: 'CalendarDesigner',
        params: { designs: this.designs, context: 'create' },
      });
    },
    read(calendar) {
      this.$router.push({
        name: 'CalendarRead',
        params: { name: calendar.name, obj: calendar.object },
      });
    },
    update(design) {
      this.$router.push({
        name: 'CalendarDesigner',
        params: { designs: this.designs, design, context: 'update' },
      });
    },
    showDeleteDialog(calendar) {
      this.deleteDialog.calendar = calendar;
      this.deleteDialog.show = !this.deleteDialog.show;
    },
    trash() {
      this.calendars = _.filter(
        this.calendars,
        calendar => calendar.name === this.deleteDialog.calendar,
      );
      this.$store.dispatch('deleteDesignByName', this.deleteDialog.calendar);
      this.deleteDialog = {
        show: false,
        calendar: '',
      };
    },
  },
  async created() {
    this.designs = await this.$store.dispatch('getAllDesigns');
    this.calendars = _.where(this.designs, { type: 'calendar' });
  },
};
</script>
