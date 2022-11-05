<template>
  <form ref="sendFileForm" lazy-validation @submit.prevent="onSubmit">
    <div>
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
      <v-dialog v-model="createdDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          List Saved
        </v-card-title>
        <v-card-text>
          List has been saved!
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
            List create failed
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
            List Updated
          </v-card-title>
          <v-card-text>
            List has been Updated!
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
      <v-dialog v-model="setFieldOptionsDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title>Field Options
          </v-card-title>
          <div>
            <v-radio-group v-model="setContext" row style="margin-left:20px ">
              <v-radio label="Read" value="read"></v-radio>
              <v-radio label="Update" value="update"></v-radio>
            </v-radio-group>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button" @click="fieldSettings"
            >Save
            </v-btn>
            <v-btn color="black" text type="button" @click="closeFieldSettings"
            >Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div>
        <table>
          <tr>
            <td style="width: 15%">
              <v-row class="text-lg-center mx-1">
                <div style="width: 100%">
                  <v-card-title>Available Fields</v-card-title>
                </div>
                <div v-for="(item, index) in availableFields" :key="index">
                  <v-chip id="field-item" @drag="drag" @dragend="dragend" class="droppable-element"
                          :draggable="true" @mousedown="clickedAvailableField = item"
                          elevation="3" :data="item">
                    {{ item.label }}
                  </v-chip>
                </div>
              </v-row>
            </td>
            <td>
              <div>
              </div>
              <div style="margin: 20px">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="design.object" label="Object" disabled>
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="design.label" label="Label" required></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="design.name" label="Name" required></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-select v-model="design.meta.filter" :items="autocompleteFilters"
                              clearable label="Choose User Filter"></v-select>
                  </v-col>
                  <v-col>
                    <v-select v-model="design.meta.adminFilter" :items="autocompleteFilters"
                              clearable label="Choose Admin Filter"></v-select>
                  </v-col>
                  <v-col>
                    <v-select v-model="design.meta.bindTo" :items="autocompleteDashboards" clearable
                              label="Bind to Dashboard"></v-select>
                  </v-col>
                  <v-col>
                    <v-autocomplete v-model="design.meta.routeBy" :items="autocompleteFields"
                                    clearable label="Route By" />
                  </v-col>
                  <v-col>
                    <v-select v-model="design.meta.create" :items="autocompleteDashboards" clearable
                              label="Create Dashboard"></v-select>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col>
                    <v-checkbox v-model="design.meta.searchable" label="Global Search" />
                  </v-col>
                  <v-col>
                    <v-checkbox v-model="design.meta.import" label="Show Import Button" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-select v-model="design.meta.sort.mode" :items="['ascending', 'descending']"
                               clearable label="Sort Mode" />
                  </v-col>
                  <v-col>
                    <v-autocomplete v-model="design.meta.sort.field" :items="autocompleteFields"
                               clearable label="Default Sort Field" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                  <div class="headline text-xs-center red--text pb- pt-5">
                    Actions
                  </div>
                    <div>
                      <v-row v-for="(item, index) in design.meta.actions" :key="index">
                        <v-col>
                          <v-text-field v-model="item.label" label="Label"/>
                        </v-col>
                        <v-col>
                          <v-select v-model="item.icon" label="Icon" :items="icons"/>
                        </v-col>
                        <v-col>
                          <v-select v-model="item.type" label="Type" :items="actionTypes"/>
                        </v-col>
                        <v-col v-if="item.type === 'process'">
                          <v-autocomplete v-model="item.process" :items="autocompleteProcess"
                                    label="Process"/>
                        </v-col>
                        <v-col v-if="item.type === 'create-form-dialog'">
                          <design-field v-model="item.createFormDialog"
                                    type-filter="form" label="Forms" />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-btn style="position: absolute; right: 16px" icon
                                 @click="design.meta.actions.push({})">
                            <v-icon class="red--text"> mdi-plus</v-icon>
                          </v-btn>
                          <v-btn style="position: absolute; right: 54px" icon
                                 @click="design.meta.actions.pop()">
                            <v-icon class="red--text"> mdi-minus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>

                  </v-col>
                </v-row>
              </div>
              <div>
                <v-layout>
                  <v-flex offset-sm5 offset-xs2 sm2 xs8 class="pa-1">
                    <v-card max-height="60px">
                      <v-row class="text-lg-center mx-1; justify-center">
                        <v-col>
                          <v-text-field dense v-model="design.meta.column" label="column" outlined
                                        color="red darken-2"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field dense v-model="design.meta.height" label="height" outlined
                                        color="red darken-2"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-flex>
                </v-layout>
              </div>
              <div>
                <div style="position: relative; padding: 40px">
                  <div>
                    <v-icon class="increaseColSize" @click="increaseColSize()">
                      mdi-plus-circle-outline
                    </v-icon>
                    <v-icon class="decreaseColSize" @click="decreaseColSize()">
                      mdi-minus-circle-outline
                    </v-icon>
                  </div>
                  <v-card :elevation="1">
                    <div>
                      <div id="content">
                        <grid-layout :layout.sync="design.meta.layout"
                                     :col-num=parseInt(design.meta.column)
                                     :row-height=parseInt(design.meta.height)
                                     :is-draggable="false"
                                     :is-resizable="false"
                                     :responsive="false"
                                     :vertical-compact="true"
                                     :prevent-collision="true"
                                     :use-css-transforms="false"
                                     :max-rows="1"
                                     ref="gridlayout"
                                     style="min-height: 196px"
                        >
                          <grid-item v-for="item in design.meta.layout" :key="item.i"
                                     :static="item.static"
                                     :x="item.x"
                                     :y="item.y"
                                     :w="item.w"
                                     :h="item.h"
                                     :i="item.i"
                          >
                            <span class="text">
                              {{ item && item.value && item.value.label ? item.value.label : '' }}
                              <br>
                              {{ item && item.value && item.value.type ? item.value.type : '' }}
                            </span>
                            <v-icon class="remove" @click="removeField(item.i)">
                              mdi-trash-can-outline
                            </v-icon>
                            <v-icon class="options" @click="openFieldOptionsDialog(item)">mdi-wrench
                            </v-icon>
                          </grid-item>
                        </grid-layout>
                      </div>
                    </div>
                  </v-card>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div style="margin: 8px 0px 54px 12px">
          <v-btn color="red darken-2" dark type="submit">Save</v-btn>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import _ from 'underscore';
