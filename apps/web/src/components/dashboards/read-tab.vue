<template>
  <form ref="configExecution" lazy-validation @submit.prevent="onSubmit"
        style="padding-bottom: 36px">
    <div style="position: relative; padding: 10px">
      <div class="headline red--text pb-5 pt-5" style="text-align: center">
        {{ this.design ? this.design.label : '' }}
      </div>
      <div>
        <div id="content" v-if="design && design.meta">
          <grid-layout
            :layout.sync="design.meta.layout"
            :col-num="parseInt(design.meta.column)"
            :row-height="parseInt(design.meta.height)"
            :is-draggable="false"
            :is-resizable="false"
            :responsive="false"
            :vertical-compact="false"
            :prevent-collision="true"
            :use-css-transforms="false"
            ref="gridlayout"
            style="min-height: 700px">
            <grid-item v-for="(item,index) in design.meta.layout" :key="index"
                       :static="item.static"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.i">
              <div v-if="item.value.type==='form'">
                <div :style="{height: item.h}" v-if="!input">
                  <create-form :input="input" :form-name="item.value.name"
                               :name="`create-form-${item.value.name}`"/>
                </div>
                <div :style="{height: item.h}" v-if="input">
                  <form-update :input="input" :name="`form-update-${item.value.name}`"
                               context="update"
                               :design-name="item.value.name" :inputId="inputId"/>
                </div>
              </div>
              <div v-if="item.value.type==='list'">
                <list-read :input="input" :design-name="item.value.name"
                           :filter="item.value.meta.filter" :name="`list-read-${item.value.name}`"
                           :obj="item.value.object" :inputId="inputId"/>
              </div>
              <div v-if="item.value.type==='chart'">
                <chart-read :name="item.value.name" :ht="height" :label="item.value.label"
                            :obj="item.value.object" :input="input"/>
              </div>
              <div v-if="item.value.type==='point'">
                <point-read :name="item.value.name" :input="input"
                            :obj="item.value.object"/>
              </div>
              <div v-if="item.value.type==='tab'">
                <tab-read :input="input" :design-name="item.value.name"
                          :name="`tab-read-${item.value.name}`"
                          :obj="item.value.object" :inputId="inputId"/>
              </div>
              <div v-if="item.value.type==='button'">
                <button-read :name="item.value.name" :obj="item.value.object" :input="input"
                             :design="getDesign(item)"/>
              </div>
              <div v-if="item.value.type==='workflow'">
                <workflow-read :name="item.value.name" :obj="item.value.object" :input="input"
                               :design="getDesign(item)"/>
              </div>
              <div v-if="item.value.type==='request'">
                <request-read :name="item.value.name" :obj="item.value.object" :input="input"
                              :design="getDesign(item)"/>
              </div>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import VueSignaturePad from 'vue-signature-pad';
import createForm from '../forms/create';
import FormUpdate from '../forms/update';
import ListRead from '../lists/read';
import ChartRead from '../charts/read';
import PointRead from '../points/read';
import TabRead from '../tabs/read';
import ButtonRead from '../buttons/read';
import WorkflowRead from '../workflows/read';
import RequestRead from '../requests/read';

export default {
  components: {
    GridLayout,
    GridItem,
    VueSignaturePad,
    createForm,
    FormUpdate,
    ListRead,
    ChartRead,
    PointRead,
    TabRead,
    ButtonRead,
    WorkflowRead,
    RequestRead,
  },
  props: ['design', 'input', 'inputId'], // input is a record id
  data() {
    return {
      layout: [],
      column: 0,
      height: 0,
    };
  },
  computed: {
    getDesignName(item) {
      return item.value.name;
    },
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

table {
  font-family: arial, sans-serif;
  width: 100%;
}

td, th {
  /*border: 1px dashed #ccc;*/
  text-align: left;
  padding: 8px;
}

.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
}

.droppable-element {
  width: 150px;
  text-align: center;
  background: #eeeeee;
  /*border: 1px solid black;*/
  margin: 10px 0;
  padding: 10px;
}

.vue-grid-layout {
  /*background: #eee;*/
  /*background: #FFFFFF;*/
  /*grid-template-columns: auto auto;*/
  /*padding: 10px;*/
  /*border-radius: 10px;*/

}

.vue-grid-item:not(.vue-grid-placeholder) {
  /*background: #FAFAFA;*/
  /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);*/
  /*border: 1px solid black;*/
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

.form-create {
  height: 10%;
  width: 10%;
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

