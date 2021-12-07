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
        <el-form-item label="栏目名称">
          <el-input
            placeholder="请选择"
            v-model="query.resourcetitle"
            clearable
          />
        </el-form-item>
        <el-form-item label="栏目类型">
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
          <!-- <el-button type="primary" @click="infoAdd()" icon="el-icon-plus"
            >新增</el-button
          > -->
          <el-dropdown class="letdropdown" @command="handleClick">
            <el-button type="primary"> 新增 </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
              <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
              <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
              <el-dropdown-item command="双皮奶">双皮奶</el-dropdown-item>
              <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <br />
      <el-button type="primary" @click="opendalog(1)"> 新增图片栏目 </el-button>
      <el-button type="primary" @click="opendalog(2)">
        新增金刚区栏目
      </el-button>
      <el-button type="primary" @click="opendalog(3)">
        新增图文资讯栏目
      </el-button>
      <el-button type="primary" @click="opendalog(4)">
        新增视频资讯栏目
      </el-button>
      <el-button type="primary" @click="opendalog(5)"> 新增活动栏目 </el-button>
      <el-button type="primary" @click="opendalog(6)"> 新增地点栏目 </el-button>
      <el-button type="primary" @click="opendalog(7)"> 新增公告栏目 </el-button>
    </el-card>
    <br />
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="栏目ID" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="栏目ID" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="栏目类型">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
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
        <el-table-column label="操作" width="650">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-if="
                scope.row.status === 1 ||
                scope.row.status === 3 ||
                scope.row.status === 4
              "
              >修改
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="deleteDetail(scope.row)"
              >删除
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
    <NewPictureColumn
      ref="newpicturecolumn"
      :dialogShow="dialogShows === 1 ? true : false"
      @formClose="NewpictureformClose"
    ></NewPictureColumn>
    <NewGraphicColumn
      ref="newpicturecolumn"
      :dialogShow="dialogShows === 2 ? true : false"
      @formClose="NewpictureformClose"
    ></NewGraphicColumn>
    <NewInformationColumn
      ref="newinformationcolumn"
      :dialogShow="dialogShows === 3 ? true : false"
      @formClose="NewpictureformClose"
    ></NewInformationColumn>
    <NewVideoColumn
      ref="newvideocolumn"
      :dialogShow="dialogShows === 4 ? true : false"
      @formClose="NewpictureformClose"
    ></NewVideoColumn>
    <NewActivityColumn
      ref="newactivitycolumn"
      :dialogShow="dialogShows === 5 ? true : false"
      @formClose="NewpictureformClose"
    ></NewActivityColumn>
    <NewLocationColumn
      ref="newlocationcolumn"
      :dialogShow="dialogShows === 6 ? true : false"
      @formClose="NewpictureformClose"
    ></NewLocationColumn>
    <NewAnnouncementColumn
      ref="newannouncementcolumn"
      :dialogShow="dialogShows === 7 ? true : false"
      @formClose="NewpictureformClose"
    ></NewAnnouncementColumn>
  </div>
</template>
<script>
import contents from './contents'
import Newpagedalog from '../../../components/Newpagedalog.vue'
import NewPictureColumn from '../../../components/NewPictureColumn.vue' // 新增图片栏目
import NewGraphicColumn from '../../../components/NewGraphicColumn.vue' // 新增金刚区栏目
import NewInformationColumn from '../../../components/NewInformationColumn.vue' // 新增图文栏目
import NewVideoColumn from '../../../components/NewVideoColumn.vue' // 新增视频栏目
import NewActivityColumn from '../../../components/NewActivityColumn.vue' // 新增活动栏目
import NewLocationColumn from '../../../components/NewLocationColumn.vue' // 新增地点栏目
import NewAnnouncementColumn from '../../../components/NewAnnouncementColumn.vue' // 新增公告栏目
export default {
  name: "PageManage",
  components: {
    Newpagedalog,
    NewPictureColumn,
    NewGraphicColumn,
    NewInformationColumn,
    NewVideoColumn,
    NewLocationColumn,
    NewActivityColumn,
    NewAnnouncementColumn
  },
  data() {
    return {
      dialogType: '',
      bindcolumnsdalog: false,
      dialogShow: false,
      dialogShows: 0,
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
      message: 'www.baidu.com'
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
      this.dialogShow = bool;
      this.$refs.newpagedalog.setDialogForm({});
    },
    // 关闭弹出窗口
    NewpictureformClose(index) {
      this.dialogType = '';
      this.dialogShows = index;
    },
    // 新增活动信息
    handleClick(item) {
      alert(JSON.stringify(item))
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
    },
    // 单个页码按钮
    userHandleCurrentChange(currentPage) {
    },
    // 新增栏目弹框
    opendalog(item) {
      this.dialogShows = item
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
.letdropdown {
  margin-left: 20px;
}
</style>
