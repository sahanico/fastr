<template>
  <div :style="{ height: (this.$parent['rowHeight'] * this.$parent['h']) + 'px', padding: '16px' }">
    <form ref="configExecution" @submit.prevent="onSubmit"
          style="padding: 16px">
      <div>
        <div id="content">
          <grid-layout
            :layout.sync="layout" :col-num=parseInt(column)
            :row-height=parseInt(height)
            :is-draggable="false" :is-resizable="false" :responsive="false"
            :vertical-compact="true" :prevent-collision="true" :use-css-transforms="true"
            ref="gridlayout">
            <grid-item v-for="(item,index) in layout" :key="index"
                       :static="item.static"
                       :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
              <fields :name="`inlist-form-${$attrs.name}-${item.value.name}`"
                      @updateHeight="updateHeight(index)"
                      :root-form-field-index="rootFormFieldIndex"
                      v-model="form[item.value.name]" :form.sync="form" :item="item"
                      context="create" />
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import VueSignaturePad from 'vue-signature-pad';
import { _ } from 'vue-underscore';

export default {
  components: {
    GridLayout,
    GridItem,
    VueSignaturePad,
    Fields: () => import('../fields/fields'),
  },
  props: ['form', 'idx', 'formName', 'rootFormFieldIndex'],
  data() {
    return {
      layout: [],
      column: 0,
      height: 0,
      design: {},
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      createdDialog: false,
    };
  },
  computed: {
    inListFormHeight() {
      let total = 0;
      const maxHeight = [];
      _.each(this.layout, (item) => {
        maxHeight[item.y] = item.h;
      });
      total = maxHeight.reduce((a, b) => a + b, 0);
      this.$emit('updateInListHeight', (total + 1) * (this.height + 1), this.rootFormFieldIndex);
      return (total) * this.height;
    },
  },
  methods: {
    updateHeight(value, index) {
      this.layout[index].h = value;
    },
    async onSubmit() {
      const defaultValues = {};
      // populate defaultValues map
      _.each(this.object.fields, (field) => {
        if (field.meta && field.meta.defaultValue) {
          defaultValues[field.name] = field.meta.defaultValue;
        }
      });
      _.each(this.design.meta.hiddenFields, (field) => {
        if (field.name) {
          this.form[field.name] = '';
        }
        if (defaultValues[field.name]) {
          this.form[field.name] = defaultValues[field.name];
        }
      });
      const record = {
        object: this.design.object,
        data: this.form,
      };
      const createRecord = await this.$store.dispatch('createRecord', record);

      if (this.form.attachment) {
        if (createRecord) {
          const fd = new FormData();
          const paths = [];
          Array.prototype.forEach.call(this.form.attachment, (file) => {
            fd.append(file.name, file, file.name);
            paths.push(`/${file.name}`);
          });
          const fileData = {
            recordId: createRecord.id,
            path: paths,
          };
          fd.append('record', fileData.recordId);
          await this.$store.dispatch('uploadAttachment', fd);
        }
      }
      this.createdDialog = true;
      this.form = {};
    },
    getData(data) {
      this.form = data;
    },

  },
  async created() {
    this.design = await this.$store.dispatch('getDesignByName', {
      name: this.formName,
    });
    this.layout = this.design.meta.layout;
    this.column = this.design.meta.column;
    this.height = this.design.meta.height;
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
</style>

