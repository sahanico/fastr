<template>
  <form ref="configExecution">
    <div style="position: relative; padding: 10px">
      <div class="headline red--text pt-2 mt-2 pb-2 mb-2">
        {{ design.meta.showLabel ? design.label : '' }}
      </div>
      <v-card :elevation="1">
        <div>
          <div id="content">
            <grid-layout
              :layout.sync="design.meta.layout"
              :col-num="parseInt(design.meta.column)" :row-height="parseInt(design.meta.height)"
              :is-draggable="false" :is-resizable="false"
              :responsive="false" :vertical-compact="false"
              :prevent-collision="true" :use-css-transforms="false"
              ref="gridlayout" style="min-height: 700px">
              <grid-item v-for="(item,index) in design.meta.layout" :key="index"
                         :static="item.static" :i="item.i"
                         :x="item.x" :y="item.y"
                         :w="item.w" :h="item.h">
                <fields v-model="input[item.value.name]" :form.sync="input"
                        :item="item" context="read"></fields>
              </grid-item>
            </grid-layout>
          </div>
        </div>
      </v-card>
    </div>
  </form>
</template>
<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import Fields from '../fields/fields';

export default {
  components: {
    GridLayout,
    GridItem,
    Fields,
  },
  props: ['design', 'input'],
  data() {
    return {
      form: {},
    };
  },
};
</script>
<style scoped>

.vue-signature {
  border: 1px solid black;
  border-radius: 10px;
}

#signature {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
  radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

/*table {*/
/*  font-family: arial, sans-serif;*/
/*  width: 100%;*/
/*}*/

/*td, th {*/
/*  border: 1px dashed #ccc;*/
/*  text-align: left;*/
/*  padding: 8px;*/
/*}*/

/*.remove {*/
/*  position: absolute;*/
/*  right: 2px;*/
/*  top: 0;*/
/*  cursor: pointer;*/
/*}*/

/*.droppable-element {*/
/*  width: 150px;*/
/*  text-align: center;*/
/*  background: #eeeeee;*/
/*  border: 1px solid black;*/
/*  margin: 10px 0;*/
/*  padding: 10px;*/
/*}*/

/*.vue-grid-layout {*/
/*  !*background: #eee;*!*/
/*  background: #FFFFFF;*/
/*  grid-template-columns: auto auto;*/
/*  padding: 10px;*/
/*  border-radius: 10px;*/

/*}*/

/*.vue-grid-item:not(.vue-grid-placeholder) {*/
/*  background: #FAFAFA;*/
/*  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);*/
/*  border: 1px solid black;*/
/*  !*background: #ffefc1; //egg white *!*/

/*}*/

/*.vue-grid-item .resizing {*/
/*  opacity: 0.9;*/
/*}*/

/*.vue-grid-item .static {*/
/*  background: #cce;*/
/*}*/

/*.vue-grid-item .text {*/
/*  font-size: 12px;*/
/*  position: absolute;*/
/*  top: 0;*/
/*  bottom: 0;*/
/*  left: 2px;*/
/*  right: 0;*/
/*  margin: auto;*/
/*  height: 100%;*/
/*  width: 100%;*/
/*}*/

/*.vue-grid-item .no-drag {*/
/*  height: 100%;*/
/*  width: 100%;*/
/*}*/

/*.vue-grid-item .minMax {*/
/*  font-size: 12px;*/
/*}*/

/*.vue-grid-item .add {*/
/*  cursor: pointer;*/
/*}*/

/*.vue-draggable-handle {*/
/*  position: absolute;*/
/*  width: 20px;*/
/*  height: 20px;*/
/*  top: 0;*/
/*  left: 0;*/
/*  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;*/
/*  background-position: bottom right;*/
/*  padding: 0 8px 8px 0;*/
/*  background-repeat: no-repeat;*/
/*  background-origin: content-box;*/
/*  box-sizing: border-box;*/
/*  cursor: pointer;*/
/*}*/

/*.columns {*/
/*  -moz-columns: 120px;*/
/*  -webkit-columns: 120px;*/
/*  columns: 120px;*/
/*}*/
</style>

