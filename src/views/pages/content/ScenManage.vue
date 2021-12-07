<template>
  <!-- 活动管理 -->
  <div>
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="名称">
          <el-input
            v-model="query.resourcetitle"
            placeholder="地点名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
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
        <el-form-item label="归属单位">
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
        <el-form-item label="资源类型">
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
          <el-button type="primary" @click="stadiumAdd()" icon="el-icon-plus"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <br />
    <!--活动列表-->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column label="ID" width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系电话"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.resourcelink }}</span>
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
              scope.row.editunit == "129"
                ? "汉寿县文化旅游广电体育局"
                : scope.row.editunit == "672"
                ? "汉寿县文化馆"
                : scope.row.editunit == "113"
                ? "汉寿县图书馆"
                : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最大容客量"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.maxamount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" :show-overflow-tooltip="true">
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
              >修改
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
              @click="handleUp(scope.row)"
              v-if="scope.row.status === 4"
              >上线
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDown(scope.row)"
              v-if="scope.row.status === 1"
              >下线
            </el-button>
            <el-button size="mini" type="danger" @click="createEwm(scope.row)"
              >二维码</el-button
            >
            <el-button size="mini" type="danger" @click="signup(scope.row)"
              >报名人数</el-button
            >
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleTop(scope.row)"
              v-if="scope.row.status === 1 && scope.$index !== 0"
              >预约人数
            </el-button> -->
            <!-- <el-button
              size="mini"
              type="danger"
              @click="sortDown(scope.$index, scope.row)"
              v-if="scope.$index !== table.length - 1"
              >下移
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="sortUp(scope.$index, scope.row)"
              v-if="scope.$index !== 0"
              >上移
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
    <ScenMandalog
      ref="scenmandalog"
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
    ></ScenMandalog>
  </div>
</template>
<script>
import contents from './contents'
import ScenMandalog from '../../../components/ScenMandalog.vue'
export default {
  name: "ScenManage",
  components: { ScenMandalog },
  data() {
    return {
      dialogShow: false,
      loading: false,
      // 状态选择
      selectOptions: {
        statusOption: [
          { id: 1, label: '正常' }, { id: 2, label: '审核中' },
          { id: 3, label: '审核不通过' }, { id: 4, label: '下线' }
        ],
        status2Option: ['正常', '审核中', '审核不通过', '下线'],
        roleOption: [],
        pageOption: [],
        pathOption: [],
        dirOption: [],
        pageDirective: {},
        resources: {
          1: { label: '景点', list: [] },
          2: { label: '场馆', list: [] }
        }
      },
      // from 表单数据
      query: {
        resourcetitle: '',
        status: '',
        resourcetype: '',
        editunit: ''
      },
      subTypes: {
        1: 1,
        2: 2
      },
      table: [],
      labels: [],
      longitude: 111.971707,
      latitude: 28.904437,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      resources: [],
      dialogType: '',
      // 归属单位
      editunitarr: [
        { editunitname: "汉寿县文化旅游广电体育局", editunit: "129" },
        { editunitname: "汉寿县文化馆", editunit: "672" },
        { editunitname: "汉寿县图书馆", editunit: "113" }],
      dialogForm: {
        editunit: ''
      }
    };
  },
  created() { },
  mounted() {
    // 模拟数据层
    var data = contents.getunitcos().codes.message.list
    this.pageTotal = contents.getunitcos().actmanage.message.total
    this.table = data
    this.labels = contents.getunitcos().label.message.list;
    this.labels.unshift({ labelid: 0, labelword: '无' });
    var list = contents.getunitcos().contns.message.list;
    var list2 = contents.getunitcos().contns.message.list2;
    this.selectOptions.resources[1].list = list
    this.selectOptions.resources[2].list = list2
    this.resources = [...this.resources, ...list];
    this.resources = [...this.resources, ...list2];
    // 模拟数据层
  },
  methods: {
    // 查询
    queryList(index) {
      const _self = this;
      _self.$message.success('查询成功');
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
    // 报名人数
    signup(item) {
      const _self = this;
      _self.$message.success('报名人数');
    },
    // 关闭弹出窗口
    formClose(bool) {
      this.dialogType = '';
      this.$refs.scenmandalog.setDialogForm({});
      this.dialogShow = bool;
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
      this.$refs.scenmandalog.setdatafrom(this.$refs.scenmandalog.dialogForm, 'resourceimage', contents.getunitcos().imgdata.message);
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
      this.$refs.scenmandalog.setdatafrom(this.$refs.scenmandalog.dialogForm, 'resourceipicture', contents.getunitcos().imgdata.message);
      //   } else {
      //     _self.$message('上传失败,请重新上传')
      //   }
      // })
    },
    // 弹框资讯视频图片上传
    uploadVideo(params) {
      const _self = this;
      _self.$message.success('上传成功');
      this.$refs.scenmandalog.setdatafrom(this.$refs.scenmandalog.dialogForm, 'resourceviedo', contents.getunitcos().video.message);
    },
    // 新增
    stadiumAdd() {
      this.$message.success('新增成功');
      this.dialogType = 'add';
      this.dialogShow = true;
      this.$refs.scenmandalog.setDialogForm({});
      this.$refs.scenmandalog.setdatafrom(this.$refs.scenmandalog.dialogForm, 'status', 4);
      this.$refs.scenmandalog.qqmap(this.latitude, this.longitude);
    },
    // 详情
    handleDetail(item) {
      const _self = this;
      _self.$message.success('详情成功');
      this.dialogShow = true;
      this.dialogType = 'detail';
      this.$refs.scenmandalog.setDialogForm(JSON.parse(JSON.stringify(item)));
      if (this.$refs.scenmandalog.dialogForm.latitude && this.$refs.scenmandalog.dialogForm.longitude) {
        this.$refs.scenmandalog.qqmap(this.$refs.scenmandalog.dialogForm.latitude, this.$refs.scenmandalog.dialogForm.longitude);
      } else {
        this.$refs.scenmandalog.qqmap(this.latitude, this.longitude);
      }
    },
    // 修改
    handleUpdate(item) {
      this.$message.success('修改成功');
      this.dialogType = 'update';
      this.$refs.scenmandalog.setDialogForm(JSON.parse(JSON.stringify(item)));
      this.$refs.scenmandalog.setdatafrom(this.$refs.scenmandalog.dialogForm, 'status', 4);
      this.dialogShow = true;
      if (this.$refs.scenmandalog.dialogForm.latitude && this.$refs.scenmandalog.dialogForm.longitude) {
        this.$refs.scenmandalog.qqmap(this.$refs.scenmandalog.dialogForm.latitude, this.$refs.scenmandalog.dialogForm.longitude);
      } else {
        this.$refs.scenmandalog.qqmap(this.latitude, this.longitude);
      }
    },
    deleteDetail(item) {
      this.$message.success('删除成功');
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
    // 预约人数
    handleTop(item) {
      const _self = this;
      _self.$message.success('预约人数');
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
