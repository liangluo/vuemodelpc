<template>
  <!--添加/修改/查看资讯-->
  <el-dialog
    :title="
      dialogType === 'add'
        ? '新增资讯信息'
        : dialogType === 'update'
        ? '修改资讯信息'
        : '资讯信息详情'
    "
    :fullscreen="true"
    v-if="dialogShow == true"
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
        :rules="dialogRules"
        :inline="true"
        ref="dialogForm"
      >
        <el-form-item label="资讯标题" label-width="120px" prop="resourcetitle">
          <el-input
            v-model="dialogForm.resourcetitle"
            auto-complete="off"
            placeholder="资讯标题"
            style="width: 500px"
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <el-form-item
          label="资讯类型"
          label-width="120px"
          prop="resourcetypeid"
        >
          <el-select
            placeholder="请选择"
            v-model="dialogForm.resourcetypeid"
            filterable
            :disabled="dialogType === 'detail'"
            style="width: 500px"
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
                :value="_type.resourcetypeid"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="归属单位" label-width="120px" prop="editunit">
          <el-select
            v-model="dialogForm.editunit"
            placeholder="请选择归属单位"
            style="width: 500px"
            filterable
            :disabled="dialogType === 'detail'"
          >
            <el-option
              v-for="_type in editunitarr"
              :key="_type.editunit"
              :label="_type.editunitname"
              :value="_type.editunit"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="资讯来源"
          label-width="120px"
          prop="resourcesource"
        >
          <el-input
            v-model="dialogForm.resourcesource"
            auto-complete="off"
            style="width: 500px"
            placeholder="资讯来源"
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <br />
        <el-form-item
          label="资讯封面图"
          label-width="120px"
          prop="resourceimage"
        >
          <el-upload
            class="avatar-uploader"
            :disabled="dialogType === 'detail'"
            action
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImage"
          >
            <p v-if="dialogForm.resourceimage" class="avatarImg">
              <img :src="dialogForm.resourceimage" class="avatar" />
              <i class="el-icon-error closeImg" @click.stop="closeImg(0)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="资讯高清图"
          label-width="180px"
          prop="resourceipicture"
        >
          <el-upload
            class="avatar-uploader"
            :disabled="dialogType === 'detail'"
            action
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImage1"
          >
            <p v-if="dialogForm.resourceipicture" class="avatarImg">
              <img :src="dialogForm.resourceipicture" class="avatar" />
              <i class="el-icon-error closeImg" @click.stop="closeImg(1)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="资讯视频" label-width="120px" prop="resourceviedo">
          <el-upload
            class="avatar-uploader"
            :disabled="dialogType === 'detail'"
            action
            :show-file-list="false"
            :before-upload="beforeUploadVideo"
            :http-request="uploadVideo"
          >
            <p v-if="dialogForm.resourceviedo" class="avatarImg">
              <video
                v-if="dialogForm.resourceviedo"
                :src="dialogForm.resourceviedo"
                class="avatar video-avatar"
                controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
              <i class="el-icon-error closeImg" @click.stop="closeImg(2)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <p style="color: red; margin-left: 120px; font-size: 12px">
          封面图尺寸：678*390 / 高清图尺寸：15:9
        </p>
        <br />
        <el-form-item label="标签" label-width="120px" prop="label">
          <el-select
            v-model="dialogForm.label"
            placeholder="请选择"
            filterable
            multiple
            readonly
            :multiple-limit="3"
            style="width: 500px"
            :disabled="dialogType === 'detail'"
            clearable
          >
            <el-option
              v-for="_label in labels"
              :key="_label.labelid"
              :label="_label.labelword"
              :value="_label.labelid"
            />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item
          label="资讯详情"
          label-width="120px"
          prop="resourcedetail"
        >
          <QuillEditor
            v-if="dialogType !== 'detail'"
            v-model="dialogForm.resourcedetail"
            style="width: 930px"
          />
          <div
            v-else
            v-html="dialogForm.resourcedetail"
            style="display: inline-block; width: 800px"
            class="ql-editor"
          >
            {{ dialogForm.resourcedetail }}
          </div>
          <p style="color: red; font-size: 12px; padding-left: 15px">
            详情图片尺寸：保持宽度一致，宽度不大于1390即可
          </p>
        </el-form-item>

        <br />

        <el-form-item
          label="处理意见"
          label-width="120px"
          prop="suggest"
          v-if="dialogType === 'detail'"
        >
          <el-input
            v-model="dialogForm.suggest"
            auto-complete="off"
            style="width: 500px"
            placeholder="处理意见"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="formClose()">取 消</el-button>
      <el-button
        type="primary"
        v-if="dialogType === 'add' || dialogType === 'update'"
        @click="infoSubmit()"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import QuillEditor from '@/components/MyQuillEditor';
