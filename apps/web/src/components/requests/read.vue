<template>
  <!--<div>-->
  <!--  {{(chart.meta)}}-->
  <!--</div>-->
  <div v-if="design">
    <div class="headline red--text pt-2 mt-2 pb-2 mb-2">
      {{ this.design.value.label }}
    </div>
    <div>
    <v-layout>
      <v-row>

        <v-col cols="10" md="10">
          <div v-if="design.value.meta && design.value.meta.request">
            <v-timeline color="red" dense>
           <!---/> <v-timeline-item v-for="(item, index) in design.value.meta.request"
            :key="index">
              </-->
              <div v-for="(item, index) in nodesList"
                   :key="index">
                <v-timeline-item >
                    <div style="margin: 8px 0px 54px 12px">
                      <v-row>
                        <v-col>
                          <create-form v-if="getFormContext(item) === 'Create'"
                                       :form-name="item.thisNodeDesign"
                                       :name="`create-form-${item.thisNodeDesign}`"
                                       :form-status="getFormContext(item, index)"
                                       @submitForm="submitForm"/>
                          <read-form v-if="getFormContext(item) === 'Read'"
                                     :design="item.thisNodeDesign"
                                     :record-id="item.recordID"
                          />
                        </v-col>
                      </v-row>
                    </div>
                    <div v-if="(item.status === 'Created') && (item.recordID)"
                         style="margin: 8px 0px 54px 12px">
                      <v-row>
                        <v-col>
                          <v-btn color="red darken-2" dark @click="accepted(item)">Approve</v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="red darken-2" dark
                                 @click="reRequest(item)">Re-request</v-btn>
                        </v-col>
                        <v-col>
                          <v-select v-model="reRequestDesign" :items="autocompleteForms"
                                    label="Select design"/>
                        </v-col>
                      </v-row>
                    </div>
                </v-timeline-item>
              </div>
            </v-timeline>
          </div>
        </v-col>
      </v-row>
    </v-layout>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import CreateForm from '../forms/create';
import ReadForm from '../forms/read';

export default {
  name: 'read',
  components: { CreateForm, ReadForm },
  props: ['name', 'obj', 'input', 'design'],
  data() {
    return {
      stepper: 1,
      requestCardDesign: {},
      reRequestDesign: '',
      nodeForms: [],
      firstNodeDesign: '',
      forms: [],
      nodesList: [],
    };
  },
  methods: {
    submitForm(recordID) {
      const newRecord = _.omit(this.input, ['id', '_id']);
      if (this.input.nodes && this.input.nodes.length > 0) {
        const lastNode = this.input.nodes[this.input.nodes.length - 1];
        newRecord.nodes.push(this.generateNode('Created', lastNode.reRequestDesign, recordID));
      } else {
        newRecord.nodes = [this.generateNode('Created', this.firstNodeDesign, recordID)];
      }
      this.updateRecord(newRecord);
    },
    reRequest(node) {
      const newRecord = _.omit(this.input, ['id', '_id']);
      const nd = this.generateNode('Rerequested', node.thisNodeDesign, node.recordID, this.reRequestDesign);
      newRecord.nodes.pop();
      newRecord.nodes.push(nd);
      this.updateRecord(newRecord);
    },
    accepted(node) {
      const newRecord = _.omit(this.input, ['id', '_id']);
      const nd = this.generateNode('Accepted', node.thisNodeDesign, node.recordID);
      newRecord.nodes.pop();
      newRecord.nodes.push(nd);
      this.updateRecord(newRecord);
    },
    generateNode(status, thisNodeDesign, recordID, reRequestDesign) {
      const node = {
        status,
        thisNodeDesign,
      };

      if (recordID != null) {
        node.recordID = recordID;
      }
      if (reRequestDesign != null) {
        node.reRequestDesign = reRequestDesign;
      }
      return node;
    },
    generateNodesList() {
      if (this.input.nodes && this.input.nodes.length > 0) {
        this.nodesList = Object.assign([], this.input.nodes);
        if (this.nodesList[this.nodesList.length - 1].status === 'Rerequested') {
          this.nodesList.push(this.generateNode('Created', this.nodesList[this.nodesList.length - 1].reRequestDesign));
        }
      } else {
        this.nodesList = [this.generateNode('Created', this.firstNodeDesign)];
      }
    },
    updateRecord(newRecord) {
      const record = {
        object: 'request',
        id: this.input.id,
        data: newRecord,
      };
      this.$store.dispatch('updateRecord', record);
    },
    getFormContext(node) {
      if (node.recordID && node.recordID != null) {
        return 'Read';
      }
      return 'Create';
    },
    async getFormDesign(node) {
      const formDesign = await this.$store.dispatch('getDesignByName', {
        name: node.thisNodeDesign });
      return formDesign;
    },
  },
  async created() {
    this.requestCardDesign = await this.$store.dispatch('getDesignByName', {
      name: this.input.design });
    if (!(this.input.nodes && this.input.nodes.length > 0)) {
      this.firstNodeDesign = this.input.design;
    }
    this.generateNodesList();
    this.forms = await this.$store.dispatch('getDesignsByType', {
      type: 'form',
    });
  },
  computed: {
    autocompleteForms() {
      return _.map(this.forms, form => ({
        text: form.label,
        value: form.name,
      }));
    },
  },
};
</script>

<style scoped>

</style>

