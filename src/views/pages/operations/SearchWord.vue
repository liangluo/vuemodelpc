<template>
    <div class="SearchWordContainer">
        <!-- 搜索部分 -->
      <el-card>
        <el-form :inline="true" :model="query">
            <el-form-item label="广告名称：">
            <el-input
                v-model="query.swName"
                autocomplete="off"
                placeholder="热词名称 "
                clearable
            ></el-input>
            </el-form-item>
            <el-form-item>
            <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="queryLine()"
                >查询</el-button
            >
            </el-form-item>
            <el-form-item>
            <el-button 
                type="primary" 
                size="small" 
                icon="el-icon-plus"
                @click="addSearchWord()"
                >新增</el-button
            >
            </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
       <el-card>
           <el-table :data="swTable" style="width: 100%"  v-loading="loading">
                <el-table-column type="index" width="50" label="ID"> </el-table-column>
                <el-table-column prop="swName" label="热词名称"> </el-table-column>
                <el-table-column prop="swType" label="绑定类型"> </el-table-column>
                <el-table-column prop="swClickNum" label="热词点击量"> </el-table-column>
                <el-table-column label="操作"  width="350">
                  <template>
                    <el-button size="mini"  @click="addSearchWord()">添加</el-button>
                    <el-button size="mini" >修改</el-button>
                    <el-button size="mini" >查看</el-button>
                    <el-button size="mini" >导出</el-button>
                    <el-button size="mini" type="danger">删除</el-button>
                  </template>
                </el-table-column>
           </el-table>

             <!-- 分页 -->
              <el-pagination
                background
                :current-page="page"
                :page-size="pagesize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageTotal"
                @size-change="userHandleSizeChange"
                @current-change="userHandleCurrentChange"
            >
            </el-pagination>
       </el-card>

         <!-- 新增弹窗 -->
        <el-dialog  
            title="新增"
            :visible.sync="addDialogShow"
            v-loading="addLoading"
            @close="addFormClose()"
            >
            <el-form 
            :model="addForm" 
            ref="addForm" 
            :rules="rules" 
            class="addform"
             :label-position="labelPosition" 
            label-width="100px"
            >
                <el-form-item
                label="热词名称："
                prop="swName"
                width="100"
                >
                    <el-input
                    v-model="addForm.swName"
                    autocomplete="off"
                    placeholder="热词名称"
                    clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                label="绑定类型："
                prop="swType"
                width="100"
                >
                    <el-input
                    v-model="addForm.swType"
                    autocomplete="off"
                    placeholder="绑定类型"
                    clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                label="热词点击量："
                prop="swClickNum"
                width="100"
                >
                    <el-input
                    v-model="addForm.swClickNum"
                    autocomplete="off"
                    placeholder="热词点击量"
                    clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                 label="创建时间："
                 prop="swCreateTime"
                  width="100"
                 >
                  <el-date-picker
                    v-model="addForm.swCreateTime"
                    type="date"
                    placeholder="选择日期"
                    clearable
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormClose()">取 消</el-button>
                <el-button type="primary" @click="addSubmit()">确 定</el-button>
            </div> 
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:'SearchWord',
        data() {
            return {
                query: {}, //搜索列表
                swTable:[
                     {
                         swName:'热词名称',
                         swType:'绑定类型',
                         swClickNum:'111111111',
                         swCreateTime:'2021-6-15'
                     },
                      {
                         swName:'热词名称',
                         swType:'绑定类型',
                         swClickNum:'2222222222',
                         swCreateTime:'2021-6-15'
                     },
                      {
                         swName:'热词名称',
                         swType:'绑定类型',
                         swClickNum:'333333333',
                         swCreateTime:'2021-6-15'
                     },
                      {
                         swName:'热词名称',
                         swType:'绑定类型',
                         swClickNum:'444444444',
                         swCreateTime:'2021-6-15'
                     },
                      {
                         swName:'热词名称',
                         swType:'绑定类型',
                         swClickNum:'555555555',
                         swCreateTime:'2021-6-15'
                     }
                ],//搜索热词表格数据
                loading:false,
                addForm:{},//新增弹窗数据
                addLoading: false,
                addDialogShow:false,//新增弹窗
                labelPosition: 'right',
                 page: 1, //当前页
                pagesize: 10, //每页条数
                pageTotal: 100, // 总个数
                rules:{
                    swName: [
                    { required: true, message: "请输入热词名称", trigger: "blur" }
                    ],
                    swType: [
                    { required: true, message: "请输入绑定类型", trigger: "blur" }
                    ],
                    swClickNum: [
                    { required: true, message: "请输入热词点击量", trigger: "blur" }
                    ],
                     swCreateTime: [
                    { required: true, message: "请输入创建时间", trigger: "blur" }
                    ]
                 },
            }
        },
        methods: {
            //新增弹窗确认按钮
          addSubmit() {

          },  
            //新增弹窗关闭按钮
          addFormClose() {
              this.addDialogShow = false;
          },
            //新增
          addSearchWord() {
              this.addDialogShow = true;
          },
             //查询
          queryLine() {
            this.loading = false;
            const _query = {};
            if (!!this.query.swName) {
                _query["swName"] = this.query.swName;
            }
            //   if (this.query.swName) {
            //     
            //     linedetail(_query).then((res) => {
            //       if (res.data.innercode === "0000" && res.data.code === "0000") {
            //         this.lineData = [];
            //         const message = res.data.message;
            //         if (message != null) {
            //           this.lineData = message;
            //         }
            //       }
            //     });
            //   }
            },
            //分页  每页条数
            userHandleSizeChange(size) {
              this.pagesize = size;
            //   this.queryLine();
            },
            //分页  当前页
            userHandleCurrentChange(currentPage) {
              this.page = currentPage;
            //   this.queryLine();
            },
         },
    }
</script>

<style lang="scss" scoped>
.SearchWordContainer{
    margin: 20px;
}
.addform /deep/.el-form-item__content{
    width: 300px;
    display: flex;
}
/deep/.el-date-editor.el-input, 
/deep/.el-date-editor.el-input__inner {
    width: 300px;
}
/deep/.el-pagination{
 margin: 10px 0;
}
</style>