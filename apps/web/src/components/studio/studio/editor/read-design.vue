<template>
  <div>
  <div v-if="type === 'form'">
    <read-form :design-name="design" :name="`create-form-${design}`"/>
  </div>
  <div v-if="type === 'list'">
    <preview-list :design-name="design"
                  :name="`list-read-${design}`"/>
  </div>
    <div v-if="type === 'chart'">
    <chart-read :name="design"/>
  </div>
    <div v-if="type === 'video'">
      <youtube :video-id="design"/>
    </div>
    <div v-if="type === 'rich_textarea'" v-html="design">
    </div>
  </div>
</template>

<script>
import ReadForm from '../../../forms/read';
import PreviewList from '../../../lists/preview';
import ChartRead from '../../../charts/read';
import richTextRead from '../../../fields/rich-text-area/rich-text-read';

export default {
  components: { ReadForm, PreviewList, ChartRead, richTextRead },
  props: ['design', 'type'],
};
</script>
