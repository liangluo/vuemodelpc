<template>
  <div>
    <!-- <el-card>
      资源类型管理
    </el-card>
    <br/> -->
    <!--查询条件-->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="上级资源名称">
          <el-select placeholder="请选择" v-model="query.upResourceTypeName" filterable clearable>
            <el-option v-for="_type in upresourcetype" :key="_type" :label="_type" :value="_type"/>
          </el-select>

        </el-form-item>
        <el-form-item label="资源类型名称">
          <el-input placeholder="资源类型名称" v-model="query.resourtypename" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择" v-model="query.status" filterable clearable>
            <el-option v-for="_status in selectOptions.statusOption" :key="_status.id"
                       :label="_status.label" :value="_status.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryList(1)">查询</el-button>
          <el-button icon="el-icon-delete" @click="clear()">清空</el-button>
          <!--<el-button type="primary" @click="resourceTypeAdd()" icon="el-icon-plus">新增</el-button>-->
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!--资源类型列表-->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading" >
        <!-- <el-table-column label="资源类型ID">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetypeid }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="资源类型名称">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="上级资源类型ID">
          <template slot-scope="scope">
            <span>{{ scope.row.upresourcetypeid }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="上级资源类型名称">
          <template slot-scope="scope">
            <span>{{ scope.row.upResourceTypeName || '/'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ selectOptions.status2Option[scope.row.status - 1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime | formatDBDateToDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updatetime | formatDBDateToDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini" type="success" @click="handleUp(scope.row)"
                       v-if="scope.row.status === 2 && scope.row.upresourcetypeid">恢复</el-button>
            <el-button size="mini" type="danger" @click="handleDown(scope.row)"
                       v-if="scope.row.status === 1 && scope.row.upresourcetypeid">禁用</el-button>
            <el-button size="mini" type="primary" @click="resourceTypeAdd(scope.row)" v-if="!scope.row.upresourcetypeid">添加</el-button>
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
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加资源类型-->
    <el-dialog :title="title" :visible.sync="dialogShow"  @close="formClose()" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <div class="el-dialog-div">
      <el-form :model="dialogForm" :rules="dialogRules" :inline="true" ref="dialogForm">
        <el-form-item label="上级资源类型" label-width="140px" prop="upresourcetypeName" v-show="dialogType==='add'">
          <el-input v-model="dialogForm.upresourcetypeName" disabled style="width:365px"/>
        </el-form-item>
        <el-form-item label="资源类型名称" label-width="140px" prop="resourtypename">
          <el-input v-model="dialogForm.resourtypename" auto-complete="off" style="width:365px" placeholder="资源类型名称"/>
        </el-form-item>
        <el-form-item label="状态" label-width="140px" prop="status">
          <el-select v-model="dialogForm.status" placeholder="请选择" filterable>
            <el-option v-for="_status in selectOptions.statusOption" :key="_status.id"
                       :label="_status.label" :value="_status.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="formClose()">取 消</el-button>
        <el-button type="primary" @click="resourceTypeSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resTypeSave, resTypeList } from '@/api/resource'

export default {
  name: 'PageResourceType',
  data () {
    return {
      selectOptions: {
        statusOption: [{ id: 1, label: '正常' }, { id: 2, label: '禁用' }],
        status2Option: ['正常', '禁用']
      },
      query: {},
      title: '',
      table: [],
      upresourcetype: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      total: 0,
      loading: false,
      dialogShow: false,
      dialogType: '',
      dialogForm: {
        upresourcetypeid: '',
        resourtypename: '',
        resourcetypeid: '',
        upresourcetypeName: '',
        status: ''
      },
      // 必填项
      dialogRules: {
        resourtypename: [{ required: true, message: '请输入资源类型名称', trigger: 'blur' }]
      }
    }
  },
  created: function() {
    this.queryList(1);
    this.typeList();
  },
  methods: {
    resourceTypeAdd(resTop) {
      const _self = this;
      _self.title = '资源类型添加';
      _self.dialogForm = { status: 2 };
      // 添加有上级资源的
      if (resTop) {
        _self.dialogType = 'add';
        _self.dialogForm.upresourcetypeid = resTop.resourcetypeid;
        _self.dialogForm.upresourcetypeName = resTop.resourtypename;
      } else {
        _self.dialogType = 'addTop';
      }
      this.dialogShow = true;
    },
    handleUpdate (row) {
      this.title = '资源类型修改';
      this.dialogType = 'update';
      this.dialogForm = JSON.parse(JSON.stringify(row));
      if (!this.dialogForm.status) {
        this.dialogForm.status = 2;
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
      this.query.upResourceTypeName = '';
      this.query.resourtypename = '';
      this.query.status = '';
    },
    // 下线
    handleDown(row) {
      this.handleDelete(row, 1);
    },
    // 上线
    handleUp(row) {
      this.handleDelete(row, 0);
    },
    handleDelete(row, isUp) {
      const _self = this;
      const _comment = !isUp ? '恢复' : '禁用';
      const _status = !isUp ? 1 : 2;
      if (row.status === _status) {
        _self.$message({
          message: '操作失败, 该类型已经' + _comment,
          type: 'error'
        });
        return;
      }
      _self.$confirm('请确认是否' + _comment + '该类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resTypeSave({ resourcetypeid: row.resourcetypeid, status: _status }).then(_result => {
          if (_result.code === '0000' && _result.innercode === '0000') {
            _self.queryList();
            _self.$message({
              message: '类型已' + _comment,
              type: 'success'
            });
          } else {
            _self.$message({
              message: '类型' + _comment + '失败！',
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
      this.queryList();
    },
    userHandleCurrentChange (currentPage) {
      this.currentPage = currentPage;
      this.queryList();
    },
    resourceTypeSubmit () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this;
          resTypeSave(_self.dialogForm).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              _self.dialogShow = false;
              _self.dialogForm = {};
              _self.queryList();
              _self.$message({
                message: _self.dialogType === 'add' || _self.dialogType === 'addTop'
                  ? '添加类型成功！' : '修改类型成功！',
                type: 'success'
              });
            } else {
              _self.$message({
                message: _self.dialogType === 'add' || _self.dialogType === 'addTop'
                  ? '添加类型失败！' : '修改类型失败！',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    queryList(_currentPage) {
      const _self = this;
      _self.loading = true;
      const _query = {};
      if (_self.query.upResourceTypeName) {
        _query.upResourceTypeName = _self.query.upResourceTypeName;
      }
      if (_self.query.resourtypename) {
        _query.resourtypename = _self.query.resourtypename;
      }
      if (_self.query.status) {
        _query.status = _self.query.status;
      }
      if (!_currentPage) {
        _currentPage = _self.currentPage;
      } else {
        _self.currentPage = _currentPage;
      }
      resTypeList(_query, _currentPage, _self.pageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.table = _message.list;
          _self.total = _message.total;
          _self.pageTotal = _message.total;
        }
      }).finally(() => _self.loading = false);
    },
    // 上级资源类型下拉
    typeList() {
      const _self = this;
      const _query = {};
      resTypeList(_query, 1, 50).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          for (var i = 0; i < _message.list.length; i++) {
            if (_message.list[i].upResourceTypeName === null) {
              const newOut = _message.list[i].resourtypename;

              _self.upresourcetype.push(newOut);
            }
          }
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">

</style>
