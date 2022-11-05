<template>
  <div id="forms">
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
    <div v-if="selectedField !== {}">
      <field-settings :dialog="fieldSettingsDialog" :field="selectedField" :objects="objects"
                      :design="design" @save="saveFieldSettings" :designs="designs"
                      @close="fieldSettingsDialog = false"/>
    </div>
    <v-dialog v-model="createdDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          Form Saved
        </v-card-title>
        <v-card-text>
          Form has been saved!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button" @click="routeToList">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="designExistsDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Form create failed
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
          Form Updated
        </v-card-title>
        <v-card-text>
          Form has been Updated!
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
        {{ context === 'create' ? 'Create ' : 'Update ' }}Form
      </div>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <div>
              <v-text-field label="Filter" v-model="fieldFilter"/>
            </div>
            <div>Available Fields</div>
            <div>
              <v-chip-group column multiple>
                <div v-for="(item, index) in availableFields" :key="index">
                  <v-chip id="field-item" @drag="drag" @dragend="dragend"
                          class="droppable-element"
                          :draggable="true" @mousedown="clickedField = item"
                          elevation="3" :data="item">
                    {{ `${item.name} | ${item.label}` }}
                  </v-chip>
                </div>
              </v-chip-group>
            </div>
            <div>Custom Fields</div>
            <div>
              <v-chip-group column multiple>
                <div v-for="(item, index) in customFields" :key="index">
                  <v-chip @drag="drag" @dragend="dragend"
                          class="droppable-element"
                          :draggable="true" @mousedown="clickedField = item"
                          elevation="3" :data="item">
                    {{ item.label }}
                  </v-chip>
                </div>
              </v-chip-group>
            </div>
          </v-col>
          <v-col cols="12" md="9">
            <form @submit.prevent="onSubmit">
              <v-card elevation="1" class="pa-5 ma-5">
                <v-row>
                  <v-col>
                    <v-text-field v-model="design.object" label="Base Object" required disabled/>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="design.label" label="Label" required/>
                  </v-col>
                  <v-col>
                    <v-text-field :disabled="context === 'update'" v-model="design.name"
                                  label="Name" required/>
                  </v-col>
                </v-row>
              </v-card>
              <div>
                <div class="headline text-xs-center red--text pb- pt-5">
                  <input type="checkbox" id="checkbox" v-model="design.meta.showLabel">
                  <label for="checkbox">{{ `Show Label : ${design.meta.showLabel}` }}</label>
                </div>
              </div>
              <div>
                <inputs :autocomplete-objects="autocompleteObjects" :design="design"/>
              </div>
              <div class="headline text-xs-center red--text pb- pt-5">
                Hidden Fields
              </div>
              <v-row v-for="(item, index) in design.meta.hiddenFields" :key="index">
                <v-col cols="12" md="3">
                  <div v-if="!item.name">
                    <v-select v-model="item.name" :items="availableFieldNames" label="Field"/>
                  </div>
                  <div v-if="item.name">
                    <v-text-field v-model="item.name" disabled label="Field"/>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn style="position: absolute; right: 16px" icon
                         @click="design.meta.hiddenFields.push({})">
                    <v-icon class="red--text"> mdi-plus</v-icon>
                  </v-btn>
                  <v-btn style="position: absolute; right: 54px" icon
                         @click="design.meta.hiddenFields.pop()">
                    <v-icon class="red--text"> mdi-minus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <div class="headline text-xs-center red--text pb- pt-5">
                Layout
              </div>
              <div>
                <v-layout>
                  <v-flex offset-sm5 offset-xs2 sm2 xs8 class="pa-1">
                    <v-card max-height="60px">
                      <v-row class="text-lg-center mx-1; justify-center">
                        <v-col>
                          <v-text-field dense v-model="design.meta.column" label="column" outlined
                                        color="red darken-2"/>
                        </v-col>
                        <v-col>
                          <v-text-field dense v-model="design.meta.height" label="height" outlined
                                        color="red darken-2"/>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-flex>
                </v-layout>
              </div>
              <div>
                <div style="position: relative; padding: 40px">
                  <v-card :elevation="1">
                    <div>
                      <div id="content">
                        <grid-layout :layout.sync="design.meta.layout"
                                     :col-num=parseInt(design.meta.column)
                                     :row-height=parseInt(design.meta.height)
                                     :is-draggable=true
                                     :is-resizable=true
                                     :responsive=false
                                     :vertical-compact=false
                                     :prevent-collision=true
                                     :use-css-transforms=false
                                     ref="gridlayout"
                                     style="min-height: 400px">
                          <grid-item v-for="item in design.meta.layout" :key="item.i"
                                     :static="item.static"
                                     :x="item.x"
                                     :y="item.y"
                                     :w="item.w"
                                     :h="item.h"
                                     :i="item.i">
                            <span class="text">
                              {{ item && item.value && item.value.label ? item.value.label : '' }}
                              <br>
                              {{ item && item.value && item.value.type ? item.value.type : '' }}
                              <div v-if="item.value && item.value.type === 'display_text'">
                                {{ item.value.meta.value }}
                              </div>
                            </span>
                            <v-icon class="remove" @click="removeField(item.i)">
                              mdi-trash-can-outline
                            </v-icon>
                            <v-icon class="options" @click="openFieldSettingsDialog(item)">
                              mdi-wrench
                            </v-icon>
                          </grid-item>
                        </grid-layout>
                      </div>
                    </div>
                  </v-card>
                </div>
              </div>
              <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
            </form>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import { GridLayout, GridItem } from 'vue-grid-layout';
