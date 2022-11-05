<template>
  <v-card>
    <v-card-title><span class="headline">{{ formTitle }}</span></v-card-title>
    <v-container>
      <v-row>
        <v-col cols="16" sm="6" md="4">
          <v-text-field v-model="template.label" label="Label">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field :disabled="context === 'update'" v-model="template.name" label="Name">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field v-model="template.description" label="Description">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-file-input v-model="selectedFile" label="PDF" :disabled="context === 'read'"
                        chips show-size counter outlined dense color="red">
            <template v-slot:selection="{ text }">
              <v-chip small label color="red darken-2" text-color="white">{{ text }}</v-chip>
            </template>
          </v-file-input>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-2" dark text @click="close">Cancel</v-btn>
      <v-btn color="red darken-2" dark text @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  props: ['template', 'context'],
  data() {
    return {
      selectedFile: null,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Template' : 'Edit Template';
    },
  },
  methods: {
    save() {
      if (this.selectedFile !== {}) {
        this.template.attachment = this.selectedFile;
      }
      this.$emit('save', this.template);
      this.close();
    },
    close() {
      this.selectedFile = {};
      this.$emit('dialog', false);
    },
  },
};

</script>