import { GridLayout, GridItem } from 'vue-grid-layout';
import conditions from '../conditions/conditions';
import DesignField from '../fields/design-field';


const mouseXY = { x: null, y: null };
const DragPos = { x: null, y: null, w: 1, h: 1, i: null };

export default {
  components: {
    GridLayout,
    GridItem,
    conditions,
    DesignField,
  },
  props: {
    design: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'list',
        object: null,
        meta: {
          layout: [],
          column: 1,
          height: 196,
          bindTo: '',
          actions: [],
          routeBy: '',
          filter: '', // for user
          adminFilter: '',
          create: '',
          searchable: false,
          import: false,
          sort: {
            mode: '',
            field: '',
          },
        },
      }),
    },
    context: String,
  },
  data() {
    return {
      clickedAvailableField: {},
      createdDialog: false,
      updatedDialog: false,
      designs: [],
      icons: ['download', 'approve', 'pay'],
      layout: [],
      index: 0,
      column: 1,
      height: 196,
      objects: [],
      processes: [],
      autocompleteObject: [],
      selectedObject: {},
      autocompleteProcess: [],
      chooseObjectDialog: true,
      clickedItem: {},
      actionTypes: ['process', 'create-form-dialog'],
      createDialog: false,
      executionDialog: false,
      designExistsDialog: false,
      listName: '',
      listLabel: '',
      listType: '',
      selectedBind: '',
      dashboards: [],
      attachment: {
        name: 'attachment',
        label: 'Attachment',
        type: 'attachment',
        description: 'attachment',
      },
      selectedRouteField: '',
      setFieldOptionsDialog: false,
      setContext: '',
      selectedFilters: [],
      baseObjectDialog: true,
      baseObject: null,
    };
  },
  mounted() {
    document.addEventListener('dragover', (e) => {
      mouseXY.x = e.clientX;
      mouseXY.y = e.clientY;
    }, false);
  },
  beforeDestroy() {
  },
  computed: {
    autocompleteObjects() {
      return _.map(this.objects, object => ({
        text: object.label,
        value: object.name,
      }));
    },
    autocompleteFilters() {
      const filters = _.where(this.designs, { type: 'filter', object: this.design.object });
      return _.map(filters, filter => ({
        text: filter.label,
        value: filter.name,
      }));
    },
    fields() {
      if (this.selectedObject.value) {
        return this.objects[this.selectedObject.value].fields;
      }
      return '';
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
      if (layoutFields.length === 0) return object.fields;
      const layoutFieldNames = _.pluck(layoutFields, 'name');
      return _.filter(object.fields, field => layoutFieldNames.indexOf(field.name) === -1);
    },
    object() {
      if (this.selectedObject.value) {
        return this.objects[this.selectedObject.value].name;
      }
      return '';
    },
    dashboardLabels() {
      const labels = [];
      _.each(this.dashboards, (dashboard) => {
        labels.push(dashboard.label);
      });
      return labels;
    },
    autocompleteDashboards() {
      return _.map(this.dashboards, dashboard => ({
        text: dashboard.label,
        value: dashboard.name,
      }));
    },
    getSelectedDashName() {
      let name = '';
      _.each(this.dashboards, (dashboard) => {
        if (this.selectedBind === dashboard.label) {
          name = dashboard.name;
        }
      });
      return name;
    },
    attachmentStatus() {
      if (this.selectedObject.value) {
        return this.objects[this.selectedObject.value].attachment;
      }
      return '';
    },
    attachmentExists() {
      const layoutFields = _.map(this.layout, item => item.value);
      return _.contains(layoutFields, this.attachment);
    },

  },
  methods: {
    selectBaseObject() {
      this.design.object = this.baseObject.value;
      this.baseObjectDialog = false;
    },
    setDialog(bool) {
      this.executionDialog = bool;
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
    itemTitle(item) {
      let result = item.i;
      if (item.static) {
        result += ' - static';
      }
      return result;
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
        this.design.meta.layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: 1,
          h: 1,
          i: DragPos.i,
          value: this.clickedAvailableField,
        });
      }
    },
    removeField(val) {
      const index = this.design.meta.layout.map(item => item.i).indexOf(val);
      this.design.meta.layout.splice(index, 1);
    },
    increaseColSize() {
      if (this.design.meta.column < 12) {
        this.design.meta.column += 1;
      }
    },
    decreaseColSize() {
      if (this.design.meta.column > 1) {
        this.design.meta.column -= 1;
        // todo: checks field position based on LIFO
        /**
         * this.removeField() gets rid of the last inserted field. however, if the field is not
         * at the end of the line, all other remaining fields breaks positions and stack on top
         * of each other.
         * * */
        // this.removeField(); /
      }
    },
    routeToList() {
      this.$router.push('/lists/list');
    },
    openFieldOptionsDialog(item) {
      this.setFieldOptionsDialog = true;
      this.tempLayoutItem = item;
      if (item.value.context !== '') {
        this.setContext = item.value.context;
      }
    },
    fieldSettings() {
      this.layout[this.tempLayoutItem.i].value.context = this.setContext;
      this.closeFieldSettings();
    },
    closeFieldSettings() {
      this.setFieldOptionsDialog = false;
      this.tempLayoutItem = {};
      this.setContext = '';
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
    this.designs = await this.$store.dispatch('getAllDesigns');
    if (this.context === 'update') {
      this.baseObject = _.findWhere(this.autocompleteObjects, { value: this.design.object });
      this.baseObjectDialog = false;
    }
    this.dashboards = await this.$store.dispatch('getDesignsByType', {
      type: 'dashboard',
    });
    this.processes = await this.$store.dispatch('getDesignsByType', {
      type: 'process',
    });
    if (this.processes) {
      this.processes = _.map(this.processes, (process) => {
        this.autocompleteProcess.push({ text: `${process.label}`, value: process.name });
        return {
          name: process.name,
          label: process.label,
        };
      });
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
  top: 0;
  cursor: pointer;
}

.increaseColSize {
  position: absolute;
  right: 15px;
  top: 40px;
  cursor: pointer;
}

.decreaseColSize {
  position: absolute;
  right: 15px;
  top: 80px;
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

.options {
  position: absolute;
  right: 24px;
  top: 4px;
  cursor: pointer;
}
</style>
