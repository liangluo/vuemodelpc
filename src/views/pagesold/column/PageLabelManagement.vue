<template>
  <div>
    <!-- <el-card>
      标签管理
    </el-card>
    <br/> -->
    <!--查询条件-->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="标签词">
          <el-input placeholder="标签词" v-model="query.labelword" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryList(1)">查询</el-button>
          <el-button icon="el-icon-delete" @click="clear()">清空</el-button>
          <el-button type="primary" @click="labelAdd()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!--标签列表-->
    <el-card shadow="hover">
      <el-button type="primary" icon="el-icon-delete" @click="batchDelete()" :disabled="selectList.length <= 0"
                 style="margin-bottom: 20px;">批量删除</el-button>
      <el-table :data="table" style="width: 100%" @selection-change="changeFun" v-loading="loading">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.labelid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.labelword }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.labeldesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updatetime | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)" >删除</el-button>
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

    <!--添加标签-->
    <el-dialog :title="title" :visible.sync="dialogShow" @close="formClose()" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <el-form :model="dialogForm" :rules="dialogRules" :inline="true" ref="dialogForm">
        <el-form-item label="标签词" label-width="120px" prop="labelword">
          <el-input v-model="dialogForm.labelword" auto-complete="off"
                    style="width:365px" placeholder="标签词"/>
        </el-form-item>
        <el-form-item label="标签描述" label-width="120px" prop="labeldesc">
          <el-input  placeholder="" v-model="dialogForm.labeldesc" resize="none"
                     style="width:365px" type="textarea" rows="3" maxlength="1000" class="handle-input-800"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formClose()">取 消</el-button>
        <el-button type="primary" @click="labelSubmit()">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { labelSave, labelList, labelDeleteBatch } from '@/api/label'
  export default {
    name: 'PageLabelManagement',
    data () {
      return {
        selectOptions: {
        },
        query: {
          labelword: '',
        },
        selectList: [],
        title: '',
        table: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        total: 0,
        loading: false,
        dialogShow: false,
        dialogType: '',
        dialogForm: {},
        //必填项
        dialogRules: {
          labelword: [{required: true, message: '请输入标签词', trigger: 'blur'}],
        }

      }
    },
    created: function() {
      this.queryList(1);
    },
    methods:{
      changeFun(val){
        this.selectList = val;
      },
      labelAdd() {
        this.title = '标签添加';
        this.dialogType = 'add';
        this.dialogForm = {status: 2};
        this.dialogShow = true;
      },
      handleUpdate(row) {
        this.title = '标签修改';
        this.dialogType = 'update';
        this.dialogForm = JSON.parse(JSON.stringify(row));
        this.dialogShow = true;

      },

      batchDelete() {
        const _self = this;
        _self.$confirm('已绑定资源，是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _flag = false;
          if (_self.table.length === _self.selectList.length) {
            _flag = true;
          }
          labelDeleteBatch(_self.selectList.map(a => a.labelid)).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              if (_flag && _self.currentPage !== 1) {
                _self.currentPage--;
              }
              _self.queryList();
              _self.$message({
                message:'删除标签成功！',
                type: 'success'
              });
            } else {
              _self.$message({
                message: '删除标签失败！',
                type: 'error'
              });
            }
          });
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleDelete(row) {
        const _self = this;
        let _flag = false;
        if (_self.table.length === 1) {
          _flag = true;
        }
        _self.$confirm('已绑定资源，是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          labelDeleteBatch([row.labelid]).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              if (_flag && _self.currentPage !== 1) {
                _self.currentPage--;
              }
              _self.queryList();
              _self.$message({
                message:'删除标签成功！',
                type: 'success'
              });
            } else {
              _self.$message({
                message: '删除标签失败！',
                type: 'error'
              });
            }
          });
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //关闭表单时，重置校验
      formClose(){
        this.dialogShow = false
        this.$refs.dialogForm.resetFields();
        this.$refs.dialogForm.clearValidate();
      },
      //清空
      clear(){
        this.query.labelword="";
      },
      userHandleSizeChange (size) {
        this.pageSize = size;
        this.queryList();
      },
      userHandleCurrentChange (currentPage) {
        this.currentPage = currentPage;
        this.queryList();
      },
      labelSubmit () {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) { // validate success
            const _self = this;
            console.log(_self.dialogForm)
            labelSave(_self.dialogForm).then(_result => {
              if (_result.code === '0000' && _result.innercode === '0000') {
                _self.dialogShow = false;
                _self.dialogForm = {};
                _self.queryList();
                _self.$message({
                  message: _self.dialogType === 'add' ? '添加标签成功！' : '修改标签成功！',
                  type: 'success'
                });
              } else {
                _self.$message({
                  message: _self.dialogType === 'add' ? '添加标签失败！' : '修改标签失败！',
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
        _self.loading=true;
        const _query = {};
        if (!!_self.query.labelword) {
          _query['labelword'] = _self.query.labelword;
        }
        if (!_currentPage) {
          _currentPage = _self.currentPage;
        }else{
          _self.currentPage = _currentPage;
        }
        labelList(_query, _currentPage, _self.pageSize).then(_resultData => {
          if (_resultData.code === '0000' && _resultData.innercode === '0000') {
            const _message = _resultData.message;
            _self.total = _message.total;
            _self.table = _message.list;
            _self.pageTotal = _message.total;
          }
        }).finally(() => _self.loading = false);
      },
    }
  }
</script>
