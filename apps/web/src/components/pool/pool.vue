<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="headline red--text">Pool</div>
      </v-col>
    </v-row>
    <v-card style="padding-bottom: 40px">
      <v-container>
        <v-row  v-for="(item, index) in pool" :key="index">
          <v-col>
            <v-text-field v-model="item.label" label="label"/>
          </v-col>
          <v-col>
            <v-text-field v-model="item.name" label="Name"/>
          </v-col>
          <v-col>
            <v-select v-model="item.feeder" :items="['selection', 'system', 'input']"
                      label="Source" />
          </v-col>
          <v-col v-if="item.feeder === 'system'">
            <v-autocomplete v-model="item.system" :items="['logged_in_user',
                'logged_in_account', 'logged_in_account_member']"
                            label="Source Input" />
          </v-col>
          <v-col>
            <v-autocomplete v-model="item.type" :items="['object', 'literal']" label="Type"
                            v-if="item.feeder === 'selection' || item.feeder === 'input'" />
          </v-col>
          <v-col>
            <div v-if="item.type === 'object'">
              <v-autocomplete v-model="item.object" :items="autocompleteObjects"
                              label="Object"/>
            </div>
          </v-col>
          <v-col v-if="item.type === 'literal'">
            <v-text-field v-model="item.value" label="Value"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn style="position: absolute; right: 16px" icon
                   @click="pool.push({})">
              <v-icon class="red--text"> mdi-plus</v-icon>
            </v-btn>
            <v-btn style="position: absolute; right: 54px" icon
                   @click="pool.pop()">
              <v-icon class="red--text"> mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>

export default {
  props: ['pool', 'autocompleteObjects'],
  model: {
    prop: 'pool'
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
