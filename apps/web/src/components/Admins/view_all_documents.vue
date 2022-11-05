<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-card class="pb-3 mb-3 grey lighten-4">
            <div class="headline text-xs-center red--text pb-5 pt-5">Documents Sent</div>
            <div>
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" color="red darken-2"
                         dark style="align: right;">Send New Document
                  </v-btn>
                </template>
                <template>
                  <div>
                    <send-document @setDialog="setDialog"></send-document>
                  </div>
                </template>
              </v-dialog>
            </div>
            <div>
              <v-row>
                <v-col>
                  <v-text-field v-model="filters.outboundDocuments.toUserName"
                                label="Filter by Name"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="filters.outboundDocuments.type"
                                label="Filter by Document Type"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="filters.outboundDocuments.year"
                                label="Filter by Year"></v-text-field>
                </v-col>
              </v-row>

            </div>
            <v-data-table :headers="outboundDocumentsHeaders"
                          :items="filteredOutboundDocuments" class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.toUserId }}</td>
                <td>{{ props.item.description }}</td>
                <td>{{ props.item.year }}</td>
                <td>{{
                    props.item.timestamp.toString()
                      .substr(0, 10)
                  }}
                </td>
              </template>
              <template v-slot:item.path="{ item }">
                <td>
                  <div v-for="(name, index) in item.path" v-bind:key="index">
                    <a style="font-size: 10px;" @click="downloadDocuments(index, item)"
                       href="javascript:void(0)">{{ name }}</a>
                  </div>
                </td>
              </template>
            </v-data-table>
          </v-card>
          <v-card class="pb-5 mb-5 grey lighten-4" flat>
            <div class="headline text-xs-center red--text pb-5 pt-5">Documents Received</div>
            <div>
              <v-text-field v-model="filters.inboundDocuments"
                            label="Filter by Name"></v-text-field>
            </div>
            <v-data-table :headers="headers" :items="filteredInboundDocuments" class="elevation-1">
              <template v-slot:item.path="{ item }">
                <td>
                  <div v-for="(name, index) in item.path" v-bind:key="index">
                    <a style="font-size: 10px;" @click="downloadDocuments(index, item)"
                       href="javascript:void(0)">{{ name }}</a>
                  </div>
                </td>
              </template>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.fromUserId }}</td>
                <!--                <td>{{ props.item. }}</td>-->
                <td>{{
                    props.item.timestamp.toString()
                      .substr(0, 10)
                  }}
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import SendDocument from '@/components/Admins/send_document';
import { _ } from 'vue-underscore';

