 <!-- 
  :showtable:是否显示table
  :showtable: table内容
  @updatedraw:更新组件显示状态方法
  @checkall:批量审核提交
  -->
<template>
  <el-drawer v-if="isShow" title="批量审核" :size="drawSize" :wrapperClosable="false" :visible.sync="isShow" direction="rtl" custom-class="act-drawer" ref="drawer" :show-close="true" :before-close="formClose" :modal-append-to-body="false">
    <div class="drawer__content">
      <el-form :model="checkForm" ref="checkForm" :rules="checkFormRules" :inline="true">
        <el-form-item label="审核结果：" label-width="100px" prop="status">
          <el-radio-group  v-model="checkForm.status">
            <el-radio  label="1">通过</el-radio>
            <el-radio  label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核时间：" label-width="100px" prop="audittime">
            <el-date-picker v-model="checkForm.audittime" auto-complete="off"
                            format="yyyy-MM-dd HH:mm:ss" value-format="yyyyMMddHHmmss" type="datetime"/>
        </el-form-item>
        <el-form-item label="处理意见：" label-width="100px">
            <el-input v-model="checkForm.auditdesc"  placeholder="处理意见" class="w480"></el-input>
        </el-form-item>
      </el-form>
      <div class="line" ></div>
       <el-table :data="checkTable" style="width: 100%">
        <el-table-column label="活动名称"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动地址" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="容人数量" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.maxamount }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="drawer__footer">
        <el-button type="success" size="mini" round   @click="submitCheckList" :loading="loading">{{ loading ? '审核中 ...' : '批量审核' }}</el-button>
      </div>
    </div>  
  </el-drawer>
</template>

<script>
export default {
  name: 'check',
  data() {
    return {
      formLabelWidth:'80px', //label宽度
      drawSize:'600px',     //折叠框大小
      isShow:false,     //是否显示组件
      loading:false,      //提交加载
      checkTable:[],    //批量数据
      checkForm: {
        status:2,
        auditdesc: '',
        audittime: ''
      },
      // 必填项
      checkFormRules: {
        status: [{ required: true, message: '选择审核结果', trigger: 'blur' }]
      }
    }
  },
  props: ['showtable','cktable'], 
  watch: {
    showtable: function (val) {
      const _self = this;
      _self.isShow = val;
      _self.checkTable = _self.cktable;
      _self.checkForm.audittime = _self.getNowTime();
      _self.loading = false;
      _self.checkForm.status = 2;
      _self.checkForm.auditdesc = ""; 
    },
  },
  methods: {
    // 批量审批确定
    submitCheckList() {
      const _self = this;
      _self.$refs.checkForm.validate((valid) => {
        if (valid) {
          if (_self.checkForm.status == 3 && (_self.checkForm.auditdesc == null || _self.checkForm.auditdesc == '')) {
            _self.$message({
              message: '请填写不通过原因',
              type: 'warning'
            });
            return;
          }
          _self.loading = true;
          const resourceids = []
          for (var i = 0; i < _self.checkTable.length; i++) {
            resourceids.push(_self.checkTable[i].resourceid)
          }
          // 审批参数
          const newOut = {
            resourceIds: resourceids,
            audittime: _self.checkForm.audittime,
            auditdesc: _self.checkForm.auditdesc
          }
          newOut.status = _self.checkForm.status
          _self.$emit('checkall',newOut);
        }else{
          return false;
        }
      })
    },
    //关闭表单
    formClose() {
      const _self = this;
      _self.$emit('updatedraw',false);
      _self.loading = false;
      _self.checkTable = [];
      _self.$refs.checkForm.clearValidate();
      _self.isShow = false;
    },
    //当前时间
    getNowTime() {
         var now = new Date();
	       var year = now.getFullYear(); //得到年份
	       var month = now.getMonth(); //得到月份
	       var date = now.getDate(); //得到日期
         var hour = now.getHours(); //得到小时
         var minutes = now.getMinutes(); //分钟
         var seconds = now.getSeconds(); //秒
	       month = month + 1;
	       month = month.toString().padStart(2, "0");
         date = date.toString().padStart(2, "0");
         hour = hour.toString().padStart(2, "0");
         minutes = minutes.toString().padStart(2, "0");
         seconds = seconds.toString().padStart(2, "0");
	       var defaultDate = `${year}${month}${date}${hour}${minutes}${seconds}`;
	       return defaultDate;
	  },
  }
}

</script>

<style scoped lang="scss">
.drawer__content{
  .el-input,
  .el-date-editor--datetimerange{
    width: 185px;
    &.w480{
      width: 480px;
    }
  }
  .w480{
    width: 480px;
  }
}
.drawer__footer{
  text-align: center;
  position: absolute;
  top:6px;
  right:50px;
  .el-button{
    width: 118px;
  }
}
.line{
  height: 10px;
  width: 100%;
  background: #eee;
}
</style>
