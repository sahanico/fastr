<template>
  <form ref="sendFileForm" lazy-validation @submit.prevent="onSubmit">
    <v-card>
      <v-card-title><span class="headline">Create Invoice</span></v-card-title>
      <v-card-text>
        <v-row>
          <v-autocomplete v-model="selectedUser" :items="autocompleteUsers" chips dense
                          label="Send To" outlined return-object small-chips></v-autocomplete>
          <v-spacer></v-spacer>
          <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                  :return-value.sync="date" transition="scale-transition"
                  offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="date" label="Invoice Date" prepend-icon="event"
                            v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="date" color="red" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-row>
        <v-row>
          <v-div>
            <v-text-field v-model="bill_to_name" label="Mailing Name"></v-text-field>
            <v-text-field v-model="bill_to_email" label="Email"></v-text-field>
            <v-text-field v-model="bill_to_phone" label="Phone"></v-text-field>
            <v-text-field v-model="bill_to_address_1" label="Mailing Address 1"></v-text-field>
            <v-text-field v-model="bill_to_address_2" label="Mailing Address 2"></v-text-field>
            <v-text-field v-model="bill_to_postal_code" label="Postal Code"></v-text-field>
          </v-div>
          <v-spacer></v-spacer>
          <v-textarea v-model="notes" hint="Leave a comment"
                      label="Description" required></v-textarea>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="lineItems"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Itemized Bill</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="red darken-2" dark class="mb-2" v-bind="attrs" v-on="on">ADD ITEM
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title><span class="headline">{{ formTitle }}</span></v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-text-field v-model="editedItem.lineItem" label="Line Item">
                        </v-text-field>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.year" label="Year">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.quantity" label="Quantity">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.amount" label="Amount"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-2" dark text @click="close">Cancel</v-btn>
                    <v-btn color="red darken-2" dark text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
        <v-row style="padding-top: 20px">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <div>
            <v-text-field v-model="subtotal" label="Subtotal" disabled></v-text-field>
            <v-text-field v-model="tax" label="Tax (13%)" disabled></v-text-field>
            <v-text-field v-model="total" label="Total" disabled></v-text-field>
          </div>
        </v-row>
        <input ref="fileInput" style="display: none" type="file" @change="onFileSelected"/>
        <div style="padding-left: 40px">{{ selectedFile ? selectedFile.name : '' }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-2" dark @click="$emit('setDialog', false)">Close</v-btn>
        <v-btn color="red darken-2" dark type="submit">Create</v-btn>
      </v-card-actions>
    </v-card>
  </form>
</template>

<script>

import { _ } from 'vue-underscore';

export default {
  props: ['dialog'],
  data() {
    return {
      users: [],
      autocompleteUsers: [],
      selectedUser: {},
      usernames: [],
      documentTypes: [
        'T4',
        'RRSP',
        'Notice of Assessment',
        'T1 General',
        'Tuition Fees',
        'Authorization',
        '183',
        'Misc'],
      invoice_name: '',
      bill_to_address_1: '',
      bill_to_address_2: '',
      bill_to_postal_code: '',
      selectedDocumentType: '',
      notes: '',
      selectedFile: null,
      uploading: false,
      year: '',
      documentTitle: '',
      id: '',
      date: new Date().toISOString().substr(0, 10),
      fullName: '',
      menu: false,
      modal: false,
      taxRate: 0.13,
      lineItem: '',
      invoice_id: '',
      headers: [
        { text: 'Line Item', value: 'lineItem' },
        { text: 'Year', value: 'year' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Amount', value: 'amount' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      payment_details: {},

      lineItems: [],
      editedIndex: -1,
      editedItem: {
        lineItem: '',
        year: 0,
        quantity: 0,
        amount: 0,
      },
      defaultItem: {
        lineItem: '',
        year: 0,
        quantity: 0,
        amount: 0,
      },
    };
  },
  methods: {

    onFileSelected(event) {
      this.uploading = true;
      this.selectedFile = event.target.files[0];
    },
    sendFileForm() {
      if (this.$refs.sendFileForm.validate()) {
        this.snackbar = true;
      }
    },
    onSubmit() {
      const invoice = {
        invoice_name: this.invoice_name,
        send_to: this.send_to,
        userId: this.userId,
        invoice_date: this.date,
        subtotal: this.subtotal,
        tax: this.tax,
        total: this.total,
        notes: this.notes,
        line_items: this.lineItems,
        payment_details: Object.assign({ paid: false, notes: '', void: false }),
        bill_to_address_1: this.bill_to_address_1,
        bill_to_address_2: this.bill_to_address_2,
        bill_to_name: this.bill_to_name,
        bill_to_postal_code: this.bill_to_postal_code,
        bill_to_phone: this.bill_to_phone,
        bill_to_email: this.bill_to_email,
      };
      this.$store.dispatch('submitInvoice', invoice);
      this.$emit('setDialog', false);
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.lineItems[this.editedIndex], this.editedItem);
      } else {
        this.lineItems.push(this.editedItem);
      }
      this.close();
    },
    initialize() {
      this.lineItems = [];
    },
    editItem(item) {
      this.editedIndex = this.lineItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.lineItems.indexOf(item);
      this.lineItems.splice(index, 1);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
  async created() {
    this.initialize();
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
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    },
    subtotal() {
      let sum = 0;
      _.each(this.lineItems, (lineItem) => {
        sum += lineItem.amount * lineItem.quantity;
      });
      return sum.toFixed(2);
    },
    tax() {
      return (this.subtotal * this.taxRate).toFixed(2);
    },
    total() {
      return (this.subtotal * (1 + this.taxRate)).toFixed(2);
    },
    bill_to_name() {
      if (this.selectedUser.value) {
        return this.users[this.selectedUser.value].name;
      }
      return '';
    },
    userId() {
      if (this.selectedUser.value) {
        return this.users[this.selectedUser.value].userId;
      }
      return '';
    },
    bill_to_phone() {
      if (this.selectedUser.value) {
        return this.users[this.selectedUser.value].phoneNumber;
      }
      return '';
    },
    bill_to_email() {
      if (this.selectedUser.value) {
        return this.users[this.selectedUser.value].email;
      }
      return '';
    },
    send_to() {
      return this.selectedUser.text ? this.selectedUser.text : '';
    },
  },
  watch: {
    dialog(val) {
      return val || this.close();
    },
  },
};
</script>

<style>

</style>
