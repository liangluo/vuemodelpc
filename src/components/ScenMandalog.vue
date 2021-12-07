<template>
  <!--添加/修改/查看地点-->
  <el-dialog
    :fullscreen="true"
    title="场馆/景点信息"
    :visible.sync="dialogShow"
    class="dialog"
    @close="formClose()"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :append-to-body="true"
    :destroy-on-close="true"
  >
    <div class="el-dialog-div">
      <el-form
        :inline="true"
        :model="dialogForm"
        ref="dialogForm"
        :rules="dialogRules"
      >
        <el-form-item
          label="场景/景点名称"
          label-width="140px"
          prop="resourcetitle"
        >
          <el-input
            v-model="dialogForm.resourcetitle"
            placeholder="场景/景点名称"
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <el-form-item
          label="场景/景点类型"
          label-width="140px"
          prop="resourcetypeid"
        >
          <el-select
            placeholder="请选择"
            v-model="dialogForm.resourcetypeid"
            filterable
            :disabled="dialogType === 'detail'"
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
        <el-form-item label="联系电话" label-width="140px" prop="resourcelink">
          <el-input
            v-model="dialogForm.resourcelink"
            placeholder="联系电话"
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <br />
        <el-form-item
          label="场景/景点封面图"
          label-width="140px"
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
          label="场景/景点高清图"
          label-width="140px"
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
        <el-form-item
          label="场景/景点视频"
          label-width="140px"
          prop="resourceviedo"
        >
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
        <p style="color: red; margin-left: 140px; font-size: 12px">
          封面图尺寸：600*564 / 资讯高清图尺寸：15:9
        </p>
        <br />
        <el-form-item label="天开放时间类型" label-width="140px">
          <span class="type">每周：</span>
          <el-input
            v-model="dialogForm.openweekday"
            placeholder="每周"
            :readonly="dialogType === 'detail'"
            style="width: 225px"
          />
          <br />
          <span class="type" style="padding-top: 10px">特定日期开放：</span>
          <el-input
            v-model="dialogForm.openday"
            placeholder="特定日期开放"
            :readonly="dialogType === 'detail'"
            style="width: 225px"
          />
          <br />
          <span class="type" style="padding-top: 10px">特定日期不开放：</span>
          <el-input
            v-model="dialogForm.closeday"
            placeholder="特定日期不开放"
            :readonly="dialogType === 'detail'"
            style="width: 225px"
          />
        </el-form-item>
        <el-form-item label=" " label-width="140px">
          <label style="color: red"
            >每日，无需填写;<br />
            每周，填写具体是哪几天开放，1表示星期一，7表示星期日，多日间使用半角逗号分隔，例如1,2,3;<br />
            特定日期开放，填写具体是几月几日开放，多日间使用半角逗号分隔，例如0201,0616,0919,1227;<br />
            特定日期不开放，填写具体是几月几日不开放，多日间使用半角逗号分隔，例如0201,0616,0919,1227;
          </label>
        </el-form-item>
        <br />
        <el-form-item label="主管单位" label-width="140px" prop="hostunit">
          <el-input
            v-model="dialogForm.hostunit"
            placeholder="主管单位"
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <el-form-item label="归属单位" label-width="140px" prop="editunit">
          <el-select
            v-model="dialogForm.editunit"
            placeholder="请选择归属单位"
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
        <el-form-item label="开放天时间" label-width="140px" prop="opentime">
          <el-input
            v-model="dialogForm.opentime"
            placeholder="开放天说明"
            :readonly="dialogType === 'detail'"
          />
          <p style="color: red">
            如08:30-11:30,14:00-17:30表示开放日的这两个时间段开放
          </p>
        </el-form-item>
        <br />
        <el-form-item label="场景/景点地址" label-width="140px" prop="address">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="dialogForm.address"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
            style="width: 500px"
          >
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleIconClick"
            >
            </i>
            <template slot-scope="props">
              <div class="name">{{ props.item.title }}</div>
              <span class="addr">{{ props.item.address }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <br />
        <el-form-item label="地图" label-width="140px" prop="address">
          <div
            id="map"
            style="margin: 0 auto; width: 1000px; height: 300px"
          ></div>
        </el-form-item>
        <br />
        <el-form-item label="经度" label-width="140px" prop="longitude">
          <el-input
            v-model="dialogForm.longitude"
            placeholder="经度"
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <el-form-item label="纬度" label-width="140px" prop="latitude">
          <el-input
            v-model="dialogForm.latitude"
            placeholder="纬度"
            :readonly="dialogType === 'detail'"
          />
        </el-form-item>
        <el-form-item label="最大容客量" label-width="140px" prop="maxamount">
          <el-input
            v-model="dialogForm.maxamount"
            :readonly="dialogType === 'detail'"
            placeholder="最大容客量"
          />
        </el-form-item>
        <br />
        <el-form-item label="场景/景点公告" label-width="140px">
          <el-input
            style="width: 500px"
            :readonly="dialogType === 'detail'"
            v-model="dialogForm.resourceboards"
            resize="none"
            type="textarea"
            rows="3"
            maxlength="1000"
          />
        </el-form-item>
        <el-form-item label="标签" label-width="140px" prop="label">
          <el-select
            v-model="dialogForm.label"
            placeholder="请选择"
            filterable
            multiple
            readonly
            :multiple-limit="3"
            style="width: 300px"
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
          label="处理意见"
          label-width="140px"
          prop="auditdesc"
          v-if="dialogType === 'detail'"
        >
          <el-input
            v-model="dialogForm.auditdesc"
            auto-complete="off"
            style="width: 500px"
            placeholder="处理意见"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item
          label="场景/景点详情"
          label-width="140px"
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
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="formClose()">取 消</el-button>
      <el-button
        type="primary"
        v-if="dialogType === 'add' || dialogType === 'update'"
        @click="stadiumSubmit()"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import QuillEditor from '@/components/MyQuillEditor';
import { isIntegerNotMust, validatePhoneTwo } from '@/utils/validate';
export default {
  name: 'ActMandalog',
  data() {
    return {
      dialogForm: {
        resourcetitle: '',
        resourcetypeid: '',
        resourcedetail: '',
        resourceimage: '',
        resourceipicture: '',
        resourceviedo: '',
        address: '',
        longitude: '',
        latitude: '',
        resourceboards: '',
        resourcelink: '',
        resourcetime: [],
        bespeaktime: [],
        hostunit: '',
        editunit: '',
        maxamount: '',
        label: '',
        auditdesc: ''
      },
      // 必填项
      dialogRules: {
        resourcetitle: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        resourcetypeid: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
        resourcedetail: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
        resourceimage: [{ required: true, message: '请输入活动图片', trigger: 'blur' }],
        resourcelink: [{ required: true, message: '请输入联系电话', trigger: 'blur' }, { validator: validatePhoneTwo, trigger: blur }],
        address: [{ required: true, message: '请输入活动地址', trigger: 'blur' }],
        longitude: [{ required: true, message: '请输入活动地点经度', trigger: 'blur' }],
        latitude: [{ required: true, message: '请输入活动地点纬度', trigger: 'blur' }],
        resourcetime: [{ type: 'array', required: true, message: '请选择活动时间', trigger: 'change' }],
        bespeaktime: [{ type: 'array', required: true, message: '请选择预约时间', trigger: 'change' }],
        maxamount: [{ required: true, message: '请输入最大参与人数', trigger: 'blur' }, { validator: isIntegerNotMust, trigger: blur }],
        editunit: [{ required: true, message: '请选择归属单位', trigger: 'blur' }]
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
    // 活动图片
    handleAvatarSuccess(res, file) {
      this.dialogForm.resourceimage = URL.createObjectURL(file.raw);
    },
    // 活动高清图片
    handleAvatarSuccess1(res, file) {
      this.dialogForm.resourceipicture = URL.createObjectURL(file.raw);
    },
    // 上传成功回调
    handleVideoSuccess(res, file) {
      this.dialogForm.resourceviedo = URL.createObjectURL(file.raw);
    },
    handleIconClick(ev) {
      console.log(ev);
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
    stadiumSubmit() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this;
          if (_self.dialogForm.resourcetime && _self.dialogForm.resourcetime.length > 1) {
            _self.dialogForm.resourcestarttime = _self.dialogForm.resourcetime[0];
            _self.dialogForm.resourceendtime = _self.dialogForm.resourcetime[1];
            delete _self.dialogForm.resourcetime;
          }
          if (_self.dialogForm.bespeaktime && _self.dialogForm.bespeaktime.length > 1) {
            _self.dialogForm.bespeakstarttime = _self.dialogForm.bespeaktime[0];
            _self.dialogForm.bespeakendtime = _self.dialogForm.bespeaktime[1];
            delete _self.dialogForm.bespeaktime;
          }
          const topTypeId = _self.resources.find(a => a.resourcetypeid === _self.dialogForm.resourcetypeid).upresourcetypeid;
          _self.dialogForm.subType = _self.subTypes[topTypeId];
          this.$emit("infoSubmit", _self.dialogForm, _self.dialogType, true)
        } else {
          this.$emit("infoSubmit", null, null, false)
        }
      });
    },
    qqmap(latitude, longitude) {
      this.$nextTick(() => {
        var myLatlng = new qq.maps.LatLng(latitude, longitude);
        // 定义工厂模式函数x
        var myOptions = {
          zoom: 17, // 设置地图缩放级别
          center: myLatlng, // 设置中心点样式
          mapTypeId: qq.maps.MapTypeId.ROADMAP // 设置地图样式详情参见MapType
        }
        // 获取dom元素添加地图信息
        this.map = new qq.maps.Map(document.getElementById('map'), myOptions)
        this.marker = new qq.maps.Marker({
          position: myLatlng,
          map: this.map
        })
        // 添加监听事件
        var that = this
        qq.maps.event.addListener(this.map, 'click', (e) => {
          that.latitude = e.latLng.getLat();
          that.longitude = e.latLng.getLng();
          var url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${that.latitude},${that.longitude}&region=常德&key=UBKBZ-FWC33-HFO3L-3ZNVN-7YP67-YDBCO&output=jsonp&&callback=?`
          $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp', // 指定服务器返回的数据类型
            success: function (_resultData) {
              if (_resultData) {
                var address = _resultData.result.address;
                var o = {
                  longitude: that.longitude,
                  latitude: that.latitude,
                  address: address
                }
                that.dialogForm = { ...that.dialogForm, ...o }
                myLatlng = new qq.maps.LatLng(that.latitude, that.longitude);
                that.marker.setMap(null);
                that.marker = new qq.maps.Marker({
                  position: myLatlng,
                  map: that.map
                });
                that.map.setCenter(myLatlng);
              }
            }
          });
        });
      });
    },
    querySearch(queryString, cb) {
      if (!queryString) {
        queryString = '汉寿';
      }
      var url = `https://apis.map.qq.com/ws/place/v1/suggestion/?keyword=${queryString}&region=常德&key=UBKBZ-FWC33-HFO3L-3ZNVN-7YP67-YDBCO&output=jsonp&&callback=?`
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp', // 指定服务器返回的数据类型
        success: function (_resultData) {
          if (_resultData) {
            // 调用 callback 返回建议列表的数据
            cb(_resultData.data);
          }
        }
      });
    },
    // 搜索
    handleSelect(item) {
      var that = this
      that.latitude = item.location.lat;
      that.longitude = item.location.lng;
      var o = {
        longitude: that.longitude,
        latitude: that.latitude,
        address: item.address
      }
      that.dialogForm = { ...that.dialogForm, ...o }
      this.qqmap(this.latitude, this.longitude);
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
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 177px;
    height: 112px;
    line-height: 112px;
    text-align: center;
  }
  .avatar {
    width: 177px;
    height: 112px;
    display: block;
  }
  .type{
    width: 122px;
    text-align: right;
    padding-right: 10px;
    display: inline-block;
  }
  .avatarImg{
    width: 177px;
    height: 112px;
    position: relative;
  }
  .closeImg{
    position: absolute;
    right:-10px;
    top:-10px;
    width:30px;
    height: 30px;
    text-align: center;
    font-size: 28px;
    color: #8c939d;
    z-index: 2;
  }
</style>
