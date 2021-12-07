<template>
  <!--添加/修改/查看活动-->
  <el-dialog
    :fullscreen="true"
    :title="
      dialogType === 'add'
        ? '新增活动信息'
        : dialogType === 'update'
        ? '修改活动信息'
        : '资讯活动详情'
    "
    v-if="dialogShow"
    :visible.sync="dialogShow"
    @close="formClose()"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :append-to-body="true"
    :destroy-on-close="true"
  >
    <div class="el-dialog-div">
      <el-form
        :model="dialogForm"
        ref="dialogForm"
        :rules="dialogRules"
        :inline="true"
      >
        <el-form-item label="页面名称" label-width="120px" prop="resourcetitle">
          <el-input
            style="width: 500px"
            v-model="dialogForm.resourcetitle"
            auto-complete="off"
            placeholder="请输入"
            maxlength="10"
            show-word-limit
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <br />
        <el-form-item
          label="页面标题"
          label-width="120px"
          prop="resourcetypeid"
        >
          <el-input
            style="width: 500px"
            v-model="dialogForm.resourcetypeid"
            auto-complete="off"
            placeholder="请输入"
            maxlength="20"
            show-word-limit
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <br />
        <el-form-item
          class="elformitems"
          label="页面背景色"
          label-width="120px"
          prop="resourcedetail"
        >
          <el-select
            v-model="dialogForm.resourcedetail"
            placeholder="请选择页面背景色"
          >
            <el-option label="肤色一" value="#000000"></el-option>
            <el-option label="肤色二" value="#00FF99"></el-option>
          </el-select>
          <div
            class="fscolor"
            :style="{ background: dialogForm.resourcedetail }"
          ></div>
        </el-form-item>
        <br />
        <el-form-item label="单位入口" label-width="120px" prop="delivery">
          <el-checkbox-group v-model="dialogForm.delivery">
            <el-checkbox label="展示本页面单位入口" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <br />
        <el-form-item label="页面类型" label-width="120px" prop="resourcelink">
          <el-select
            v-model="dialogForm.resourcelink"
            placeholder="请选择页面类型"
          >
            <el-option label="普通页面" value="putongyemian"></el-option>
            <el-option label="专题页面" value="zhuantiyemian"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="formClose(false)">取 消</el-button>
      <el-button
        type="primary"
        v-if="dialogType === 'update' || dialogType === 'add'"
        @click="infoSubmit()"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'Newpagedalog',
  data() {
    return {
      dialogForm: {
        resourcetitle: '',
        resourcetypeid: '',
        resourcedetail: '',
        delivery: false,
        resourcelink: []
      },
      dialogRules: {
        resourcetitle: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        resourcetypeid: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
        resourcedetail: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
        resourcelink: [{ required: true, message: '请选择页面类型', trigger: 'blur' }]
      },
      subTypes: {
        4: 1,
        5: 2
      },
      map: null,
      marker: null
    }
  },
  props: [
    'dialogShow',
    'dialogType',
    'selectOptions',
    'labels',
    'resources',
    'editunitarr'],

  methods: {
    // 关闭表单时，重置校验
    formClose() {
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.clearValidate();
      this.$emit("formClose", false)
    },
    // 关闭图片
    closeImg(id) {
    },
    // 上传图片
    beforeAvatarUpload(file) {
    },
    // 活动图片
    handleAvatarSuccess(res, file) {
    },
    // 活动高清图片
    handleAvatarSuccess1(res, file) {
    },
    // 上传成功回调
    handleVideoSuccess(res, file) {
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    /* 上传视频 */
    // 上传前回调
    beforeUploadVideo(file) {
    },
    // 上传资讯图片
    uploadImage(image) {
    },
    // 资讯高清图片上传
    uploadImage1(image) {
    },
    // 上传视频
    uploadVideo(video) {
    },
    // 提交弹框表单
    infoSubmit() {
    },
    qqmap(latitude, longitude) {
    },
    querySearch(queryString, cb) {
    },
    // 搜索
    handleSelect(item) {
    },
    // 单独修改form 表单数据
    setdatafrom(objorarr, key, value) {
    },
    setDialogForm(item) {
    }
  }
}

</script>

<style scoped lang="scss">
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
</style>