export default {
  name: 'Detailsdalog',
  data() {
    return {
      dialogForm: {},
      dialogRules: {
        resourcetitle: [{ required: true, message: '请输入资讯标题', trigger: 'blur' }],
        resourcetypeid: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
        editunit: [{ required: true, message: '请选择归属单位', trigger: 'change' }],
        resourceimage: [{ required: true, message: '请输入资讯图片', trigger: 'blur' }],
        resourcedetail: [{ required: true, message: '请输入资讯详情', trigger: 'blur' }]
      },
      subTypes: {
        4: 1,
        5: 2
      }
    }
  },
  props: [
    'dialogShow',
    'dialogType',
    'selectOptions',
    'labels',
    'resources',
    'editunitarr'],
  components: {
    QuillEditor
  },
  methods: {
    // 关闭表单时，重置校验
    formClose() {
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.clearValidate();
      this.$emit("formClose", false)
    },
    // 关闭图片
    closeImg(id) {
      const _self = this;
      if (id === 0) {
        this.setdatafrom(_self.dialogForm, 'resourceimage', '');
      } else if (id === 1) {
        this.setdatafrom(_self.dialogForm, 'resourceipicture', '');
      } else {
        this.setdatafrom(_self.dialogForm, 'resourceviedo', '');
      }
    },
    // 上传图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    /* 上传视频 */
    // 上传前回调
    beforeUploadVideo(file) {
      var fileSize = file.size / 1024 / 1024 < 50;
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式');
        return false;
      }
      if (!fileSize) {
        this.$message.error('视频大小不能超过50MB');
        return false;
      }
    },
    // 上传资讯图片
    uploadImage(image) {
      const params = new FormData()
      params.append('file', image.file)
      this.$emit("uploadImage", params)
    },
    // 资讯高清图片上传
    uploadImage1(image) {
      const params = new FormData()
      params.append('file', image.file)
      this.$emit("uploadImage1", params)
    },
    // 上传视频
    uploadVideo(video) {
      const params = new FormData()
      params.append('file', video.file)
      this.$emit("uploadVideo", params)
    },
    // 提交弹框表单
    infoSubmit() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this;
          const topTypeId = _self.resources.find(a => a.resourcetypeid === _self.dialogForm.resourcetypeid).upresourcetypeid;
          _self.dialogForm.subType = _self.subTypes[topTypeId];
          this.$emit("infoSubmit", _self.dialogForm, _self.dialogType, true)
        } else {
          this.$emit("infoSubmit", null, null, false)
        }
      });
    },
    // 单独修改form 表单数据
    setdatafrom(objorarr, key, value) {
      this.$set(objorarr, key, value);
    },
    setDialogForm(item) {
      this.dialogForm = item
    }
  }
}

</script>

<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
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
.avatarImg {
  width: 177px;
  height: 100px;
  position: relative;
}
.avatar {
  width: 177px;
  height: 100px;
  display: block;
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
/deep/ .el-dialog {
  max-width: 100% !important;
}
/deep/ .ql-editor {
  min-height: 600px;
}
/deep/ .el-form {
  padding-top: 0px !important;
}

</style>
