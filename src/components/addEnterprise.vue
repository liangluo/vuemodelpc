/* eslint-disable no-sequences */
 <!--
  :showDraw:是否显示drawer
  :rtype:drawer的类型，add,update,detail,addchind
  :resources:资源类型
  :editform: drawer内容
  @updatedraw:更新组件显示状态方法
  @updatelist:更新列表
  @resetform:重置搜索
  -->
<template>
  <el-drawer v-if="isShow" :title="title" :size="drawSize" :wrapperClosable="false" :visible.sync="isShow" direction="rtl" custom-class="act-drawer" ref="drawer" :show-close="true" :before-close="formClose" :modal-append-to-body="false">
    <div class="drawer__content">
      <el-form :model="drawerForm" ref="drawerForm" :rules="drawerRules" :inline="true">
        <el-form-item label="上级企业：" label-width="100px" prop="parentId" v-if="drawerForm.parentId && drawerForm.parentId!=0">
          <el-input v-model="drawerForm.parentName" auto-complete="off" placeholder="上级企业名称" disabled  class="w480"/>
        </el-form-item>
        <el-form-item label="企业名称：" label-width="100px" prop="entName">
          <el-input v-model="drawerForm.entName" auto-complete="off" placeholder="企业名称" :disabled="readonly" />
        </el-form-item>
        <el-form-item label="企业全称：" label-width="100px" prop="entFullname">
          <el-input v-model="drawerForm.entFullname" auto-complete="off" placeholder="企业全称" :disabled="readonly" />
        </el-form-item>
        <el-form-item label="联系人：" label-width="100px" prop="linkName">
          <el-input v-model="drawerForm.linkName" auto-complete="off" placeholder="联系人" :disabled="readonly"/>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="100px" prop="linkMobile">
          <el-input v-model="drawerForm.linkMobile" auto-complete="off" placeholder="联系电话" :disabled="readonly"/>
        </el-form-item>
        <el-form-item label="企业风格：" label-width="100px" prop="pageTheme">
          <el-select placeholder="请选择" v-model="drawerForm.pageTheme" filterable :disabled="readonly">
            <el-option   label="白底黑字" value="1" />
            <el-option   label="灰底黄字" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业状态：" label-width="100px" prop="status">
          <el-select placeholder="请选择" v-model="drawerForm.status" filterable :disabled="readonly">
            <el-option   label="正常" :value="1" />
            <el-option   label="禁用" :value="2" />
          </el-select>
       </el-form-item>
        <el-form-item label="企业地址：" label-width="100px" prop="address">
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
       <el-form-item label="地图标注：" label-width="100px" prop="address" v-if="newtype!=='detail'">
          <div id="map"></div>
      </el-form-item>
      </el-form>
      <div class="drawer__footer">
        <el-button type="success"  size="mini" round v-if="newtype!=='detail'"  @click="submitData" :loading="loading">{{ loading ? '提交中 ...' : '提 交' }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { validatePhoneTwo } from '@/utils/validate';
import { requestEntAdd } from '@/api/user'
export default {
  name: 'addAct',
  data() {
    return {
      drawSize: '600px', // 折叠框大小
      newtype: '', // 组件类型
      title: '', // 组件标题
      isShow: false, // 是否显示组件
      loading: false, // 提交加载
      longitude: 110.635692, // 经度
      latitude: 26.721265, // 纬度
      map: null, // 地图
      drawerForm: {
        entName: '', // 名称
        entFullname: '', // 全称
        linkName: '', // 联系人
        linkMobile: '', // 联系电话
        pageTheme: '1', // 主题
        address: '', // 地址
        longitude: '', // 经度
        latitude: '', // 纬度
        status: 1 // 状态
      },
      // 必填项
      drawerRules: {
        entName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        entFullname: [{ required: true, message: '请熟人企业全称', trigger: 'blur' }],
        linkName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        linkMobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }, { validator: validatePhoneTwo, trigger: blur }],
        address: [{ required: true, message: '请输入活动地址', trigger: 'change' }],
        longitude: [{ required: true, message: '请输入活动地点经度', trigger: 'blur' }],
        latitude: [{ required: true, message: '请输入活动地点纬度', trigger: 'blur' }]
      },
      readonly: false, // 只读
      checkForm: {
        auditdesc: '',
        audittime: ''
      }
    }
  },
  props: ['showDraw', 'rtype', 'resources', 'editform', 'labels'],
  watch: {
    editform: function(val) {
      const _self = this;
      console.log(val)
      if (val) {
        if (_self.rtype === 'addchild') {
          _self.drawerForm.parentId = val.entId
          _self.drawerForm.parentName = val.entName
        } else {
          _self.drawerForm = val;
          if (_self.rtype === 'update') {
            _self.qqmap(_self.drawerForm.latitude, _self.drawerForm.longitude);
          }
        }
      }
    },
    showDraw: function (val) {
      const _self = this;
      _self.isShow = val;
      if (val) {
        if (_self.rtype === 'add' || _self.rtype === 'addchild') {
          _self.qqmap(_self.latitude, _self.longitude);
        }
      }
    },
    rtype: function (val) {
      const _self = this;
      _self.title = val === 'add' ? '新增企业' : val === 'update' ? '修改企业' : val === 'addchild' ? '增加子企业' : '企业详情';
      _self.newtype = val;
      _self.readonly = (val === 'detail');
    }
  },
  methods: {
    // 更新接口
    updateData(data) {
      const _self = this;
      console.log(data);
      requestEntAdd(data).then(res => {
        _self.loading = false;
        if (res.code === '0000' && res.innercode === '0000') {
          _self.$message({
            message: _self.newtype === 'add' || _self.newtype === 'addchild' ? '添加企业信息成功！' : '修改企业信息成功！',
            type: 'success'
          });
          _self.formClose();
          if (_self.newtype === 'add' || _self.newtype === 'addchild' ) {
            _self.$emit('resetform', false);
          }
          _self.$emit('updatelist', false);
        } else {
          _self.$message({
            message: _self.newtype === 'add' || _self.newtype === 'addchild' ? '添加企业信息失败！' : '修改企业信息失败！',
            type: 'error'
          });
        }
      });
    },
    // 提交数据
    submitData () {
      const _self = this;
      _self.$refs.drawerForm.validate((valid) => {
        if (valid) { // validate success
          _self.loading = true;
          _self.updateData(_self.drawerForm);
        } else {
          return false;
        }
      });
    },
    // 地址搜索
    addressSearch(queryString, cb) {
      if (!queryString) {
        queryString = '武冈';
      }
      var url = `https://apis.map.qq.com/ws/place/v1/suggestion/?keyword=${queryString}&region=邵阳&key=UBKBZ-FWC33-HFO3L-3ZNVN-7YP67-YDBCO&output=jsonp&&callback=?`
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
    // 地址选择
    handleSelect(item) {
      const _self = this;
      console.log(item)
      _self.latitude = item.location.lat;
      _self.longitude = item.location.lng;
      var o = {
        longitude: _self.longitude,
        latitude: _self.latitude,
        address: item.address,
        city: item.city,
        district: item.district,
        province: item.province
      }
      _self.drawerForm = { ..._self.drawerForm, ...o }
      _self.qqmap(_self.latitude, _self.longitude);
    },
    // 地图选点
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
                console.log(res);
                var o = {
                  longitude: _self.longitude,
                  latitude: _self.latitude,
                  address: res.result.address,
                  city: res.result.address_component.city,
                  district: res.result.address_component.district,
                  province: res.result.address_component.province,
                  street: res.result.address_component.street
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
    // 关闭表单
    formClose() {
      const _self = this;
      _self.$emit('updatedraw', false);
      _self.loading = false;
      _self.drawerForm = {
        entName: '', // 名称
        entFullname: '', // 全称
        linkName: '', // 联系人
        linkMobile: '', // 联系电话
        address: '', // 地址
        longitude: '', // 经度
        latitude: '', // 纬度
        pageTheme: '1', // 主题
        status: 1 // 状态
      }
      _self.$refs.drawerForm.clearValidate();
      _self.isShow = false;
    },
    // 当前时间
    getNowTime() {
      var now = new Date();
	       var year = now.getFullYear(); // 得到年份
	       var month = now.getMonth(); // 得到月份
	       var date = now.getDate(); // 得到日期
      var hour = now.getHours(); // 得到小时
      var minutes = now.getMinutes(); // 分钟
      var seconds = now.getSeconds(); // 秒
	       month = month + 1;
	       month = month.toString().padStart(2, '0');
      date = date.toString().padStart(2, '0');
      hour = hour.toString().padStart(2, '0');
      minutes = minutes.toString().padStart(2, '0');
      seconds = seconds.toString().padStart(2, '0');
	       var defaultDate = `${year}${month}${date}${hour}${minutes}${seconds}`;
	       console.log(defaultDate)
	       return defaultDate;
	  }
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
  height:350px;
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
/deep/ .el-input.is-disabled .el-input__inner{
  color: #333;
}

</style>
