<template>
  <form ref="sendFileForm" lazy-validation @submit.prevent="onSubmit">
    <div>
      <v-dialog v-model="createdDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          Tabs Saved
        </v-card-title>
        <v-card-text>
          Tabs has been saved!
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
            Tabs create failed
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
            Tabs Updated
          </v-card-title>
          <v-card-text>
            Tabs has been Updated!
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
        <table>
          <tr>
            <td style="width: 15%">
              <v-row class="text-lg-center mx-1">
                <div style="width: 100%">
                  <v-card-title>Available Fields</v-card-title>
                </div>
                <div v-for="(item, index) in availableDashboards" :key="index">
                  <v-chip id="field-item" @drag="drag" @dragend="dragend" class="droppable-element"
                          :draggable="true" @mousedown="clickedAvailable = item"
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
                    <v-text-field v-model="design.label" label="Label" required></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="design.name" label="Name" required></v-text-field>
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
                            <v-icon class="remove" @click="removeDesign(item.i)">
                              mdi-trash-can-outline
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
      </div>
    </div>
    <v-btn style="margin-left: 12px" color="red darken-2" dark type="submit">Save</v-btn>
  </form>
</template>

<script>
import _ from 'underscore';
import { GridLayout, GridItem } from 'vue-grid-layout';


const mouseXY = { x: null, y: null };
const DragPos = { x: null, y: null, w: 1, h: 1, i: null };

export default {
  components: {
    GridLayout,
    GridItem,
  },
  props: {
    design: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        type: 'tab',
        object: null,
        meta: {
          layout: [],
          column: 1,
          height: 196,
        },
      }),
    },
    context: String,
  },
  data() {
    return {
      clickedAvailable: {},
      createdDialog: false,
      updatedDialog: false,
      index: 0,
      createDialog: false,
      executionDialog: false,
      designExistsDialog: false,
      dashboards: [],
    };
  },
  mounted() {
    document.addEventListener('dragover', (e) => {
      mouseXY.x = e.clientX;
      mouseXY.y = e.clientY;
    }, false);
  },
  computed: {
    availableDashboards() {
      const layoutDesigns = _.map(this.design.meta.layout, item => item.value);
      return _.filter(this.dashboards, item => layoutDesigns.indexOf(item) === -1);
    },
    autocompleteDashboards() {
      return _.map(this.dashboards, dashboard => ({
        text: dashboard.label,
        value: dashboard.name,
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
          value: this.clickedAvailable,
        });
      }
    },
    removeDesign(val) {
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
      this.$router.push('/tabs/list');
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
    this.dashboards = await this.$store.dispatch('getDesignsByType', {
      type: 'dashboard',
    });
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
