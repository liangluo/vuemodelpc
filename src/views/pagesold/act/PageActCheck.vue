<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源审核</el-breadcrumb-item>
      <el-breadcrumb-item>活动审核</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询条件-->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="活动名称：">
          <el-input placeholder="活动名称" v-model="query.resourcetitle" clearable/>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select placeholder="请选择" v-model="query.status" filterable clearable>
            <el-option
              v-for="_status in selectOptions.statusOption" :key="_status.id"
              :label="_status.label" :value="_status.id"/>
          </el-select>
        </el-form-item>
         <el-form-item label="归属单位：">
          <el-select placeholder="请选择" v-model="query.editunit" filterable clearable>
             <el-option v-for="_type in selectOptions.editunitarr" :key="_type.editunit" :label="_type.editunitname" :value="_type.editunit"/>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型名称：">
          <el-select placeholder="请选择" v-model="query.resourtypename" filterable clearable>
            <el-option v-for="_type in resources" :key="_type.resourcetypeid"
                       :label="_type.resourtypename" :value="_type.resourtypename"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
          <el-button icon="el-icon-delete"  @click="resetForm">清空</el-button>
          <el-button type="primary"  @click="checkList()" icon="el-icon-document-copy" :disabled="selectTable.length <= 0">批量审批</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--活动列表-->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="handleSelectable"></el-table-column>
        <el-table-column label="ID"  width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
          <el-table-column label="归属单位"  :show-overflow-tooltip="true" width="110">
              <template slot-scope="scope">
                  <span>{{scope.row.editunit==129?'汉寿县文化旅游广电体育局':scope.row.editunit==672?'汉寿县文化馆':scope.row.editunit==113?'汉寿县图书馆':'无'}}</span>
              </template>
          </el-table-column>
        <el-table-column label="联系电话" width="100" >
          <template slot-scope="scope">
            <span>{{ scope.row.resourcelink}}</span>
          </template>
        </el-table-column>
        <el-table-column label="容人数量" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.maxamount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{ selectOptions.status2Option[scope.row.status - 1] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批时间" width="100">
          <template slot-scope="scope" >
            <span v-if="!!scope.row.audittime">{{ scope.row.audittime.substring(0,4)}}-{{ scope.row.audittime.substring(4,6)}}-{{ scope.row.audittime.substring(6,8)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='150'>
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handlercheck(scope.row)" v-if="scope.row.status === 2">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </el-card>
    <!-- 增删改组件 -->
    <addAct :editform="editForm" :showDraw='showDraw' :rtype='rtype' :resources='resources' :labels="labels" @updatedraw="updateDraw" @updatelist='getList' @resetform="resetForm"></addAct>
    <!-- 批量审核 -->
    <checkMore :cktable="selectTable" :showtable="isShowCheckTable" @updatedraw="updateDraw" @checkall='checkAllData'></checkMore>
  </div>
</template>

<script>
import { activitySave, activityList,activitysSave } from '@/api/activity';
import { labelList } from '@/api/label';
import { resTypeList } from '@/api/resource';
import { publishActivity } from '@/api/publish'
import addAct from '@/components/addAct.vue';
import checkMore from '@/components/check.vue';
export default {
  name: 'PageActManagement',
  data() {
    return {
      query: {
        name: '',
        status: 2,
        editunit:'',
        resourtypename: ''
      },         //查询条件
      currentPage:1,  //当前页
      pageSize:10,    //条数
      pageTotal:0,    //数据总数量
      loading:false,  //列表加载中
      table: [],    //表格列表

      selectOptions: {
        statusOption: [
          { id: 1, label: '正常' }, { id: 2, label: '审核中' },
          { id: 3, label: '审核不通过' }, { id: 4, label: '下线' }
        ],
        status2Option: ['正常', '审核中', '审核不通过', '下线'],
        editunitarr:[
          {editunitname:"汉寿县文化旅游广电体育局",editunit:129},
          {editunitname:"汉寿县文化馆",editunit:672},
          {editunitname:"汉寿县图书馆",editunit:113}
        ],
      },     //本地选项
      resources: [],  //资源类型列表
      labels: [],        //标签列表

      rtype:'', //增删改组件类型
      showDraw:false, //是否显示增删改组件
      editForm:null, //增删改组件id

      selectTable:[],  //表格多选
      isShowCheckTable:false, //是否显示批量审核
    }
  },
  components: {
    addAct,
    checkMore
  },
  created: function() {
    this.getList();
    this.gettypeList();
    this.getLabelList();
  },
  methods: {
    // 获取标签接口
    getLabelList() {
      const _self = this;
      labelList({}, 0, 0).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          const _message = res.message;
          _self.labels = _message.list;
        }
      });
    },
    // 获取资源类型列表
    gettypeList() {
      const _self = this;
      resTypeList({ upresourcetypeid: 3 }, 0, 0).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.resources = res.message.list;
        }
      });
    },
    //获取活动列表
    getList() {
      const _self = this;
      _self.loading = true;
      activityList(_self.query, _self.currentPage, _self.pageSize).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.pageTotal = res.message.total;
          _self.table = res.message.list;
          _self.table.forEach(_v => {
            const _tempVos = _v.resourceLabelVos;
            if (_v.resourcestarttime && _v.resourceendtime) {
              _v.resourcetime = [_v.resourcestarttime, _v.resourceendtime];
            }
            if (_v.bespeakstarttime && _v.bespeakendtime) {
              _v.bespeaktime = [_v.bespeakstarttime, _v.bespeakendtime];
            }
            const lableout = [];
            if (_tempVos && _tempVos.length > 0) {
              for (let i = 0; i < _tempVos.length; i++) {
                lableout.push(_tempVos[i].sysLabel.labelid);
                _v.label = lableout;
              }
            }
          });
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => _self.loading = false);
    },
    //更新接口
    updateData(configData) {
      const _self = this;
      activitySave(_self.dialogForm).then(_result => {
        if (_result.code === '0000' && _result.innercode === '0000') {
          _self.getList();
          _self.$message({
            message: configData,
            type: 'success'
          });
        }
      });
    },
    //推送接口
    pushData(){
      const _self = this;
      publishActivity(_self.dialogForm).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
           _self.dialogForm.publishflag = 1;
          _self.updateData('活动已推送！')
        }
      })
    },
    //批量审核接口
    checkAllData(data) {
      const _self = this;
      activitysSave(data).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.$message({
            message: '批量审核成功',
            type: 'success'
          });
          _self.updateDraw(false);
          _self.resetForm();
          _self.getList();
        } else {
          _self.$message({
            message: '批量审核失败！' ,
            type: 'error'
          });
        }
      });
    },
    //详情
    handleDetail(row){
      const _self = this;
      _self.showDraw = true;
      _self.rtype = "detail";
      _self.editForm = JSON.parse(JSON.stringify(row));;
    },
    //修改增，改组件类型
    updateDraw(val){
       const _self = this; 
      _self.showDraw = val;
      _self.isShowCheckTable = val;
    },
     //单条审批
    handlercheck(row){
      const _self = this;
      _self.showDraw = true;
      _self.rtype = "check";
      _self.editForm = JSON.parse(JSON.stringify(row));
    },
    //批量审核
    checkList() {
      const _self = this;
      _self.isShowCheckTable = true;
    },
    //表格批量选择
    handleSelectionChange(val) {
      const _self = this;
      _self.selectTable = val;
    },
    // 判断活动是否可审批
    handleSelectable(item) {
      if (item.status === 2) {
        return true
      }
    },
    //搜索条件清空
    resetForm() {
      const _self = this;
      _self.currentPage = 1;
      _self.query = {
        name: '',
        status: 2,
        resourtypename:'',
        editunit:'',
      }
    },
    //修改页码
    handleSizeChange (size) {
      const _self = this;
      _self.pageSize = size
      _self.getList();
    },
    //修改当前页
    handleCurrentChange (currentPage) {
      const _self = this;
      _self.currentPage = currentPage
      _self.getList();
    },
  }
}

</script>

<style scoped lang="scss">
.closeImg{
  position: absolute;
  right:-10px;
  top:-10px;
  width:30px;
  height: 30px;
  text-align: center;
  font-size: 28px;
  color: #8c939d;
  z-index: 2;
}
.mod-popcontainer-btn{
  cursor: pointer;
}
</style>
