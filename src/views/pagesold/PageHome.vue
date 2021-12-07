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
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #fff;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
        cursor: pointer;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 30px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(100, 213, 114);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }
/deep/ .el-table::before{
  height: 0;
}
</style>
