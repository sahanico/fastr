<template>
  <div class="grey lighten-4" style="height:100%">
    <v-container>
      <v-layout>
        <v-flex>
          <v-card class="pb-5 mb-5 grey lighten-4" flat>
            <div class="headline text-xs-center red--text pb-5 pt-5">
              Outstanding Payments
            </div>
            <div>
              <v-dialog v-model="dialog">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" color="red darken-2"
                         dark style="align: right;">
                    Create New Invoice
                  </v-btn>
                </template>
                <template>
                  <div style="width: 100%">
                    <create-invoice @setDialog="setDialog"></create-invoice>
                  </div>
                </template>
              </v-dialog>
            </div>
            <div></div>
            <v-data-table :headers="outstandingPaymentHeaders"
                          :items="outstandingPayments" class="elevation-1">
              <template v-slot:item.invoice_name="{item}">
                <a href="javascript:void(0)" @click="downloadInvoice(item)">
                  {{ item.invoice_name }}
                </a>
              </template>
              <template v-slot:item.payment_details="{item}">
                <PaymentStatus v-on:paid_invoice="updateUI" :item="item"></PaymentStatus>
              </template>
              <template v-slot:item.void="{item}">
                <voidInvoice :item="item" v-on:voided_invoice="updateUI"></voidInvoice>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">transaction details</span>
                </v-card-title>
              </v-card>
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
import _ from 'underscore';
import createInvoice from '@/components/Admins/create_invoice';
import voidInvoice from './voidInvoice';
import PaymentStatus from './PaymentStatus';

export default {
  props: ['dialogs', 'item'],
  components: {
    'create-invoice': createInvoice,
    voidInvoice,
    PaymentStatus,
  },
  data() {
    return {
      dialog: false,
      pay_stat: '',
      // setDialog: false,
      outstandingPaymentHeaders: [
        { value: 'invoice_name', text: 'Invoice name' },
        { value: 'send_to', text: 'Send To' },
        { value: 'invoice_date', text: 'Invoice Date' },
        { value: 'total', text: 'Total' },
        { value: 'notes', text: 'Notes' },
        { value: 'payment_details', text: 'Payment Details' },
        { value: 'void', text: 'VOID Invoice' },
      ],
      outstandingPayments: [],
      paymentHistory: [],
      paymentHistoryHeaders: [
        { value: 'invoice_name', text: 'Invoice name' },
        { value: 'send_to', text: 'Send To' },
        { value: 'invoice_date', text: 'Invoice Date' },
        { value: 'total', text: 'Total' },
        { value: 'notes', text: 'Notes' },
        { value: 'payment_details.void', text: 'Voided' },
      ],
    };
  },
  async created() {
    this.paymentHistory = await this.$store.dispatch('getAllPaidInvoices');
    this.outstandingPayments = await this.$store.dispatch('getAllOutstandingInvoices');
  },
  methods: {
    setDialog(bool) {
      this.dialog = bool;
    },
    updateUI(invoice) {
      this.outstandingPayments = _.filter(this.outstandingPayments, item => invoice.id !==
        item.id);
      this.paymentHistory.push(invoice);
    },
    downloadInvoice(invoice) {
      this.invoice_name = this.$store.dispatch('downloadInvoice', {
        path: invoice.path,
        userId: invoice.userId,
      });
    },
  },
};
</script>
