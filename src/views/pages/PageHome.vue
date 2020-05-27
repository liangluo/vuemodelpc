<template>
  <div>
   <ve-line :data="chartData" :settings="chartSettings"></ve-line>
  </div>
</template>

<script>
export default {
  name: 'PageHome',
  data () {
    this.chartSettings = {
      yAxisType: ['0,0a']
    }
    return {
      chartData: {
        columns: ['date', 'PV', 'Order'],
        rows: [
          { date: '2018-05-22', PV: 32371, Order: 19810 },
          { date: '2018-05-23', PV: 12328, Order: 4398 },
          { date: '2018-05-24', PV: 92381, Order: 52910 }
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
