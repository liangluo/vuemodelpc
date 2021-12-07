<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  查询条件 -->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query" >
         <el-form-item label="登录名：">
           <el-input v-model="query.account" placeholder="请输入登录名" clearable class="search-input"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
           <el-input v-model="query.adminName" placeholder="请输入姓名" clearable class="search-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="addHander()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="ID"  width="60"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.adminId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="登录名"    :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="150"   :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.adminName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" width="150"   :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色权限" width="150"   :show-overflow-tooltip="true">
          <template slot-scope="scope">
             <span v-for="item in roleList" v-if="item.role.id == scope.row.roleId">{{ item.role.roleName}} </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150"   :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDBDateToDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="150"   :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | formatDBDateToDate}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200"  >
          <template slot-scope="scope">
            <el-button size="mini" @click="updateHander(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteHander(scope.$index, scope.row)"
                       v-if="scope.row.account!=='admin'&&!!currentUser&&currentUser.adminId!==scope.row.adminId">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleCurrentChange"
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

    <!-- 弹出框 -->
    <el-dialog :title="dialogType=='add'?'新增用户':'修改用户'" :visible.sync="dialogShow" class="dialog" @close="formClose" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <div class="el-dialog-div">
        <el-form :model="dialogForm" ref="dialogForm" :rules="dialogRules">
          <el-form-item label="姓名：" label-width="100px" prop="adminName" >
            <el-input v-model="dialogForm.adminName"  placeholder="姓名" class="input-middle"></el-input>
          </el-form-item>
          <el-form-item label="登录名：" label-width="100px" prop="account">
            <el-input v-model="dialogForm.account"  placeholder="登录名" :disabled="dialogType === 'update'" class="input-middle"></el-input>
          </el-form-item>
          <el-form-item label="密码：" label-width="100px" :prop="dialogType === 'add' ? 'password' : 'password2'">
            <el-input type="password" v-model="dialogForm.password" placeholder="密码" class="input-middle"></el-input>
          </el-form-item>
          <el-form-item label="手机：" label-width="100px" prop="mobile">
            <el-input v-model="dialogForm.mobile"  placeholder="手机" class="input-middle"></el-input>
          </el-form-item>
          <el-form-item label="角色权限：" label-width="100px" prop="adminType" v-if="roleQueryFlag">
            <el-select v-model="dialogForm.roleId" placeholder="请选择" filterable :disabled="dialogTypeFlag" class="input-middle">
              <el-option v-for="_role in roleList" :key="_role.role.id" :label="_role.role.roleName" :value="_role.role.id"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" v-if="dialogType === 'add' || dialogType === 'update'">
        <el-button @click="formClose">取 消</el-button>
        <el-button type="primary" @click="submitHander">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, userSave, userDelete, requestPermissionList } from '@/api/user'
import storage from '@/utils/storage'
export default {
  name: 'PageUserManagement',
  data () {
    return {
      query: {
        name: '',
        account: ''
      },              //查询条件
      currentPage:1,  //当前页
      pageSize:10,    //条数
      pageTotal:0,    //数据总数量
      loading:false,  //列表加载中
      table: [],      //表格列表

      dialogForm: {}, //弹出框内容
      dialogShow: false,  //是否显示弹出框
      dialogType: 'add',   //弹出框类型
      dialogTypeFlag:false, //弹出框是否可编辑
      dialogRules: {      //弹出框规则
        account: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        adminName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        adminType: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
        status: [{ required: true, message: '请选择用户状态', trigger: 'change' }],
      },

      roleList: [],  //角色权限列表
      roleQueryFlag: false,   //是否显示角色列表
      currentUser: storage.getStorage('user'),        //当前用户信息
    }
  },
  mounted: function() {
    this.getList();
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      const _self = this;
      requestPermissionList({},0,0).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.roleList = res.message.list;
          if (_self.roleList.length > 0) {
            _self.roleQueryFlag = true;
          }
        }
      }).catch(err => {
        console.log(err)
      });
    },
    // 获取用户列表
    getList() {
      const _self = this;
      _self.loading = true;
      userList(_self.query, _self.currentPage, _self.pageSize).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.pageTotal = res.message.total;
          _self.table = res.message.list;
          _self.table.forEach(a => {
            if (a.roleSet && a.roleSet.length>0) {
              a.roleId = a.roleSet[0].id;
            }
          })
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => _self.loading = false);
    },
    // 提交数据
    submitData(){
      const _self = this;
      userSave(_self.dialogForm).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.dialogShow = false;
          _self.dialogForm = {};
          if(_self.dialogType === 'add'){
            _self.currentPage = 1;
          }
          _self.getList();
          _self.$message({
            message: _self.dialogType === 'add' ? '添加用户成功！' : '修改用户成功！',
            type: 'success'
          });
        } else {
          _self.$message({
            message: _self.dialogType === 'add' ? '添加用户失败！' : '修改用户失败！',
            type: 'error'
          });
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //删除数据
    deleteData(adminId,account){
      const _self = this;
      userDelete(adminId, account).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.getList();
          _self.$message({
            message:'删除用户成功！',
            type: 'success'
          });
        } else {
          _self.$message({
            message: '删除用户失败！',
            type: 'error'
          });
        }
      }).catch(err => {
        console.log(err)
      });
    },
    // 搜索
    handleSearch() {
      const _self = this;
      _self.currentPage = 1;
      _self.getList();
    },
    // 新增
    addHander () {
      const _self = this;
      _self.dialogType = 'add';
      _self.dialogTypeFlag = false;
      _self.dialogForm = {status: 1,adminType: 1};
      _self.dialogShow = true
    },
    //修改
    updateHander (index, row) {
      const _self = this;
      _self.dialogType = 'update';
      _self.dialogTypeFlag = row.account === 'test';
      _self.dialogForm = JSON.parse(JSON.stringify(row));
      _self.dialogShow = true;
    },
    // 数据验证
    submitHander () {
      const _self = this;
      _self.$refs.dialogForm.validate((valid) => {
        if (valid) { 
          _self.dialogForm['roleSet'] = [_self.roleList.find(a => a.role.id === _self.dialogForm.roleId).role];
          _self.submitData();
        } else {
          return false;
        }
      });
    },
    //删除
    deleteHander(index, row) {
      const _self = this;
      _self.$confirm('请确认是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.deleteData(row.adminId,row.account);
      })
    },
    //关闭表单，重置表单，
    formClose(){
      const _self = this;
      _self.dialogShow = false
      _self.$refs.dialogForm.resetFields();
      _self.$refs.dialogForm.clearValidate();
    },
    //搜索条件清空
    resetForm() {
      const _self = this;
      _self.currentPage = 1;
      _self.query = {
        name: '',
        account: ''
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


