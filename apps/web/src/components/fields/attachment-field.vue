<template>
  <div>
    <!--    <div>{{form[name]}}</div>-->
    <v-file-input v-model="selectedFiles" :label="label" :disabled="context === 'read'"
                  chips multiple show-size counter outlined dense color="red"
                  @change="onFileSelected" :rules="rules">
      <template v-slot:selection="{ text }">
        <v-chip small label color="red darken-2" text-color="white">{{ text }}</v-chip>
      </template>
    </v-file-input>
    <div v-if="(context === 'update') || (context === 'read')">
      <div v-for="(pathName, index) in availableFiles.path" v-bind:key="index">
        <a style="font-size: 12px;" @click="downloadDocuments(index, availableFiles.path)"
           href="javascript:void(0)">{{ pathName }}</a>
      </div>
    </div>
    <!--    <v-flex offset-sm5 offset-xs2 sm2 xs8>-->
    <!--      <div class="mt-5">-->
    <!--        <v-card class="mb-4">-->
    <!--          <input ref="fileInput" style="display: none" type="file"-->
    <!--                 @change="onFileSelected" multiple>-->
    <!--          <div class="subheading red&#45;&#45;text" @click="$refs.fileInput.click()"-->
    <!--               style="textAlign: center; padding: 20px; cursor: pointer;">-->
    <!--            Upload A Document-->
    <!--          </div>-->
    <!--        </v-card>-->
    <!--      </div>-->
    <!--    </v-flex>-->
  </div>
</template>

<script>

export default {
  props: ['label', 'context', 'name', 'form', 'item', 'inputId'],
  data() {
    return {
      selectedFiles: null,
      availableFiles: [],
      rules: [
        v => !!v || 'File is required',
        v => (v && v.size > 0) || 'File is required',
      ],
    };
  },
  methods: {
    onFileSelected(files) {
      this.$emit('input', files);
    },
    async downloadDocuments(idx, attachment) {
      this.pathName = await this.$store.dispatch('downloadAttachment', {
        path: attachment[idx],
      });
    },
  },
  async created() {
    if ((this.context === 'update') || (this.context === 'read')) {
      this.availableFiles = await this.$store.dispatch('getAttachmentsByRecordId', {
        recordId: this.inputId,
      });
    }
  },

};
</script>

<style scoped>

</style>
