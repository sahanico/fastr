<template>
  <div v-if="design && design.meta">
    <div class="headline red--text pt-2 mt-2 pb-2 mb-2">{{ this.design.label }}</div>
    <div>
      <v-btn dark color="red" small
             :style="{ position: 'absolute', top: '16px', right: '16px' }"
             @click="toggleCreateDialog">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div>
      <v-dialog v-model="showCreateDialog" width="500px" style="height: 500px;">
        <v-card style="height: 500px;">
          <create-form :form-name="design.meta.create.form" :outlined="true"
                       @submitForm="submitForm"
                       :name="`create-form-dialog-${design.meta.create.form}`"/>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar ref="calendar" v-model="focus" color="red" :events="calendarEvents"
            :event-color="getEventColor" :type="type" @click:event="showEvent"
            @click:more="viewDay" @click:date="viewDay" @change="updateRange" />
          <v-menu v-model="selectedOpen" :close-on-content-click="false"
                  :activator="selectedElement" offset-x color="red">
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn color="white" flat dark outlined style="padding-right: 16px">Update</v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </v-toolbar>
              <v-card-text>
                <div v-for="(item, index) in Object.keys(selectedEventDetails)" :key="index">
                  {{ index }}
                  {{ item }}
                  {{ selectedEvent[item] }}
                  {{ selectedEvent[index] }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from 'underscore';
import moment from 'moment';
import CreateForm from '../forms/create';
import FormUpdate from '../forms/update';

export default {
  name: 'read',
  components: { FormUpdate, CreateForm },
  props: ['obj', 'input', 'designName'],
  data() {
    return {
      design: {},
      events: [],
      stepper: 1,
      showCreateDialog: false,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      calendarEvents: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    };
  },
  computed: {
    selectedEventDetails() {
      return _.omit(this.selectedEvent, ['color', 'timed', 'id']);
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    toggleCreateDialog() {
      this.showCreateDialog = !this.showCreateDialog;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = '';
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        // eslint-disable-next-line no-return-assign
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true));
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async submitForm() {
      this.events = await this.$store.dispatch('getRecordsByObject', { object: 'event' });
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const startDate = moment(firstDay).format('YYYY-MM-DD');
      const endDate = moment(lastDay).format('YYYY-MM-DD');
      this.updateRange({ start: { date: startDate }, end: { date: endDate } });
    },
    updateRange({ start, end }) {
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const filteredEvents = [];
      _.each(this.events, (event) => {
        if (event.data.start_date_time > min.toISOString() &&
        event.data.end_date_time < max.toISOString()) {
          filteredEvents.push(event);
        }
      });
      this.calendarEvents = _.map(filteredEvents, (evt) => {
        const eventRecord = _.findWhere({ id: evt.id });
        return {
          name: evt.data.title,
          start: new Date(evt.data.start_date_time),
          end: new Date(evt.data.start_date_time),
          color: 'red',
          timed: true,
          id: evt.id,
          ...eventRecord.data,
        };
      });
    },
  },
  async created() {
    this.design = await this.$store.dispatch('getDesignByName', { name: this.designName });
    this.events = await this.$store.dispatch('getRecordsByObject', { object: 'event' });
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDate = moment(firstDay).format('YYYY-MM-DD');
    const endDate = moment(lastDay).format('YYYY-MM-DD');
    this.updateRange({ start: { date: startDate }, end: { date: endDate } });
  },
};
</script>

<style scoped>

</style>

