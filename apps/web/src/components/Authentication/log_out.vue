<template>
  <div></div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('logout', 'logout');
    this.$router.push('/sign_in');
  },

};
</script>

<style>

</style>
