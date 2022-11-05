<template>
 <div v-html="design"/>
</template>

<script>
import { VueEditor } from 'vue2-editor';

export default {
  props: ['design'],
  components: { VueEditor },
  data() {
    return {
      text: '',
    };
  },
  name: 'rich-text-read',
};
</script>

<style scoped>

</style>
