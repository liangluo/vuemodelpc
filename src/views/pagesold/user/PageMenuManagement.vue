<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="ID"  width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="页面" >
          <template slot-scope="scope">
            <span>{{ scope.row.marker }}</span>
          </template>
        </el-table-column>
        <el-table-column label="路径">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
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
  </div>
</template>

<script>
import { requestMenuList } from '@/api/user'
export default {
  name: 'PageStadiumManagement',
  data () {
    return {
      currentPage: 1, // 页码
      pageSize: 20, // 页个数
      pageTotal: 0, // 总个数
      loading: false,
      table: [], // 列表数据
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      const _self = this;
      _self.loading = true;
      requestMenuList(self.query, _self.currentPage, _self.pageSize).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.table = res.message.list;
          _self.pageTotal = res.message.total;
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => _self.loading = false)
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
<style>
</style>
