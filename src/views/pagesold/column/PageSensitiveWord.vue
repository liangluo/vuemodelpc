<template>
  <div>
    <!-- <el-card>
      敏感词管理
    </el-card>
    <br/> -->
    <!--查询条件-->
    <el-card shadow="hover">
      <el-form :inline="true"  :model="query">
        <el-form-item label="敏感词">
          <el-input  placeholder="敏感词" v-model="query.word" clearable></el-input>
        </el-form-item>
        <el-form-item label="敏感词组">
          <el-select  placeholder="请选择"  v-model="query.wordgroup"  multiple filterable>
            <el-option
              v-for="_wordgroup in selectOptions.wordgroupOption" :key="_wordgroup"
              :label="_wordgroup" :value="_wordgroup"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  icon="el-icon-search">查询</el-button>
          <el-button icon="el-icon-delete"  @click="clear()">清空</el-button>
          <el-button type="primary"  @click="addSensitiveWord()" icon="el-icon-plus">新增</el-button>
          <!-- <el-button type="primary"  icon="el-icon-download">查询结果导出</el-button>
          <el-button type="primary"  icon="el-icon-upload2">批量导入</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
    <br/>
    <!--敏感词列表-->
    <el-card shadow="hover">
      <el-button type="primary"  icon="el-icon-delete" style="margin-bottom: 20px;">批量删除</el-button>
      <el-table
        :data="table.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%">
        <el-table-column type="selection" width="55" >
        </el-table-column>
        <el-table-column label="敏感词">
          <template slot-scope="scope">
            <span>{{ scope.row.word }}</span>
          </template>
        </el-table-column>
        <el-table-column label="敏感词组">
          <template slot-scope="scope">
            <span>{{ scope.row.wordgroup }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini">修改</el-button>
            <el-button size="mini" type="danger">删除</el-button>
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

    <!--添加敏感词-->
    <el-dialog title="敏感词添加" :visible.sync="dialogShow" :close-on-click-modal="false" :lock-scroll='false' :append-to-body="true" :destroy-on-close="true">
      <el-form :model="dialogForm" :rules="dialogRules"   :inline="true"  ref="resourcetypeForm" >
        <el-form-item label="敏感词" label-width="120px" prop="word">
          <el-input v-model="dialogForm.word" auto-complete="off"  style="width:565px" placeholder="敏感词"></el-input>
        </el-form-item>
        <el-form-item label="敏感词组" label-width="120px" prop="wordgroup" multiple>
          <el-select v-model="dialogForm.wordgroup" placeholder="请选择"  filterable>
            <el-option
              v-for="_wordgroup in selectOptions.wordgroupOption" :key="_wordgroup"
              :label="_wordgroup" :value="_wordgroup"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="userDialogSubmit()">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: 'PageSensitiveWord',
    data () {
      return {
        selectOptions: {
          wordgroupOption: ["默认", "政治敏感", "色情", "垃圾信息", "污秽言语", "前端过滤使用", "黄段子", "品牌自动审核", "涉疆涉恐", "广告"],
        },

          query: {
            word: '',
            wordgroup: [],
          },
          table: [],
          currentPage: 1,
          pageSize: 10,
          pageTotal: 0,
          dialogShow: false,
          dialogType: '',
          dialogForm: {
            word: '',
            wordgroup: [],
          },
          //必填项
          dialogRules: {
            name: [{required: true, message: '请输入敏感词', trigger: 'blur'}],
            state: [{required: true, message: '', trigger: 'blur'}],
          }

      }
    },
    methods:{
      addSensitiveWord(){
        this.dialogType = 'add',
          this.dialogForm.word = '',
          this.dialogForm.wordgroup = [],
          this.dialogShow = true
      },
      //清空
      clear(){
        this.query.word="";
        this.query.wordgroup=[];
      },

      userHandleSizeChange (size) {
        this.pagesize = size
      },
      userHandleCurrentChange (currentPage) {
        this.currentPage = currentPage
      }
    }
  }
</script>

<style scoped lang="scss">
  /*  .el-table__header .el-table-column--selection .cell .el-checkbox:after {
      content: "全选";
    }*/
</style>
