<template>
  <div>
    <v-card min-height="600px" width="100%">
      <v-container style="min-height: 500px">
        <v-row>
          <v-col>Create Step</v-col>
        </v-row>
        <v-row>
          <!-- Select Label -->
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="step.label" label='Step Label'
            />
          </v-col>
          <!-- Select Name -->
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="step.name" label='Step Name'
            />
          </v-col>
          <!-- Select Type -->
          <v-col cols="12" sm="3">
            <v-select v-model="step.type" :items="types" chips dense
                      outlined return-object small-chips
                      label="Type"
            />
          </v-col>
        </v-row>
        <!-- Steps -->
        <v-row v-if="step.type.value === 'find_record'">
          <find-record
            :steps="steps" :objects="objects" :type="'find_record'" :meta="step.meta"
            :name="step.name" :pool="pool"
            @addStep="addStep" @cancelStep="cancelStep" @updateStep="updateStep"
          />
        </v-row>
        <v-row v-if="step.type.value === 'update_record'">
          <update-record
            :steps="steps" :objects="objects" :step="step"
            :pool="pool" @addStep="addStep" @cancelStep="cancelStep"
          />
        </v-row>
        <v-row v-if="step.type.value === 'api_call'">
          <api-call
              :steps="steps" :name="step.name" :context="context"
              :objects="objects" :pool="pool"
              @addStep="addStep" @updateStep="updateStep"
              @cancelStep="cancelStep"/>
        </v-row>
        <v-row v-if="step.type.value === 'send_email'">
          <send-email :steps="steps" :step="step" :objects="objects"
                      :pool="pool" @addStep="addStep" @cancelStep="cancelStep"/>
        </v-row>
        <v-row v-if="step.type.value === 'create_pdf'">
          <create-pdf :steps="steps" :objects="objects" :step="step"
                      :pool="pool" @addStep="addStep" @cancelStep="cancelStep" />
        </v-row>
      </v-container>
    </v-card>
  </div>

</template>

<script>
import SendEmail from './steps/send-email';
import ApiCall from './steps/api-call';
import FindRecord from './steps/find-record';
import UpdateRecord from './steps/update-record';
import CreatePdf from './steps/create-pdf';

export default {
  name: 'step',
  components: {
    SendEmail,
    ApiCall,
    FindRecord,
    UpdateRecord,
    CreatePdf,
  },
  props: {
    steps: Array,
    context: String,
    pool: Array,
    objects: Array,
    step: {
      type: Object,
      default: () => ({
        name: '',
        label: '',
        type: '',
        meta: {
          object: '',
          template: '',
          fields: {},
          email: {
            to: {
              type: '',
              value: {
                literal: '', // either this
                variable: { // or this
                  name: '',
                  field: '',
                },
              },
            },
            subject: '',
            message: '',
          },
        },
      }),
    },
  },
  data() {
    return {
      emailData: [],
      stepItems: [],
      types: [
        {
          value: 'find_record',
          text: 'Find Record',
        },
        {
          value: 'create_record',
          text: 'Create Record',
        },
        {
          value: 'update_record',
          text: 'Update Record',
        },
        {
          value: 'send_email',
          text: 'Send Email',
        },
        {
          value: 'api_call',
          text: 'API Call',
        },
        {
          value: 'create_pdf',
          text: 'Create PDF',
        },
      ],
      combinator: [],
      autocompleteFields: [],
      fieldSelected: '',
    };
  },
  computed: { },
  methods: {
    addStep(step) {
      const fullStep = {
        ...step,
        name: this.step.name,
        label: this.step.label,
        type: this.step.type,
      };
      this.$emit('createStep', fullStep);
      this.cancelStep();
    },
    updateStep(step) {
      this.$emit('updateSteps', step);
      this.cancelStep();
    },
    cancelStep() {
      this.$emit('dialog', false);
    },
    addEmailData(data) {
      this.emailData.push(data);
    },
  },
};
</script>

<style scoped>

</style>
