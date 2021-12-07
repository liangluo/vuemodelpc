<template>
  <div>
    <!-- <el-card>
      场馆/景点管理
    </el-card>
    <br/> -->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="名称">
          <el-input v-model="query.resourcetitle" placeholder="场景/景点名称" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择" v-model="query.status" filterable clearable>
            <el-option
              v-for="_status in selectOptions.statusOption" :key="_status.id"
              :label="_status.label" :value="_status.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="归属单位">
          <el-select placeholder="请选择" v-model="query.editunit" filterable clearable>
             <el-option v-for="_type in editunitarr" :key="_type.editunit" :label="_type.editunitname" :value="_type.editunit"/>
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型">
          <el-select placeholder="请选择" v-model="query.resourcetype" filterable clearable>
            <el-option-group v-for="group in selectOptions.resources" :key="group.label" :label="group.label">
              <el-option v-for="_type in group.list" :key="_type.resourcetypeid"
                         :label="_type.resourtypename" :value="_type.resourtypename"/>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="queryList(1)">查询</el-button>
          <el-button icon="el-icon-delete" @click="clear()">清空</el-button>
          <el-button type="primary"  @click="stadiumAdd()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!-- Users *** Table -->
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
        <el-table-column label="联系电话" width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcelink }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
          <el-table-column label="归属单位"  :show-overflow-tooltip="true" align='center'>
              <template slot-scope="scope">
                  <span>{{scope.row.editunit=='129'?'汉寿县文化旅游广电体育局':scope.row.editunit=='672'?'汉寿县文化馆':scope.row.editunit=='113'?'汉寿县图书馆':'无'}}</span>
              </template>
          </el-table-column>
        <!-- <el-table-column label="经度"  width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.longitude }}</span>
          </template>
        </el-table-column>
        <el-table-column label="纬度"  width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.latitude }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="最大容客量" width="100" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.maxamount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ selectOptions.status2Option[scope.row.status - 1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="500">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                       v-if="scope.row.status === 1||scope.row.status === 3||scope.row.status === 4">修改
            </el-button>
                        <el-button size="mini" type="primary" @click="createEwm(scope.row)">二维码</el-button>
            <el-button size="mini" type="danger" @click="handleUp(scope.row)" v-if="scope.row.status === 4">上线
            </el-button>
            <el-button size="mini" type="danger" @click="handleDown(scope.row)" v-if="scope.row.status === 1">下线
            </el-button>
            <el-button size="mini" type="danger" @click="handleTop(scope.row)" v-if="scope.row.status === 1&&scope.$index!==0">置顶
            </el-button>
            <el-button size="mini" type="danger" @click="sortDown(scope.$index,scope.row)"
                       v-if="scope.$index !== table.length - 1">下移
            </el-button>
            <el-button size="mini" type="danger" @click="sortUp(scope.$index,scope.row)" v-if="scope.$index !== 0">上移
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="userHandleSizeChange"
        @current-change="userHandleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-card>
    <el-dialog title="场馆/景点信息" :visible.sync="dialogShow" class="dialog" @close='formClose()' :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
     <div class="el-dialog-div">
      <el-form :inline="true" :model="dialogForm" ref="dialogForm" :rules="dialogRules">
        <el-form-item label="场景/景点名称" label-width="140px" prop="resourcetitle">
          <el-input v-model="dialogForm.resourcetitle" placeholder="场景/景点名称"
                    :readonly="dialogType==='detail'"/>
        </el-form-item>
        <el-form-item label="资源类型" label-width="140px" prop="resourcetypeid">
          <el-select placeholder="请选择" v-model="dialogForm.resourcetypeid" filterable
                     :disabled="dialogType==='detail'">
            <el-option-group v-for="group in selectOptions.resources" :key="group.label" :label="group.label">
              <el-option v-for="_type in group.list" :key="_type.resourcetypeid"
                         :label="_type.resourtypename" :value="_type.resourcetypeid"/>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" label-width="140px" prop="resourcelink">
          <el-input v-model="dialogForm.resourcelink" placeholder="联系电话" :readonly="dialogType==='detail'"/>
        </el-form-item>
        <br/>
        <el-form-item label="场景/景点封面图" label-width="140px" prop="resourceimage">
          <el-upload class="avatar-uploader" :disabled="dialogType==='detail'" action :show-file-list="false"
                      :before-upload="beforeAvatarUpload" :http-request="uploadImage">
            <p v-if="dialogForm.resourceimage" class="avatarImg">
              <img  :src="dialogForm.resourceimage" class="avatar">
              <i class="el-icon-error closeImg" @click.stop="closeImg(0)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="场景/景点高清图" label-width="140px" prop="resourceipicture">
          <el-upload class="avatar-uploader" :disabled="dialogType==='detail'" action :show-file-list="false"
                     :before-upload="beforeAvatarUpload" :http-request="uploadImage1">
             <p v-if="dialogForm.resourceipicture" class="avatarImg">
              <img  :src="dialogForm.resourceipicture" class="avatar">
              <i class="el-icon-error closeImg" @click.stop="closeImg(1)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <p style="color: red;margin-left: 140px;font-size: 12px;">封面图尺寸：600*564 / 资讯高清图尺寸：15:9</p>
        <br/>
        <el-form-item label="场景/景点视频" label-width="140px" prop="resourceviedo">
          <el-upload class="avatar-uploader" :disabled="dialogType==='detail'" action :show-file-list="false"
                       :before-upload="beforeUploadVideo" :http-request="uploadVideo">
           <p v-if="dialogForm.resourceviedo" class="avatarImg">
              <video v-if="dialogForm.resourceviedo" :src="dialogForm.resourceviedo" class="avatar video-avatar"  controls="controls">
              您的浏览器不支持视频播放
             </video>
              <i class="el-icon-error closeImg" @click.stop="closeImg(2)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <br/>
        <el-form-item label="天开放时间类型" label-width="140px" >
          <span class="type">每周：</span>
          <el-input v-model="dialogForm.openweekday"  placeholder="每周" :readonly="dialogType==='detail'" style="width:225px"/>
          <br/>
          <span class="type" style="padding-top: 10px;">特定日期开放：</span>
          <el-input v-model="dialogForm.openday" placeholder="特定日期开放"  :readonly="dialogType==='detail'" style="width:225px"/>
          <br/>
          <span class="type" style="padding-top: 10px;">特定日期不开放：</span>
          <el-input v-model="dialogForm.closeday " placeholder="特定日期不开放" :readonly="dialogType==='detail'"  style="width:225px"/>
        </el-form-item>
        <el-form-item label=" " label-width="140px">
          <label style="color:red;">每日，无需填写;<br/>
            每周，填写具体是哪几天开放，1表示星期一，7表示星期日，多日间使用半角逗号分隔，例如1,2,3;<br/>
            特定日期开放，填写具体是几月几日开放，多日间使用半角逗号分隔，例如0201,0616,0919,1227;<br/>
            特定日期不开放，填写具体是几月几日不开放，多日间使用半角逗号分隔，例如0201,0616,0919,1227;
          </label>
        </el-form-item>
        <el-form-item label="主管单位" label-width="140px" prop="hostunit">
          <el-input v-model="dialogForm.hostunit" placeholder="主管单位" :readonly="dialogType==='detail'"/>
        </el-form-item>
          <el-form-item label="归属单位" label-width="140px" prop="editunit">
              <el-select v-model="dialogForm.editunit" placeholder="请选择归属单位" style="width:500px"
                         filterable :disabled="dialogType==='detail'"
              >
                  <el-option v-for="_type in editunitarr" :key="_type.editunit"
                             :label="_type.editunitname" :value="_type.editunit"/>
              </el-select>
          </el-form-item>
        <el-form-item label="开放天时间" label-width="140px" prop="opentime">
          <el-input style="width:500px" v-model="dialogForm.opentime" placeholder="开放天说明"
                    :readonly="dialogType==='detail'"/>
        </el-form-item>
        <el-form-item label=" " label-width="140px">
          <label style="color:red;">如08:30-11:30,14:00-17:30表示开放日的这两个时间段开放</label>
        </el-form-item>
        <el-form-item label="地图" label-width="140px" prop="address">
          <div id="map" style="margin:0 auto;width:500px;height:400px" ></div>
        </el-form-item>
        <el-form-item label="场景/景点地址" label-width="140px" prop="address">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="dialogForm.address"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect" style="width:500px">
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix"
            @click="handleIconClick">
          </i>
          <template slot-scope="props">
            <div class="name">{{ props.item.title }}</div>
            <span class="addr">{{ props.item.address }}</span>
          </template>
        </el-autocomplete>
        </el-form-item>
        <el-form-item label="经度" label-width="140px" prop="longitude">
          <el-input v-model="dialogForm.longitude" placeholder="经度" :readonly="dialogType==='detail'"/>
        </el-form-item>
        <el-form-item label="纬度" label-width="140px" prop="latitude">
          <el-input v-model="dialogForm.latitude" placeholder="纬度" :readonly="dialogType==='detail'"/>
        </el-form-item>
        <br/>
        <el-form-item label="场景/景点详情" label-width="140px" prop="resourcedetail">
          <QuillEditor v-if="dialogType!=='detail'" v-model="dialogForm.resourcedetail" style="width:500px"/>
          <div v-else v-html="dialogForm.resourcedetail" style="width:500px" class="ql-editor">
            {{dialogForm.resourcedetail}}
          </div>
        </el-form-item>
        <p style="color: red;margin-left: 140px;font-size: 12px;">详情图片尺寸：保持宽度一致，宽度不大于1390即可</p>
        <br/>
        <el-form-item label="最大容客量" label-width="140px" prop="maxamount">
          <el-input v-model="dialogForm.maxamount" :readonly="dialogType==='detail'" placeholder="最大容客量"/>
        </el-form-item>
        <el-form-item label="场景/景点公告" label-width="140px">
          <el-input style="width:500px" :readonly="dialogType==='detail'" v-model="dialogForm.resourceboards" resize="none"
                    type="textarea" rows="3" maxlength="1000"/>
        </el-form-item>
        <el-form-item label="标签" label-width="140px" prop="label">
          <el-select v-model="dialogForm.label" placeholder="请选择" filterable multiple readonly :multiple-limit="3" style="width:300px"
                     :disabled="dialogType==='detail'" clearable>
            <el-option v-for="_label in labels" :key="_label.labelid"
                       :label="_label.labelword" :value="_label.labelid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" label-width="140px" prop="auditdesc" v-if="dialogType === 'detail'">
          <el-input v-model="dialogForm.auditdesc" auto-complete="off"  style="width:500px" placeholder="处理意见"></el-input>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="formClose()">取 消</el-button>
        <el-button type="primary"   v-if="dialogType === 'add' || dialogType === 'update'" @click="stadiumSubmit()">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 显示二维码 -->
    <div class="_mod-popup"  id="ewmPopup">
      <div class="mod-popcontainer">
        <div class="mod-popcontainer-content">
          <div class="tit">场馆/景点预约核销二维码</div>
          <div class="qrcode" id="qrcodes"></div>
          <div>右击二维码--图片另存为</div>
        </div>
        <div class="mod-popcontainer-btn flex f-center f-align">
            <div  @click="closepops">我知道了</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { stadiumSave, stadiumList, stadiumReorder, addFile } from '@/api/stadium'
import { resTypeList } from '@/api/resource'
import { labelList } from '@/api/label'

import QuillEditor from '@/components/MyQuillEditor';
import { isIntegerNotMust, validatePhoneTwo } from '@/api/validate';
import { mapSearch, mapGetAddress } from '@/api/activity';
import QRCode from 'qrcodejs2';
export default {
  name: 'PageStadiumManagement',
  data () {
    return {
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
      query: {
        resourcetitle: '',
        status: '',
        resourcetype: '',
        editunit:'',
      },
      subTypes: {
        1: 1,
        2: 2
      },
      table: [],
      tableAll: [],
      loading: false,
      resources: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogShow: false,
      dialogType: 'add',
      editunitarr:[{editunitname:"汉寿县文化旅游广电体育局",editunit:"129"},{editunitname:"汉寿县文化馆",editunit:"672"},{editunitname:"汉寿县图书馆",editunit:"113"}],
      dialogForm: {
		editunit:''
      },
      dialogRules: {
        resourcetitle: [{ required: true, message: '请输入场景/景点名称', trigger: 'blur' }],
        resourcetypeid: [{ required: true, message: '请选择资源类型', trigger: 'blur' }],
		editunit: [{ required: true, message: '请选择归属单位', trigger: 'change' }],
        resourcelink: [{ required: true, message: '请输入联系电话', trigger: 'blur' }, { validator: validatePhoneTwo, trigger: blur }],
        resourceimage: [{ required: true, message: '请输入场景/景点图片', trigger: 'blur' }],
        opentime: [{ required: true, message: '请输入天开放时间', trigger: 'blur' }],
        address: [{ required: true, message: '请输入场景/景点地址', trigger: 'blur' }],
        longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
        latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
        resourcedetail: [{ required: true, message: '请输入场景/景点详情', trigger: 'blur' }],
        maxamount: [{ required: true, message: '请输入最大客容量', trigger: 'blur' }, { validator: isIntegerNotMust, trigger: blur }]
      },
      labels: [],
      longitude: 111.971707,
      latitude: 28.904437,
      map: null,
      marker: null
    }
  },
  components: {
    QuillEditor,
    QRCode
  },
  created: function() {
    this.queryList(1);
    this.typeList();
    this.queryLabelList();
  },
  mounted() {

  },
  methods: {
    stadiumAdd() {
      this.dialogType = 'add';
      this.dialogForm = { status: 4 };
      this.dialogShow = true;
      this.qqmap(this.latitude, this.longitude);
    },
    handleUpdate (row) {
      this.dialogType = 'update';
      this.dialogForm = JSON.parse(JSON.stringify(row));
      this.dialogForm.status = 4;
      this.dialogShow = true;
      if (this.dialogForm.latitude && this.dialogForm.longitude) {
        this.qqmap(this.dialogForm.latitude, this.dialogForm.longitude);
      } else {
        this.qqmap(this.latitude, this.longitude);
      }
    },

    handleDelete(row, isUp) {
      const _self = this;
      const _comment = !isUp ? '进入审核' : '下线';
      const _status = !isUp ? 2 : 4;
      if (row.status === _status) {
        _self.$message({
          message: _comment + '失败, 该场馆/景点已经' + _comment,
          type: 'error'
        });
        return;
      }
      _self.$confirm('请确认该场馆/景点是否' + _comment + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stadiumSave({ resourceid: row.resourceid, status: _status }).then(_result => {
          if (_result.code === '0000' && _result.innercode === '0000') {
            _self.queryList();
            _self.$message({
              message: '场馆/景点' + _comment + '成功！',
              type: 'success'
            });
          } else {
            _self.$message({
              message: '场馆/景点' + _comment + '失败！',
              type: 'error'
            });
          }
        });
      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 详情
    handleDetail (row) {
      this.dialogType = 'detail';
      this.dialogForm = row;
      console.log("详情");
      console.log(row);
      this.dialogShow = true;
      if (this.dialogForm.latitude && this.dialogForm.longitude) {
        this.qqmap(this.dialogForm.latitude, this.dialogForm.longitude);
      } else {
        this.qqmap(this.latitude, this.longitude);
      }
    },
    // 下线
    handleDown(row) {
      this.handleDelete(row, 1);
    },
    // 上线
    handleUp(row) {
      this.handleDelete(row, 0);
    },
    // 置顶
    handleTop(row) {
      const _self = this;
      _self.dialogForm = JSON.parse(JSON.stringify(row));
      const date = new Date();
      let _updateTime = date.getFullYear();
      const month = date.getMonth() + 1;
      _updateTime += (month <= 9 ? '0' : '') + month;
      const strDate = date.getDate();
      _updateTime += (strDate <= 9 ? '0' : '') + strDate;
      const strHours = date.getHours();
      _updateTime += (strHours <= 9 ? '0' : '') + strHours;
      const strMinutes = date.getMinutes();
      _updateTime += (strMinutes <= 9 ? '0' : '') + strMinutes;
      const strSeconds = date.getSeconds() + 1;
      _updateTime += (strSeconds <= 9 ? '0' : '') + strSeconds;
      _self.dialogForm.updatetime = _updateTime;
      _self.stadiumUpdate();
    },
    // 下移
    sortDown(index, row) {
      const _self = this;
      if (index + 1 < _self.table.length) {
        stadiumReorder(row, _self.table[index + 1]);
        setTimeout(function () {
          _self.queryList();
        }, '500');
      }
    },
    // 上移
    sortUp(index, row) {
      const _self = this;
      if (index > 0) {
        stadiumReorder(row, _self.table[index - 1]);
        setTimeout(function () {
          _self.queryList();
        }, '500');
      }
    },
    stadiumUpdate() {
      const _self = this;
      stadiumSave(_self.dialogForm).then(_result => {
        if (_result.code === '0000' && _result.innercode === '0000') {
          _self.queryList();
        } else {
          _self.$message({
            message: '置顶失败',
            type: 'error'
          });
        }
      });
    },
    stadiumSubmit () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this;
          const topTypeId = _self.resources.find(a => a.resourcetypeid === _self.dialogForm.resourcetypeid).upresourcetypeid;
          _self.dialogForm.subType = _self.subTypes[topTypeId];
          stadiumSave(_self.dialogForm).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              _self.dialogShow = false;
              _self.dialogForm = {};
              _self.queryList();
              _self.$message({
                message: _self.dialogType === 'add' ? '添加场馆/景点成功！' : '修改场馆/景点成功！',
                type: 'success'
              });
            } else {
              _self.$message({
                message: _self.dialogType === 'add' ? '添加场馆/景点失败！' : '修改场馆/景点失败！',
                type: 'error'
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    queryList(_currentPage) {
      const _self = this;
      _self.loading = true;
      const _query = {};
      if (_self.query.resourcetitle) {
        _query.resourcetitle = _self.query.resourcetitle;
      }
      if (_self.query.resourcetype) {
        _query.resourtypename = _self.query.resourcetype;
      }
      if (_self.query.status) {
        _query.status = _self.query.status;
      }
      if (_self.query.editunit) {
        _query.editunit = _self.query.editunit;
      }
      if (!_currentPage) {
        _currentPage = _self.currentPage;
      } else {
        _self.currentPage = _currentPage;
      }
      stadiumList(_query, _currentPage, _self.pageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.pageTotal = _message.total;
          _self.table = _message.list;
          _self.table.forEach(_v => {
            const _tempVos = _v.resourceLabelVos;
            const lableout = [];
            if (_tempVos && _tempVos.length > 0) {
              for (let i = 0; i < _tempVos.length; i++) {
                lableout.push(_tempVos[i].sysLabel.labelid);
                _v.label = lableout;
              }
            }
          });
        }
      }).finally(() => _self.loading = false);
    },
    // 上传图片前处理图片
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
    // 场馆图片
    uploadImage(image) {
      const _self = this;
      const params = new FormData()
      params.append('file', image.file)
      addFile(params).then(_result => {
        if (_result.code === '0000' && _result.innercode === '0000') {
          _self.$message.success('上传成功');
          this.$set(_self.dialogForm, 'resourceimage', _result.message);
        } else {
          _self.$message('上传失败,请重新上传')
        }
      })
    },
    // 场馆高清图片上传
    uploadImage1(image) {
      const _self = this;
      const params = new FormData()
      params.append('file', image.file)
      addFile(params).then(_result => {
        if (_result.code === '0000' && _result.innercode === '0000') {
          _self.$message.success('上传成功');
          this.$set(_self.dialogForm, 'resourceipicture', _result.message);
        } else {
          _self.$message('上传失败,请重新上传')
        }
      })
    },
    userHandleSizeChange (size) {
      this.pageSize = size
      this.queryList();
    },
    userHandleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.queryList();
    },
    /* 上传视频 */
    // 上传前回调
    beforeUploadVideo(file) {
      var fileSize = file.size / 1024 / 1024 < 50;
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
        this.$message.error('请上传正确的视频格式');
        return false;
      }
      if (!fileSize) {
        this.$message.error('视频大小不能超过50MB');
        return false;
      }
    },
    // 上传视频
    uploadVideo(video) {
      const _self = this;
      const params = new FormData()
      params.append('file', video.file)
      addFile(params).then(_result => {
        if (_result.code === '0000' && _result.innercode === '0000') {
          _self.$message.success('上传成功');
          this.$set(_self.dialogForm, 'resourceviedo', _result.message);
        } else {
          _self.$message('上传失败,请重新上传')
        }
      })
    },
    // 关闭表单时，重置校验
    formClose() {
      this.dialogShow = false
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.clearValidate();
    },
    // 清空
    clear() {
      this.query.resourcetitle = '';
      this.query.status = '';
      this.query.resourcetype = '';
      this.query.editunit = '';
    },
    // 资源类型下拉
    typeList() {
      const _self = this;
      resTypeList({ upresourcetypeid: 1 }, 0, 0).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.selectOptions.resources[1].list = _message.list;
          _self.resources = _self.resources.concat(_message.list);
        }
      });
      resTypeList({ upresourcetypeid: 2 }, 0, 0).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.selectOptions.resources[2].list = _message.list;
          _self.resources = _self.resources.concat(_message.list);
        }
      });
    },
    queryLabelList() {
      const _self = this;
      labelList({}, 0, 0).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.labels = _message.list;
        }
        _self.labels.unshift({ labelid: 0, labelword: '无' });
      });
    },

    qqmap(latitude, longitude) {
      this.$nextTick(() => {
        var myLatlng = new qq.maps.LatLng(latitude, longitude);
        // 定义工厂模式函数
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
    handleIconClick(ev) {
      console.log(ev);
    },
    // 显示二维码
    createEwm(data) {
      this.qrcode(data);
      document.getElementById('ewmPopup').style.transform = 'translateX(0)';
    },
    // 关闭弹出框
    closepops() {
      document.getElementById('ewmPopup').style.transform = 'translateX(1000%)';
      document.getElementById('qrcodes').innerHTML = '';
    },
    //  生成二维码
    qrcode(data) {
      // http://www.zxinhb.com/webwl/#/destroy/2?tableid=1&subtype=1
      const that = this;
      const qrcode = new QRCode('qrcodes', {
        width: 288,
        height: 288, // 高度
        text: window.location.origin + '/webwl/#/destroy/' + data.resourceid + '?tableid=2&subtype=' + data.subtype // 二维码内容
      });
    },
    // 关闭图片
    closeImg(id) {
      const _self = this;
      if (id == 0) {
        this.$set(_self.dialogForm, 'resourceimage', '');
      } else if (id == 1) {
        this.$set(_self.dialogForm, 'resourceipicture', '');
      } else {
        this.$set(_self.dialogForm, 'resourceviedo', '');
      }
    }

  }

}
</script>

<style>
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
    width: 112px;
    height: 112px;
    line-height: 112px;
    text-align: center;
  }
  .avatar {
    width: 112px;
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
    width: 112px;
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
