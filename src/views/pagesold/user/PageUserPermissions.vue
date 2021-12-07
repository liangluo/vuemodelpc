<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  查询条件 -->
    <el-card shadow="hover">
        <el-button type="primary" @click="addHander" icon="el-icon-plus" style="margin:20px 0;">新增</el-button>
    </el-card>
    <!-- 列表 -->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-tag class="my-role-permission" v-for="_permission in props.row.menus" :key="_permission.menuName">
                  {{_permission.marker}}
              </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.role.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可访问占比" >
          <template slot-scope="scope">
             <span>{{ scope.row.menus.length }} / {{menuList.length}}</span>
          </template>
        </el-table-column>
         <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
             <span>{{ scope.row.role.creatTime | formatDBDateToDate}}</span>
          </template>
        </el-table-column>
         <el-table-column label="备注" :show-overflow-tooltip="true">
          <template slot-scope="scope">
             <span>{{ scope.row.role.marker}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="updateHander(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteHander(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog :title="dialogType=='add'?'新增角色':'修改角色'" :visible.sync="dialogShow" @close="formClose" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <div class="el-dialog-div">
      <el-form :model="dialogForm" ref="dialogForm" :rules="dialogRules">
        <el-form-item label="名称：" label-width="100px" prop="roleName">
          <el-input v-model="dialogForm.roleName" autocomplete="off" placeholder="名称" class="input-middle"></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="100px" prop="marker">
          <el-input v-model="dialogForm.marker"  placeholder="备注" class="input-middle"></el-input>
        </el-form-item>
        <el-form-item label="可访问功能：" label-width="100px" prop="menuIdSet">
           <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllHander">全选</el-checkbox>
           <el-checkbox-group v-model="dialogForm.menuIdSet" @change="checkChangeHander">
              <el-checkbox v-for="item in menuList"  :key="item.id" :label="item.id"  :value="item.id">{{item.marker}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="formClose">取 消</el-button>
        <el-button type="primary" @click="submitHander">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { requestPermissionList, requestPermissionDel, requestMenuList, requestPermissionAdd, requestPermissionEdit} from '@/api/user'

export default {
  name: 'PageStadiumManagement',
  data() {
    return { 
      currentPage:1,  //当前页
      pageSize:10,    //条数
      pageTotal:0,    //数据总数量
      loading:false,  //列表加载中
      table: [],      //表格列表

      dialogForm: {}, //弹出框内容
      dialogShow: false, // 显示弹出框
      dialogType: 'add', //弹出框类型
      dialogRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        menuIdSet: [{ required: true, message: '请给角色添加权限', trigger: 'blur' }]
      },
      
      menuList: [], // 所有菜单
      checkAll: false, // 全选
      isIndeterminate: true, // 是否启用状态
      
    };
  },
  mounted() {
    this.getList();
    this.getMenuList();
  },
  methods: {
    // 菜单列表
    getMenuList() {
      const _self = this;
      requestMenuList({},0,0).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.menuList = res.message.list;
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 角色列表
    getList() {
      const _self = this;
      _self.loading = true;
      requestPermissionList(_self.query, _self.currentPage, _self.pageSize).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.table = res.message.list;
          _self.pageTotal = res.message.total;
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => _self.loading = false);
    },
    // 提交数据
    submitData(){
      const _self = this;
      if (_self.dialogType === 'add') {
        requestPermissionAdd(_self.dialogForm).then(res => {
          if (res.code === '0000' && res.innercode === '0000') {
            _self.$message({
              message: '添加角色成功！',
              type: 'success'
            });
            _self.dialogShow = false;
            _self.getList();
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        requestPermissionEdit(_self.dialogForm).then(res => {
          if (res.code === '0000' && res.innercode === '0000') {
            _self.$message({
              message: '修改角色成功！',
              type: 'success'
            });
            _self.dialogShow = false;
            _self.getList();
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
     //删除数据
    deleteData(data){
      const _self = this;
       requestPermissionDel(data).then(res => {
          if (res.code === '0000' && res.innercode === '0000') {
            _self.$message({
              message: '删除角色成功！',
              type: 'success'
            });
            _self.getList();
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 新增
    addHander () {
      const _self = this;
      _self.dialogType = 'add';
      _self.dialogForm = {status: 1,menuIdSet:[]};
      _self.dialogShow = true
    },
     //修改
    updateHander (index, row) {
      const _self = this;
      _self.dialogType = 'update';
      _self.$set(_self.dialogForm, "id", row.role.id);
      _self.$set(_self.dialogForm, "roleName", row.role.roleName);
      _self.$set(_self.dialogForm, "marker", row.role.marker);
      _self.$set(_self.dialogForm, "menuIdSet", []);
      if (row.menus) {
        row.menus.forEach((el, index) => {
          _self.dialogForm.menuIdSet.push(el.id);
        })
      }
      _self.dialogShow = true;
    },
    // 数据验证
    submitHander () {
      const _self = this;
      _self.$refs.dialogForm.validate((valid) => {
        if (valid) { 
          _self.submitData();
        } else {
          return false;
        }
      });
    },
     //删除
    deleteHander(index, row) {
      const _self = this;
      _self.$confirm('您确认要删除"' + row.role.roleName + '"角色？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.role.id
        }
        _self.deleteData(data);
      })
    },
     // 处理多选框
    checkAllHander(val) {
      const _self = this;
      _self.dialogForm.menuIdSet = [];
      if (val) {
        _self.menuList.forEach(el => {
          _self.dialogForm.menuIdSet.push(el.id);
        });
      } else {
        _self.dialogForm.menuIdSet = [];
      }
      _self.isIndeterminate = false;
    },
    //选择权限
    checkChangeHander(value) {
      const _self = this;
      const checkedCount = value.length;
      _self.checkAll = checkedCount === _self.menuList.length;
      _self.isIndeterminate = checkedCount > 0 && checkedCount < _self.menuList.length;
    },
     //关闭表单，重置表单，
    formClose(){
      const _self = this;
      _self.dialogShow = false;
      _self.dialogForm.menuIdSet = [];
      _self.$refs.dialogForm.resetFields();
      _self.$refs.dialogForm.clearValidate();
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
};
</script>

<style scoped lang="scss">
.my-role-permission {
  margin: 5px 5px 0 0;
  height: auto;
  white-space: normal;
}

.my-db-instruction {
  margin-top: 20px;
  display: block;
  height: auto;

  ol {
    margin-left: 20px;
  }
}
/deep/ .el-checkbox{
  margin:0;
  width: 156px;
  line-height: 30px;
}
</style>
