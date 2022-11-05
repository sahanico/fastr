<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <div class="headline red--text pt-5 pb-4 pl-3 text-xs-center">All Appointments</div>
          <calendar role="Admin"></calendar>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import calendar from '@/components/Calendar/calendar';

export default {
  components: { calendar },
};

</script>
