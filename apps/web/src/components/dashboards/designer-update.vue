<template>
  <form lazy-validation @submit.prevent="onSubmit">
    <div>
      <v-dialog v-model="updatedDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title> Dashboard Updated
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-text> Your dashboard design has been updated.</v-card-text>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button"
                 @click="updatedDialog = false">Ok
          </v-btn>
        </v-card>
      </v-dialog>
      <v-dialog v-model="setContextDialog" width="400">
        <v-card>
          <v-card-title class="headline red white--text" dark
                        primary-title>Set the context of the design
          </v-card-title>
          <v-radio-group v-model="setContext" row style="margin-left:20px ">
            <v-radio label="Read" value="read"></v-radio>
            <v-radio label="Update" value="update"></v-radio>
          </v-radio-group>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" text type="button" @click="context"
            >Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div></div>
      <div>
        <table>
          <tr>
            <td style="width: 15%">
              <v-row class="text-lg-center mx-1">
                <div>
                  <div style="width: 100%">
                    <v-card-title> Forms</v-card-title>
                  </div>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='form'">
                      <v-card @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              draggable="true" @mousedown="clickItem(item)"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-card>
                    </div>
                  </div>
                </div>
                <div>
                  <div style="width: 100%">
                    <v-card-title> Lists</v-card-title>
                  </div>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='list'">
                      <v-card @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              draggable="true" @mousedown="clickItem(item)"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-card>
                    </div>
                  </div>
                </div>
              </v-row>
            </td>
            <td>
              <div></div>
              <div style="margin: 20px">
                <v-row>
                  <v-col>
                    <v-text-field v-model="dashboard.label" label="Label" required></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="dashboard.name" label="Name" required disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
              <div>
                <v-layout>
                  <v-flex offset-sm5 offset-xs2 sm2 xs8 class="pa-1">
                    <v-card max-height="60px">
                      <v-row class="text-lg-center mx-1; justify-center">
                        <v-col>
                          <v-text-field dense v-model="dashboard.meta.column" label="column"
                                        outlined color="red darken-2"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field dense v-model="dashboard.meta.height" label="height"
                                        outlined color="red darken-2"></v-text-field>
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
                        <grid-layout
                          ref="gridlayout"
                          :layout.sync="dashboard.meta.layout"
                          :col-num=parseInt(this.dashboard.meta.column)
                          :row-height=parseInt(this.dashboard.meta.height)
                          :is-draggable="true"
                          :is-resizable="true"
                          :responsive="false"
                          :vertical-compact="false"
                          :prevent-collision="true"
                          :use-css-transforms="false"
                          style="min-height: 400px"
                        >
                          <grid-item v-for="item in dashboard.meta.layout" :key="item.i"
                                     :static="item.static"
                                     :x="item.x"
                                     :y="item.y"
                                     :w="item.w"
                                     :h="item.h"
                                     :i="item.i"
                          >
                            <span class="text">{{
                                item.value.label
                              }}<br>{{ item.value.type }}</span>
                            <v-icon class="remove" @click="removeDesign(item.i)">
                              mdi-trash-can-outline</v-icon>
                            <v-icon v-if="item.value.type === 'form'" class="options"
                                    @click="openContextDialog(item)">mdi-wrench
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
        <div style="margin-bottom: 54px">
          <v-btn color="red darken-2" dark @click="cancel">Cancel</v-btn>
          <v-btn color="red darken-2" dark type="submit">Update</v-btn>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { _ } from 'vue-underscore';
import { GridLayout, GridItem } from 'vue-grid-layout';


const mouseXY = { x: null, y: null };
const DragPos = { x: null, y: null, w: 1, h: 1, i: null };

