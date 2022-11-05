<template>
  <vue-editor v-model="text"></vue-editor>
</template>

<script>
import { VueEditor } from 'vue2-editor';

export default {
  props: ['design'],
  components: [VueEditor],
  data() {
    return {
      text: '',
    };
  },
  name: 'rich-text-create',
};
</script>

<style scoped>

</style>