export default {
  components: {
    'send-document': SendDocument,
  },
  data() {
    return {
      dialog: false,
      filters: {
        // outboundDocuments: '',
        outboundDocuments: {
          toUserName: '',
          type: '',
          year: '',
        },
        inboundDocuments: '',
      },
      headers: [
        { text: 'Document Name', align: 'left', value: 'path' },
        { text: 'Uploaded By', align: 'left', value: 'fromUserName' },
        { text: 'Uploaded By UserId', align: 'left', value: 'fromUserId' },
        { text: 'Time Uploaded', align: 'left', value: 'timestamp' },
      ],
      outboundDocumentsHeaders: [
        { text: 'Document Name', align: 'left', value: 'path' },
        { text: 'Document Type', align: 'left', value: 'type' },
        { text: 'Uploaded By', align: 'left', value: 'fromUserName' },
        { text: 'Sent to', align: 'left', value: 'toUserName' },
        { text: 'Notes', align: 'left', value: 'description' },
        { text: 'Year', align: 'left', value: 'year' },
        { text: 'Time Uploaded', align: 'left', value: 'timestamp' },
      ],
      outboundDocuments: [],
      inboundDocuments: [],
    };
  },
  computed: {
    filteredOutboundDocuments() {
      // filter toUserName,type, year together
      if ((this.filters.outboundDocuments.toUserName !== '')
        && (this.filters.outboundDocuments.type !== '') &&
        (this.filters.outboundDocuments.year !== '')) {
        return _.select(this.outboundDocuments, (doc) => {
          if ((doc.toUserName !== '' && doc.toUserName !==
            undefined) && (doc.type !== '' && doc.type !==
            undefined) && (doc.year !== '' && doc.year !==
            undefined)) {
            return (doc.toUserName.toLowerCase()
              .includes(
                this.filters.outboundDocuments.toUserName.toLowerCase()))
              && ((doc.type.toLowerCase()
                .includes(
                  this.filters.outboundDocuments.type.toLowerCase()))
              ) && (doc.year.toLowerCase()
              .includes(
                this.filters.outboundDocuments.year.toLowerCase()));
          }
          return null;
        });
      }
      // filter toUserName and type together
      if ((this.filters.outboundDocuments.toUserName !== '') &&
        (this.filters.outboundDocuments.type !== '')) {
        return _.select(this.outboundDocuments, (doc) => {
          if ((doc.toUserName !== '' && doc.toUserName !==
            undefined) && (doc.type !== '' && doc.type !==
            undefined)) {
            return (doc.toUserName.toLowerCase()
              .includes(
                this.filters.outboundDocuments.toUserName.toLowerCase()))
              && ((doc.type.toLowerCase()
                .includes(
                  this.filters.outboundDocuments.type.toLowerCase())));
          }
          return null;
        });
      }
      // filter toUserName and year together
      if ((this.filters.outboundDocuments.toUserName !== '') &&
        (this.filters.outboundDocuments.year !== '')) {
        return _.select(this.outboundDocuments, (doc) => {
          if ((doc.toUserName !== '' && doc.toUserName !==
            undefined) && (doc.year !== '' && doc.year !==
            undefined)) {
            return (doc.toUserName.toLowerCase()
              .includes(
                this.filters.outboundDocuments.toUserName.toLowerCase()))
              && ((doc.year.toLowerCase()
                .includes(
                  this.filters.outboundDocuments.year.toLowerCase())));
          }
          return null;
        });
      }
      // filter type and year together
      if ((this.filters.outboundDocuments.type !== '') &&
        (this.filters.outboundDocuments.year !== '')) {
        return _.select(this.outboundDocuments, (doc) => {
          if ((doc.type !== '' && doc.type !==
            undefined) && (doc.year !== '' && doc.year !==
            undefined)) {
            return (doc.type.toLowerCase()
              .includes(
                this.filters.outboundDocuments.type.toLowerCase()))
              && ((doc.year.toLowerCase()
                .includes(
                  this.filters.outboundDocuments.year.toLowerCase())));
          }
          return null;
        });
      }

      // filters by toUserName
      if (this.filters.outboundDocuments.toUserName !== '') {
        return _.select(this.outboundDocuments, (doc) => {
          if (doc.toUserName !== '' && doc.toUserName !==
            undefined) {
            return doc.toUserName.toLowerCase()
              .includes(
                this.filters.outboundDocuments.toUserName.toLowerCase());
          }
          return null;
        });
      }
      // filters by type
      if (this.filters.outboundDocuments.type !== '') {
        return _.select(this.outboundDocuments, (doc) => {
          if (doc.type !== '' && doc.type !== undefined) {
            return doc.type.toLowerCase()
              .includes(
                this.filters.outboundDocuments.type.toLowerCase());
          }
          return null;
        });
      }
      // filters by year
      if (this.filters.outboundDocuments.year !== '') {
        return _.select(this.outboundDocuments, (doc) => {
          if (doc.year !== '' && doc.year !==
            undefined) {
            return doc.year.toLowerCase()
              .includes(
                this.filters.outboundDocuments.year.toLowerCase());
          }
          return null;
        });
      }

      return this.outboundDocuments;
    },
    filteredInboundDocuments() {
      if (this.filters.inboundDocuments !== '' && this.filters.inboundDocuments !== null) {
        return _.select(this.inboundDocuments, (doc) => {
          if (doc.fromUserName !== '' && doc.fromUserName !== undefined) {
            return doc.fromUserName.toLowerCase()
              .includes(
                this.filters.inboundDocuments.toLowerCase());
          }
          return null;
        });
      }
      return this.inboundDocuments;
    },
  },
  methods: {
    setDialog(bool) {
      this.dialog = bool;
    },
    downloadDocuments(idx, document) {
      this.name = this.$store.dispatch('downloadDocuments', {
        path: document.path[idx],
        userId: document.fromUserId,
      });
    },
  },
  async created() {
    this.inboundDocuments = await this.$store.dispatch('getAllInboundDocuments');
    this.outboundDocuments = await this.$store.dispatch('getAllOutboundDocuments');
  },
};
</script>
