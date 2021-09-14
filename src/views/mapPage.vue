<template>
  <div class="mapPage">
    <myMap/>
  </div>
</template>

<script>
import myMap from '../components/map.vue'
export default {
  components: {
    myMap
  }
}
</script>

<style>
.mapPage{
  width: 100%;
  height: 100%;
}
</style>