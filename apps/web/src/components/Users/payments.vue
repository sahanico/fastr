<template>
  <div class="grey lighten-4" style="height:100%">
    <v-container>
      <v-layout>
        <v-flex>
          <v-card class="pb-5 mb-5 grey lighten-4" flat>
            <div class="headline text-xs-center red--text pb-5 pt-5">
              Outstanding Payments
            </div>
            <v-data-table :headers="outstandingPaymentHeaders"
                          :items="outstandingPayments" class="elevation-1">
              <template v-slot:item.invoice_name="{ item }">
                <a href="javascript:void(0)" @click="downloadInvoice(item)">
                  {{ item.invoice_name }}
                </a>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <v-layout>
        <v-flex>
          <v-card class="pb-5 mb-5 grey lighten-4" flat>
            <div class="headline text-xs-center red--text pb-5 pt-5">Payment History</div>
            <v-data-table :headers="paymentHistoryHeaders"
                          :items="paymentHistory" class="elevation-1">
              <template v-slot:item.invoice_name="{ item }">
                <a href="javascript:void(0)" @click="downloadInvoice(item)">
                  {{ item.invoice_name }}
                </a>
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
  components: {
    /* 'create-invoice': CreateInvoice, */
  },
  data() {
    return {
      dialog: false,
      outstandingPayments: [],
      paymentHistory: [],
      outstandingPaymentHeaders: [
        { value: 'invoice_name', text: 'Invoice name' },
        { value: 'invoice_date', text: 'Invoice Date' },
        { value: 'total', text: 'Total' },
        { value: 'notes', text: 'Notes' },
      ],
      paymentHistoryHeaders: [
        { value: 'invoice_name', text: 'Invoice name' },
        { value: 'invoice_date', text: 'Invoice Date' },
        { value: 'total', text: 'Total' },
        { value: 'notes', text: 'Notes' },
        { value: 'payment_details.void', text: 'Voided' },
      ],
    };
  },
  async created() {
    this.paymentHistory = await this.$store.dispatch('getPaidInvoices');
    this.outstandingPayments = await this.$store.dispatch('getOutstandingInvoices');
  },
  methods: {
    downloadInvoice(invoice) {
      this.invoice_name = this.$store.dispatch('downloadInvoice', {
        path: invoice.path,
        userId: invoice.userId,
      });
    },
  },
};
</script>