export default {
  components: {
    GridLayout,
    GridItem,
    // createFormRecord,
  },
  props: ['name', 'path'],
  data() {
    return {
      initLayout: [],
      dashboard: {
        layout: [],
      },
      draggable: true,
      resizable: true,
      index: 0,
      column: 12,
      height: 60,
      allDesigns: [],
      clickedItem: {},
      updatedDialog: false,
      executionDialog: false,
      type: '',
      setContextDialog: false,
      setContext: '',
      tempLayoutItem: {},
      // listOfFieldsInObject: [],
      // listOFFIeldsinLayout:[],
    };
  },
  computed: {
    // fields() {
    //   if (this.selectedObject.value) {
    //     return this.allObjects[this.selectedObject.value].fields;
    //   }
    //   return '';
    // },
    // todo: fix availableDesigns
    availableDesigns() {
      const designs = this.allDesigns;
      const layoutDesigns = _.map(this.dashboard.layout, item => item.value);
      // if (layoutDesigns.name === designs.name) {
      //   const available = _.filter(designs, item => layoutDesigns.indexOf(item) === -1);
      //   return available;
      // }
      const available = _.filter(designs, item => layoutDesigns.indexOf(item) === -1);
      return available;
    },
    // allFormDesigns() {
    //   const formdesigns = _.map(this.allDesigns, item => item.type === 'form');
    //   const layoutDesigns = _.map(this.layout, item => item.value);
    //   return formdesigns;
    // },

  },
  methods: {
    setDialog(bool) {
      this.executionDialog = bool;
    },
    cancel() {
      if (this.path === 'dashboards-list') {
        this.$router.push('/dashboards/list');
      } else {
        this.$router.push('/objects/list');
      }
    },
    onSubmit() {
      const layout = {
        name: this.name,
        label: this.dashboard.label,
        meta: {
          layout: this.dashboard.meta.layout,
          column: this.dashboard.meta.column,
          height: this.dashboard.meta.height,
        },
      };
      this.$store.dispatch('updateDesign', layout);
      this.updatedDialog = true;
      // this.$nextTick(() => {
      //   this.$router.push('/objects/list');
      // });
      // this.$nextTick(() => {
      //   this.layout = [];
      // });
    },
    clickItem(item) {
      this.clickedItem = item;
    },
    itemTitle(item) {
      let result = item.i;
      if (item.static) {
        result += ' - static';
      }
      return result;
    },
    drag() {
      const parentRect = document.getElementById('content')
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) &&
        ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true && (this.dashboard.meta.layout.findIndex(item => item.i === 'drop'))
        ===
        -1) {
        this.dashboard.meta.layout.push({
          x: (this.dashboard.meta.layout.length * 2) % (this.colNum || 12),
          y: this.dashboard.meta.layout.length + (this.colNum || 12), // puts it at the bottom
          w: 1,
          h: 1,
          i: 'drop',
        });
      }
      const index = this.dashboard.meta.layout.findIndex(item => item.i === 'drop');
      if (index !== -1) {
        try {
          this.$refs.gridlayout.$children[this.dashboard.meta.layout.length].$refs.item.style.display = 'none';
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
          DragPos.x = this.dashboard.meta.layout[index].x;
          DragPos.y = this.dashboard.meta.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 1, 1);
          this.dashboard.meta.layout = this.dashboard.meta.layout.filter(obj => obj.i !== 'drop');
        }
      }
    },
    dragend() {
      const parentRect = document.getElementById('content')
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) &&
        ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        this.$refs.gridlayout.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 1, 1);
        this.dashboard.meta.layout = this.dashboard.meta.layout.filter(obj => obj.i !== 'drop');
        // _.each(this.layout, (fields) => {
        //   if (fields.value.name) {
        //  if you want to add a grid-item
        this.dashboard.meta.layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: 1,
          h: 1,
          i: DragPos.i,
          value: this.clickedItem,
        });
        this.$refs.gridLayout.dragEvent('dragend', DragPos.i, DragPos.x, DragPos.y, 1, 1);
        try {
          this.$refs.gridLayout.$children[this.layout.meta.length].$refs.item.style.display = 'block';
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
        //   }
        // });
      }
    },
    removeDesign(val) {
      const index = this.dashboard.meta.layout.map(item => item.i)
        .indexOf(val);
      this.dashboard.meta.layout.splice(index, 1);
    },
    openContextDialog(item) {
      this.setContextDialog = true;
      this.tempLayoutItem = item;
      this.setContext = this.tempLayoutItem.value.meta.context;
    },
    context() {
      this.setContextDialog = false;
      this.dashboard.meta.layout[this.tempLayoutItem.i].value.meta.context = this.setContext;
      this.$nextTick(() => {
        this.tempLayoutItem = {};
        this.setContext = '';
      });
    },
  },
  async created() {
    this.allDesigns = await this.$store.dispatch('getAllDesigns');
    this.dashboard = await this.$store.dispatch('getDesignByName', {
      name: this.name,
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
  top: 4px;
  cursor: pointer;
}

.options {
  position: absolute;
  right: 24px;
  top: 4px;
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
  padding: 0 8px 8px 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat bottom right;
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
