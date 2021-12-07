 <!-- 
  :showDraw:是否显示drawer
  :rtype:drawer的类型，add,update,detail,check
  :resources:资源类型
  :editform: drawer内容
  :labels:标签类型
  @updatedraw:更新组件显示状态方法
  @updatelist:更新列表
  @resetform:重置搜索
  -->
<template>
  <el-drawer v-if="isShow" :title="title" :size="drawSize" :wrapperClosable="false" :visible.sync="isShow" direction="rtl" custom-class="act-drawer" ref="drawer" :show-close="true" :before-close="formClose" :modal-append-to-body="false">
    <div class="drawer__content">
      <el-form :model="drawerForm" ref="drawerForm" :rules="drawerRules" :inline="true">
        <el-form-item label="活动标题：" label-width="100px" prop="resourcetitle">
          <el-input v-model="drawerForm.resourcetitle" auto-complete="off" placeholder="请输入" :disabled="readonly"  class="w480"/>
        </el-form-item>
        <el-form-item label="活动类型：" label-width="100px" prop="resourcetypeid">
          <el-select placeholder="请选择" v-model="drawerForm.resourcetypeid" filterable :disabled="readonly">
            <el-option v-for="_type in resources" :key="_type.resourcetypeid" :label="_type.resourtypename" :value="_type.resourcetypeid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="主办单位：" label-width="100px" prop="hostunit">
          <el-input v-model="drawerForm.hostunit" auto-complete="off" placeholder="主办单位" :disabled="readonly" />
        </el-form-item>
        <el-form-item label="联系电话：" label-width="100px" prop="resourcelink">
          <el-input v-model="drawerForm.resourcelink" auto-complete="off" placeholder="联系电话" :disabled="readonly"/>
        </el-form-item>
        <el-form-item label="参加人数：" label-width="100px" prop="maxamount">
          <el-input v-model="drawerForm.maxamount" auto-complete="off" placeholder="最大参加人数" :disabled="readonly"/>
        </el-form-item>
        <el-form-item label="活动封面：" label-width="100px" prop="resourceimage" >
          <el-upload class="avatar-uploader" :disabled="readonly" action :show-file-list="false"
                     :on-success="uploadImageSuccess" :before-upload="beforeuploadImage"
                     :http-request="uploadImage">
            <p v-if="drawerForm.resourceimage" class="avatarImg">
              <img  :src="drawerForm.resourceimage" class="avatar">
              <i class="el-icon-error closeImg" @click.stop="closeImg(0)" v-if="isImgClose"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="tips">封面图尺寸比例3:1,建议776*258</p>
        </el-form-item>
        <el-form-item label="活动大图：" label-width="100px" prop="resourceipicture">
          <el-upload class="avatar-uploader" :disabled="readonly" action :show-file-list="false"
                     :on-success="uploadImageSuccess1" :before-upload="beforeuploadImage"
                     :http-request="uploadImage1">
            <p v-if="drawerForm.resourceipicture" class="avatarImg">
              <img  :src="drawerForm.resourceipicture" class="avatar">
              <i class="el-icon-error closeImg" @click.stop="closeImg(1)" v-if="isImgClose"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="tips">大图尺寸比例23:14,建议828*504</p>
        </el-form-item>
         <el-form-item label="活动视频：" label-width="100px" prop="resourceviedo">
          <el-upload class="avatar-uploader w480" :disabled="readonly" action :show-file-list="false"
                     :on-success="uploadVideoSuccess"  :before-upload="beforeUploadVideo"
                     :http-request="uploadVideo">
            <p v-if="drawerForm.resourceviedo" class="avatarImg">
              <video v-if="drawerForm.resourceviedo" :src="drawerForm.resourceviedo" class="avatar video-avatar"  controls="controls">
              您的浏览器不支持视频播放
             </video>
              <i class="el-icon-error closeImg" @click.stop="closeImg(2)" v-if="isImgClose"></i>
            </p>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动时间：" label-width="100px" prop="resourcetime">
          <el-date-picker v-model="drawerForm.resourcetime" auto-complete="off"
                          format="yyyy-MM-dd HH:mm:ss" value-format="yyyyMMddHHmmss" type="datetimerange"
                          start-placeholder="开始日期" end-placeholder="结束日期"
                          :disabled="readonly" class="w480"/>
        </el-form-item>
        <el-form-item label="预约时间：" label-width="100px" prop="bespeaktime">
          <el-date-picker v-model="drawerForm.bespeaktime" auto-complete="off"
                          format="yyyy-MM-dd HH:mm:ss" value-format="yyyyMMddHHmmss" type="datetimerange"
                          start-placeholder="开始日期" end-placeholder="结束日期"
                          :disabled="readonly" class="w480"/>
        </el-form-item>
        <el-form-item label="活动简介：" label-width="100px" prop="resourceboards">
          <el-input v-model="drawerForm.resourceboards" resize="none" type="textarea" rows="2" maxlength="100" :disabled="readonly" class="w480"/>
        </el-form-item>
         <el-form-item label="活动标签：" label-width="100px" prop="label">
          <el-select v-model="drawerForm.label" placeholder="请选择" filterable multiple  :multiple-limit="3" :disabled="readonly" clearable class="w480">
            <el-option v-for="_label in labels" :key="_label.labelid"  :label="_label.labelword" :value="_label.labelid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地址：" label-width="100px" prop="address">
        <el-autocomplete popper-class="my-autocomplete" v-model="drawerForm.address"
          :fetch-suggestions="addressSearch" placeholder="请输入地址" @select="handleSelect" class="w480" :disabled="readonly" >
          <i class="el-icon-edit el-input__icon" slot="suffix"></i>
          <template slot-scope="props">
            <div class="name">{{ props.item.title }}</div>
            <span class="addr">{{ props.item.address }}</span>
          </template>
        </el-autocomplete>
       </el-form-item>
       <el-form-item label="地址经度：" label-width="100px" prop="longitude">
          <el-input v-model="drawerForm.longitude" auto-complete="off" placeholder="活动地点经度"
                    :disabled="readonly"/>
        </el-form-item>
        <el-form-item label="地址纬度：" label-width="100px" prop="latitude">
          <el-input v-model="drawerForm.latitude" auto-complete="off" placeholder="活动地址纬度"
                    :disabled="readonly"/>
        </el-form-item>
       <el-form-item label="地图标注：" label-width="100px" prop="address" v-if="newtype==='add'||newtype==='update'">
          <div id="map"></div>
      </el-form-item>
      <el-form-item label="审核结果：" label-width="100px" prop="status" v-if="readonly&&newtype!=='check'">
          <el-radio-group  v-model="drawerForm.status" disabled>
            <el-radio  :label="1" >通过</el-radio>
            <el-radio  :label="3" >不通过</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="审核时间：" label-width="100px" prop="audittime" v-if="readonly&&newtype!=='check'">
          <el-date-picker v-model="drawerForm.audittime" auto-complete="off"
                          format="yyyy-MM-dd HH:mm:ss" value-format="yyyyMMddHHmmss" type="datetime" :disabled="true"/>
      </el-form-item>
      <el-form-item label="处理意见：" label-width="100px" v-if="readonly&&newtype!=='check'">
          <el-input v-model="drawerForm.auditdesc"  placeholder="处理意见" :disabled="true" class="w480"></el-input>
      </el-form-item>
      <el-form-item label="活动详情：" label-width="100px" prop="resourcedetail">
          <QuillEditor v-if="isImgClose" v-model="drawerForm.resourcedetail" style="width:480px"/>
          <div v-else v-html="drawerForm.resourcedetail"  class="ql-editor w480">{{drawerForm.resourcedetail}}</div>
          <p class="tips">图片尺寸：保持宽度一致，宽度不大于1390即可</p>
      </el-form-item>
      </el-form>
      <div class="drawer__footer">
        <el-button type="success"  size="mini" round v-if="newtype==='update'|| newtype==='add'"  @click="submitData" :loading="loading">{{ loading ? '提交中 ...' : '提 交' }}</el-button>
        <el-button type="success" size="mini" round v-if="newtype==='check'"  @click="submitCheck" :loading="loading">{{ loading ? '审核中 ...' : '审 核' }}</el-button>
      </div>
    </div>  
  </el-drawer>
