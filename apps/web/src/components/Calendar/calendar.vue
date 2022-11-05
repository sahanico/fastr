<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
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
        <v-calendar ref="calendar" v-model="focus" color="primary"
                    :events="calendarEvents" :event-color="getEventColor"
                    :type="type" @click:event="showEvent" @click:more="viewDay"
                    @click:date="viewDay" @change="updateRange">
        </v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false"
                :activator="selectedElement" offset-x>
          <div :key="selectedEvent.name"
               slot="activator"
               v-ripple :style="{backgroundColor: eventColor(selectedEvent),
            border: eventColor(selectedEvent)}"
               class="my-event" color="red" v-html="selectedEvent.title">
          </div>
          <v-card color="grey lighten-4" min-width="400px">
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            </v-toolbar>
            <v-card-title primary-title>
              <span class="mr-2">Date: </span>
              <span v-html="selectedEvent.start"> </span>
              <span class="ml-2 mr-2">   is </span>
              <span v-html="selectedEvent.status"></span>
            </v-card-title>
            <span class="body-1 pl-3 ">Notes: </span>
            <div class="body-1 pl-3 ">{{ selectedEvent.notes }}</div>
            <div v-if="eventColor(selectedEvent.status) === 'blue'"
                 class="body-1 pl-3 blue--text mt-3">Waiting for
              confirmation
            </div>
            <div v-if="eventColor(selectedEvent.status) === 'green'"
                 class="body-1 pl-3 green--text mt-3">Confirmed
            </div>
            <v-layout>
              <v-card-actions v-if="eventColor(selectedEvent.status) === 'blue' ">
                <v-btn v-if="isAdmin" color="white"
                       @click="clickConfirm(selectedEvent.id)">Confirm
                </v-btn>
              </v-card-actions>
              <v-card-actions
                v-if="(eventColor(selectedEvent.status) === 'blue') ||
                      (eventColor(selectedEvent.status) === 'green')">
                <v-btn v-if="isAdmin" color="white"
                       @click="clickCancel(selectedEvent.id)">Cancel</v-btn>
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import _ from 'underscore';

export default {
  props: ['role'],
  data: () => ({
    events: {},
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    notes: '',
    status: '',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  computed: {
    isAdmin() {
      return this.role === 'Admin';
    },
    calendarEvents() {
      return _.map(this.events, event => ({
        name: event.title,
        start: `${event.date.substring(0, 10)} ${this.getTwentyFourHourTime(event.time)}`,
        end: `${event.date.substring(0, 10)} ${this.getTwentyFourHourTime(event.time)}`,
        color: this.eventColor(event.status),
        notes: event.notes,
        status: event.status,
        timed: true,
        id: event.id,
      }));
    },
  },
  methods: {
    open(event) {
      // eslint-disable-next-line no-alert
      alert(event.title);
    },
    eventColor(status) {
      if (status !== undefined) {
        if (status === 'scheduled') return 'blue';
        if (status === 'confirmed') return 'green';
        if (status === 'cancelled') return 'grey';
      }
      return '';
    },
    async clickConfirm(id) {
      const appointment = _.findWhere(this.events, { id });
      const returnVal = await this.$store.dispatch('confirmedAppointment', appointment);
      if (returnVal) {
        const newEventsList = _.filter(this.events, event => event.id !== id);
        newEventsList.push(returnVal);
        this.events = newEventsList;
        this.$refs.calendar.checkChange();
        this.selectedOpen = false;
      }
    },
    async clickCancel(id) {
      const appointment = _.findWhere(this.events, { id });
      const returnVal = await this.$store.dispatch('cancelledAppointment', appointment);
      if (returnVal) {
        const newEventsList = _.filter(this.events, event => event.id !== id);
        newEventsList.push(returnVal);
        this.events = newEventsList;
        this.$refs.calendar.checkChange();
        this.selectedOpen = false;
      }
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
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange() {
      return this.calendarEvents;
    },
    getTwentyFourHourTime(amPmString) {
      const d = new Date(`1/1/2013 ${amPmString}`);
      return `${d.getHours()}:${d.getMinutes()}`;
    },
  },
  async created() {
    if (this.$props.role === 'Admin') {
      this.events = await this.$store.dispatch('getAllAppointments');
    }
    if (this.$props.role === 'User') {
      this.events = await this.$store.dispatch('getAppointments');
    }
  },
};
</script>
