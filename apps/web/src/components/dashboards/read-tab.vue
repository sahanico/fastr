<template>
  <form ref="configExecution" lazy-validation @submit.prevent="onSubmit"
        style="padding-bottom: 36px">
    <div>
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
                <div :style="{height: item.h}" v-if="!inputId">
                  <create-form :input="input" :form-name="item.value.name"
                               :name="`create-form-${item.value.name}`"/>
                </div>
                <div :style="{height: item.h}" v-if="inputId">
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
import ListRead from '../lists/read2';
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
