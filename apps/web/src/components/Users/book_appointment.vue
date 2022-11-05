<template>
  <div class="grey lighten-4">
    <div class="headline red--text text-sm-center mb-3 mt-3 pt-5" style="margin: 20px;">
      Book An Appointment
    </div>
    <v-container>
      <v-layout>
        <v-flex class="mb-5 pb-5" offset-sm4 sm4 xs12>
          <v-stepper v-model="e6" vertical>
            <v-stepper-step :complete="e6 > 1" :editable="stepOneEditable" color="red" step="1">
              Choose a date
              <small v-show="e6 !== 1">{{ date }}</small></v-stepper-step>
            <v-stepper-content step="1">
              <template>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex lg6 xs12>
                      <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                              :return-value.sync="date"
                              full-width lazy max-width="290px" min-width="290px"
                              offset-y transition="scale-transition">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="date" label="Appointment Date" prepend-icon="event"
                                        v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="date" color="red" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                          <v-btn text color="primary"
                                 @click="[
                                   $refs.menu.save(date),
                                   stepOneContiueDisabled=false,
                                   stepOneContinueDark=true,
                                  ]"
                          >OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-container>
              </template>
              <v-btn
                :dark="stepOneContinueDark" :disabled="stepOneContiueDisabled"
                color="red" @click="dateContinueBtnClick()">Continue
              </v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 2" :editable="stepTwoEditable"
                            color="red" step="2">Pick an account manager
              <small v-show="e6 > 2">{{ personSelected() }}</small>
            </v-stepper-step>
            <v-stepper-content step="2">
              <div>
                <!--                <v-btn v-show="showHarsh" :color="harshColor" dark text
                @click="selectHarsh()">-->
                <!--                  <v-flex align-left class="mb-5" justify-left layout>-->
                <!--                    <div class="subheading" style="marginTop: 10px">
                 Harsh Sahani</div>-->
                <!--                  </v-flex>-->
                <!--                </v-btn>-->
                <!--                <v-btn v-show="showRakesh" :color="rakeshColor" dark text
                @click="selectRakesh()">-->
                <!--                  <v-flex align-left class="mb-5" justify-left layout>-->
                <!--                    <div class="subheading" style="marginTop: 10px"> Rakesh
                 Chaudhry</div>-->
                <!--                  </v-flex>-->
                <!--                </v-btn>-->
                <v-btn v-show="showSangeeta" :color="sangeetaColor" class="mb-4"
                       dark text @click="selectSangeeta()">
                  <v-flex align-left class="mb-5" justify-left layout>
                    <div class="subheading" style="marginTop: 10px"> Sangeeta Sahani</div>
                  </v-flex>
                </v-btn>
              </div>
              <v-btn :dark="stepTwoContinueDark" :disabled="stepTwoContiueDisabled" color="red"
                     @click="personContinueBtnClick()">Continue
              </v-btn>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 3" :editable="stepThreeEditable"
                            color="red" step="3">Select a time
              <small v-show="e6 > 3">{{ currentAppointment.time }}</small>
            </v-stepper-step>
            <v-stepper-content step="3">
              <template>
                <div class="text-xs">
                  <v-menu offset-y>
                    <v-btn slot="activator" class="red--text"
                           :color="timeColor" dark text>{{ selectedTime }}
                    </v-btn>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn :color="timeColor" class="red--text" dark text
                             v-bind="attrs" v-on="on">
                        {{ selectedTime }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in defaultTimeItems"
                        :key="index"
                        @click="timeItemClick(item.title)"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <v-btn :dark="stepThreeContinueDark" :disabled="stepThreeContiueDisabled"
                       color="red" @click="timeContinueBtnClick()">Continue
                </v-btn>
              </template>
            </v-stepper-content>
            <v-stepper-step :complete="e6 > 4" :editable="stepFourEditable"
                            color="red" step="4">
              Notes
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-flex xs12>
                <v-textarea v-model="specialInstructions" color="red"
                            label="Please leave any additional comments here"
                            name="input-7-4" solo
                            value="">
                </v-textarea>
              </v-flex>
              <v-btn color="red" dark @click="submitBtnClick()">Submit</v-btn>
              <v-flex>
                <v-card-actions class="justify-center mb-3">
                  <template>
                    <div class="text-xs-center">
                      <v-dialog v-model="successDialog" width="500">
                        <v-card>
                          <v-card-title class="headline red white--text" dark
                                        primary-title> Appointment Created!
                          </v-card-title>
                          <v-card-text> Your appointment was created successfully !</v-card-text>
                          <v-divider></v-divider>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red white--text" flat @click="successDialog = false">
                              OK
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </template>
                </v-card-actions>
              </v-flex>
            </v-stepper-content>
          </v-stepper>
        </v-flex>
      </v-layout>

    </v-container>
  </div>

</template>

<script>
import { _ } from 'vue-underscore';

export default {
  data() {
    return {
      e6: 1,
      systemUser: false,
      selectedUser: {},
      autocompleteUsers: [],
      successDialog: false,
      date: new Date().toISOString()
        .substr(0, 10),
      menu: false,
      stepOneEditable: false,
      stepTwoEditable: false,
      stepThreeEditable: false,
      stepFourEditable: false,
      currentAppointment: {
        title: '',
        accountManager: '',
        bookedByUserId: '',
        bookedByUsername: '',
        date: null,
        specialInstructions: '',
        time: null,
        confirmed: 'false',
        appointmentId: null,
      },
      stepOneContiueDisabled: true,
      stepOneContinueDark: false,
      stepTwoContiueDisabled: true,
      stepTwoContinueDark: false,
      sangeeta: false,
      harsh: false,
      rakesh: false,
      harshColor: 'black',
      sangeetaColor: 'black',
      rakeshColor: 'black',
      showHarsh: true,
      showSangeeta: true,
      showRakesh: true,
      stepThreeContiueDisabled: true,
      stepThreeContinueDark: false,
      stepFourContiueDisabled: true,
      stepFourContinueDark: false,
      selectedTime: 'Select a  Time',
      specialInstructions: '',
      bookedBy: '',
      defaultTimeItems: [
        { title: '11:00 AM' },
        { title: '11:30 AM' },
        { title: '12:00 PM' },
        { title: '12:30 PM' },
        { title: '1:00 PM' },
        { title: '1:30 PM' },
        { title: '2:00 PM' },
        { title: '2:30 PM' },
        { title: '3:00 PM' },
        { title: '3:30 PM' },
        { title: '4:00 PM' },
        { title: '4:30 PM' },
        { title: '5:00 PM' },
        { title: '5:30 PM' },
        { title: '6:00 PM' },
      ],
      timeColor: 'white',
      users: [],
      smallTimeTitle: '',
    };
  },
  async created() {
    this.users = await this.$store.dispatch('getAllUsers');
    if (this.users) {
      this.users = _.map(this.users, (user, index) => {
        this.autocompleteUsers.push({ text: `${user.name} (${user.email})`, value: index });
        return {
          name: user.name,
          email: user.email,
          userId: user.userId,
          phoneNumber: user.phoneNumber,
        };
      });
    }
  },
  computed: {
    bookedBySmall() {
      if (this.systemUser) {
        return this.selectedUser.text;
      }
      return this.bookedBy;
    },
  },
  methods: {
    dateContinueBtnClick() {
      this.stepOneEditable = true;
      this.currentAppointment.date = this.date;
      this.e6 = 2;
    },
    // dateSelected() {
    //   $refs.menu.save(date);
    //   this.stepOneContiueDisabled = false;
    //   this.stepOneContinueDark = true;
    // },
    personSelected() {
      if (this.sangeeta) {
        this.stepTwoEditable = true;
        this.currentAppointment.accountManager = 'Sangeeta Sahani';
        return 'Sangeeta Sahani';
      }
      if (this.harsh) {
        this.stepTwoEditable = true;
        this.currentAppointment.accountManager = 'Harsh Sahani';
        return 'Harsh Sahani';
      }
      if (this.rakesh) {
        this.stepTwoEditable = true;
        this.currentAppointment.accountManager = 'Rakesh Chaudhry';
        return 'Rakesh Chaudhry';
      }
      return null;
    },
    selectHarsh() {
      this.sangeeta = false;
      this.rakesh = false;
      this.harsh = true;
      this.harshColor = 'red darken-2';
      this.sangeetaColor = 'black';
      this.rakeshColor = 'black';
      this.stepTwoContiueDisabled = false;
      this.stepTwoContinueDark = true;
      this.stepTwoEditable = true;
    },
    selectSangeeta() {
      this.sangeeta = true;
      this.rakesh = false;
      this.harsh = false;
      this.harshColor = 'black';
      this.sangeetaColor = 'red darken-2';
      this.rakeshColor = 'black';
      this.stepTwoContiueDisabled = false;
      this.stepTwoContinueDark = true;
      this.stepTwoEditable = true;
    },
    selectRakesh() {
      this.sangeeta = false;
      this.rakesh = true;
      this.harsh = false;
      this.harshColor = 'black';
      this.sangeetaColor = 'black';
      this.rakeshColor = 'red darken-2';
      this.stepTwoContiueDisabled = false;
      this.stepTwoContinueDark = true;
      this.stepTwoEditable = true;
    },
    personContinueBtnClick() {
      this.e6 = 3;
    },
    timeSelected(title) {
      return title;
    },

    timeItemClick(item) {
      this.timeColor = 'white';
      this.selectedTime = item;
      this.stepThreeContiueDisabled = false;
      this.stepThreeContinueDark = true;
      this.currentAppointment.time = item;
    },
    timeContinueBtnClick() {
      this.stepThreeEditable = true;
      this.e6 = 4;
    },
    nameItemChange() {
      this.stepFourContinueDisabled = false;
      this.stepFourContinueDark = true;
    },
    nameContinueBtnClick() {
      if (this.systemUser) {
        this.currentAppointment.bookedByUsername = this.users[this.selectedUser.value].username;
        this.currentAppointment.bookedByUserId = this.users[this.selectedUser.value].userId;
      } else {
        this.currentAppointment.bookedByUsername = this.bookedBy;
      }

      this.stepFourEditable = true;
      this.e6 = 5;
    },
    submitBtnClick() {
      this.currentAppointment.specialInstructions = this.specialInstructions;
      if (this.systemUser) {
        this.currentAppointment.title = `${this.currentAppointment.time} - ${
          this.bookedBySmall} with ${this.currentAppointment.accountManager}`;
      } else {
        this.currentAppointment.title = `${this.currentAppointment.time} - ${this.bookedBySmall} with ${
          this.currentAppointment.accountManager}`;
      }
      const appointment = {
        date: this.currentAppointment.date,
        title: this.currentAppointment.title,
        status: 'scheduled',
        notes: this.currentAppointment.specialInstructions,
        time: this.currentAppointment.time,
      };
      this.successDialog = true;
      return this.$store.dispatch('createAppointment', appointment);
    },
  },
};
</script>

<style>

</style>
