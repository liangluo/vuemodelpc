<template>
  <div>
    <!-- <el-card>
      栏目管理
    </el-card>
    <br/> -->
    <!--查询条件-->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="名称">
          <el-input placeholder="栏目名称" v-model="query.catalogname" clearable/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select placeholder="请选择" v-model="query.catalogtype" filterable clearable>
            <el-option
              v-for="_catalogtype in selectOptions.typeOption" :key="_catalogtype.id"
              :label="_catalogtype.label" :value="_catalogtype.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="配置页面">
          <el-select placeholder="请选择" v-model="query.pageid" filterable clearable>
            <el-option
              v-for="_pageid in selectOptions.pageIdOption" :key="_pageid.id"
              :label="_pageid.label" :value="_pageid.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select placeholder="请选择" v-model="query.tableid" filterable clearable>
            <el-option
              v-for="_table in selectOptions.subTypeOption" :key="_table.value"
              :label="_table.label" :value="_table.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="二级资源类型">
          <el-select placeholder="请选择" v-model="query.subtype" filterable clearable>
            <el-option
              v-for="_table in (query.tableid > 0 ? selectOptions.subTypeOption[query.tableid-1].children: [])"
              :key="_table.value"
              :label="_table.label" :value="_table.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select  placeholder="请选择"  v-model="query.status" filterable clearable>
            <el-option v-for="_status in selectOptions.statusOption"
                       :key="_status.id" :label="_status.label" :value="_status.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryList(1)">查询</el-button>
          <el-button icon="el-icon-delete"  @click="clear()">清空</el-button>
          <el-button type="primary"  @click="columnAdd()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!--栏目类型列表-->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="ID" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.catalogid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.catalogname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ selectOptions.type2Option[scope.row.catalogtype - 1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源类别" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.tableid > 0 ? selectOptions.subTypeOption[scope.row.tableid - 1].label:""
              }}/{{ scope.row.subtype != null ? selectOptions.subTypeOption[scope.row.tableid - 1].children[scope.row.subtype].label : "" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置页面" >
          <template slot-scope="scope">
            <span>{{ scope.row.pageid > 0 ? selectOptions.pageIdOption[scope.row.pageid - 1].label : "" }}</span>
          </template>
        </el-table-column>
       <!-- <el-table-column label="栏目图片">
          <template slot-scope="scope">
            <span>{{ scope.row.catalogimage }}</span>
          </template>
        </el-table-column>-->
       <!-- <el-table-column label="栏目样式">
          <template slot-scope="scope">
            <span>{{ scope.row.catalogdisplaystyle }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="创建时间" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.createtime">{{ scope.row.createtime | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.updatetime">{{ scope.row.updatetime | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <span>{{ selectOptions.status2Option[scope.row.status - 1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="340">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini" type="success" @click="handleUp(scope.row)"
                       v-if="scope.row.status === 2">恢复</el-button>
            <el-button size="mini" type="danger" @click="handleDown(scope.row)"
                       v-if="scope.row.status === 1">禁用</el-button>
            <el-button size="mini" @click="bindRes(scope.row)"
                       v-if="scope.row.catalogtype !== 3">绑定</el-button>
            <el-button size="mini" type="danger" @click="sortDown(scope.$index,scope.row)"
                       v-if="scope.$index !== table.length - 1">下移
            </el-button>
            <el-button size="mini" type="danger" @click="sortUp(scope.$index,scope.row)" v-if="scope.$index !== 0">上移
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="userHandleSizeChange"
        @current-change="userHandleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-card>

    <!--添加栏目-->
    <el-dialog :title="title" :visible.sync="dialogShow" @close="formClose()" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <div class="el-dialog-div">
      <el-form :model="dialogForm" :rules="dialogRules" :inline="true" ref="dialogForm">
        <el-form-item label="栏目名称" label-width="120px" prop="catalogname">
          <el-input v-model="dialogForm.catalogname" auto-complete="off" placeholder="栏目名称" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="状态" label-width="120px" prop="status">
          <el-select v-model="dialogForm.status" placeholder="请选择" filterable style="width: 200px;">
            <el-option v-for="_status in selectOptions.statusOption"
                       :key="_status.id" :label="_status.label" :value="_status.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目类型" label-width="120px" prop="catalogtype">
          <el-select v-model="dialogForm.catalogtype" placeholder="请选择" :disabled="dialogType !== 'add'" filterable style="width: 200px;">
            <el-option
              v-for="_catalogtype in selectOptions.typeOption" :key="_catalogtype.id"
              :label="_catalogtype.label" :value="_catalogtype.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型" label-width="120px" prop="tableArr">
          <el-cascader v-model="dialogForm.tableArr" :props="subTypeProps" :options="subTypeOption" clearable
                       v-if="dialogForm.catalogtype===3" style="width: 200px;"/>
          <el-cascader v-model="dialogForm.tableArr" :options="selectOptions.subTypeOption" clearable
                       v-else style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="配置页面" label-width="120px" prop="pageid">
          <el-select v-model="dialogForm.pageid" placeholder="请选择" filterable style="width: 200px;">
            <el-option
              v-for="_pageid in selectOptions.pageIdOption" :key="_pageid.id"
              :label="_pageid.label" :value="_pageid.id"/>
          </el-select>
        </el-form-item>
        <!--  <el-form-item label="栏目样式" label-width="120px" prop="catalogdisplaystyle">
            <el-input v-model="dialogForm.catalogdisplaystyle" auto-complete="off" placeholder="栏目样式" style="width: 218px;"/>
          </el-form-item>-->
        <br/>
        <el-form-item label="栏目图片" label-width="120px" prop="catalogimage">
          <el-upload class="avatar-uploader" action :show-file-list="false"
                      :before-upload="beforeAvatarUpload" :http-request="uploadImage">
            <img v-if="dialogForm.catalogimage" :src="dialogForm.catalogimage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="栏目链接" label-width="120px" prop="cataloglink">
          <el-input v-model="dialogForm.cataloglink" auto-complete="off" style="width:500px" placeholder="栏目链接"/>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="formClose()">取 消</el-button>
        <el-button type="primary" @click="columnSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!--绑定资源-->
    <el-dialog title="绑定资源" :visible.sync="bindDialogShow" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <el-card shadow="hover">
        <el-form :inline="true" :model="bindQuery">
          <el-form-item label="资源名称">
            <el-input placeholder="资源名称" v-model="bindQuery.resourcetitle" clearable/>
          </el-form-item>
          <el-form-item label="资源类型名称">
            <el-select placeholder="请选择" v-model="bindQuery.resourcetype" filterable clearable>
              <el-option v-for="_type in showResources" :key="_type.resourcetypeid"
                         :label="_type.resourtypename" :value="_type.resourtypename"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryBindList(1)">查询</el-button>
            <el-button icon="el-icon-delete" @click="clearBind()">清空</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table :data="tableBind" style="width: 100%" @selection-change="changeFun" ref="dataTable" v-loading="bindLoading">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="资源ID" >
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源名称">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源类型">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ selectOptions.status2Option[scope.row.status - 1]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="userBindHandleSizeChange"
        @current-change="userBindHandleCurrentChange"
        background
        :current-page="bindCurrentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="bindPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="bindPageTotal">
      </el-pagination>
      <div slot="footer">
        <el-button @click="bindDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="bindResSubmit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { columnSave, columnList, catalogReorder } from '@/api/column';
import { addFile, stadiumList } from '@/api/stadium';
import { resTypeList } from '@/api/resource';
import { activityList } from '@/api/activity';
import { infoList } from '@/api/info';

const subTypeOption = [{
  value: 1,
  label: '活动类型',
  children: [
    { value: 0, label: '全部' },
    { value: 1, label: '活动' }
  ]
}, {
  value: 2,
  label: '场馆类型',
  children: [
    { value: 0, label: '全部' },
    { value: 1, label: '景点' },
    { value: 2, label: '场馆' }
  ]
}, {
  value: 3,
  label: '资讯类型',
  children: [
    { value: 0, label: '全部' },
    { value: 1, label: '文化' },
    { value: 2, label: '资讯' }
  ]
}];
let _resource = [];
export default {
  name: 'PageColumnManagement',
  data() {
    return {
      selectOptions: {
        statusOption: [{ id: 1, label: '正常' }, { id: 2, label: '禁用' }],
        status2Option: ['正常', '禁用'],
        typeOption: [{ id: 1, label: '普通' }, { id: 2, label: 'banner' }, { id: 3, label: '分类' }],
        type2Option: ['普通', 'banner', '分类'],
        pageIdOption: [// 1.首页  2.活动  3 资讯  4 文化   5场馆  6 景点
          { id: 1, label: '首页' },
          { id: 2, label: '活动' },
          { id: 3, label: '资讯' },
          { id: 4, label: '文化' },
          { id: 5, label: '场馆' },
          { id: 6, label: '景点' },
          { id: 7, label: '文化遗产' },
          { id: 8, label: '文化旅游' },
          { id: 9, label: '沧浪文化' },
          { id: 10, label: '龙舟文化' },
          { id: 11, label: '子站首页' }
        ],
        subTypeOption: [{
          value: 1,
          label: '活动类型',
          children: [
            { value: 0, label: '全部' },
            { value: 1, label: '活动' }
          ]
        }, {
          value: 2,
          label: '场馆类型',
          children: [
            { value: 0, label: '全部' },
            { value: 1, label: '景点' },
            { value: 2, label: '场馆' }
          ]
        }, {
          value: 3,
          label: '资讯类型',
          children: [
            { value: 0, label: '全部' },
            { value: 1, label: '文化' },
            { value: 2, label: '资讯' }
          ]
        }]
      },
      subTypeOption: [{
        value: 1,
        label: '活动类型',
        children: [
          { value: 0, label: '全部' },
          { value: 1, label: '活动' }
        ]
      }, {
        value: 2,
        label: '场馆类型',
        children: [
          { value: 0, label: '全部' },
          { value: 1, label: '景点' },
          { value: 2, label: '场馆' }
        ]
      }, {
        value: 3,
        label: '资讯类型',
        children: [
          { value: 0, label: '全部' },
          { value: 1, label: '文化' },
          { value: 2, label: '资讯' }
        ]
      }],
      query: {
        catalogname: '',
        catalogtype: '',
        status: '',
        tableid: ''
      },
      bindQuery: {
        resourcetitle: '',
        resourcetype: ''
      },
      title: '',
      table: [],
      loading: false,
      bindLoading: false,
      resources: [],
      showResources: [],
      tableBind: [],
      bindIds: [], // 历史数据
      subTypeProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (node.children.length > 0) {
            resolve([]);
            return;
          }
          if (level === 2) {
            const _children = subTypeOption[node.parent.value - 1].children;
            let _labels = [];
            if (node.value === 0) {
              _labels = _children.filter((v, i) => i !== 0).map(a => a.label);
            } else {
              _labels = [_children[node.value].label];
            }
            resolve(_resource.filter(a => {
              return _labels.findIndex(b => b === a.upResourceTypeName) > -1;
            }).map(a => ({ value: a.resourcetypeid, label: a.resourtypename, leaf: true })));
          }
        }
      },
      newBindData: [],
      newBindDataAdd: [],
      newBindDataDel: [],
      bindCatalog: {}, // 绑定提交对象
      bindSubType: null,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      bindCurrentPage: 1,
      bindPageSize: 10,
      bindPageTotal: 0,
      dialogShow: false,
      bindDialogShow: false,
      dialogType: '',
      dialogForm: {},
      bindDialogForm: {},
      bindFunc: function() {},
      // 必填项
      dialogRules: {
        catalogname: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        catalogtype: [{ required: true, message: '请选择栏目类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        tableArr: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
        pageid: [{ required: true, message: '请选择所在页面', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'dialogForm.catalogtype': function(val) {
      if (this.dialogType === 'add') {
        this.dialogForm.tableArr = [];
      }
    }
  },
  created: function () {
    this.queryList(1);
    this.typeList();
  },
  methods: {
    changeFun(val) {
      const _self = this;
      if (_self.newBindData.length <= 0) {
        _self.newBindData = _self.tableBind.map(a => {
          return { id: a.resourceid, flag: false }
        });
      }
      _self.newBindData.forEach(a => {
        a.flag = false;
        val.find(b => {
          if (b.resourceid === a.id) {
            return a.flag = true;
          }
        });
      });
    },
    columnAdd() {
      this.title = '栏目添加';
      this.dialogType = 'add';
      this.dialogForm = { status: 2 };
      this.dialogShow = true;
    },
    handleUpdate(row) {
      this.title = '栏目修改';
      this.dialogType = 'update';
      this.dialogForm = JSON.parse(JSON.stringify(row));
      const tableArr = this.dialogForm.tableArr;
      if (!!tableArr && tableArr.length === 3) {
        const _children = this.subTypeOption[tableArr[0] - 1].children;
        const subChildren = _children[tableArr[1]];
        if (!subChildren.children) {
          subChildren.loading = true;
          let _labels = [];
          if (tableArr[1] === 0) {
            _labels = _children.filter((v, i) => i !== 0).map(a => a.label);
          } else {
            _labels = [_children[tableArr[1]].label];
          }
          subChildren.children = _resource.filter(a => {
            return _labels.findIndex(b => b === a.upResourceTypeName) > -1;
          }).map(a => ({ value: a.resourcetypeid, label: a.resourtypename, leaf: true }))
        }
      }
      this.dialogShow = true;
    },
    // 关闭表单时，重置校验
    formClose() {
      this.dialogShow = false
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.clearValidate();
    },
    // 清空
    clear() {
      this.query.catalogname = '';
      this.query.catalogtype = '';
      this.query.status = '';
      this.query.tableid = '';
      this.query.subtype = '';
      this.query.pageid = '';
    },
    clearBind() {
      this.bindQuery.resourcetitle = '';
      this.bindQuery.resourcetype = '';
    },
    // 下移
    sortDown(index, row) {
      const _self = this;
      if (index + 1 < _self.table.length) {
        catalogReorder(row, _self.table[index + 1]);
        setTimeout(function () {
          _self.queryList();
        }, '500');
      }
    },
    // 上移
    sortUp(index, row) {
      const _self = this;
      if (index > 0) {
        catalogReorder(row, _self.table[index - 1]);
        setTimeout(function () {
          _self.queryList();
        }, '500');
      }
    },
    // 禁用
    handleDown(row) {
      this.handleDelete(row, 1);
    },
    // 恢复
    handleUp(row) {
      this.handleDelete(row, 0);
    },
    handleDelete(row, isUp) {
      const _self = this;
      const _comment = !isUp ? '恢复' : '禁用';
      const _status = !isUp ? 1 : 2;
      if (row.status === _status) {
        _self.$message({
          message: '操作失败, 该栏目已经' + _comment,
          type: 'error'
        });
        return;
      }
      _self.$confirm('请确认是否' + _comment + '该栏目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        columnSave({ catalogid: row.catalogid, status: _status }).then(_result => {
          if (_result.code === '0000' && _result.innercode === '0000') {
            _self.queryList();
            _self.$message({
              message: '栏目已' + _comment,
              type: 'success'
            });
          } else {
            _self.$message({
              message: '栏目' + _comment + '失败！',
              type: 'error'
            });
          }
        });
      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },

    userHandleSizeChange (size) {
      this.pageSize = size;
      console.log(this.pageSize);
      this.queryList();
    },
    userHandleCurrentChange (currentPage) {
      this.currentPage = currentPage;
      this.queryList();
    },
    userBindHandleSizeChange (size) {
      this.bindPageSize = size;
      this.queryBindList();
    },
    userBindHandleCurrentChange (currentPage) {
      this.bindCurrentPage = currentPage;
      this.queryBindList();
    },
    columnSubmit () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this;
          // if(_self.dialogForm.catalogtype===3&&(_self.dialogForm.cataloglink==""||_self.dialogForm.cataloglink==null)){
          if (_self.dialogForm.catalogtype === 3 && (!_self.dialogForm.tableArr || _self.dialogForm.tableArr.length < 3)) {
            _self.$message({
              message: '请在资源类型中选择具体的类型',
              type: 'warning'
            });
            return;
          }
          _self.dialogForm.tableid = _self.dialogForm.tableArr[0];
          _self.dialogForm.subtype = _self.dialogForm.tableArr[1];
          if (_self.dialogForm.catalogtype === 3) {
            _self.dialogForm.resourcetype = _self.dialogForm.tableArr[2];
          }
          columnSave(_self.dialogForm).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              _self.dialogShow = false;
              _self.dialogForm = {};
              _self.queryList();
              _self.$message({
                message: _self.dialogType === 'add' || _self.dialogType === 'addTop'
                  ? '添加栏目成功！' : '修改栏目成功！',
                type: 'success'
              });
            } else {
              _self.$message({
                message: _self.dialogType === 'add' || _self.dialogType === 'addTop'
                  ? '添加栏目失败！' : '修改栏目失败！',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    bindResSubmit() {
      const _self = this;
      if (_self.newBindData.length > 0) {
        _self.bindSaveData();
      }
      _self.bindCatalog.catalogResourceVos = _self.bindIds.map(a => {
        return { catalogid: _self.bindCatalog.catalogid, resourceid: a, tableid: _self.bindCatalog.tableid };
      });
      columnSave(_self.bindCatalog).then(_result => {
        if (_result.code === '0000' && _result.innercode === '0000') {
          _self.bindDialogShow = false;
          _self.bindCatalog = {};
          _self.queryList();
          _self.$message({
            message: '绑定资源成功！',
            type: 'success'
          });
        } else {
          _self.$message({
            message: '绑定资源失败！',
            type: 'error'
          });
        }
      });
    },
    queryList(_currentPage) {
      const _self = this;
      _self.loading = true;
      const _query = {};
      if (_self.query.catalogname) {
        _query.catalogname = _self.query.catalogname;
      }
      if (_self.query.catalogtype) {
        _query.catalogtype = _self.query.catalogtype;
      }
      if (_self.query.status) {
        _query.status = _self.query.status;
      }
      if (_self.query.tableid) {
        _query.tableid = _self.query.tableid;
      }
      if (_self.query.pageid) {
        _query.pageid = _self.query.pageid;
      }
      if (_self.query.subtype) {
        _query.subtype = _self.query.subtype;
      }
      if (!_currentPage) {
        _currentPage = _self.currentPage;
      } else {
        _self.currentPage = _currentPage;
      }
      columnList(_query, _currentPage, _self.pageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.pageTotal = _message.total;
          _self.table = _message.list;
          _self.table.forEach(a => {
            if (a.tableid != null && a.subtype != null) {
              if (a.resourcetype != null) {
                a.tableArr = [a.tableid, a.subtype, a.resourcetype];
              } else {
                a.tableArr = [a.tableid, a.subtype];
              }
            }
          })
        }
      }).finally(() => _self.loading = false);
    },
    // 资源类型下拉
    typeList() {
      const _self = this;
      resTypeList({}, 0, 0).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.resources = _message.list;
          _resource = _message.list;
        }
      });
    },
    queryBindList(_currentPage) {
      const _self = this;
      _self.bindLoading = true;
      const _query = {};
      if (_self.bindQuery.resourcetitle) {
        _query.resourcetitle = _self.bindQuery.resourcetitle;
      }
      if (_self.bindQuery.resourcetype) {
        _query.resourtypename = _self.bindQuery.resourcetype;
      }
      if (_self.bindSubType) {
        _query.subtype = _self.bindSubType;
      }
      if (!_currentPage) {
        _currentPage = _self.bindCurrentPage;
      }
      _self.bindFunc(_query, _currentPage, _self.bindPageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          if (_self.newBindData.length > 0) {
            _self.bindSaveData();
          }
          const _message = _resultData.message;
          _self.bindPageTotal = _message.total;
          _self.tableBind = _message.list;
          _self.$nextTick(() => {
            _self.tableBind.forEach(row => {
              if (_self.bindIds.findIndex(value => {
                return value === row.resourceid;
              }) > -1) {
                _self.$refs.dataTable.toggleRowSelection(row, true);
              }
            })
          });
        }
      }).finally(() => _self.bindLoading = false);
    },

    // 上传图片前处理图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    bindSaveData() {
      const _self = this;
      _self.bindIds = Array.from(new Set(_self.bindIds.filter(a => {
        return _self.newBindData.filter(b => !b.flag).findIndex(b => {
          return a === b.id;
        }) <= -1
      }).concat(_self.newBindData.filter(b => b.flag).map(b => b.id))));
      _self.newBindData = [];
      console.log('bindIds, ' + _self.bindIds);
    },
    bindRes(row) {
      debugger
      if (row.tableid == null || row.subtype == null) {
        this.$message.error('异常的栏目数据，无法绑定资源，请完善资源类型。');
        return;
      }
      const _self = this;
      _self.bindQuery = {
        resourcetitle: '',
        resourcetype: ''
      };
      _self.bindSubType = null;
      _self.tableBind = [];
      _self.bindCurrentPage = 1;
      _self.bindPageTotal = 0;
      _self.bindCatalog = row;
      _self.newBindData = [];
      const cc = _self.selectOptions.subTypeOption[row.tableid - 1];
      _self.showResources = _self.resources.filter(a => {
        if (row.subtype === 0) {
          return cc.children.findIndex((b, i) => i !== 0 && b.label === a.upResourceTypeName) > -1;
        } else {
          _self.bindSubType = row.subtype;
          return cc.children[row.subtype].label === a.upResourceTypeName;
        }
      });
      if (row.tableid === 1) {
        _self.bindFunc = activityList;
      } else if (row.tableid === 2) {
        _self.bindFunc = stadiumList;
      } else if (row.tableid === 3) {
        _self.bindFunc = infoList;
      } else {
        return;
      }
      _self.bindDialogForm = JSON.parse(JSON.stringify(row));
      if (row.tableid === 1) {
        _self.bindIds = row.catalogResourceVos.map(a => a.resourceActivityVo.resourceid);
      } else if (row.tableid === 2) {
        _self.bindIds = row.catalogResourceVos.map(a => a.resourceSiteVo.resourceid);
      } else if (row.tableid === 3) {
        _self.bindIds = row.catalogResourceVos.map(a => a.resourceNewsVo.resourceid);
      } else {
        return;
      }

      // _self.bindIds = [];
      _self.queryBindList(1);
      _self.bindDialogShow = true;
    },
    // 图片上传
    uploadImage(image) {
      const _self = this;
      const params = new FormData()
      params.append('file', image.file)
      addFile(params).then(_result => {
        if (_result.code === '0000' && _result.innercode === '0000') {
          _self.$message.success('上传成功');
          this.$set(_self.dialogForm, 'catalogimage', _result.message);
        } else {
          _self.$message('上传失败,请重新上传')
        }
      })
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
