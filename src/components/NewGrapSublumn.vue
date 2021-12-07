<template>
  <div class="newpiccolsubimg">
    <div class="newpiccolsubimg-sub" v-for="(i, index) in imgdata" :key="index">
      <el-form-item label="图片标题" label-width="120px" prop="resourcetitle">
        <el-input
          style="width: 500px"
          v-model="dialogForm.resourcetitle"
          auto-complete="off"
          placeholder="请输入"
          maxlength="5"
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
        提示：支持jpg、png、gif，图标尺寸1:1，1M以内
      </p>
      <br />
      <el-form-item
        class="elformitems"
        label="绑定内容"
        label-width="120px"
        prop="resourcedetail"
      >
        <el-select placeholder="请选择绑定内容">
          <el-option label="无绑定" value="无绑定"></el-option>
          <el-option label="绑定内容" value="绑定内容"></el-option>
          <el-option label="绑定资源" value="绑定资源"></el-option>
          <el-option label="绑定链接" value="绑定链接"></el-option>
          <el-option label="绑定内容栏目" value="绑定内容栏目"></el-option>
        </el-select>
      </el-form-item>
      <div class="newpiccolsubimg-sub-view">
        <el-button type="primary" @click="sortUp(index)"> 上移 </el-button>
        <el-button type="primary" @click="sortDown(index)"> 下移 </el-button>
        <el-button
          type="primary"
          @click="deletearrsubs(index)"
          v-if="imgdata.length !== 1"
        >
          删除
        </el-button>
        <el-button
          type="primary"
          @click="addclikc(index)"
          v-if="imgdata.length - 1 === index && imgdata.length !== imglength"
        >
          更多
        </el-button>
        <el-button
          v-if="imgdata.length === imglength && imgdata.length - 1 === index"
          type="primary"
          disabled
          >更多</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { deletearrsub, zIndexUp, zIndexDown } from '../utils/arrayswap'
export default {
  name: "NewGrapSublumn",
  data() {
    return {
      imgdata: []
    };
  },
  props: ['dialogForm', 'imglength', 'type'],
  created() {
    if (this.type === '2') {
      this.imgdata = [{ imgurl: "0", binding: "0" }]
    }
  },
  mounted() {
  },
  methods: {
    formClose(item) {
      this.$emit('formClose', 0)
    },
    // 添加
    addclikc(index) {
      this.imgdata.push({ imgurl: index + 1, binding: index + 1 })
    },
    // 删除
    deletearrsubs(index) {
      deletearrsub(this.imgdata, index, 1)
    },
    // 上移
    sortUp(index) {
      zIndexUp(this.imgdata, index, this.imgdata.length)
      console.log(this.imgdata, index)
    },
    // 下移
    sortDown(index) {
      zIndexDown(this.imgdata, index, this.imgdata.length)
      console.log(this.imgdata, index)
    },
    // 切换属性
    setimgdata() {
      this.imgdata = [{ imgurl: "0", binding: "0" }]
    }
  }
}
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
.newpiccolsubimg-sub {
  position: relative;
  width: 100%;
  .newpiccolsubimg-sub-view {
    position: absolute;
    right: 0px;
    bottom: 0px;
    padding-right: 20px;
  }
}
</style>
