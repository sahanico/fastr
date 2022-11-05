<template>
  <div>
    <div style="text-align: center"> {{this.item.value.label}}</div>
    <v-img :src="this.item.value.meta.image" ></v-img>
  </div>
</template>

<script>

export default {
  props: ['item', 'context', 'default', 'form', 'name'],
  data() {
    return {
      image: '',
      url: null,
      imageBase64Data: [],
      files: [],
      selectedImage: '',
    };
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>
