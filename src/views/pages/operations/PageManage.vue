<template>
  <!-- 页面管理 -->
  <div>
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="页面ID">
          <el-input
            placeholder="页面ID"
            v-model="query.resourcetitle"
            clearable
          />
        </el-form-item>
        <el-form-item label="页面名称">
          <el-input
            placeholder="请选择"
            v-model="query.resourcetitle"
            clearable
          />
        </el-form-item>
        <el-form-item label="页面类型">
          <el-select
            placeholder="请选择"
            v-model="query.status"
            filterable
            clearable
          >
            <el-option
              v-for="_status in selectOptions.statusOption"
              :key="_status.id"
              :label="_status.label"
              :value="_status.id"
            />
          </el-select>
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
        <el-table-column label="ID" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="页面名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属单位"
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
        <el-table-column label="页面类型">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="650">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              @click="handleDetail(scope.row)"
              >查看</el-button
            > -->
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-if="
                scope.row.status === 1 ||
                scope.row.status === 3 ||
                scope.row.status === 4
              "
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="bindwindow(true, scope.row)"
              >绑定栏目
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="deleteDetail(scope.row)"
              >删除
            </el-button>
            <el-button
              size="mini"
              type="danger"
              v-clipboard:copy="message"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              >复制连接
            </el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="sendData(scope.row)"
              v-if="scope.row.status === 1"
              >{{ scope.row.publishflag == 1 ? "取消推送" : "推送资讯" }}
            </el-button> -->
            <!-- <el-button size="mini" type="danger" @click="handleUp(scope.row)"
              >上线
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDown(scope.row)"
              v-if="scope.row.status === 1"
              >下线
            </el-button> -->
            <!-- <el-button size="mini" type="danger" @click="createPull(scope.row)"
              >拉取</el-button
            > -->
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleTop(scope.row)"
              v-if="scope.row.status === 1 && scope.$index !== 0"
              >置顶
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
            </el-button> -->
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
    <!-- 新增页面 -->
    <Newpagedalog
      ref="newpagedalog"
      :dialogShow="dialogShow"
      :dialogType="dialogType"
      :selectOptions="selectOptions"
      :labels="labels"
      :resources="resources"
      :editunitarr="editunitarr"
      @formClose="formClose"
      @infoSubmit="infoSubmit"
      @uploadImage="uploadImage"
      @uploadImage1="uploadImage1"
      @uploadVideo="uploadVideo"
    ></Newpagedalog>
    <!-- 绑定自己栏目 -->
    <Pagecomanagdalog
      ref="pagecomanagdalog"
      :dialogShows="dialogShows"
      @formClose="bindwindow"
      :selectOptions="selectOptions"
      :labels="labels"
      :resources="resources"
      :editunitarr="editunitarr"
      @infoSubmit="infoSubmit"
      @uploadImage="uploadImage"
      @uploadImage1="uploadImage1"
      @uploadVideo="uploadVideo"
      @setbindcolumnsdalog="setbindcolumnsdalog"
    ></Pagecomanagdalog>
    <!-- 去公共栏目拉去栏目 -->
    <Bindcolumnsdalog
      ref="bindcolumnsdalog"
      :dialogShow="bindcolumnsdalogs"
      :dialogType="dialogType"
      :selectOptions="selectOptions"
      :labels="labels"
      :resources="resources"
      :editunitarr="editunitarr"
      @formClose="setbindcolumnsdalog"
      @infoSubmit="infoSubmit"
      @uploadImage="uploadImage"
      @uploadImage1="uploadImage1"
      @uploadVideo="uploadVideo"
    ></Bindcolumnsdalog>
  </div>
