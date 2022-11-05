<template>

  <v-container>
    <div id = "apiStep">
    <v-row>
      <v-col>
        <v-text-field v-model="api.url" label="Endpoint" required></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="api.type" :items="apiTypes" chips dense
                  outlined return-object small-chips
                  label="API Method"
        />
      </v-col>
    </v-row>
      <!-- Header -->
    <div>
      <!-- heading, add or remove buttons -->
      <v-row>
        <v-col>Headers</v-col>
         <v-col>
          <v-btn style="position: absolute; right: 16px" icon
                 @click="api.headers.push(headerDefault)">
            <v-icon class="red--text"> mdi-plus</v-icon>
          </v-btn>
          <v-btn style="position: absolute; right: 54px" icon
                 @click="api.headers.pop()">
            <v-icon class="red--text"> mdi-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    <v-row v-for="(item, idx) in api.headers" :key="idx">
      <!-- data -->
      <v-col cols="12" sm="3">
        <v-text-field v-model="api.headers[idx].key" label="Key"/>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select v-model="api.headers[idx].type" :items="keyTypes" chips dense
                  outlined return-object small-chips
                  label="Key Type"
        />
      </v-col>
      <v-col v-if="api.headers[idx].type ==='literal'" cols="12" sm="3">
        <v-text-field v-model="api.headers[idx].value" label="Value"/>
      </v-col>
      <v-col v-if="api.headers[idx].type ==='variable'" cols="12" sm="3">
        <v-select v-model="api.headers[idx].type" :items="keyTypes" chips dense
                  outlined return-object small-chips
                  label="Key Type"
        />
      </v-col>
    </v-row>
    </div>
      <!-- body -->
    <div>
      <v-row>
        <v-col>Body</v-col>
        <v-col>
          <v-btn style="position: absolute; right: 16px" icon
                 @click="api.body.push(bodyDefault)">
            <v-icon class="red--text"> mdi-plus</v-icon>
          </v-btn>
          <v-btn style="position: absolute; right: 54px" icon
                 @click="api.body.pop()">
            <v-icon class="red--text"> mdi-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-for="(item, idx) in api.body" :key="idx">
        <v-col>
          <v-text-field v-model="api.body[idx].key" label="Key"/>
        </v-col>
        <v-col>
          <v-text-field v-model="api.body[idx].value" label="Value"/>
        </v-col>
      </v-row>
    </div>
        <!-- Buttons -->
      <v-row class="justify-end">
          <v-col cols="12" sm="1">
            <v-btn color="red darken-2" text type="button"
                   @click="cancelStep">Cancel
            </v-btn>
          </v-col>
          <v-col cols="12" sm="1">
            <v-btn v-if="context ==='create'" color="red darken-2" text type="button"
                   @click="addStep">Add Step
            </v-btn>
            <v-btn v-if="context ==='update'" color="red darken-2" text type="button"
                   @click="addStep">Update Step
            </v-btn>
          </v-col>
        </v-row>

  </div>
  </v-container>

</template>

<script>
import _ from 'underscore';

const blankHeader = {
  key: '',
  value: '',
  type: '',
};
const blankBody = {
  key: '',
  value: '',
  type: '',
};

export default {
  props: {
    steps: Array,
    name: String,
    context: String,
    pool: Array,
    api: {
      type: Object,
      default: () => ({
        type: '',
        method: '',
        url: '',
        headers: [...blankHeader],
        body: [...blankBody],
      }),
    },
  },
  // props: ['steps', 'objects'],
  data() {
    return {
      apiTypes: ['Post', 'Put', 'Get', 'Delete'],
      keyTypes: ['literal', 'variable'],
      headerDefault: blankHeader,
      bodyDefault: blankBody,
    };
  },
  methods: {
    addStep() {
      const step = {
        name: this.name,
        type: 'api_call',
        meta: {
          api: this.api,
        },
      };
      if (this.context === 'update') {
        this.$emit('updateStep', step);
      } else if (this.context === 'create') {
        this.$emit('addStep', step);
      }

      this.cancelStep();
    },
    cancelStep() {
      this.$emit('cancelStep');
      this.api();
    },
  },
  created() {
    if (this.context === 'update') {
      const step = _.findWhere(this.steps, { name: this.name });
      this.api = step.meta.api;
    } else {
      this.api.headers.push({
        key: '',
        value: '',
      });
      this.api.body.push({
        key: '',
        value: '',
      });
    }
  },
};
</script>

<style scoped>

</style>
