<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>操作记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="操作日期：">
          <el-date-picker
            v-model="query.querytime"
            value-format="yyyyMMddHHmmss"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryList(1)">查询</el-button>
          <el-button icon="el-icon-delete" @click="clearQueryParams">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!-- Roles *** Table -->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="ID" width="80" >
          <template slot-scope="scope">
             <span>{{ scope.row.operlogId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作描述" >
          <template slot-scope="scope">
             <span>{{ scope.row.operatedesc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作表" >
          <template slot-scope="scope">
             <span>{{ scope.row.operTable}}</span>
          </template>
        </el-table-column>
         <el-table-column label="操作时间" width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
             <span>{{ scope.row.createTime | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="roleHandleSizeChange"
        @current-change="roleHandleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"/>
    </el-card>
</div>
</template>

<script>
import { requestHandler } from '@/api/user'

export default {
  name: 'PageHandlerManagement',
  data() {
    return {
      query: {
        querytime: ''
      },
      typeOption: [{ id: 1, name: '新增' }, { id: 2, name: '修改' }, { id: 3, name: '删除' }, { id: 4, name: '审核' }],
      table: [], // 列表数据
      loading: false,
      currentPage: 1, // 页码
      pageSize: 10, // 页个数
      pageTotal: 0 // 总个数
    };
  },
  mounted() {
    this.queryList(1);
  },
  methods: {
    // 查询
    queryList(_currentPage) {
      const _self = this;
      _self.loading = true;
      const _query = {};
      if (_self.query.querytime) {
        _query.startTime = _self.query.querytime[0];
        _query.endTime = _self.query.querytime[1];
      }
      if (!_currentPage) {
        _currentPage = _self.currentPage;
      } else {
        _self.currentPage = _currentPage;
      }
      requestHandler(_query, _currentPage, _self.pageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.pageTotal = _message.total;
          _self.table = _message.records;
        }
      }).finally(() => _self.loading = false);
    },
    // page切换
    roleHandleSizeChange(size) {
      this.pageSize = size;
      this.queryList();
    },
    roleHandleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryList();
    },
    clearQueryParams() {
      this.query = {
        querytime: ''
      };
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
</style>
