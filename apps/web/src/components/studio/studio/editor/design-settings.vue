<template>
  <div>
    <v-dialog v-model="showDialog">
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" md="11" v-if="type != 'video' && type != 'rich_textarea'">
              <v-autocomplete
                :items="autocompleteDesigns"
                v-model="data.design"
                :label="`Select a ${type}`"/>
            </v-col>
            <v-col v-if="type != 'rich_textarea'">
              <v-text-field v-model="data.design"/>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn small color="red" dark>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="data.design" >
            <v-col v-if="type === 'form'"  cols="12" md="12">
              <read-form :design-name="data.design" :name="`create-form-${data.design}`" />
            </v-col>
            <v-col v-if="type === 'list'" cols="12" md="12">
              <preview-list :design-name="data.design"
                         :name="`list-read-${data.design}`"/>
            </v-col>
            <v-col v-if="type === 'chart'" cols="12" md="12">
              <chart-read :name="data.design" :ht="height" :label="designs[0].label"
                          :obj="designs[0].object" />
            </v-col>
            <v-col v-if="type === 'video'" cols="12" md="12">
              <youtube :video-id="data.design"/>
            </v-col>
          </v-row>
          <v-row v-if="type==='rich_textarea'">
            <v-col v-if="type === 'rich_textarea'" cols="12" md="12">
              <vue-editor v-model="data.design" ></vue-editor>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn color="red" dark @click="selectDesign">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'underscore';
import VueYouTubeEmbed from 'vue-youtube-embed';
import { VueEditor } from 'vue2-editor';
import ReadForm from '../../../forms/read';
import PreviewList from '../../../lists/preview';
import ChartRead from '../../../charts/read';


export default {
  components: { ReadForm, PreviewList, ChartRead, VueYouTubeEmbed, VueEditor },
  props: ['showDialog', 'type'],
  data: () => ({
    designs: [],
    data: {
      design: '',
    },
    url: '',
  }),
  computed: {
    autocompleteDesigns() {
      if (this.designs.length === 0) return [];
      return _.map(this.designs, design => ({
        text: design.label,
        value: design.name,
      }));
    },
  },
  methods: {
    selectDesign() {
      this.$emit('submitSettings', this.data);
      this.showDialog = false;
    },
  },
  async created() {
    if (this.type !== 'rich_textarea') {
      this.designs = await this.$store.dispatch('getDesignsByType', {
        type: this.type,
      });
    }
  },
};
</script>
