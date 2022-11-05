<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-card class="pb-3 mb-3 grey lighten-4">
            <div class="headline text-xs-center red--text pb-5 pt-5">Documents Sent</div>
            <v-data-table :headers="inboundDocumentsHeaders"
                          :items="inboundDocuments" class="elevation-1">
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
                <td>{{ props.item.path }}</td>
                <td>{{ props.item.timestamp }}</td>
              </template>
            </v-data-table>
          </v-card>
          <v-card class="pb-5 mb-5 grey lighten-4" flat>
            <div class="headline text-xs-center red--text pb-5 pt-5">Documents Received</div>
            <v-data-table :headers="outboundDocumentsHeaders"
                          :items="outboundDocuments" class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.timestamp }}</td>
                <td> {{ props.item.path }}</td>
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
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      inboundDocumentsHeaders: [
        { text: 'Document Name', align: 'left', value: 'path' },
        { text: 'Time Uploaded', align: 'left', value: 'timestamp' },
      ],
      outboundDocumentsHeaders: [
        { text: 'Document Name', align: 'left', value: 'path' },
        { text: 'Document Type', align: 'left', value: 'type' },
        { text: 'Uploaded By', align: 'left', value: 'fromUserName' },
        { text: 'Notes', align: 'left', value: 'description' },
        { text: 'Year', align: 'left', value: 'year' },
        { text: 'Time Uploaded', align: 'left', value: 'timestamp' },
      ],
      outboundDocuments: [],
      inboundDocuments: [],
    };
  },
  methods: {
    setDialog(bool) {
      this.dialog = bool;
    },
    downloadDocuments(idx, document) {
      this.name = this.$store.dispatch('downloadDocuments', {
        path: document.path[idx],
      });
    },
  },
  async created() {
    this.inboundDocuments = await this.$store.dispatch('getInboundDocuments');
    this.outboundDocuments = await this.$store.dispatch('getOutboundDocuments');
  },
};
</script>
