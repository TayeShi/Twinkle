<template>
  <div>{{ count }}</div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  export default class Counter extends Vue {
    computed: {
      count () {
        return store.state.count
      }
  }
  }

</script>
