<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>
      </el-col>
      <el-col :span="12">
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>
      </el-col>
    </el-row>
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
      actTotal:0, //活动待审核
      infoTotal:0, //资讯待审核
      scenTotal:0, //场馆待审核
      vjData:[], //最新资讯
      actData:[],//最新活动
      chartData: {
        columns: ['date', 'PV', 'Order'],
        rows: [
          { date: '2020-09-01', PV: 32371, Order: 19810 },
          { date: '2020-09-02', PV: 12328, Order: 4398 },
          { date: '2020-09-03', PV: 92381, Order: 52910 }
        ]
      }
    }
  },
  created(){

  },
  activated(){


  },
  methods: {
    //路由跳转
    goRouter(id){
        if(id==1){
            this.$router.openPage("/act/actcheck" , {});
        }else if(id==2){
            this.$router.openPage("/information/infocheck" , {});
        }else if(id==3){
            this.$router.openPage("/stadium/stadiumcheck" , {});
        }else if(id==4){
            this.$router.openPage("/information/infomanagement" , {});
        }else if(id==5){
            this.$router.openPage("/act/actmanagement" , {});
        }
    },
  }
}
</script>

<style scoped lang="scss">
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.el-col {
  border-radius: 4px;
}
</style>
