<template>
  <!-- 页面管理 -->
  <el-dialog
    :fullscreen="true"
    :title="'页面栏目管理'"
    v-if="dialogShows"
    :visible.sync="dialogShows"
    @close="formClose(false)"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :append-to-body="true"
    :destroy-on-close="true"
  >
    <el-card shadow="hover">
      <br />
      <el-form :inline="true" :model="query">
        <el-form-item label="页面ID">
          <el-input
            placeholder="页面ID"
            v-model="query.resourcetitle"
            clearable
          />
        </el-form-item>
        <el-form-item label="栏目名称">
          <el-input
            placeholder="请选择"
            v-model="query.resourcetitle"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属单位">
          <el-select
            placeholder="请选择"
            v-model="query.editunit"
            filterable
            clearable
          >
            <el-option
              v-for="_type in editunitarr"
              :key="_type.editunit"
              :label="_type.editunitname"
              :value="_type.editunit"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryList(1)"
            >查询</el-button
          >
          <el-button icon="el-icon-delete" @click="clear()">清空</el-button>
          <el-button type="primary" @click="infoAdd()" icon="el-icon-plus"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <br />
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="排序号" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="栏目ID" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="栏目名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="栏目类型"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.editunit == 129
                ? "汉寿县文化旅游广电体育局"
                : scope.row.editunit == 672
                ? "汉寿县文化馆"
                : scope.row.editunit == 113
                ? "汉寿县图书馆"
                : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属单位">
          <template slot-scope="scope">
            <span>{{
              scope.row.editunit == 129
                ? "汉寿县文化旅游广电体育局"
                : scope.row.editunit == 672
                ? "汉寿县文化馆"
                : scope.row.editunit == 113
                ? "汉寿县图书馆"
                : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="650">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="Unbind(scope.row)"
              >解除绑定
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="bindingcolumn(scope.row)"
              >绑定栏目
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="sortUp(scope.$index, scope.row)"
              v-if="scope.$index !== 0"
              >上移
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="sortDown(scope.$index, scope.row)"
              v-if="scope.$index !== table.length - 1"
              >下移
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="Moveto(scope.$index, scope.row)"
              v-if="scope.$index !== table.length - 1"
              >移动到
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <el-pagination
        @size-change="userHandleSizeChange"
        @current-change="userHandleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      >
      </el-pagination>
    </el-card>
    <br />
    <div slot="footer">
      <el-button @click="formClose(false)">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import contents from './contents'
export default {
  name: "Pagecomanagdalog",
  props: [
    'dialogShows',
    'dialogType',
    'selectOptions',
    'labels',
    'resources',
    'editunitarr'],
  data() {
    return {
      loading: false,
      // from 表单数据
      query: {
        resourcetitle: '',
        status: '',
        editunit: '',
        resourcetype: ''
      },
      // 表格数据
      table: [],
      // 资源类型名称
      // 分页页数
      currentPage: 1,
      // 页面展示多少条数据
      pageSize: 10,
      // 数据总数
      pageTotal: 0,
      message: 'www.baidu.com'
    };
  },
  created() {
    console.log('绑定了数据')
  },
  mounted() {
    // 模拟数据层
    var data = contents.getunitcos().data.message.list
    this.pageTotal = contents.getunitcos().data.message.total
    this.table = data
    console.log("this.resources", this.resources)
    // 模拟数据层
  },
  methods: {
    // 绑定了数据
    bindingcolumn() {
      this.$emit('setbindcolumnsdalog', true)
    },
    // 解除绑定
    Unbind() {

    },
    // 请求接口
    queryList(_currentPage) {
    },
    // 清空
    clear() {
      this.query.resourcetitle = '';
      this.query.status = '';
      this.query.resourcetype = '';
      this.query.editunit = '';
    },
    onCopy(e) {
    },
    onError(e) {
    },
    // 新增
    infoAdd() {
    },
    // 关闭弹出窗口
    formClose(bool) {
      this.$emit("formClose", false)
    },
    // 拉取
    createPull(item) { },
    actManagerAdd() { },
    // 详情
    handleDetail(item) {
    },
    // 修改
    handleUpdate(item) {
    },
    // 提交数据
    infoSubmit(dialogForm, dialogType, bool) {
    },
    // 弹框图片上传回调用方法
    uploadImage(params) {
    },
    // 弹框资讯高清图片上传
    uploadImage1(params) {
    },
    // 弹框资讯视频图片上传
    uploadVideo(params) {
    },
    // 推送资源
    sendData(item) {
      const _self = this;
      _self.$message.success('推送成功');
    },
    // 发布
    handleUp(item) {
      const _self = this;
      _self.$message.success('上线成功');
    },
    // 下线
    handleDown(item) {
      const _self = this;
      _self.$message.success('下线成功');
    },
    // 置顶
    handleTop(item) {
      const _self = this;
      _self.$message.success('置顶成功');
    },
    // 下移
    sortDown(index, item) {
      const _self = this;
      _self.$message.success('下移成功');
    },
    // 上移
    sortUp(index, item) {
      const _self = this;
      _self.$message.success('上移成功');
    },
    // 页码
    userHandleSizeChange(size) {
    },
    // 单个页码按钮
    userHandleCurrentChange(currentPage) {
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  max-width: 100% !important;
}
/deep/ .ql-editor {
  min-height: 600px;
}
/deep/ .el-form {
  padding-top: 0px !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 177px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #c0c4cc;
}
.avatar {
  width: 177px;
  height: 100px;
  display: block;
}
.avatarImg {
  width: 177px;
  height: 100px;
  position: relative;
}
.closeImg {
  position: absolute;
  right: -10px;
  top: -10px;
  width: 30px;
  height: 30px;
  text-align: center;
  font-size: 28px;
  color: #8c939d;
  z-index: 2;
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.fscolor {
  width: 200px;
  margin-left: 30px;
}
.elformitems {
}
/deep/ .elformitems .el-form-item__content {
  display: flex;
  flex-direction: flex;
}
/deep/ .el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0 !important;
  box-sizing: border-box;
}
/deep/.el-card__body {
  padding: 0 20px 20px 20px;
}
</style>
