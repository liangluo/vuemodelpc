<template>
    <div class="ActQueryContainer">
      <!-- 搜索部分 -->
      <el-card>
        <el-form :inline="true" :model="query">
            <el-form-item label="活动名称：">
            <el-input
                v-model="query.activityName"
                autocomplete="off"
                placeholder="活动名称"
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
                @click="addActivity()"
                >新增</el-button
            >
            </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格 -->
       <el-card>
           <el-table :data="activityTable" style="width: 100%"  v-loading="loading">
                <el-table-column type="index" width="50" label="ID"> </el-table-column>
                <el-table-column prop="userNickname" label="用户昵称"> </el-table-column>
                <el-table-column prop="regDate" label="报名时间"> </el-table-column>
                 <el-table-column prop="userName" label="联系人"> </el-table-column>
                <el-table-column prop="telephone" label="电话"> </el-table-column>
                <el-table-column label="操作"  width="350">
                  <template>
                    <el-button size="mini"  @click="addActivity()">添加</el-button>
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
                label="用户昵称："
                prop="userNickname"
                width="100"
                >
                    <el-input
                    v-model="addForm.userNickname"
                    autocomplete="off"
                    placeholder="用户昵称"
                    clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                 label="报名时间："
                 prop="regDate"
                  width="100"
                 >
                  <el-date-picker
                    v-model="addForm.regDate"
                    type="date"
                    placeholder="选择日期"
                    clearable
                    >
                    </el-date-picker>
                </el-form-item>
                 <el-form-item
                    label="联系人："
                    prop="userName"
                    >
                    <!-- <el-select v-model="addForm.userName" placeholder="请选择联系人">
                        <el-option
                        v-for="item in userData"
                        :key="item.userid"
                        :label="item.userName"
                        :value="item.userid"
                        >
                        </el-option>
                    </el-select> -->
                    <el-input
                     v-model="addForm.userName"
                     autocomplete="off"
                     placeholder="联系人"
                     clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                 label="电话："
                 prop="telephone"
                 width="100"
                >
                    <el-input
                    v-model="addForm.telephone"
                    autocomplete="off"
                    placeholder="电话"
                    clearable
                    maxlength="11"
                    ></el-input>
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
        name:'ActQuery',
        data() {
            return {
                query: {}, //搜索列表
                activityTable:[
                     {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     },
                     {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     },
                      {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     },
                      {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     },
                      {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     },

                      {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     }, {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     },

                      {
                         userNickname:'用户昵称',
                         regDate:'2021-06-15',
                         userName:'张三',
                         telephone:'1224565215'
                     },
                ],//活动表格
                loading:false,
                addForm:{},//新增弹窗数据
                addLoading: false,
                addDialogShow:false,//新增弹窗
                labelPosition: 'right',
                page: 1, //当前页
                pagesize: 10, //每页条数
                pageTotal: 100, // 总个数
                rules:{
                    userName: [
                     { required: true, message: "请输入用户昵称", trigger: "blur" }
                    ],
                    regDate: [
                     { required: true, message: "请输入报名时间", trigger: "blur" }
                    ],
                    userName: [
                        { required: true, message: "请输入联系人", trigger: "blur" }
                    ],
                    telephone: [
                     { required: true, message: "请输入电话", trigger: "blur" }
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
         //新增活动
         addActivity() {
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
.ActQueryContainer{
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