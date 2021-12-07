<template>
  <div>
    <!-- <el-card>
      场馆/景点预约查询
    </el-card>
    <br/> -->
    <el-card shadow="hover">
      <el-form :inline="true" :model="query">
        <el-form-item label="名称:">
         <el-input v-model="query.resourcename" placeholder="场馆/景点名称" clearable/>
        </el-form-item>
        <!--<el-form-item label="资源类型">
          <el-select placeholder="请选择" v-model="query.tableid" filterable clearable>
            <el-option
              v-for="_table in subTypeOption" :key="_table.value"
              :label="_table.label" :value="_table.value"/>
          </el-select>
        </el-form-item>-->
        <el-form-item label="预约日期：">
          <el-date-picker
            v-model="query.querytime"
            value-format="yyyyMMddHHmmss"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择" v-model="query.status" filterable clearable>
            <el-option
              v-for="_table in statusOption" :key="_table.value"
              :label="_table.label" :value="_table.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"  @click="queryList(1)">查询</el-button>
          <el-button icon="el-icon-delete" @click="clear()">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!-- Users *** Table -->
    <el-card shadow="hover">
        <el-table :data="table" style="width: 100%"  v-loading="loading">
        <el-table-column label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.bespeakid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <span>{{  scope.row.resourcetitle  }}</span>
          </template>
        </el-table-column>
         <el-table-column label="联系人" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.bespeaklinkman }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.createtime">{{ scope.row.createtime | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约日期" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.bespeakday">{{ scope.row.bespeakday | formatDBDateToDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约人数" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.bespeakamount }}</span>
          </template>
        </el-table-column>
         <el-table-column label="预约状态" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status=='1'?'正常':scope.row.status=='2'?'已取消':'已入场'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">明细</el-button>
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

    <!--预约明细-->
    <el-dialog title="预约明细" :visible.sync="dialogShow" class="dialog" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <div class="el-dialog-div">
      <el-form :inline="true" :model="dialogForm"  ref="dialogForm" >
        <el-form-item label="场馆/景点名称：" label-width="140px" prop="resourcetitle">
          <el-input v-model="dialogForm.resourcetitle" placeholder="场馆/景点名称"  readonly/>
        </el-form-item>
        <el-form-item label="预约联系人：" label-width="140px" prop="bespeaklinkman">
          <el-input v-model="dialogForm.bespeaklinkman" placeholder="预约联系人" readonly/>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="140px" prop="bespeaklinkmobile">
          <el-input v-model="dialogForm.bespeaklinkmobile" placeholder="联系电话" readonly/>
        </el-form-item>
        <el-form-item label="预约人数：" label-width="140px" prop="bespeakamount">
          <el-input v-model="dialogForm.bespeakamount" placeholder="预约人数" readonly/>
        </el-form-item>
        <el-form-item label="成年人数量：" label-width="140px" prop="adultamount">
          <el-input v-model="dialogForm.adultamount" placeholder="成年人数量" readonly/>
        </el-form-item>
        <el-form-item label="未成年人数量：" label-width="140px" prop="minoramount">
          <el-input v-model="dialogForm.minoramount" placeholder="未成年人数量" readonly/>
        </el-form-item>
        <el-form-item label="创建日期：" label-width="140px" prop="createtime">
          <el-input v-model="createtime" placeholder="创建日期" readonly/>
        </el-form-item>
        <el-form-item label="预约日期：" label-width="140px" prop="bespeakday">
          <el-input v-model="bespeakday" placeholder="预约日期" readonly/>
        </el-form-item>
        <el-form-item label="状态：" label-width="140px" prop="status">
          <el-input v-model="status" placeholder="状态" readonly/>
        </el-form-item>
      </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { subscribeList } from '@/api/stadium'
export default {
  name: 'PageStadiumManagement',
  data () {
    return {
      subTypeOption: [{
        value: 1,
        label: '活动类型'
      }, {
        value: 2,
        label: '场馆类型'
      }],
      statusOption: [{
        value: 1,
        label: '正常'
      }, {
        value: 2,
        label: '已取消'
      }, {
        value: 3,
        label: '已入场'
      }],
      query: {
        querytime: '',
        resourcename: ''
      },
      status: '',
      bespeakday: '',
      createtime: '',
      table: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogShow: false,
      dialogType: 'detail',
      resourceSiteVo: '',
      dialogForm: {
      },
      checkDialogShow: false

    }
  },
  created: function () {
    this.queryList(1);
  },
  methods: {
    // 查询
    queryList(_currentPage) {
      const _self = this;
      _self.loading = true;
      const _query = {
        tableid: 2
      };
      if (_self.query.resourcename) {
        _query.resourcetitle = _self.query.resourcename;
      }
      if (_self.query.status) {
        _query.status = _self.query.status;
      }
      if (_self.query.querytime) {
        _self.startTime = _self.query.querytime[0],
        _self.endTime = _self.query.querytime[1],
        _query.startTime = _self.startTime;
        _query.endTime = _self.endTime;
      }
      if (!_currentPage) {
        _currentPage = _self.currentPage;
      } else {
        _self.currentPage = _currentPage;
      }
      subscribeList(_query, _currentPage, _self.pageSize).then(_resultData => {
        if (_resultData.code === '0000' && _resultData.innercode === '0000') {
          const _message = _resultData.message;
          _self.pageTotal = _message.total;
          _self.table = _message.list;
         _self.table.forEach(_v => {
            const _tempVos = _v.resourceLabelVos;
            const lableout = [];
            if (_tempVos && _tempVos.length > 0) {
              for (let i = 0; i < _tempVos.length; i++) {
                lableout.push(_tempVos[i].sysLabel.labelword);
                _v.label = lableout;
              }
            }
          });
        }
      }).finally(() => _self.loading = false);
    },

    // 详情

    handleDetail (index, row) {
      this.dialogType = 'detail'
      this.dialogForm = row;
      this.resourceSiteVo = row.resourceSiteVo;
      this.dialogForm.resourcetitle = row.resourcetitle;
      if (this.dialogForm.status == 1) {
        this.status = '正常'
      }
      if (this.dialogForm.status == 2) {
        this.status = '已取消'
      }
      if (this.dialogForm.status == 3) {
        this.status = '已入场'
      }
      if (this.dialogForm.bespeakday) {
        this.bespeakday = this.dialogForm.bespeakday.substring(0, 4) + '-' + this.dialogForm.bespeakday.substring(4, 6) + '-' + this.dialogForm.bespeakday.substring(6, 8)
      }
      if (this.dialogForm.createtime) {
        this.createtime = this.dialogForm.createtime.substring(0, 4) + '-' + this.dialogForm.createtime.substring(4, 6) + '-' + this.dialogForm.createtime.substring(6, 8)
      }
      this.dialogShow = true;
    },
    // 页码
    userHandleSizeChange (size) {
      this.pageSize = size;
      this.queryList()
    },
    userHandleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.queryList()
    },
    // 清空
    clear() {
      this.query.resourcename = '';
      this.query.querytime = '';
      this.query.status = '';
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
    overflow: hidden;
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
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
