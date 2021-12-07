<template>
  <div>
    <!-- <el-card>
      资讯审核
    </el-card>
    <br/> -->
    <!--查询条件-->
    <el-card shadow="hover">
      <el-form :inline="true"  :model="query">
        <el-form-item label="标题">
          <el-input  placeholder="资讯标题" v-model="query.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.state" placeholder="状态"  filterable>
            <el-option
              v-for="_state in stateOption" :key="_state.id"
              :label="_state.name" :value="_state.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select  placeholder="请选择"  v-model="query.sourcetype"  filterable>
            <el-option
              v-for="_sourcetype in resourcetype" :key="_sourcetype"
              :label="_sourcetype" :value="_sourcetype"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  icon="el-icon-search"  @click=" queryList()">查询</el-button>
          <el-button icon="el-icon-delete"  @click="clear()">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!--资讯列表-->
    <el-card shadow="hover">
      <el-button type="primary" @click="checkList()" icon="el-icon-document-copy" :disabled="checkTable.length <= 0" style="margin-bottom: 20px;">批量审批</el-button>
      <el-table :data="table" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" width="55"   :selectable="handleSelectable"></el-table-column>
        <el-table-column label="ID" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.resourcesource}}</span>
          </template>
        </el-table-column>
          <el-table-column label="归属单位"  :show-overflow-tooltip="true" align='center'>
              <template slot-scope="scope">
                  <span>{{scope.row.editunit==129?'汉寿县文化旅游广电体育局':scope.row.editunit==672?'汉寿县文化馆':scope.row.editunit==113?'汉寿县图书馆':'无'}}</span>
              </template>
          </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{ status2Option[scope.row.status - 1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="推送时间" width="100">
          <template slot-scope="scope" >
            <span v-if="!!scope.row.audittime">{{ scope.row.audittime.substring(0,4)}}-{{ scope.row.audittime.substring(4,6)}}-{{ scope.row.audittime.substring(6,8)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"   @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <!--当状态为未审核时才显示审批按钮-->
            <el-button size="mini" type="danger"   v-if="scope.row.status === 2"    @click="checkInfo(scope.$index, scope.row)">审批</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        @size-change="userHandleSizeChange"
        @current-change="userHandleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-card>

    <!--批量审核-->
    <el-dialog title="资讯批量审核" :visible.sync="checkDialogShow" class="dialog" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <div class="el-dialog-div">
      <el-table
        :data="checkTable"
        style="width: 100%">
        <el-table-column label="资讯标题" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="资源类型" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="资讯来源" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.resourcesource}}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.updatetime.substring(0,4)}}-{{ scope.row.updatetime.substring(4,6)}}-{{ scope.row.updatetime.substring(6,8)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form :inline="true" :model="dialogCheckForm"  :rules="dialogRules"  ref="dialogCheckForm">
        <el-form-item label="审核结果" label-width="120px" prop="status">
          <el-radio-group  v-model="dialogCheckForm.status">
            <el-radio  label="1">通过</el-radio>
            <el-radio  label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推送时间" label-width="120px" prop="audittime">
          <el-date-picker v-model="dialogCheckForm.audittime" auto-complete="off"
                          format="yyyy-MM-dd HH:mm:ss" value-format="yyyyMMddHHmmss" type="datetime" style="width:275px"/>
        </el-form-item>
        <el-form-item label="处理意见" label-width="120px">
          <el-input style="width:500px" v-model="dialogCheckForm.auditdesc"  placeholder="处理意见"></el-input>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="checkDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="submitCheckList()">确 定</el-button>
      </div>
    </el-dialog>

    <!--单条审核/详情-->
    <el-dialog title="资讯信息" v-if="dialogShow==true" :visible.sync="dialogShow" @close="formClose()" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <div class="el-dialog-div">
      <el-form :model="dialogForm" :rules="dialogRules"   :inline="true"  ref="dialogForm" >
        <el-form-item label="资讯标题" label-width="120px" prop="resourcetitle">
          <el-input v-model="dialogForm.resourcetitle" auto-complete="off" readonly  placeholder="资讯标题" style="width: 218px;"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" label-width="120px" prop="resourtypename">
          <el-select v-model="dialogForm.resourtypename" placeholder="" disabled filterable style="width:218px" >
            <el-option
              v-for="_role in resourcetype" :key="_role"
              :label="_role" :value="_role"></el-option>
          </el-select>
        </el-form-item>
        <br/>

        <el-form-item label="资讯图片" label-width="120px" prop="resourceimage">
            <img v-if="dialogForm.resourceimage" :src="dialogForm.resourceimage"  readonly class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item label="资讯高清图" label-width="110px" prop="resourceipicture">
            <img v-if="dialogForm.resourceipicture" :src="dialogForm.resourceipicture"  readonly class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item label="资讯视频" label-width="120px" prop="resourceviedo">
          <video v-if="dialogForm.resourceviedo" :src="dialogForm.resourceviedo" class="avatar video-avatar" readonly  controls="controls">
            您的浏览器不支持视频播放
          </video>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-form-item>
        <el-form-item label="资讯来源" label-width="120px" prop="resourcesource">
          <el-input v-model="dialogForm.resourcesource" auto-complete="off"  style="width:445px" readonly  placeholder="资讯来源"></el-input>
        </el-form-item>
          <el-form-item label="归属单位" label-width="120px" prop="editunit">
              <el-select v-model="dialogForm.editunit" placeholder="请选择归属单位" style="width:500px"
                         filterable :disabled="dialogType==='detail'"
              >
                  <el-option v-for="_type in editunitarr" :key="_type.editunit"
                             :label="_type.editunitname" :value="_type.editunit"/>
              </el-select>
          </el-form-item>
        <el-form-item label="标签" label-width="120px" prop="label">
          <el-select v-model="dialogForm.label" placeholder="请选择" filterable multiple  :multiple-limit="3" style="width:300px" disabled>
            <el-option v-for="_label in labels" :key="_label.labelid"
                       :label="_label.labelword" :value="_label.labelid"/>
                       :label="_label.labelword" :value="_label.labelid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="资讯详情" label-width="120px" prop="resourcedetail">
          <div  v-html="dialogForm.resourcedetail"  style="width: 500px;">
            {{dialogForm.resourcedetail}}
          </div>
        </el-form-item>
        <el-form-item label="审核结果" label-width="120px" prop="status" v-if="dialogType === 'update'">
          <el-radio-group  v-model="dialogForm.status">
            <el-radio  :label="1">通过</el-radio>
            <el-radio  :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推送时间" label-width="120px" prop="audittime">
          <el-date-picker v-model="dialogForm.audittime" auto-complete="off"
                          format="yyyy-MM-dd HH:mm:ss" value-format="yyyyMMddHHmmss" type="datetime" style="width:275px"/>
        </el-form-item>
        <el-form-item label="处理意见" label-width="120px" prop="auditdesc" v-if="dialogType === 'update'">
          <el-input v-model="dialogForm.auditdesc" auto-complete="off"  style="width:565px" placeholder="处理意见"></el-input>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="formClose()">取 消</el-button>
        <el-button type="primary" v-if="dialogType === 'update'" @click="submitCheck()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { infoSave, infoList, infosSave } from '@/api/info'
import { resTypeList } from '@/api/resource'
import { labelList } from '@/api/label'
export default {
  name: 'PageInfoCheck',
  data () {
    return {
      stateOption: [{ id: '1 ', name: '正常' }, { id: '2 ', name: '未审核' }, {
        id: '3 ',
        name: '审核不通过'
      }, { id: '4 ', name: '下线' }
      ],
      status2Option: ['正常', '审核中', '审核不通过', '下线'],
	  editunitarr:[{editunitname:"汉寿县文化旅游广电体育局",editunit:129},{editunitname:"汉寿县文化馆",editunit:672},{editunitname:"汉寿县图书馆",editunit:113}],
      query: {
        title: '',
        state: '',
        sourcetype: ''
      },
      table: [],
      loading: false,
      checkTable: [],
      resourcetype: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 2,
      dialogShow: false,
      checkDialogShow: false,
      dialogType: '',
      labels: [],
      defaultquery: {
        status: 2
      },
      dialogForm: {
        auditdesc: '',
        audittime: '',
        lable: []
      },
      dialogCheckForm: {
        auditdesc: '',
        audittime: ''
      },
      // 必填项
      dialogRules: {
        status: [{ required: true, message: '选择审核结果', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.typeList();
    this.defaultqueryList(this.defaultquery);
    this.queryLabelList();
  },
  methods: {
    // 默认查询未审核记录
    defaultqueryList(query, _currentPage) {
      const _self = this;
      _self.loading = true;
      const _query = query;
      if (!_currentPage) {
        _currentPage = _self.currentPage;
      }
      infoList(_query, _currentPage, _self.pageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.pageTotal = _message.total;
          _self.table = _message.list;
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
      }).finally(() => _self.loading = false);
    },
    // 查询
    queryList(_currentPage) {
      const _self = this;
      _self.loading = true;
      const _query = {};
      if (_self.query.title) {
        _query.resourcetitle = _self.query.title;
      }
      if (_self.query.state) {
        _query.status = _self.query.state;
      }
      if (_self.query.sourcetype) {
        _query.resourtypename = _self.query.sourcetype;
      }
      if (!_currentPage) {
        _currentPage = _self.currentPage;
      } else {
        _self.currentPage = _currentPage;
      }
      infoList(_query, _currentPage, _self.pageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.pageTotal = _message.total;
          _self.table = _message.list;
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
      }).finally(() => _self.loading = false);
    },
    // 关闭表单时，重置校验
    formClose() {
      this.dialogShow = false
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.clearValidate();
    },
    // 详情
    handleDetail (index, row) {
      this.dialogType = 'detail'
      this.dialogForm = row;
      this.dialogShow = true;
    },
    // 单条审批
    checkInfo(index, row) {
      this.dialogType = 'update',
      this.dialogForm = row;
      this.dialogForm.auditdesc = '';
      this.dialogShow = true
    },
    // 单独审批确认
    submitCheck () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this;
          if (_self.dialogForm.status == 2) {
            _self.$message({
              message: '请选择审批结果',
              type: 'warning'
            });

            // 清空审批框，更新结果
            setTimeout(function () {
			_self.defaultqueryList(_self.defaultquery);
            }, '500');
            return;
          }
          if (_self.dialogForm.status == 3 && (_self.dialogForm.auditdesc == null || _self.dialogForm.auditdesc == '')) {
            _self.$message({
              message: '审批不通过时需要填写处理意见',
              type: 'warning'
            });
            // 清空审批框，更新结果
            setTimeout(function () {
              _self.dialogForm.status == 3
              _self.defaultqueryList(_self.defaultquery);
            }, '500');
            return;
          }
          infoSave(_self.dialogForm).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              this.dialogShow = false;
              _self.$message({
                message: '审核资讯成功！',
                type: 'success'
              });
              // 清空审批框，更新结果
              setTimeout(function () {
                _self.dialogForm = {};
				_self.defaultqueryList(_self.defaultquery);
              }, '500');
            } else {
              _self.$message({
                message: '审核资讯失败！',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 判断状态是否能批量审批
    handleSelectable(item) {
      if (item.status === 2) {
        return true
      }
    },
    // 批量审批
    handleSelectionChange(val) {
      this.checkTable = val;
    },
    checkList() {
      this.dialogCheckForm = {}
      this.checkDialogShow = true
    },
    // 批量审批确定
    submitCheckList() {
      this.$refs.dialogCheckForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this
          if (_self.dialogCheckForm.status == 3 && (_self.dialogCheckForm.auditdesc == null || _self.dialogCheckForm.auditdesc == '')) {
            _self.$message({
              message: '审批不通过时需要填写处理意见',
              type: 'warning'
            });
            return;
          }
          const resourceids = []
          for (var i = 0; i < _self.checkTable.length; i++) {
            resourceids.push(_self.checkTable[i].resourceid)
          }

          // 审批参数
          const newOut = {
            resourceIds: resourceids,
            audittime: _self.dialogCheckForm.audittime,
            auditdesc: _self.dialogCheckForm.auditdesc
          }
          newOut.status = _self.dialogCheckForm.status
          infosSave(newOut).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              this.checkDialogShow = false;
              _self.$message({
                message: '审批资讯成功！',
                type: 'success'
              });
              // 清空审批框，更新结果
              setTimeout(function () {
                _self.dialogCheckForm = {};
				_self.defaultqueryList(_self.defaultquery);
              }, '500');
            } else {
              _self.$message({
                message: '审批资讯失败！',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 资源类型下拉
    typeList() {
      const _self = this;
      const _query = {};
      resTypeList(_query, 1, 50).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          for (var i = 0; i < _message.list.length; i++) {
            if (_message.list[i].status !== 2) {
              const newOut = _message.list[i].resourtypename;
              _self.resourcetype.push(newOut);
            }
          }
        }
      });
    },
    // 标签下拉查询
    queryLabelList() {
      const _self = this;
      labelList({}, 0, 0).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.labels = _message.list;
        }
        _self.labels.unshift({ labelid: 0, labelword: '无' });
      });
    },
    // 清空
    clear() {
      this.query.title = '';
      this.query.state = '';
      this.query.sourcetype = '';
    },

    // 页码
    userHandleSizeChange (size) {
      this.pageSize = size
      this.queryList()
    },
    userHandleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.queryList()
    }
  }
}
</script>

<style scoped lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #C0C4CC;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

</style>
