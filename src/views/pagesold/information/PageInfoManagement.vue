<template>
  <div>
    <!-- <el-card>
      资讯管理
    </el-card>
    <br/> -->
    <!--查询条件-->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="资讯标题">
          <el-input placeholder="资讯标题" v-model="query.resourcetitle" clearable/>
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
        <el-form-item label="资源类型名称">
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
          <el-button type="primary" @click="infoAdd()" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!--资讯列表-->
    <el-card shadow="hover">
      <el-table :data="table" style="width: 100%" v-loading="loading">
        <el-table-column  label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" :show-overflow-tooltip="true" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.resourcetitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.resourtypename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.resourcesource}}</span>
          </template>
        </el-table-column>
          <el-table-column label="归属单位"  :show-overflow-tooltip="true" align='center'>
              <template slot-scope="scope">
                  <span>{{scope.row.editunit==129?'汉寿县文化旅游广电体育局':scope.row.editunit==672?'汉寿县文化馆':scope.row.editunit==113?'汉寿县图书馆':'无'}}</span>
              </template>
          </el-table-column>
        <el-table-column label="创建时间" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{ selectOptions.status2Option[scope.row.status - 1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='500'>
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                       v-if="scope.row.status === 1||scope.row.status === 3||scope.row.status === 4">修改
            </el-button>
            <el-button size="mini" type="danger" @click="sendData(scope.row)" v-if="scope.row.status === 1">{{scope.row.publishflag==1?'取消推送':'推送资源'}}
            </el-button>
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

    <!--添加/修改/查看资讯-->
    <el-dialog title="资讯信息" v-if="dialogShow==true"  :visible.sync="dialogShow" @close="formClose()" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true" >
      <div class="el-dialog-div">
      <el-form :model="dialogForm" :rules="dialogRules" :inline="true" ref="dialogForm">
        <el-form-item label="资讯标题" label-width="120px" prop="resourcetitle">
          <el-input v-model="dialogForm.resourcetitle" auto-complete="off" placeholder="资讯标题" style="width:500px"
                    :readonly="dialogType==='detail'"/>
        </el-form-item>
        <el-form-item label="资源类型" label-width="120px" prop="resourcetypeid">
          <el-select placeholder="请选择" v-model="dialogForm.resourcetypeid" filterable
                     :disabled="dialogType==='detail'" style="width:500px">
            <el-option-group v-for="group in selectOptions.resources" :key="group.label" :label="group.label">
              <el-option v-for="_type in group.list" :key="_type.resourcetypeid"
                         :label="_type.resourtypename" :value="_type.resourcetypeid"/>
            </el-option-group>
          </el-select>
        </el-form-item>
          <el-form-item label="归属单位" label-width="120px" prop="editunit">
              <el-select v-model="dialogForm.editunit" placeholder="请选择归属单位" style="width:500px"
                         filterable :disabled="dialogType==='detail'"
              >
                  <el-option v-for="_type in editunitarr" :key="_type.editunit"
                             :label="_type.editunitname" :value="_type.editunit"/>
              </el-select>
          </el-form-item>
        <br/>
        <el-form-item label="资讯封面图" label-width="120px" prop="resourceimage">
          <el-upload class="avatar-uploader" :disabled="dialogType==='detail'" action :show-file-list="false"
                     :before-upload="beforeAvatarUpload"  :http-request="uploadImage">
            <p v-if="dialogForm.resourceimage" class="avatarImg">
              <img  :src="dialogForm.resourceimage" class="avatar">
              <i class="el-icon-error closeImg" @click.stop="closeImg(0)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="资讯高清图" label-width="180px" prop="resourceipicture">
          <el-upload class="avatar-uploader" :disabled="dialogType==='detail'" action :show-file-list="false"
                      :before-upload="beforeAvatarUpload"  :http-request="uploadImage1">
            <p v-if="dialogForm.resourceipicture" class="avatarImg">
              <img  :src="dialogForm.resourceipicture" class="avatar">
              <i class="el-icon-error closeImg" @click.stop="closeImg(1)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <p style="color: red;margin-left: 120px;font-size: 12px;">封面图尺寸：678*390 / 高清图尺寸：15:9</p>
        <br/>
        <el-form-item label="资讯视频" label-width="120px" prop="resourceviedo">
          <el-upload class="avatar-uploader" :disabled="dialogType==='detail'" action :show-file-list="false"
                      :before-upload="beforeUploadVideo"  :http-request="uploadVideo">
            <p v-if="dialogForm.resourceviedo" class="avatarImg">
              <video v-if="dialogForm.resourceviedo" :src="dialogForm.resourceviedo" class="avatar video-avatar"  controls="controls">
              您的浏览器不支持视频播放
             </video>
              <i class="el-icon-error closeImg" @click.stop="closeImg(2)"></i>
            </p>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="资讯来源" label-width="120px" prop="resourcesource">
          <el-input v-model="dialogForm.resourcesource" auto-complete="off" style="width:500px"
                    placeholder="资讯来源" :readonly="dialogType==='detail'" />
        </el-form-item>
        <br/>
        <el-form-item label="资讯详情" label-width="120px" prop="resourcedetail">
          <QuillEditor v-if="dialogType!=='detail'" v-model="dialogForm.resourcedetail" style="width: 500px;"/>
          <div v-else v-html="dialogForm.resourcedetail" style="width: 500px;" class="ql-editor">
            {{dialogForm.resourcedetail}}
          </div>
        </el-form-item>
        <p style="color: red;margin-left: 120px;font-size: 12px;">详情图片尺寸：保持宽度一致，宽度不大于1390即可</p>
        <br/>
        <el-form-item label="标签" label-width="120px" prop="label">
          <el-select v-model="dialogForm.label" placeholder="请选择" filterable multiple  readonly :multiple-limit="3" style="width:500px"
                     :disabled="dialogType==='detail'" clearable>
            <el-option v-for="_label in labels" :key="_label.labelid"
                       :label="_label.labelword" :value="_label.labelid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" label-width="120px" prop="suggest" v-if="dialogType === 'detail'">
          <el-input v-model="dialogForm.suggest" auto-complete="off" style="width:500px" placeholder="处理意见"/>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="formClose()">取 消</el-button>
        <el-button type="primary"  v-if="dialogType === 'add' || dialogType === 'update'"  @click="infoSubmit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { infoSave, infoList, infoReorder } from '@/api/info'
import { resTypeList } from '@/api/resource'
import { publishNews } from '@/api/publish'
import { labelList } from '@/api/label'
import { addFile } from '@/api/stadium';
import QuillEditor from '@/components/MyQuillEditor';

export default {
  name: 'PageInfoManagement',
  data() {
    return {
      selectOptions: {
        statusOption: [
          { id: 1, label: '正常' }, { id: 2, label: '审核中' },
          { id: 3, label: '审核不通过' }, { id: 4, label: '下线' }
        ],
        status2Option: ['正常', '审核中', '审核不通过', '下线'],
        tab1Option: [],
        tab2Option: [],
        tab3Option: [],
        resources: {
          4: { label: '文化', list: [] },
          5: { label: '资讯', list: [] }
        }
      },
      query: {
        resourcetitle: '',
        status: '',
        editunit:'',
        resourcetype: ''
      },
      subTypes: {
        4: 1,
        5: 2
      },
      table: [],
      editunitarr:[{editunitname:"汉寿县文化旅游广电体育局",editunit:129},{editunitname:"汉寿县文化馆",editunit:672},{editunitname:"汉寿县图书馆",editunit:113}],
	  loading: false,
      resources: [],
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogShow: false,
      dialogType: '',
      dialogForm: {},
      // 必填项
      dialogRules: {
        resourcetitle: [{ required: true, message: '请输入资讯标题', trigger: 'blur' }],
        resourcetypeid: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
		editunit: [{ required: true, message: '请选择归属单位', trigger: 'change' }],
        resourceimage: [{ required: true, message: '请输入资讯图片', trigger: 'blur' }],
        resourcedetail: [{ required: true, message: '请输入资讯详情', trigger: 'blur' }]
      },
      labels: []
    }
  },
  components: {
    QuillEditor
  },
  created: function() {
    this.queryList(1);
    this.typeList();
    this.queryLabelList();
  },
  methods: {
    infoAdd() {
      this.dialogType = 'add';
      this.dialogForm = { status: 4 };
      this.dialogShow = true;
    },
    handleUpdate (row) {
      this.dialogType = 'update';
      this.dialogForm = JSON.parse(JSON.stringify(row));
      this.dialogForm.status = 4;
      this.dialogShow = true;
    },

    handleDelete(row, isUp) {
      const _self = this;
      const _comment = !isUp ? '进入审核' : '下线';
      const _status = !isUp ? 2 : 4;
      if (row.status === _status) {
        _self.$message({
          message: _comment + '失败, 该资讯已经' + _comment,
          type: 'error'
        });
        return;
      }
      _self.$confirm('请确认该资讯是否' + _comment + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        infoSave({ resourceid: row.resourceid, status: _status }).then(_result => {
          if (_result.code === '0000' && _result.innercode === '0000') {
            _self.queryList();
            _self.$message({
              message: '资讯' + _comment + '成功！',
              type: 'success'
            });
          } else {
            _self.$message({
              message: '资讯' + _comment + '失败！',
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
      this.dialogShow = true;
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
      _self.infoUpdate();
    },
    // 下移
    sortDown(index, row) {
      const _self = this;
      if (index + 1 < _self.table.length) {
        infoReorder(row, _self.table[index + 1]);
        setTimeout(function () {
          _self.queryList();
        }, '500');
      }
    },
    // 上移
    sortUp(index, row) {
      const _self = this;
      if (index > 0) {
        infoReorder(row, _self.table[index - 1]);
        setTimeout(function () {
          _self.queryList();
        }, '500');
      }
    },
    // 推送
    sendData(row) {
      const _self = this;
      if (row.status !== 1) {
        _self.$message({
          message: '未上线的资讯不能推送.',
          type: 'error'
        });
        return;
      }
      _self.$confirm('请确认是否' + (row.publishflag == 1 ? '取消' : '') + '推送?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.publishflag != 1) {
          publishNews(row).then(_pubResult => {
            if (_pubResult.code === '0000' && _pubResult.innercode === '0000') {
              infoSave({ resourceid: row.resourceid, publishflag: 1 }).then(_result => {
                if (_result.code === '0000' && _result.innercode === '0000') {
                  _self.queryList();
                  _self.$message({
                    message: '资讯已推送！',
                    type: 'success'
                  });
                }
              });
            } else {
              _self.$message({
                message: '资讯' + (row.publishflag == 1 ? '取消' : '推送') + '失败！',
                type: 'error'
              });
            }
          })
        } else {
          infoSave({ resourceid: row.resourceid, publishflag: 0 }).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              _self.queryList();
              _self.$message({
                message: '资讯已取消推送！',
                type: 'success'
              });
            }
          });
        }
      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    infoUpdate() {
      const _self = this;
      infoSave(_self.dialogForm).then(_result => {
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
    infoSubmit () {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) { // validate success
          const _self = this;
          const topTypeId = _self.resources.find(a => a.resourcetypeid === _self.dialogForm.resourcetypeid).upresourcetypeid;
          _self.dialogForm.subType = _self.subTypes[topTypeId];
          infoSave(_self.dialogForm).then(_result => {
            if (_result.code === '0000' && _result.innercode === '0000') {
              _self.dialogShow = false;
              _self.dialogForm = {};
              _self.queryList();
              _self.$message({
                message: _self.dialogType === 'add' ? '添加资讯成功！' : '修改资讯成功！',
                type: 'success'
              });
            } else {
              _self.$message({
                message: _self.dialogType === 'add' ? '添加资讯失败！' : '修改资讯失败！',
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
      infoList(_query, _currentPage, _self.pageSize).then(_resultData => {
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
    // 资讯图片
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
    // 资讯高清图片上传
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

    userHandleSizeChange (size) {
      this.pageSize = size
      this.queryList();
    },
    userHandleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.queryList();
    },
    // 资源类型下拉
    typeList() {
      const _self = this;
      resTypeList({ upresourcetypeid: 4 }, 0, 0).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.selectOptions.resources[4].list = _message.list;
          _self.resources = _self.resources.concat(_message.list);
        }
      });
      resTypeList({ upresourcetypeid: 5 }, 0, 0).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.selectOptions.resources[5].list = _message.list;
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

<style scoped lang="scss">
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #C0C4CC;
  }
  .avatarImg{
     width: 100px;
    height: 100px;
    position: relative;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
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
