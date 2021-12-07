<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>企业管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  查询条件 -->
     <el-card shadow="hover">
      <el-form :inline="true" :model="query" >
         <el-form-item label="企业：">
           <el-input v-model="query.entName" placeholder="请输入企业名称" clearable class="search-input"></el-input>
        </el-form-item>
        <el-form-item label="上级企业：">
          <el-input v-model="query.parentName" placeholder="请输入上级企业名称" clearable class="search-input"></el-input>
        </el-form-item>
       <el-form-item label="状态：">
          <el-select  placeholder="请选择"  v-model="query.status" filterable clearable>
            <el-option v-for="_status in selectOptions.statusOption"
                       :key="_status.id" :label="_status.label" :value="_status.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList(1)">查询</el-button>
          <el-button icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="ID" width="50" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.entId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称"  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.entName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上级企业" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{ scope.row.parentName==null?'最高级':scope.row.parentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.linkName }}</span>
          </template>
        </el-table-column>
         <el-table-column label="联系电话" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.linkMobile }}</span>
          </template>
        </el-table-column>
         <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
             <span>{{ scope.row.createTime | formatDBDateToDate}}</span>
          </template>
        </el-table-column>
         <el-table-column label="状态" :show-overflow-tooltip="true" width="80">
          <template slot-scope="scope">
             <span>{{ scope.row.status==1?'正常':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini" type="primary" @click="handleAddChind(scope.row)">添加子企业</el-button>
            <el-button size="mini" type="danger" @click="deleteHander(scope.row)">删除</el-button>
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
    <!-- 增删改组件 -->
    <addEnterprise :editform="editForm" :showDraw='showDraw' :rtype='rtype' :resources='resources' :labels="labels" @updatedraw="updateDraw" @updatelist='getList' @resetform="resetForm"></addEnterprise>
</div>
</template>

<script>
import { requestEntList, requestEntDel, requestChindEntList } from '@/api/user'
import addEnterprise from '@/components/addEnterprise.vue';

export default {
  name: 'PageEnterprise',
  data() {
    return {
      selectOptions: {
        statusOption: [{ id: 1, label: '正常' }, { id: 2, label: '禁用' }],
        status2Option: ['正常', '禁用']
      },
      query: {
        entName: null,
        parentName: null,
        status: null
      }, // 查询条件
      currentPage: 1, // 当前页
      pageSize: 10, // 条数
      pageTotal: 0, // 数据总数量
      loading: false, // 列表加载中
      table: [], // 表格列表

      rtype: '', // 增删改组件类型
      showDraw: false, // 是否显示增删改组件
      editForm: null, // 增删改组件id
      resources: [], // 资源类型列表
      labels: [] // 标签列表

    };
  },
  components: {
    addEnterprise
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    // 企业列表
    getList(_currentPage) {
      const _self = this;
      _self.loading = true;
      if (_currentPage) {
        _self.currentPage = _currentPage;
      }
      requestEntList(_self.query, _self.currentPage, _self.pageSize).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.table = res.message.records;
          _self.pageTotal = res.message.total;
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => _self.loading = false);
    },
    // 新增子企业
    handleAddChind(row) {
      const _self = this;
      _self.showDraw = true;
      _self.rtype = 'addchild';
      _self.editForm = JSON.parse(JSON.stringify(row));
    },
    // 新增
    handleAdd() {
      const _self = this;
      _self.showDraw = true;
      _self.rtype = 'add';
      _self.editForm = null;
    },
    // 修改增，改组件类型
    updateDraw(val) {
      const _self = this;
      _self.showDraw = val;
      _self.rtype = null;
    },
    // 详情
    handleDetail(row) {
      const _self = this;
      _self.showDraw = true;
      _self.rtype = 'detail';
      _self.editForm = JSON.parse(JSON.stringify(row)); ;
    },
    // 修改
    handleUpdate(row) {
      const _self = this;
      _self.showDraw = true;
      _self.rtype = 'update';
      _self.editForm = JSON.parse(JSON.stringify(row));
    },
    // 修改页码
    handleSizeChange (size) {
      const _self = this;
      _self.pageSize = size
      _self.getList();
    },
    // 修改当前页
    handleCurrentChange (currentPage) {
      const _self = this;
      _self.currentPage = currentPage
      _self.getList();
    },
    // 搜索条件清空
    resetForm() {
      const _self = this;
      _self.currentPage = 1;
      _self.query = {
        entName: null,
        parentName: null,
        status: null
      }
    },
    // 删除
    deleteHander(row) {
      const _self = this;
      _self.isDelete(row);
    },
    // 查询是否可删除
    isDelete(val) {
      const _self = this;
      const data = {
        parentId: val.entId
      } // 查询条件
      requestChindEntList(data).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          if (res.message.length > 0) {
            _self.$message({
              message: '该企业下存在子企业，无法删除',
              type: 'warning'
            });
          } else {
            _self.$confirm('您确认要删除企业："' + val.entName + '"？', '删除提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _self.deleteData(val);
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除数据
    deleteData(val) {
      const _self = this;
      const data = {
        id: val.entId
      }
      requestEntDel(data).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.$message({
            message: '删除企业成功！',
            type: 'success'
          });
          _self.getList(1);
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 关闭表单，重置表单
    formClose() {
      const _self = this;
      _self.dialogShow = false;
      _self.dialogForm.menuArr = [];
      _self.$refs.dialogForm.resetFields();
      _self.$refs.dialogForm.clearValidate();
    },
    // 关闭详情
    detialClose() {
      const _self = this;
      _self.dialogShowDetail = false;
      _self.dialogForm.menuArr = [];
    }
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
.roleMenuTag{
  margin:30px 0;
  line-height: 28px;
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: #409EFF;
  border-color: #409EFF;
}
/deep/ .el-checkbox__input.is-disabled.is-checked+span.el-checkbox__label{
  color: #409EFF;
}
</style>
