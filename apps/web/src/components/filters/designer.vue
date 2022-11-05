<template>
  <div id="filters">
    <v-dialog v-model="baseObjectDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          Select a base object
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-autocomplete v-model="baseObject" :items="autocompleteObjects" chips dense
                          label="Select Object" outlined return-object small-chips
                          style="max-width: 150px"
          >
          </v-autocomplete>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button" @click="selectBaseObject()">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="designExistsDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Filter create failed
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
          Filter Updated
        </v-card-title>
        <v-card-text>
          Filter has been Updated!
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
          Filter Saved
        </v-card-title>
        <v-card-text>
          Filter has been saved!
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
        {{ context === 'create' ? 'Create ' : 'Update ' }}Filter
      </div>
      <form @submit.prevent="onSubmit">
        <v-card elevation="1" class="pa-5 ma-5">
          <v-row>
            <v-col>
              <v-text-field
                v-model="design.object" label="Object" disabled>
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="design.label" label="Label" required/>
            </v-col>
            <v-col>
              <v-text-field :disabled="context === 'update'" v-model="design.name" label="Name"
                            required/>
            </v-col>
          </v-row>
        </v-card>
<!--        <div class="headline text-xs-center red&#45;&#45;text pb- pt-5">-->
<!--          Inputs-->
<!--        </div>-->
<!--        <v-container class="pa-5 ma-5 pb-9">-->
<!--          <v-row>-->
<!--            <v-col cols="12" md="12">-->
<!--              <div>-->
<!--                <v-card elevation="1">-->
<!--                  <inputs :inputs="design.meta.inputs" :primary-object="primaryObject"-->
<!--                          :objects="objects" />-->
<!--                </v-card>-->
<!--              </div>-->
<!--            </v-col>-->
<!--            <v-btn style="position: absolute; right: 16px" icon-->
<!--                   @click="design.meta.inputs.push({-->
<!--                      label: '',-->
<!--                      name: '',-->
<!--                      object: '',-->
<!--                    })">-->
<!--              <v-icon class="red&#45;&#45;text"> mdi-plus</v-icon>-->
<!--            </v-btn>-->
<!--            <v-btn style="position: absolute; right: 54px" icon-->
<!--                   @click="design.meta.inputs.pop()">-->
<!--              <v-icon class="red&#45;&#45;text"> mdi-minus</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--        </v-container>-->
        <div class="headline text-xs-center red--text pb- pt-5">
          Conditions
        </div>
        <v-card class="pa-5 ma-5 pb-9">
          <v-row>
            <v-col cols="12" md="12">
              <div>
                <v-card elevation="1">
                  <conditions
                    v-bind:objects="objects"
                    v-bind:primaryObject="primaryObject"
                    :conditions.sync="design.meta.conditions">
                  </conditions>
                </v-card>
              </div>
            </v-col>
            <v-btn style="position: absolute; right: 16px" icon
                   @click="design.meta.conditions.push({
                      lhs: {
                        field: '',
                      },
                      operator: '',
                      rhs: {
                        type: '',
                        object: '',
                        value: '',
                        systemField: '',
                        field: '',
                      },
                    })">
              <v-icon class="red--text"> mdi-plus</v-icon>
            </v-btn>
            <v-btn style="position: absolute; right: 54px" icon
                   @click="design.meta.conditions.pop()">
              <v-icon class="red--text"> mdi-minus</v-icon>
            </v-btn>
          </v-row>
        </v-card>
        <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import conditions from '../conditions/conditions';
import inputs from '../inputs/inputs';

export default {
  components: {
    conditions,
    inputs,
  },
  props: {
    designs: Array,
    design: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'filter',
        object: '',
        meta: {
          inputs: [{
            label: '',
            name: '',
            object: '',
          }],
          conditions: [{
            lhs: {
              field: '',
            },
            operator: '',
            rhs: {
              type: '',
              object: '',
              value: '',
              systemField: '',
              field: '',
            },
          }],
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
      objects: [],
      baseObjectDialog: true,
      baseObject: null,
    };
  },
  computed: {
    autocompleteObjects() {
      return _.map(this.objects, object => ({
        text: object.label,
        value: object.name,
      }));
    },
    forms() {
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
    primaryObject() {
      if (this.design.object) {
        return _.findWhere(this.objects, { name: this.design.object });
      }
      return {};
    },
  },
  methods: {
    selectBaseObject() {
      this.design.object = this.baseObject.value;
      this.baseObjectDialog = false;
    },
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
      this.$router.push('/filters/list');
    },
  },
  watch: {
    'design.label': {
      handler(label) {
        if (this.context === 'create') {
          this.design.name = label.trim().split(' ').join('_').toLowerCase();
        }
      },
    },
  },
  async created() {
    this.objects = await this.$store.dispatch('getAllObjects');
    if (this.context === 'update') {
      this.baseObject = _.findWhere(this.autocompleteObjects, { value: this.design.object });
      this.baseObjectDialog = false;
    }
  },
};
</script>
