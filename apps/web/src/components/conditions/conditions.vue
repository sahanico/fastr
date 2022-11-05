<template>
  <div style="margin: 8px">
    <table style="width: 100%; padding-bottom: 32px;">
      <tr>
        <v-row>
          <v-col>LHS</v-col>
          <v-col>Operator</v-col>
          <v-col>RHS</v-col>
        </v-row>
      </tr>
      <tr>
        <td>
          <div v-for="(item, idx) in conditions" :key="idx">
            <!--              @change="$emit('update:conditions',conditions[idx])"-->
            <condition
              :objects="objects"
              :primary-object="primaryObject"
              :condition="conditions[idx]"
            ></condition>
          </div>
        </td>
      </tr>
      <tfoot>
      </tfoot>
    </table>
  </div>
</template>

<script>
import condition from './condition';

export default {
  props: ['primaryObject', 'objects', 'conditions'],
  components: { condition },
};
</script>