</template>
<script>
import contents from './contents'
import Newpagedalog from '../../../components/Newpagedalog.vue'
import Pagecomanagdalog from '../../../components/Pagecomanagdalog.vue'
import Bindcolumnsdalog from '../../../components/Bindcolumnsdalog.vue'
export default {
  name: "PageManage",
  components: {
    Newpagedalog,
    Pagecomanagdalog,
    Bindcolumnsdalog
  },
  data() {
    return {
      dialogShows: false,
      dialogType: '',
      dialogShow: false,
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
      resources: [],
      // 分页页数
      currentPage: 1,
      // 页面展示多少条数据
      pageSize: 10,
      // 数据总数
      pageTotal: 0,
      // 状态选择
      selectOptions: {
        statusOption: [
          { id: 1, label: '正常' }, { id: 2, label: '审核中' },
          { id: 3, label: '审核不通过' }, { id: 4, label: '下线' }
        ],
        status2Option: ['正常', '审核中', '审核不通过', '下线'],
        tab1Option: [],
        tab2Option: [],
        tab3Option: [],
        resources: {
          4: { label: '文化', list: [] },
          5: { label: '资讯', list: [] }
        }
      },
      // 归属单位
      editunitarr: [
        { editunitname: "汉寿县文化旅游广电体育局", editunit: 129 },
        { editunitname: "汉寿县文化馆", editunit: 672 },
        { editunitname: "汉寿县图书馆", editunit: 113 }
      ],
      // 标签
      labels: [],
      message: 'www.baidu.com',
      bindcolumnsdalogs: false
    };
  },
  created() {
  },
  mounted() {
    // 模拟数据层
    var data = contents.getunitcos().data.message.list
    this.pageTotal = contents.getunitcos().data.message.total
    this.table = data
    var list = contents.getunitcos().datas.message.list;
    var list2 = contents.getunitcos().datas.message.list2;
    this.selectOptions.resources[4].list = list
    this.selectOptions.resources[5].list = list2
    this.resources = [...this.resources, ...list];
    this.resources = [...this.resources, ...list2];
    this.labels = contents.getunitcos().label.message.list;
    this.labels.unshift({ labelid: 0, labelword: '无' });
    console.log("this.resources", this.resources)
    // 模拟数据层
  },
  methods: {
    // 请求接口
    queryList(_currentPage) {
    },
    // 打开绑定的弹框
    setbindcolumnsdalog(bool) {
      this.bindcolumnsdalogs = bool
    },
    // 清空
    clear() {
      this.query.resourcetitle = '';
      this.query.status = '';
      this.query.resourcetype = '';
      this.query.editunit = '';
    },
    onCopy(e) {
      console.log('You just copied: ' + e.text)
    },
    onError(e) {
      console.log('Failed to copy texts')
    },
    // 新增
    infoAdd() {
      this.dialogType = 'add';
      this.dialogShow = true;
      this.$refs.newpagedalog.setDialogForm({});
      this.$refs.newpagedalog.setdatafrom(this.$refs.newpagedalog.dialogForm, 'status', 4);
    },
    // 关闭弹出窗口
    formClose(bool) {
      this.dialogType = '';
      this.$refs.newpagedalog.setDialogForm({});
      this.dialogShow = bool;
    },
    // 关闭弹出窗口
    bindwindow(bool, item) {
      this.dialogShows = bool;
      if (bool) {
      }
    },
    // 拉取
    createPull(item) { },
    actManagerAdd() { },
    // 详情
    handleDetail(item) {
      this.dialogType = 'detail';
      this.$refs.newpagedalog.setDialogForm(JSON.parse(JSON.stringify(item)));
      this.dialogShow = true;
    },
    // 修改
    handleUpdate(item) {
      this.dialogType = 'update';
      this.dialogShow = true;
      this.$refs.newpagedalog.setDialogForm(JSON.parse(JSON.stringify(item)));
      this.$refs.newpagedalog.setdatafrom(this.$refs.newpagedalog.dialogForm, 'status', 4);
    },
    // 提交数据
    infoSubmit(dialogForm, dialogType, bool) {
      console.log('infoSubmit', dialogForm, dialogType, bool);
      const _self = this;
      if (bool) {
        _self.$message({
          message: _self.dialogType === 'add' ? '添加资讯成功！' : '修改资讯成功！',
          type: 'success'
        });
        this.formClose(false)
      } else {
        _self.$message({
          message: _self.dialogType === 'add' ? '添加资讯失败！' : '修改资讯失败！',
          type: 'error'
        });
      }
    },
    // 弹框图片上传回调用方法
    uploadImage(params) {
      const _self = this;
      // addFile(params).then(_result => {
      //   if (_result.code === '0000' && _result.innercode === '0000') {
      _self.$message.success('上传成功');
      this.$refs.newpagedalog.setdatafrom(this.$refs.newpagedalog.dialogForm, 'resourceimage', contents.getunitcos().imgdata.message);
      //   } else {
      //     _self.$message('上传失败,请重新上传')
      //   }
      // })
    },
    // 弹框资讯高清图片上传
    uploadImage1(params) {
      const _self = this;
      // addFile(params).then(_result => {
      //   if (_result.code === '0000' && _result.innercode === '0000') {
      _self.$message.success('上传成功');
      this.$refs.newpagedalog.setdatafrom(this.$refs.newpagedalog.dialogForm, 'resourceipicture', contents.getunitcos().imgdata.message);
      //   } else {
      //     _self.$message('上传失败,请重新上传')
      //   }
      // })
    },
    // 弹框资讯视频图片上传
    uploadVideo(params) {
      const _self = this;
      _self.$message.success('上传成功');
      this.$refs.newpagedalog.setdatafrom(this.$refs.newpagedalog.dialogForm, 'resourceviedo', contents.getunitcos().video.message);
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
      this.pageSize = size
      this.queryList();
    },
    // 单个页码按钮
    userHandleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryList();
    }
  }
};
</script>

<style lang="scss" scoped>
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
