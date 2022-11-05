<template>
  <form ref="sendFileForm" lazy-validation @submit.prevent="onSubmit">
    <v-card>
      <v-card-title><span class="headline">Send Document</span></v-card-title>
      <v-card-text>
        <v-autocomplete v-model="selectedUser" :items="autocompleteUsers" chips dense
                        label="Send To" outlined return-object small-chips></v-autocomplete>
        <v-text-field v-model="documentTitle" label="Document Title" required></v-text-field>
        <v-text-field v-model="year" label="Year" required></v-text-field>
        <v-select v-model="selectedDocumentType" :items="documentTypes"
                  label="Document Type" required></v-select>
        <v-textarea v-model="notes" hint="Leave a comment"
                    label="Description" required></v-textarea>
        <input ref="fileInput" style="display: none" type="file" @change="onFileSelected" multiple/>
        <v-btn color="red darken-4" flat type="button"
               @click="$refs.fileInput.click()">Attach Document
        </v-btn>
        <div style="padding-left: 40px">{{ selectedFile ? selectedFile.name : '' }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-2" flat @click="$emit('setDialog', false)">Close</v-btn>
        <v-btn color="red darken-2" dark type="submit">Send</v-btn>
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
      selectedDocumentType: '',
      notes: '',
      selectedFile: null,
      uploading: false,
      year: '',
      documentTitle: '',
    };
  },
  methods: {
    onFileSelected(event) {
      this.uploading = true;
      this.selectedFile = event.target.files;
    },
    sendFileForm() {
      if (this.$refs.sendFileForm.validate()) {
        this.snackbar = true;
      }
    },
    onSubmit() {
      const fd = new FormData();
      const paths = [];
      Array.prototype.forEach.call(this.selectedFile, (file) => {
        fd.append(file.name, file, file.name);
        paths.push(`/${file.name}`);
      });

      const fileData = {
        name: this.documentTitle,
        toUserId: this.users[this.selectedUser.value].userId,
        type: this.selectedDocumentType,
        year: this.year,
        description: this.notes,
        transaction: 'outbound',
        path: paths,
      };
      fd.append('name', fileData.name);
      fd.append('toUserId', fileData.toUserId);
      fd.append('type', fileData.type);
      fd.append('year', fileData.year);
      fd.append('description', fileData.description);
      fd.append('transaction', fileData.transaction);
      this.$store.dispatch('sendDocumentToUser', fd);
      this.$emit('setDialog', false);
    },
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
};
</script>

<style>

</style>
