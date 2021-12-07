<template>
  <!-- 活动管理 -->
  <div>
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="标题">
          <el-input
            placeholder="标题名称"
            v-model="query.resourcetitle"
            clearable
          />
        </el-form-item>
        <el-form-item label="分类">
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
        <el-form-item label="单位">
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
        <el-form-item label="报名状态">
          <el-select
            placeholder="请选择"
            v-model="query.resourcetype"
            filterable
            clearable
          >
            <el-option-group
              v-for="group in selectOptions.resources"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="_type in group.list"
                :key="_type.resourcetypeid"
                :label="_type.resourtypename"
                :value="_type.resourtypename"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="上线状态">
          <el-select
            placeholder="请选择"
            v-model="query.resourcetype"
            filterable
            clearable
          >
            <el-option-group
              v-for="group in selectOptions.resources"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="_type in group.list"
                :key="_type.resourcetypeid"
                :label="_type.resourtypename"
                :value="_type.resourtypename"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryList(1)"
            >查询</el-button
          >
          <el-button icon="el-icon-delete" @click="clear()">清空</el-button>
          <el-button type="primary" @click="actManagerAdd()" icon="el-icon-plus"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <br />
    <!--活动列表-->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="ID" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="归属单位"
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
        <el-table-column label="联系电话" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcelink }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大参加人数" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.maxamount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{ selectOptions.status2Option[scope.row.status - 1] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="500">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-if="
                scope.row.status === 1 ||
                scope.row.status === 3 ||
                scope.row.status === 4
              "
              >修改</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="deleteDetail(scope.row)"
              >删除
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleUp(scope.row)"
              v-if="scope.row.status === 4"
              >上线</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDown(scope.row)"
              v-if="scope.row.status === 1"
              >下线</el-button
            >
            <el-button size="mini" type="danger" @click="createEwm(scope.row)"
              >二维码</el-button
            >
            <el-button size="mini" type="danger" @click="signup(scope.row)"
              >报名人数</el-button
            >
            <!-- <el-button size="mini" type="danger" @click="createPull(scope.row)"
              >拉取</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="sendData(scope.row)"
              v-if="scope.row.status === 1"
              >{{ scope.row.publishflag == 1 ? "取消推送" : "推送活动" }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleTop(scope.row)"
              v-if="scope.row.status === 1 && scope.$index !== 0"
              >置顶
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="sortDown(scope.$index, scope.row)"
              v-if="scope.$index !== table.length - 1"
              >下移</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="sortUp(scope.$index, scope.row)"
              v-if="scope.$index !== 0"
              >上移</el-button
            > -->
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
    <ActMandalog
      ref="actmandalog"
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
    ></ActMandalog>
  </div>
</template>
<script>
import contents from './contents'
import ActMandalog from '../../../components/ActMandalog.vue'
export default {
  name: "ActManage",
  components: {
    ActMandalog
  },
  data() {
    return {
      loading: false,
      // 标签
      labels: [],
      // 弹框
      dialogShow: false,
      dialogType: '',
      // 归属单位
      editunitarr: [
        { editunitname: "汉寿县文化旅游广电体育局", editunit: 129 },
        { editunitname: "汉寿县文化馆", editunit: 672 },
        { editunitname: "汉寿县图书馆", editunit: 113 }
      ],
      // 状态选择
      selectOptions: {
        statusOption: [
          { id: 1, label: '正常' }, { id: 2, label: '审核中' },
          { id: 3, label: '审核不通过' }, { id: 4, label: '下线' }
        ],
        status2Option: ['正常', '审核中', '审核不通过', '下线'],
        tab1Option: [],
        tab2Option: [],
        tab3Option: []
      },
      // from 表单数据
      query: {
        name: '',
        status: '',
        editunit: '',
        resourcetype: ''
      },
      subTypes: {
        3: 1
      },
      table: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      resources: [],
      longitude: 111.971707,
      latitude: 28.904437
    };
  },
  created() { },
  mounted() {
    // 模拟数据层
    var data = contents.getunitcos().actmanage.message.list
    this.pageTotal = contents.getunitcos().actmanage.message.total
    this.labels = contents.getunitcos().label.message.list;
    this.labels.unshift({ labelid: 0, labelword: '无' });
    this.table = data
    var list = contents.getunitcos().code.message.list;
    this.resources = [...this.resources, ...list];
    // 模拟数据层
  },
  methods: {
    // 查询
    queryList(index) {
      const _self = this;
      _self.$message.success('查询成功');
    },
    // 关闭弹出窗口
    formClose(bool) {
      this.dialogType = '';
      this.$refs.actmandalog.setDialogForm({});
      this.dialogShow = bool;
    },
    deleteDetail(item) {
      this.$message.success('删除成功');
    },
    // 清空
    clear() {
      const _self = this;
      _self.$message.success('清空');
      this.query.resourcetitle = '';
      this.query.status = '';
      this.query.resourcetype = '';
      this.query.editunit = '';
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
      this.$refs.actmandalog.setdatafrom(this.$refs.actmandalog.dialogForm, 'resourceimage', contents.getunitcos().imgdata.message);
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
      this.$refs.actmandalog.setdatafrom(this.$refs.actmandalog.dialogForm, 'resourceipicture', contents.getunitcos().imgdata.message);
      //   } else {
      //     _self.$message('上传失败,请重新上传')
      //   }
      // })
    },
    // 弹框资讯视频图片上传
    uploadVideo(params) {
      const _self = this;
      _self.$message.success('上传成功');
      this.$refs.actmandalog.setdatafrom(this.$refs.actmandalog.dialogForm, 'resourceviedo', contents.getunitcos().video.message);
    },
    // 新增
    actManagerAdd() {
      this.$message.success('新增成功');
      this.dialogType = 'add';
      this.dialogShow = true;
      this.$refs.actmandalog.setDialogForm({});
      this.$refs.actmandalog.setdatafrom(this.$refs.actmandalog.dialogForm, 'status', 4);
      this.dialogShow = true;
      this.$refs.actmandalog.qqmap(this.latitude, this.longitude);
    },
    // 详情
    handleDetail(item) {
      const _self = this;
      _self.$message.success('详情成功');
      this.dialogShow = true;
      this.dialogType = 'detail';
      this.$refs.actmandalog.setDialogForm(JSON.parse(JSON.stringify(item)));
      if (this.$refs.actmandalog.dialogForm.latitude && this.$refs.actmandalog.dialogForm.longitude) {
        this.$refs.actmandalog.qqmap(this.$refs.actmandalog.dialogForm.latitude, this.$refs.actmandalog.dialogForm.longitude);
      } else {
        this.$refs.actmandalog.qqmap(this.latitude, this.longitude);
      }
    },
    // 修改
    handleUpdate(item) {
      this.$message.success('修改成功');
      this.dialogType = 'update';
      this.$refs.actmandalog.setDialogForm(JSON.parse(JSON.stringify(item)));
      this.$refs.actmandalog.setdatafrom(this.$refs.actmandalog.dialogForm, 'status', 4);
      this.dialogShow = true;
      if (this.$refs.actmandalog.dialogForm.latitude && this.$refs.actmandalog.dialogForm.longitude) {
        this.$refs.actmandalog.qqmap(this.$refs.actmandalog.dialogForm.latitude, this.$refs.actmandalog.dialogForm.longitude);
      } else {
        this.$refs.actmandalog.qqmap(this.latitude, this.longitude);
      }
    },
    // 二维码
    createEwm(item) {
      const _self = this;
      _self.$message.success('二维码');
    },
    // 拉取
    createPull(item) {
      const _self = this;
      _self.$message.success('拉取');
    },
    // 取消推送 推送资源
    sendData(item) {
      const _self = this;
      _self.$message.success('取消推送');
    },
    // 发布
    handleUp(item) {
      const _self = this;
      _self.$message.success('发布');
    },
    // 下线
    handleDown(item) {
      const _self = this;
      _self.$message.success('下线');
    },
    // 置顶
    handleTop(item) {
      const _self = this;
      _self.$message.success('置顶');
    },
    // 下移
    sortDown(index, item) {
      const _self = this;
      _self.$message.success('下移');
    },
    // 上移
    sortUp(index, item) {
      const _self = this;
      _self.$message.success('上移');
    },
    // 报名人数
    signup(item) {
      const _self = this;
      _self.$message.success('报名人数');
    },
    // 页码
    userHandleSizeChange(size) {
      this.pageSize = size
      this.queryList();
      const _self = this;
      _self.$message.success('页码');
    },
    // 单个页码按钮
    userHandleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryList();
      const _self = this;
      _self.$message.success('单个页码按钮');
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