import FieldSettings from '../forms/dialogs/field-settings';
import Inputs from '../inputs/inputs';

const mouseXY = { x: null, y: null };
const DragPos = { x: null, y: null, w: 1, h: 1, i: null };

export default {
  components: {
    GridLayout,
    GridItem,
    FieldSettings,
    Inputs,
  },
  props: {
    design: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'form',
        object: null,
        meta: {
          layout: [],
          column: 12,
          height: 60,
          showLabel: false,
          inputs: [],
          hiddenFields: [],
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
      fieldSettingsDialog: false,
      baseObjectDialog: true,
      baseObject: null,
      objects: [],
      designs: [],
      clickedField: {},
      selectedField: {},
      objectArrayFormsList: [],
      objectArrayFormValue: '',
      inputObjectFields: [],
      fieldFilter: '',
      customFields: [
        {
          description: '',
          label: 'Display Text',
          type: 'display_text',
          name: 'display_text',
          meta: {
            value: '',
          },
        }],
    };
  },
  computed: {
    autocompleteObjects() {
      return _.map(this.objects, object => ({
        text: object.label,
        value: object.name,
      }));
    },
    autocompleteFields() {
      if (!this.baseObject) return [];
      const object = _.findWhere(this.objects, { name: this.design.object });
      if (object && object.fields) {
        return _.map(object.fields, field => ({
          text: field.label,
          value: field.name,
        }));
      }
      return [];
    },
    availableFields() {
      if (!this.baseObject) return [];
      const object = _.findWhere(this.objects, { name: this.baseObject.value });
      if (!(object && object.fields)) return [];
      const layoutFields = _.map(this.design.meta.layout, item => item.value);
      const hiddenFields = _.map(this.design.meta.hiddenFields, field => field.name);
      if (layoutFields.length === 0 && hiddenFields.length === 0) return object.fields;
      const layoutFieldNames = _.pluck(layoutFields, 'name');
      let items = _.filter(object.fields, field => layoutFieldNames.indexOf(field.name) === -1);
      items = _.filter(items, field => hiddenFields.indexOf(field.name) === -1);
      if (this.fieldFilter !== '') {
        return _.filter(items, item => item.name.includes(this.fieldFilter));
      }
      return items;
    },
    availableFieldNames() {
      return _.map(this.availableFields, field => field.name);
    },
  },
  methods: {
    changeObjectArrayForm(item) {
      this.selectedField.value.meta = {
        objectArrayForm: item,
        object: this.selectedField.value.name,
      };
    },
    drag() {
      const parentRect = document.getElementById('content').getBoundingClientRect();
      let mouseInGrid = false;
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) &&
        ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        (this.design.meta.layout.findIndex(item => item.i === 'drop')) === -1) {
        this.design.meta.layout.push({
          x: (this.design.meta.layout.length * 2) % (this.colNum || 12),
          y: this.design.meta.layout.length + (this.colNum || 12), // puts it at the bottom
          w: 1,
          h: 1,
          i: 'drop',
        });
      }
      const index = this.design.meta.layout.findIndex(item => item.i === 'drop');
      if (index !== -1) {
        const el = this.$refs.gridlayout.$children[index];
        el.dragging = { top: mouseXY.y - parentRect.top, left: mouseXY.x - parentRect.left };
        // eslint-disable-next-line camelcase
        const new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left);
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 1, 1);
          DragPos.i = String(index);
          DragPos.x = this.design.meta.layout[index].x;
          DragPos.y = this.design.meta.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 1, 1);
          this.design.meta.layout = this.design.meta.layout.filter(obj => obj.i !== 'drop');
        }
      }
    },
    dragend() {
      const parentRect = document.getElementById('content').getBoundingClientRect();
      let mouseInGrid = false;
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) &&
        ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true;
      }
      // if the field already exists in the object, do not add it

      if (mouseInGrid === true) {
        this.$refs.gridlayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 1, 1);
        this.design.meta.layout = this.design.meta.layout.filter(obj => obj.i !== 'drop');
        const field = { ...this.clickedField };
        if (field.type === 'display_text') {
          const displayTextFields = [];
          _.each(this.design.meta.layout, (item) => {
            if (item.value && item.value.type === 'display_text') {
              displayTextFields.push(item);
            }
          });
          field.name = `${field.name}-${displayTextFields.length}`;
        }
        this.design.meta.layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: 1,
          h: 1,
          i: DragPos.i,
          value: field,
        });
      }
    },
    selectBaseObject() {
      this.design.object = this.baseObject.value;
      this.baseObjectDialog = false;
    },
    openFieldSettingsDialog(item) {
      const field = item;
      // backwards compatibility
      if (!field.value.meta) field.value.meta = {};
      if (!field.value.meta.object) field.value.meta.object = '';
      if (!field.value.meta.value) field.value.meta.value = '';
      if (!field.value.meta.size) field.value.meta.size = 12;
      if (!field.value.meta.inlistForm) field.value.meta.inlistForm = '';
      if (!field.value.meta.required) field.value.meta.required = false;
      if (!field.value.meta.textareaRows) field.value.meta.textareaRows = 5;
      if (!field.value.meta.objectArrayForm) field.value.meta.objectArrayForm = '';
      if (!field.value.meta.default) {
        field.value.meta.default = {
          type: '',
          literal: '',
          input: {
            name: '',
            field: '',
          },
          system: '',
        };
      }
      this.selectedField = field;
      this.fieldSettingsDialog = true;
    },
    removeField(val) {
      const index = this.design.meta.layout.map(item => item.i).indexOf(val);
      this.design.meta.layout.splice(index, 1);
    },
    saveFieldSettings() {
      this.design.meta.layout[this.selectedField.i] = this.selectedField;
      this.closeFieldSettingsDialog();
    },
    closeFieldSettingsDialog() {
      this.fieldSettingsDialog = false;
      this.selectedField = {};
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
      this.$router.push('/forms/list');
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
  mounted() {
    document.addEventListener('dragover', (e) => {
      mouseXY.x = e.clientX;
      mouseXY.y = e.clientY;
    }, false);
  },
  async created() {
    this.designs = await this.$store.dispatch('getAllDesigns');
    this.objects = await this.$store.dispatch('getAllObjects');
    if (this.context === 'update') {
      this.baseObject = _.findWhere(this.autocompleteObjects, { value: this.design.object });
      this.baseObjectDialog = false;
    }
  },
};
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  width: 100%;
}

td, th {
  border: 1px dashed #ccc;
  text-align: left;
  padding: 8px;
}

.remove {
  position: absolute;
  right: 2px;
  top: 4px;
  cursor: pointer;
}

.options {
  position: absolute;
  right: 24px;
  top: 4px;
  cursor: pointer;
}

.checkStatus {
  position: absolute;
  left: 2px;
  bottom: 0;
  cursor: pointer;
}

.droppable-element {
  width: 150px;
  text-align: center;
  background: #eeeeee;
  border: 1px solid black;
  margin: 10px 0;
  padding: 10px;
}

.vue-grid-layout {
  /*background: #eee;*/
  background: #FFFFFF;
  grid-template-columns: auto auto;
  padding: 10px;
  border-radius: 10px;

}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #FAFAFA;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid black;
  /*background: #ffefc1; //egg white */

}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.vue-grid-item .static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 12px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 2px;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}
</style>