</template>

<script>
import { addFile } from '@/api/stadium';
import { activitySave } from '@/api/activity';
import { isIntegerNotMust, validatePhoneTwo } from '@/utils/validate';
import QuillEditor from '@/components/MyQuillEditor';
export default {
  name: 'addAct',
  data() {
    return {
      formLabelWidth:'80px', //label宽度
      drawSize:'600px',     //折叠框大小
      newtype:'',        //组件类型
      title:'',            //组件标题
      isShow:false,     //是否显示组件
      loading:false,      //提交加载
      longitude: 111.971707,  //经度
      latitude: 28.904437,   //纬度
      map: null,        //地图
      subTypes: {       //资源类型主类
        3: 1       
      },
      drawerForm: {
        resourcetitle: '', //标题
        resourcetypeid: '', //类型
        resourceimage: '',  //封面图
        resourceipicture: '', //详情大图
        resourceboards: '', //简介
        resourcelink: '',   //联系电话
        resourcetime: [], //活动时间
        bespeaktime: [],   //预约时间
        hostunit: '',      //主办单位
        resourceviedo: '',  //活动视频
        maxamount: '',     //最大参加人数
        address: '',     //活动地址
        longitude: '',   //经度
        latitude: '',     //纬度
        resourcedetail: '',   //活动详情
        label: '',       //资源标签
      },
      // 必填项
      drawerRules: {
        resourcetitle: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        resourcetypeid: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
        hostunit: [{ required: true, message: '请输入主办单位', trigger: 'blur' }],
        resourcelink: [{ required: true, message: '请输入联系电话', trigger: 'blur' }, { validator: validatePhoneTwo, trigger: blur }],
        resourceimage: [{ required: true, message: '请输入活动封面图', trigger: 'blur' }],
        resourceboards: [{ required: true, message: '请输入活动简介', trigger: 'blur' }],
        resourceipicture: [{ required: true, message: '请输入活动详情大图', trigger: 'blur' }],
        resourcetime: [{ type: 'array', required: true, message: '请选择活动时间', trigger: 'blur' }],
        bespeaktime: [{ type: 'array', required: true, message: '请选择预约时间', trigger: 'blur' }],
        address: [{ required: true, message: '请输入活动地址', trigger: 'change' }],
        longitude: [{ required: true, message: '请输入活动地点经度', trigger: 'blur' }],
        latitude: [{ required: true, message: '请输入活动地点纬度', trigger: 'blur' }],
        resourcedetail: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
        maxamount: [{ required: true, message: '请输入最大参与人数', trigger: 'blur' }, { validator: isIntegerNotMust, trigger: blur }],
      },
      readonly:false,  //只读
      isImgClose:true, //图片上是否显示可删除按钮
      checkForm: {
        auditdesc: '',
        audittime: ''
      },
      // 必填项
      checkFormRules: {
        status: [{ required: true, message: '选择审核结果', trigger: 'blur' }]
      }
    }
  },
  props: ['showDraw','rtype','resources','editform','labels'], 
  components: {
    QuillEditor
  },
  watch: {
    editform:function(val){
      const _self = this;
      if(!!val){
        _self.drawerForm = val;
        if(_self.rtype==="check"){
          _self.checkForm = val;
          _self.checkForm.audittime = !!val.audittime?val.audittime:_self.getNowTime();
        }
        if(_self.rtype==="update"){
          _self.qqmap(_self.drawerForm.latitude, _self.drawerForm.longitude);
        }
      }
    },
    showDraw: function (val) {
      const _self = this;
      _self.isShow = val;
      if(!!val){
        if(_self.rtype==="add"){
          _self.qqmap(_self.latitude, _self.longitude);
        }
      }
      
    },
    rtype: function (val) {
      const _self = this;
      _self.title = val==='add'?'新增活动':val==='update'?'修改活动':val==='check'?'活动审核':'活动详情';
      _self.newtype = val;
      _self.readonly = (val==='detail' ||  val==='check');
      _self.isImgClose = (val!=='detail' && val!=='check')
    },
  },
  methods: {
    //上传接口
    uploadData(params,val){
      const _self = this;
      addFile(params).then(res => {
        if (res.code === '0000' && res.innercode === '0000') {
          _self.$set(_self.drawerForm, val, res.message);
          _self.$message.success('上传成功');
        } else {
          _self.$message('上传失败,请重新上传')
        }
      })
    },
    //更新接口
    updateData(data) {
      const _self = this;
      console.log(data);
      activitySave(data).then(res => {
        _self.loading = false;
        if (res.code === '0000' && res.innercode === '0000') {
          _self.$message({
            message: _self.newtype === 'add' ? '添加活动成功！' :_self.newtype === 'check' ? '审核活动成功！': '修改活动成功！',
            type: 'success'
          });
          _self.formClose();
          if(_self.newtype === 'add' || _self.newtype === 'check'){
            _self.$emit('resetform',false);
          }
          _self.$emit('updatelist',false);
        } else {
          _self.$message({
            message: _self.newtype === 'add' ? '添加活动失败！' : _self.newtype === 'check' ? '审核活动失败！': '修改活动失败！',
            type: 'error'
          });
        }
      });
    },
    //单条审核
    submitCheck(){
      const _self = this;
      _self.$refs.checkForm.validate((valid) => {
        if (valid) {
          if (_self.checkForm.status == 3 && (_self.checkForm.auditdesc == null || _self.checkForm.auditdesc == '')) {
            _self.$message({
              message: '请填写不通过原因',
              type: 'warning'
            });
            return;
          }
           _self.loading = true;
           _self.updateData(_self.checkForm);
        }else{
          return false;
        }
      })
    },
    //提交数据
    submitData () {
      const _self = this;
      _self.$refs.drawerForm.validate((valid) => {
        if (valid) { // validate success
          _self.loading = true;
          if (_self.drawerForm.resourcetime && _self.drawerForm.resourcetime.length > 1) {
            _self.drawerForm.resourcestarttime = _self.drawerForm.resourcetime[0];
            _self.drawerForm.resourceendtime = _self.drawerForm.resourcetime[1];
            delete _self.drawerForm.resourcetime;
          }
          if (_self.drawerForm.bespeaktime && _self.drawerForm.bespeaktime.length > 1) {
            _self.drawerForm.bespeakstarttime = _self.drawerForm.bespeaktime[0];
            _self.drawerForm.bespeakendtime = _self.drawerForm.bespeaktime[1];
            delete _self.drawerForm.bespeaktime;
          }
          const topTypeId = _self.resources.find(a => a.resourcetypeid === _self.drawerForm.resourcetypeid).upresourcetypeid;
          _self.drawerForm.subType = _self.subTypes[topTypeId];
          _self.updateData(_self.drawerForm);
        } else {
          return false;
        }
      });
    },
    // 上传图片前处理图片
    beforeuploadImage(file) {
      const _self = this;
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        _self.$message.error('图片只能是JPG/PNG格式!');
      }
      if (!isLt2M) {
        _self.$message.error('图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 视频上传处理
    beforeUploadVideo(file) {
      const _self = this;
      var fileSize = file.size / 1024 / 1024 < 50;
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
        _self.$message.error('请上传正确的视频格式');
        return false;
      }
      if (!fileSize) {
        _self.$message.error('视频大小不能超过50MB');
        return false;
      }
    },
    // 封面上传
    uploadImage(image) {
      const _self = this;
      const params = new FormData();
      params.append('file', image.file);
      _self.uploadData(params,'resourceimage');
    },
    // 大图上传
    uploadImage1(image) {
      const _self = this;
      const params = new FormData();
      params.append('file', image.file);
      _self.uploadData(params,'resourceipicture');
    },
    // 上传视频
    uploadVideo(video) {
      const _self = this;
      const params = new FormData();
      params.append('file', video.file);
      _self.uploadData(params,'resourceviedo');

    },
    // 图片上传成功的回调
    uploadImageSuccess(res, file) {
      const _self = this;
      _self.drawerForm.resourceimage = URL.createObjectURL(file.raw);
    },
    // 图片上传成功的回调
    uploadImageSuccess1(res, file) {
      const _self = this;
      _self.drawerForm.resourceipicture = URL.createObjectURL(file.raw);
    },
    // 视频上传成功回调
    uploadVideoSuccess(res, file) {
      const _self = this;
      _self.drawerForm.resourceviedo = URL.createObjectURL(file.raw);
    },
    // 图片删除
    closeImg(id) {
      const _self = this;
      if (id == 0) {
        _self.$set(_self.drawerForm, 'resourceimage', '');
      } else if (id == 1) {
        _self.$set(_self.drawerForm, 'resourceipicture', '');
      } else {
        _self.$set(_self.drawerForm, 'resourceviedo', '');
      }
    },
    //地址搜索
    addressSearch(queryString, cb) {
      if (!queryString) {
        queryString = '汉寿';
      }
      var url = `https://apis.map.qq.com/ws/place/v1/suggestion/?keyword=${queryString}&region=常德&key=UBKBZ-FWC33-HFO3L-3ZNVN-7YP67-YDBCO&output=jsonp&&callback=?`
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp', // 指定服务器返回的数据类型
        success: function (res) {
          if (res) {
            cb(res.data);
          }
        }
      });
    },
    //地址选择
    handleSelect(item) {
      const _self = this;
      _self.latitude = item.location.lat;
      _self.longitude = item.location.lng;
      var o = {
        longitude: _self.longitude,
        latitude: _self.latitude,
        address: item.address
      }
      _self.drawerForm = { ..._self.drawerForm, ...o }
      _self.qqmap(_self.latitude, _self.longitude);
    },
    //地图选点
    qqmap(latitude, longitude) {
       const _self = this;
      _self.$nextTick(() => {
        var myLatlng = new qq.maps.LatLng(latitude, longitude);
        // 定义工厂模式函数
        var myOptions = {
          zoom: 17, // 设置地图缩放级别
          center: myLatlng, // 设置中心点样式
          mapTypeId: qq.maps.MapTypeId.ROADMAP // 设置地图样式详情参见MapType
        }
        // 获取dom元素添加地图信息
        _self.map = new qq.maps.Map(document.getElementById('map'), myOptions)
        _self.marker = new qq.maps.Marker({
          position: myLatlng,
          map: _self.map
        })
        // 添加监听事件
        qq.maps.event.addListener(_self.map, 'click', (e) => {
          _self.latitude = e.latLng.getLat();
          _self.longitude = e.latLng.getLng();
          var url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${_self.latitude},${_self.longitude}&region=常德&key=UBKBZ-FWC33-HFO3L-3ZNVN-7YP67-YDBCO&output=jsonp&&callback=?`
          $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp', // 指定服务器返回的数据类型
            success: function (res) {
              if (res) {
                var address = res.result.address;
                var o = {
                  longitude: _self.longitude,
                  latitude: _self.latitude,
                  address: address
                }
                _self.drawerForm = { ..._self.drawerForm, ...o }
                myLatlng = new qq.maps.LatLng(_self.latitude, _self.longitude);
                _self.marker.setMap(null);
                _self.marker = new qq.maps.Marker({
                  position: myLatlng,
                  map: _self.map
                });
                _self.map.setCenter(myLatlng);
              }
            }
          });
        });
      });
    },
    //关闭表单
    formClose() {
      const _self = this;
      _self.$emit('updatedraw',false);
      _self.loading = false;
      _self.drawerForm = {
        resourcetitle: '', //标题
        resourcetypeid: '', //类型
        resourceimage: '',  //封面图
        resourceipicture: '', //详情大图
        resourceboards: '', //简介
        resourcelink: '',   //联系电话
        resourcetime: [], //活动时间
        bespeaktime: [],   //预约时间
        hostunit: '',      //主办单位
        resourceviedo: '',  //活动视频
        maxamount: '',     //最大参加人数
        address: '',     //活动地址
        longitude: '',   //经度
        latitude: '',     //纬度
        resourcedetail: '',   //活动详情
        label: '',       //资源标签
      }
      _self.$refs.drawerForm.clearValidate();
      _self.isShow = false;
    },
    //当前时间
    getNowTime() {
         var now = new Date();
	       var year = now.getFullYear(); //得到年份
	       var month = now.getMonth(); //得到月份
	       var date = now.getDate(); //得到日期
         var hour = now.getHours(); //得到小时
         var minutes = now.getMinutes(); //分钟
         var seconds = now.getSeconds(); //秒
	       month = month + 1;
	       month = month.toString().padStart(2, "0");
         date = date.toString().padStart(2, "0");
         hour = hour.toString().padStart(2, "0");
         minutes = minutes.toString().padStart(2, "0");
         seconds = seconds.toString().padStart(2, "0");
	       var defaultDate = `${year}${month}${date}${hour}${minutes}${seconds}`;
	       console.log(defaultDate)
	       return defaultDate;
	    },
  }
}

</script>

<style scoped lang="scss">
.drawer__content{
  .el-input,
  .el-select,
  .el-date-editor--datetimerange,
  .el-textarea,
  .el-upload,
  .el-autocomplete{
    width: 185px;
    &.w480{
      width: 480px;
    }
  }
  .w480{
    width: 480px;
    .avatar-uploader-icon{
      width: 480px;
    }
  }
}
#map{
  margin:0 auto;
  width:480px;
  height:200px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 185px;
    height: 61px;
    line-height: 61px;
    text-align: center;
    border: 1px dashed #C0C4CC;
}
.avatar {
    width: 185px;
    height: 61px;
    display: block;
}
.avatarImg{
    width: 185px;
    height: 61px;
    position: relative;
}
.avatar-uploader{
  height: 61px;
}
.closeImg{
    position: absolute;
    right:-5px;
    top:-5px;
    width:20px;
    height: 20px;
    text-align: center;
    font-size: 22px;
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
.drawer__footer{
  text-align: center;
  position: absolute;
  top:6px;
  right:50px;
  .el-button{
    width: 118px;
  }
}
.line{
  height: 10px;
  width: 100%;
  background: #eee;
}
</style>
