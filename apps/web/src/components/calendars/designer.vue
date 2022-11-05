<template>
  <div id="calendars">
    <v-dialog v-model="designExistsDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Calendar create failed
        </v-card-title>
        <v-card-text>
          A design with this name already exists.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="designExistsDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="updatedDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Calendar Updated
        </v-card-title>
        <v-card-text>
          Calendar has been Updated!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="routeToList">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createdDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Calendar Saved
        </v-card-title>
        <v-card-text>
          Calendar has been saved!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="routeToList">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <div class="headline red--text pb-5 pt-5" style="text-align: center">
        {{context === 'create'? 'Create ' : 'Update '}}Calendar
      </div>
      <form @submit.prevent="onSubmit">
        <v-card elevation="1" class="pa-5 ma-5">
          <v-row>
            <v-col>
              <v-text-field v-model="design.label" label="Label" required/>
            </v-col>
            <v-col>
              <v-text-field :disabled="context === 'update'" v-model="design.name" label="Name"
                            required/>
            </v-col>
          </v-row>
        </v-card>
        <div class="headline text-xs-center red--text pb- pt-5">
          Create Button
        </div>
        <v-card class="pa-5 ma-5 pb-9">
          <v-row>
            <v-checkbox v-model="design.meta.create.enable" label="Enable Create Button" />
          </v-row>
          <v-row>
            <v-autocomplete v-model="design.meta.create.form"
                            :items="autocompleteForms" label="Create Form" />
          </v-row>
        </v-card>
        <div class="headline text-xs-center red--text pb- pt-5">
          Resources
        </div>
        <v-card class="pa-5 ma-5 pb-9">
          <v-row v-for="(item, idx) in design.meta.resources" :key="idx">
            <v-responsive max-width="50px">
              <div style="padding: 50%;">
                {{ idx + 1 }}
              </div>
            </v-responsive>
            <v-col >
              <v-text-field v-model="design.meta.resources[idx].label" label="Label"/>
            </v-col>
            <v-col>
              <v-text-field v-model="design.meta.resources[idx].name" label="Name" />
            </v-col>
            <v-col>
              <v-autocomplete :items="autocompleteObjects"
                              v-model="design.meta.resources[idx].object" />
            </v-col>
            <v-col >
              <v-select v-model="design.meta.resources[idx].card"
                        :items="autocompleteForms" label="Card Form"/>
            </v-col>
          </v-row>
          <v-btn style="position: absolute; right: 16px" icon
                 @click="design.meta.resources.push({})">
            <v-icon class="red--text"> mdi-plus</v-icon>
          </v-btn>
          <v-btn style="position: absolute; right: 54px" icon
                 @click="design.meta.resources.pop()">
            <v-icon class="red--text"> mdi-minus</v-icon>
          </v-btn>
        </v-card>
        <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';

export default {
  props: {
    designs: Array,
    design: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'calendar',
        meta: {
          create: {
            enable: true,
            form: '',
          },
          resources: [
            {
              object: '',
              label: '',
              form: '',
              card: '',
            },
          ],
        },
      }),
    },
    context: String,
  },
  data() {
    return {
      updatedDialog: false,
      designExistsDialog: false,
      createdDialog: false,
      objects: null,
    };
  },
  computed: {
    autocompleteObjects() {
      if (!this.objects) return [];
      return _.map(this.objects, object => ({
        text: object.label,
        value: object.name,
      }));
    },
    autocompleteForms() {
      const forms = _.where(this.designs, { type: 'form' });
      return _.map(forms, form => ({
        text: form.label,
        value: form.name,
      }));
    },
    processes() {
      const processes = _.where(this.designs, { type: 'process' });
      return _.map(processes, process => ({
        text: process.label,
        value: process.name,
      }));
    },
  },
  methods: {
    async onSubmit() {
      if (this.context === 'create') {
        const newDesign = await this.$store.dispatch('createDesign', this.design);
        if (newDesign.data === 'design-exists') {
          this.designExistsDialog = true;
        } else {
          this.createdDialog = true;
        }
      } else if (this.context === 'update') {
        const updatedDesign = await this.$store.dispatch('updateDesign', this.design);
        if (updatedDesign) {
          this.updatedDialog = true;
        }
      }
    },
    routeToList() {
      this.$router.push('/calendars/list');
    },
  },
  async created() {
    this.objects = await this.$store.dispatch('getAllObjects');
  },
};
</script>
