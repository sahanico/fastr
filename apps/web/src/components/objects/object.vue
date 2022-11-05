<template>
  <form ref="objectForm" lazy-validation @submit.prevent="onSubmit">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ this.context === 'create' ? 'Create object' : `Update object: ${this.name}` }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="object.label" label=" Label" required></v-text-field>
          </v-col>
          <v-col>
            <v-text-field :disabled="this.context === 'update'" v-model="object.name" label="Name"
                          required/>
          </v-col>
          <v-col>
            <v-text-field v-model="object.description" label="Description" required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select v-model="object.primaryField" label=" Primary Field"
                      :items="autocompleteFields" required/>
          </v-col>
        </v-row>
        <v-row>
          <v-card-title><span class="headline">Fields</span></v-card-title>
        </v-row>
        <v-row>
          <template>
            <v-btn color="red darken-2" style="margin-left: 16px" dark class="mb-2" v-bind="attrs"
                   @click="dialog(true, null )">
              ADD FIELD
            </v-btn>
          </template>
          <v-dialog v-model="fieldDialog" max-width="800px">
            <template>
              <div style="width: 100%">
                <field :context="fieldContext" :field="selectedField" @saveField="saveField"
                       @dialog="dialog"/>
              </div>
            </template>
          </v-dialog>
        </v-row>
        <v-data-table :headers="headers" :items="object.fields">
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editField(item)"> mdi-pencil</v-icon>
            <v-icon small @click="deleteField(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
        <v-row>
          <v-card-title><span class="headline">PDF Templates</span></v-card-title>
        </v-row>
        <v-row>
          <template>
            <v-btn color="red darken-2" style="margin-left: 16px" dark class="mb-2" v-bind="attrs"
                   @click="dialogForTemplate(true, null )">
              ADD Template
            </v-btn>
          </template>
          <v-dialog v-model="templateDialog" max-width="800px">
            <template>
              <div style="width: 100%">
                <pdf-template :template="selectedTemplate" @save="saveTemplate"
                              @dialog="dialogForTemplate"/>
              </div>
            </template>
          </v-dialog>
        </v-row>
        <v-data-table :headers="templateHeaders" :items="object.templates">
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editTemplate(item)"> mdi-pencil</v-icon>
            <v-icon small @click="deleteTemplate(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-2" dark type="submit">
            {{ this.context === 'create' ? ' Create' : 'Update' }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </form>
</template>

<script>
import _ from 'underscore';
import Field from './fields/field';
import PdfTemplate from './templates/pdf';
import { blankObject, blankTemplate } from './models';

export default {
  props: ['name', 'objects', 'context'],
  components: {
    Field,
    PdfTemplate,
  },
  data() {
    return {
      editedIndex: -1,
      fieldDialog: false,
      templateDialog: false,
      object: {},
      headers: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      templateHeaders: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      selectedField: undefined,
      selectedTemplate: blankTemplate(),
      fieldContext: 'create',
      templateContext: 'create',
    };
  },
  computed: {
    autocompleteFields() {
      return _.map(this.object.fields, field => ({ text: field.label, value: field.name }));
    },
  },
  methods: {
    dialog(bool, item) {
      this.fieldDialog = bool;
      this.selectedField = item || undefined;
      this.fieldContext = item ? 'update' : 'create';
    },
    dialogForTemplate(bool, item) {
      this.templateDialog = bool;
      this.selectedTemplate = item || blankTemplate();
      this.templateContext = item ? 'update' : 'create';
    },
    saveField(field) {
      const existingField = _.findWhere(this.object.fields, { name: field.name });
      if (existingField) {
        this.object.fields[field.name] = field;
      } else {
        this.object.fields.push(field);
      }
      this.selectedField = undefined;
    },
    async saveTemplate(template) {
      if (template.attachment) {
        const fd = new FormData();
        const path = `/${template.attachment.name}`;
        fd.append(template.attachment.name, template.attachment);
        fd.append('object', this.object.name);
        fd.append('name', template.name);
        fd.append('label', template.label);
        fd.append('description', template.description);
        fd.append('path', path);
        await this.$store.dispatch('uploadTemplate', fd);
      }
      const existingTemplate = _.findWhere(this.object.templates, { name: template.name });
      if (existingTemplate) {
        this.object.templates[template.name] = template;
      } else {
        this.object.templates.push(template);
      }
      this.template = blankTemplate();
    },
    editField(item) {
      this.dialog(true, item);
    },
    editTemplate(item) {
      this.dialogForTemplate(true, item);
    },
    deleteField(item) {
      this.object.fields = _.filter(this.object.fields, field => field.name !== item.name);
    },
    deleteTemplate(item) {
      this.object.templates = _.filter(this.object.templates, field => field.name !== item.name);
    },
    async onSubmit() {
      if (this.context === 'create') {
        await this.$store.dispatch('createObject', this.object);
      } else {
        await this.$store.dispatch('updateObjectById', this.object);
      }
      await this.$router.push({ name: 'ObjectList' });
    },
  },
  watch: {
    'object.label': {
      handler(label) {
        if (this.context === 'create') {
          this.object.name = label.trim().split(' ').join('_').toLowerCase();
        }
      },
    },
  },
  async created() {
    if (this.context === 'create') {
      this.object = blankObject();
    } else {
      this.object = await this.$store.dispatch('getObjectByName', { name: this.name });
    }
  },
};
</script>

<style>

</style>
