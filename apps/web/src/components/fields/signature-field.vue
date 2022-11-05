<template>
  <div>
    <div>
      <VueSignaturePad
        v-model="signData"
        id="signature"
        :width="parseInt[item.w]"
        :height="parseInt[item.h]"
        pen-color="#ccc"
        ref="signaturePad"
        @change="getSignData"
      ></VueSignaturePad>
    </div>
    <div>
      <v-checkbox v-model="checkbox" label="Save this sign" @change="save">Save</v-checkbox>
    </div>
  </div>

</template>

<script>
import VueSignaturePad from 'vue-signature-pad';

export default {
  components: {
    VueSignaturePad,
  },
  props: ['item', 'context', 'form', 'name', 'label'],
  data() {
    return {
      signData: [],
      checkbox: false,
    };
  },
  methods: {
    save() {
      if (this.checkbox === true) {
        this.signData = this.$refs.signaturePad.saveSignature();
        this.$emit('input', this.signData);
      }
    },
    getSignData() {
      // const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.signData = this.$refs.signaturePad.saveSignature();
      return this.signData;
    },
  },
  async mounted() {
    fetch(this.signData.data)
      .then(raw => raw.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.$refs.signaturePad.fromDataURL(reader.result);
        };
      })
      .then(this.$refs.signaturePad.fromData(this.signData.data));
  },
  created() {
    if (this.form[this.name]) {
      this.signData = this.form[this.name];
      this.$refs.signaturePad.fromData(this.signData.data);
    }
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

