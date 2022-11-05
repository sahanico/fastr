<template>
  <form ref="sendFileForm" lazy-validation @submit.prevent="onSubmit">
    <div>
      <v-dialog v-model="designExistsDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Design create failed
          </v-card-title>
          <v-card-text> A design with this name already exists.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button"
                   @click="designExistsDialog = false">Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Design Saved
          </v-card-title>
          <v-card-text> List design has been saved!
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button"
                   @click="routeToList">Close
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
                  <v-card-title>Available Objects</v-card-title>
                </div>
                <div v-for="(item, index) in availableDashboards" :key="index">
                  <v-chip id="field-item" @drag="drag" @dragend="dragend" class="droppable-element"
                          :draggable="true" @mousedown="clickItem(item)"
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
                    <v-text-field v-model="tabLabel" label="Label" required></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="tabName" label="Name" required></v-text-field>
                  </v-col>
                </v-row>
              </div>
              <div>
                <v-layout>
                  <v-flex offset-sm5 offset-xs2 sm2 xs8 class="pa-1">
                    <v-card max-height="60px">
                      <v-row class="text-lg-center mx-1; justify-center">
                        <v-col>
                          <v-text-field dense v-model="column" label="column" outlined
                                        color="red darken-2"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field dense v-model="height" label="height" outlined
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
                        <grid-layout :layout.sync="layout"
                                     :col-num=parseInt(this.column)
                                     :row-height=parseInt(this.height)
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
                          <grid-item v-for="item in layout" :key="item.i"
                                     :static="item.static"
                                     :x="item.x"
                                     :y="item.y"
                                     :w="item.w"
                                     :h="item.h"
                                     :i="item.i"
                          >
                            <span class="text">{{ item.value.label }}<br>{{
                                item.value.type
                              }}</span>
                            <v-icon class="remove" @click="removeDashboard(item.i)">
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
        <div style="margin: 8px 0 54px 12px">
          <v-btn color="red darken-2" dark type="submit">Save</v-btn>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { _ } from 'vue-underscore';
import { GridItem, GridLayout } from 'vue-grid-layout';

const mouseXY = { x: null, y: null };
const DragPos = { x: null, y: null, w: 1, h: 1, i: null };

export default {
  components: {
    GridLayout,
    GridItem,
  },
  data() {
    return {
      designExistsDialog: false,
      createDialog: false,

      dashboards: [],
      clickedItem: {},
      tabName: '',
      tabLabel: '',
      layout: [],
      column: 1,
      height: 196,
      index: 0,
    };
  },
  computed: {
    availableDashboards() {
      const layoutDashboards = _.map(this.layout, item => item.value);
      return _.filter(this.dashboards, item => layoutDashboards.indexOf(item) === -1);
    },
  },
  methods: {
    async onSubmit() {
      const layout = {
        name: this.tabName,
        label: this.tabLabel,
        type: 'tab',
        meta: {
          column: this.column,
          height: this.height,
          layout: this.layout,
        },
      };
      const newDesign = await this.$store.dispatch('createDesign', layout);
      if (newDesign.data === 'design-exists') {
        this.designExistsDialog = true;
      } else {
        this.createDialog = true;
      }
    },
    routeToList() {
      this.$router.push('/tabs/list');
    },
    drag() {
      const parentRect = document.getElementById('content').getBoundingClientRect();
      let mouseInGrid = false;
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) &&
        ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true && (this.layout.findIndex(item => item.i === 'drop')) === -1) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 12),
          y: this.layout.length + (this.colNum || 12), // puts it at the bottom
          w: 1,
          h: 1,
          i: 'drop',
        });
      }
      const index = this.layout.findIndex(item => item.i === 'drop');
      if (index !== -1) {
        try {
          this.$refs.gridlayout.$children[this.layout.length].$refs.item.style.display = 'none';
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
        const el = this.$refs.gridlayout.$children[index];
        el.dragging = { top: mouseXY.y - parentRect.top, left: mouseXY.x - parentRect.left };
        // eslint-disable-next-line camelcase
        const new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left);
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 1, 1);
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 1, 1);
          this.layout = this.layout.filter(obj => obj.i !== 'drop');
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
      // if the field already exists in the object, do not  add it

      if (mouseInGrid === true) {
        this.$refs.gridlayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 1, 1);
        this.layout = this.layout.filter(obj => obj.i !== 'drop');
        // _.each(this.layout, (fields) => {
        //   if (fields.value.name) {
        //  if you want to add a grid-item
        this.layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: 1,
          h: 1,
          i: DragPos.i,
          value: this.clickedItem,
        });
        this.$refs.gridLayout.dragEvent('dragend', DragPos.i, DragPos.x, DragPos.y, 1, 1);
        try {
          this.$refs.gridLayout.$children[this.layout.length].$refs.item.style.display = 'block';
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
        //   }
        // });
      }
    },
    clickItem(item) {
      this.clickedItem = item;
    },
    increaseColSize() {
      if (this.column < 12) {
        this.column += 1;
      }
    },
    decreaseColSize() {
      if (this.column > 1) {
        this.column -= 1;
        // todo: checks field position based on LIFO
        /**
         * this.removeField() gets rid of the last inserted field. however, if the field is not
         * at the end of the line, all other remaining fields breaks positions and stack on top
         * of each other.
         * * */
        // this.removeField(); /
      }
    },
    removeDashboard(val) {
      const index = this.layout.map(item => item.i).indexOf(val);
      this.layout.splice(index, 1);
    },
  },
  async created() {
    this.dashboards = await this.$store.dispatch('getDesignsByType', {
      type: 'dashboard',
    });
  },
  mounted() {
    document.addEventListener('dragover', (e) => {
      mouseXY.x = e.clientX;
      mouseXY.y = e.clientY;
    }, false);
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
</style>
