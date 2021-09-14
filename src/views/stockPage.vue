<template>
  <div class="stockPage">
    <stock/>
  </div>
</template>

<script>
import stock from '../components/stock.vue'
export default {
  components: {
    stock
  }
}
</script>

<style>
.stockPage{
  width: 100%;
  height: 100%;
}
</style>