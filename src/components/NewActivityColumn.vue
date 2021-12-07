<template>
  <!-- 绑定栏目 -->
  <el-dialog
    :fullscreen="true"
    :title="'新增活动栏目'"
    v-if="dialogShow"
    :visible.sync="dialogShow"
    @close="formClose(false)"
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
        <el-form-item label="图片标题" label-width="120px" prop="resourcetitle">
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
        <el-form-item label="图片上传" label-width="120px" prop="resourceimage">
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
        <br />
        <p style="color: red; margin-left: 120px; font-size: 12px">
          支持png/jpg/gif，提示：上传图片标题将不展示栏目标题
        </p>
        <br />
        <el-form-item
          label="标题是否页面展示"
          label-width="175px"
          prop="delivery"
        >
          <el-checkbox-group v-model="dialogForm.delivery">
            <el-checkbox label="" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <br />
        <el-form-item
          class="elformitems"
          label="展示样式"
          label-width="120px"
          prop="resourcedetail"
        >
          每行1个
        </el-form-item>
        <br />
        <el-form-item label="展示行数" label-width="120px" prop="resourcetitle">
          <el-input
            style="width: 500px"
            v-model="dialogForm.resourcetitle"
            auto-complete="off"
            placeholder="请输入"
            :maxlength="1"
            :max="9"
            :min="1"
            show-word-limit
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <p style="color: red; margin-left: 120px; font-size: 12px">
          提示：建议不超过9行
        </p>
        <br />
        <el-form-item
          class="elformitems"
          label="绑定内容"
          label-width="120px"
          prop="resourcedetail"
        >
          <el-select
            v-model="dialogForm.bincontent"
            placeholder="请选择绑定内容"
          >
            <el-option label="绑定分类" value="绑定分类"></el-option>
            <el-option label="绑定活动" value="绑定活动"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <!-- <div class="elformitemsborder">
          <br />
          <NewInformaSublumn
            ref="newinformasublumn"
            :dialogForm="dialogForm"
            :imglength="imglength"
            :type="'3'"
          ></NewInformaSublumn>
          <br />
        </div> -->
      </el-form>
    </div>
    <br />
    <div slot="footer">
      <el-button @click="formClose(false)">取 消</el-button>
      <el-button type="primary"> 新增 </el-button>
    </div>
  </el-dialog>
</template>
<script>
// 新增/修改图片栏目
// import NewInformaSublumn from "./NewInformaSublumn.vue"
export default {
  name: "NewActivityColumn",
  data() {
    return {
      imglength: 10, // 最多数量
      dialogForm: {
        resourcetitle: '',
        resourcetypeid: '',
        resourcedetail: '',
        styledisplay: "",
        delivery: false,
        resourcelink: [],
        bincontent: ""
      },
      dialogRules: {
        resourcetitle: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        resourcetypeid: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
        resourcedetail: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
        resourcelink: [{ required: true, message: '请选择页面类型', trigger: 'blur' }]
      }
    };
  },
  props: ['dialogShow'],
  // components: {
  //   NewInformaSublumn
  // },
  created() {
  },
  mounted() {
  },
  methods: {
    formClose(item) {
      this.$emit('formClose', 0)
    },
    selechange(item) {
      this.$refs.newinformasublumn.setimgdata();
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
.elformitemsborder {
  width: 50%;
  border: 1px dashed #000;
}
</style>
