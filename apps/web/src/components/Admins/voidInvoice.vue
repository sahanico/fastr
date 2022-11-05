<template>
  <v-row justify="center">
    <v-btn color="red darken-2" dark @click="dialog = true">
      VOID INVOICE
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"
        >NOTE
        </v-card-title
        >

        <v-text-field v-model="notes" required>
        </v-text-field>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            Close
          </v-btn>

          <v-btn color="green darken-1" text @click="voidInvoice()">
            Approve VOID
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
export default {
  props: ['item'],
  data() {
    return {
      dialog: false,
      notes: '',
    };
  },
  methods: {
    async voidInvoice() {
      const voidedInvoice = await this.$store.dispatch('voidInvoice', {
        // eslint-disable-next-line no-underscore-dangle
        invoiceId: this.item._id,
        notes: this.notes,
        userId: this.item.userId,
      });
      this.$emit('voided_invoice', voidedInvoice);
      this.dialog = false;
    },
  },
};
</script>
