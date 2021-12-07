<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
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
          <el-button type="primary"  @click="handleAdd()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--活动列表-->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
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
        <el-table-column label="操作" width='450'>
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" v-if="scope.row.status === 1||scope.row.status === 3||scope.row.status === 4">修改</el-button>
            <el-button size="mini" type="primary" @click="handleTop(scope.row)" v-if="scope.row.status === 1&&scope.$index!==0">置顶</el-button>
            <el-button size="mini" type="primary" @click="createEwm(scope.row)">二维码</el-button>
            <el-button size="mini" type="danger" @click="sendData(scope.row)" v-if="scope.row.status === 1">{{scope.row.publishflag==1?'取消推送':'推送资源'}}</el-button>
            <el-button size="mini" type="danger" @click="handleUp(scope.row)" v-if="scope.row.status === 4">上线</el-button>
            <el-button size="mini" type="danger" @click="handleDown(scope.row)" v-if="scope.row.status === 1">下线</el-button>
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
    <!-- 显示二维码 -->
    <div class="_mod-popup"  id="ewmPopup">
      <div class="mod-popcontainer">
        <div class="mod-popcontainer-content">
          <div class="tit">活动报名核销二维码</div>
          <div class="qrcode" id="qrcodes"></div>
          <div>右击二维码--图片另存为</div>
        </div>
        <div class="mod-popcontainer-btn flex f-center f-align">
            <div  @click="closepops">我知道了</div>
        </div>
      </div>
    </div>
    <!-- 增删改组件 -->
    <addAct :editform="editForm" :showDraw='showDraw' :rtype='rtype' :resources='resources' :labels="labels" @updatedraw="updateDraw" @updatelist='getList' @resetform="resetForm"></addAct>
  </div>
</template>

<script>
import { activitySave, activityList } from '@/api/activity';
import { labelList } from '@/api/label';
import { resTypeList } from '@/api/resource';
import { publishActivity } from '@/api/publish'
import QRCode from 'qrcodejs2';
import addAct from '@/components/addAct.vue';
export default {
  name: 'PageActManagement',
  data() {
    return {
      query: {
        name: '',
        status: '',
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
    }
  },
  components: {
    QRCode,
    addAct
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
    //新增
    handleAdd(){
      const _self = this;
      _self.showDraw = true;
      _self.rtype = "add";
      _self.editForm = null;
    },
    //修改
    handleUpdate(row){
      const _self = this;
      _self.showDraw = true;
      _self.rtype = "update";
      _self.editForm = JSON.parse(JSON.stringify(row));
      _self.editForm.status = 4;
      _self.editForm.auditdesc = "";
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
      _self.rtype = null;
    },
    // 下线
    handleDown(row) {
      const _self = this;
      _self.$confirm('请确认是否下线该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.dialogForm = JSON.parse(JSON.stringify(row));
        _self.dialogForm.status = 4;
        _self.dialogForm.auditdesc = "";
        _self.updateData('活动下线成功');
      }).catch(() => {

      });
    },
    // 上线
    handleUp(row) {
      const _self = this;
      _self.$confirm('请确认该活动是否进入审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.dialogForm = JSON.parse(JSON.stringify(row));
        _self.dialogForm.status = 2;
        _self.updateData('该活动进入审核，请尽快审核上线');
      }).catch(() => {

      });
    },
    // 置顶
    handleTop(row) {
      const _self = this;
      _self.dialogForm = JSON.parse(JSON.stringify(row));
      const date = new Date();
      let _updateTime = date.getFullYear();
      const month = date.getMonth() + 1;
      _updateTime += (month <= 9 ? '0' : '') + month;
      const strDate = date.getDate();
      _updateTime += (strDate <= 9 ? '0' : '') + strDate;
      const strHours = date.getHours();
      _updateTime += (strHours <= 9 ? '0' : '') + strHours;
      const strMinutes = date.getMinutes();
      _updateTime += (strMinutes <= 9 ? '0' : '') + strMinutes;
      const strSeconds = date.getSeconds() + 1;
      _updateTime += (strSeconds <= 9 ? '0' : '') + strSeconds;
      _self.dialogForm.updatetime = _updateTime;
      _self.updateData('置顶成功');
    },
    // 推送
    sendData(row) {
      const _self = this;
      _self.$confirm('请确认是否' + (row.publishflag == 1 ? '取消' : '') + '推送?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.dialogForm = JSON.parse(JSON.stringify(row));
        if (row.publishflag != 1) {
          _self.pushData();
        } else {
          _self.dialogForm.publishflag = 0;
          _self.updateData('活动已取消推送！');
        }
      }).catch(() => {
       
      });
    },
    // 显示二维码
    createEwm(data) {
      const _self = this;
      _self.qrcode(data);
      document.getElementById('ewmPopup').style.transform = 'translateX(0)';
    },
    // 关闭弹出框
    closepops() {
      document.getElementById('ewmPopup').style.transform = 'translateX(1000%)';
      document.getElementById('qrcodes').innerHTML = '';
    },
    //  生成二维码
    qrcode(data) {
      const _self = this;
      const qrcode = new QRCode('qrcodes', {
        width: 288,
        height: 288, // 高度
        text: window.location.origin + '/webwl/#/destroy/' + data.resourceid + '?tableid=1&subtype=' + data.subtype // 二维码内容
      });
    },
    //搜索条件清空
    resetForm() {
      const _self = this;
      _self.currentPage = 1;
      _self.query = {
        name: '',
        status: '',
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
