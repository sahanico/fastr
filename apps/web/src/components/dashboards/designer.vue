<template>
  <div id="dashboards">
    <v-dialog v-model="createdDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark primary-title>
          Dashboard Saved
        </v-card-title>
        <v-card-text>
          Dashboard has been saved!
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
          Dashboard create failed
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
    <v-dialog v-model="contextDialog" width="400">
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>Set the context of the design
        </v-card-title>
        <v-radio-group v-model="design.meta.context" row style="margin-left:20px ">
          <v-radio label="Read" value="read"></v-radio>
          <v-radio label="Update" value="update"></v-radio>
        </v-radio-group>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button" @click="contextDialog"
          >Save
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card>
        <v-card-title class="headline red white--text" dark
                      primary-title>
          Set the context of the design
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
          Dashboard Updated
        </v-card-title>
        <v-card-text>
          Dashboard has been Updated!
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
        {{ context === 'create' ? 'Create ' : 'Update ' }}Dashboards
      </div>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <div class="subtext red--text pb-2 pt-2" style="text-align: center">
              Available Designs
            </div>
            <v-row class="text-lg-center mx-1">
              <div>
                <div style="width: 100%">
                  <v-card-title> Forms</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='form'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title> Lists</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='list'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title> Requests</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='request'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title> Charts</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='chart'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title>Points</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='point'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title>Tabs</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='tab'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title>Buttons</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='button'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title>Workflows</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='workflow'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
              <div>
                <div style="width: 100%">
                  <v-card-title>Calendars</v-card-title>
                </div>
                <v-chip-group column multiple>
                  <div v-for="(item, index) in availableDesigns" :key="index">
                    <div v-if="item.type==='calendar'">
                      <v-chip @drag="drag" @dragend="dragend"
                              class="droppable-element"
                              :draggable="true" @mousedown="clickedAvailable = item"
                              elevation="3" :data="item">
                        {{ item.label }}
                      </v-chip>
                    </div>
                  </div>
                </v-chip-group>
              </div>
            </v-row>
          </v-col>
          <v-col cols="12" md="8">
            <form @submit.prevent="onSubmit">
              <v-card elevation="1" class="pa-5 ma-5">
                <v-row>
                  <v-col>
                    <v-text-field v-model="design.label" label="Label" required/>
                  </v-col>
                  <v-col>
                    <v-text-field :disabled="context === 'update'" v-model="design.name"
                                  label="Name" required/>
                  </v-col>
                </v-row>
              </v-card>
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
                                     :is-draggable="true"
                                     :is-resizable="true"
                                     :responsive="false"
                                     :vertical-compact="false"
                                     :prevent-collision="true"
                                     :use-css-transforms="false"
                                     ref="gridlayout"
                                     style="min-height: 400px"
                        >
                          <grid-item v-for="item in design.meta.layout" :key="item.i"
                                     :static="item.static"
                                     :x="item.x"
                                     :y="item.y"
                                     :w="item.w"
                                     :h="item.h"
                                     :i="item.i"
                          >
                            <span class="text">{{
                                item.value ? item.value.label : ''
                              }}<br>{{ item.value ? item.value.type : '' }}</span>
                            <v-icon class="remove" @click="removeDesign(item.i)">
                              mdi-trash-can-outline</v-icon>
                            <v-icon v-if="item.value && item.value.type === 'form'" class="options"
                                    @click="openContextDialog(item)">mdi-wrench
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
        type: 'dashboard',
        object: null,
        meta: {
          layout: [],
          column: 12,
          height: 60,
          context: '',
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
      contextDialog: false,
      designs: [],
      clickedAvailable: {},
      selectedDesign: {},
    };
  },
  computed: {
    autocompleteDesigns() {
      return _.map(this.designs, design => ({
        text: design.label,
        value: design.name,
      }));
    },
    availableDesigns() {
      const layoutDesigns = _.map(this.design.meta.layout, item => item.value);
      return _.filter(this.designs, item => layoutDesigns.indexOf(item) === -1);
    },
  },
  methods: {
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
    openContextDialog(item) {
      const design = item;
      this.contextDialog = true;
      this.selectedDesign = design;
    },
    removeDesign(val) {
      const index = this.design.meta.layout.map(item => item.i).indexOf(val);
      this.design.meta.layout.splice(index, 1);
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
      this.$router.push('/dashboards/list');
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
