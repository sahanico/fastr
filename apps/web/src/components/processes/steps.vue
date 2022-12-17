<template>
  <v-container>
    <v-row v-if="!ifstep">
      <v-col>
        <div class="headline red--text">Steps</div>
      </v-col>
    </v-row>
    <v-card style="padding-bottom: 40px;">
      <v-container>
        <v-container v-for="(step, index) of steps" :key="index">
          <v-row>
            <v-col cols="auto">
              {{ `${index + 1}.` }}
            </v-col>
            <v-col>
              <v-select label="Type" v-model="step.type" :items="types"/>
            </v-col>
            <v-col v-if="step.type !== 'if'">
              <v-text-field label="Label" v-model="step.label"/>
            </v-col>
            <v-col v-if="step.type !== 'if'">
              <v-text-field label="Name" v-model="step.name"/>
            </v-col>
            <v-col v-if="step.type !== 'if'">
              <v-autocomplete label="Object" v-model="step.object" :items="autocompleteObjects"/>
            </v-col>
            <v-row>
              <v-col v-if="step.type === 'if'">
                <if-step :variables="variables" :pool="pool" :objects="objects" :step="step" :steps="steps"
                         :autocomplete-objects="autocompleteObjects" />
              </v-col>
            </v-row>
          </v-row>
          <v-row v-if="step.type === 'api_call'">
            <api-call :steps="steps" :step="step" :pool="pool" :objects="objects" />
          </v-row>
          <v-row v-if="step.type === 'service_call'">
            <service-call  :steps="steps" :variables="variables" :step="step" :pool="pool" :objects="objects" />
          </v-row>
          <v-row v-if="step.type === 'send_email'">
            <send-email :steps="steps" :step="step" :pool="pool" :variables="variables" :objects="objects" />
          </v-row>
          <v-row v-if="step.type === 'find_record'">
            <find-record :find-record="step.meta" :steps="steps" :step="step" :pool="pool"
                         :variables="variables" :autocomplete-object="autocompleteObjects" :objects="objects"/>
          </v-row>
          <v-row v-if="step.type === 'update_record'">
            <update-record :steps="steps" :variables="variables" :step="step" :pool="pool" :objects="objects" />
          </v-row>
          <v-row v-if="step.type === 'create_record'">
            <create-record :steps="steps" :variables="variables" :step="step" :pool="pool" :objects="objects" />
          </v-row>
          <v-row v-if="step.type === 'create_user'">
            <create-user :steps="steps" :variables="variables" :step="step" :pool="pool" :objects="objects" />
          </v-row>
          <v-row v-if="step.type === 'create_pdf'">
            <create-pdf :steps="steps" :step="step" :pool="pool" :objects="objects" />
          </v-row>
          <v-divider />
        </v-container>
        <v-row>
          <v-col cols="12">
            <v-btn style="position: absolute; right: 16px" icon
                   @click="steps.push(
                 {
                    label: '',
                    name: '',
                    type: 'step',
                    object: '',
                    meta: {
                      object: {},
                      conditions: {
                        statements: [],
                        combinator: '',
                      },
                      steps: [],
                      fields: [],
                      user: {
                        userId: {
                          variable: '',
                          field: '',
                        },
                        email: {
                          variable: '',
                          field: '',
                        },
                      },
                      service: {
                        name: '',
                        function: '',
                        parameters: []
                      },
                      email: {
                        to: {
                          value: {
                            variable: {
                              name: ''
                            },
                          }
                        },
                        subject: '',
                        message: '',
                      }
                    },
                  }
              )">
              <v-icon class="red--text"> mdi-plus</v-icon>
            </v-btn>
            <v-btn style="position: absolute; right: 54px" icon
                   @click="steps.pop()">
              <v-icon class="red--text"> mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Step from './step';
import IfStep from './steps/if';
import SendEmail from './steps/send-email';
import ApiCall from './steps/api-call';
import ServiceCall from './steps/service-call';
import FindRecord from './steps/find-record';
import UpdateRecord from './steps/update-record';
import CreateRecord from './steps/create-record';
import CreateUser from './steps/create-user';
import CreatePdf from './steps/create-pdf';
import _ from 'underscore'

export default {
  name: 'steps',
  components: {
    Step,
    IfStep,
    SendEmail,
    ApiCall,
    ServiceCall,
    FindRecord,
    UpdateRecord,
    CreateRecord,
    CreateUser,
    CreatePdf,
  },
  model: {
    prop: 'steps'
  },
  props: {
    steps: {
      type: Array,
      default: () => ({
        label: '',
        name: '',
        type: 'steps',
        meta: {
          steps: [],
        },
      }),
    },
    autocompleteObjects: Array,
    ifstep: Boolean,
    variables: Array,
    objects: Array,
    pool: Array
  },
  data() {
    return {
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
          value: 'create_user',
          text: 'Create User',
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
          value: 'service_call',
          text: 'Service Call',
        },
        {
          value: 'create_pdf',
          text: 'Create PDF',
        },
        {
          value: 'if',
          text: 'If',
        },
      ],
    };
  },
};

</script>
