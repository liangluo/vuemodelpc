<template>
    <div class="adverContainer">
         <!-- 搜索部分 -->
      <el-card>
        <el-form :inline="true" :model="query">
            <el-form-item label="广告名称：">
            <el-input
                v-model="query.adName"
                autocomplete="off"
                placeholder="广告名称 "
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
                @click="addPic()"
                >新增</el-button
            >
            </el-form-item>
        </el-form>
      </el-card>

        <!-- 表格 -->
      <el-card>
           <el-table :data="adTable" style="width: 100%"  v-loading="loading">
                <el-table-column type="index" width="50" label="ID"> </el-table-column>
                <el-table-column prop="adName" label="广告名称"> </el-table-column>
                <el-table-column prop="adImage" label="广告图片"> 
                     <template slot-scope="scope">
                        <img :src="scope.row.adImage" alt="" class="adImage"/>
                    </template>
                </el-table-column>
                <el-table-column prop="adDes" label="广告描述"> </el-table-column>
                <el-table-column prop="adClickNum" label="广告点击量"> </el-table-column>
                <el-table-column label="操作"  width="350">
                  <template>
                    <el-button size="mini"  @click="addPic()">添加</el-button>
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
          label="广告名称："
          prop="adName"
          width="100"
         >
            <el-input
             v-model="addForm.adName"
             autocomplete="off"
             placeholder="广告名称"
             clearable
            ></el-input>
        </el-form-item>
         <el-form-item
          label="广告图片："
          prop="adName"
          width="100"
         >
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
             v-model="addForm.adImage"
            >
              <img v-if="adImage" :src="adImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
           </el-upload>         
        </el-form-item>
         <el-form-item
          label="广告描述："
          prop="adDes"
          width="100"
         >
            <el-input
             v-model="addForm.adDes"
             autocomplete="off"
             placeholder="广告描述"
             clearable
            ></el-input>
        </el-form-item>
         <el-form-item
          label="广告点击量："
          prop="adClickNum"
          width="100"
         >
            <el-input
             v-model="addForm.adClickNum"
             autocomplete="off"
             placeholder="广告点击量"
             clearable
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
    name:'AdverManage',
    data() {
        return {
            query: {}, //搜索列表
            loading:false,
            adTable:[
                {
                    adName:'广告名称111',
                    adImage: require('@/assets/loginbg.png'),
                    adDes:'广告描述111',
                    adClickNum:'111111'
                },
                {
                    adName:'广告名称222',
                    adImage: require('@/assets/loginbg.png'),
                    adDes:'广告描述222',              
                    adClickNum:'222222'
                },
                {
                    adName:'广告名称333',
                    adImage: require('@/assets/loginbg.png'),
                    adDes:'广告描述333',
                    adClickNum:'33333'
                },
                {
                    adName:'广告名称444',
                     adImage: require('@/assets/loginbg.png'),
                    adDes:'广告描述444',
                    adClickNum:'44444'
                }
            ],//广告表格数据
            addForm:{},//新增弹窗数据
            addLoading: false,
            addDialogShow:false,//新增弹窗
            rules:{
             adName: [
             { required: true, message: "请输入广告名称", trigger: "blur" },
             ],
             adDes: [
             { required: true, message: "请输入广告描述", trigger: "blur" },
             ],
             adClickNum: [
             { required: true, message: "请输入广告点击量", trigger: "blur" },
             ]
             },
            adImage: '',
            labelPosition: 'right',
            page: 1, //当前页
            pagesize: 10, //每页条数
            pageTotal: 100, // 总个数
            }
    },
    methods: {
         //新增弹窗确认按钮
        addSubmit() {
              //   this.$refs.addForm.validate((valid) => {
            //     if (valid) {
                //   const _self = this;
            //       this.addLoading= true;
            //       updateline(_self.addForm).then((res) => {
            //         if (res.innercode === "0000" && res.message != null) {
            //           this.getData();
            //           this.$message({
            //             message: "修改项目线成功！",
            //             type: "success",
            //           });
            //         } else {
            //           this.$message({
            //             message: "修改项目线失败！",
            //             type: "error",
            //           });
            //         }
            //         this.addLoading= false;
            //         this.addDialogShow= false;
            //   
            //       });
            //     }
            //   })
        },
        //新增弹窗关闭按钮
        addFormClose() {
             this.addDialogShow = false;
        },
        //新增
       addPic() {
         this.addDialogShow = true;
       },
        //查询
      queryLine() {
        this.loading = false;
        const _query = {};
        if (!!this.query.adName) {
            _query["adName"] = this.query.adName;
        }
        //   if (this.query.adName) {
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
        //图片上传成功
      handleAvatarSuccess(res, file) {
        this.adImage = URL.createObjectURL(file.raw);
      },
      //图片上传之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJPG) {
          this.$message.error('请上传图片');
        }
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
    
    }
}
</script>

<style lang="scss" scoped>
.adverContainer{
    margin: 20px;
}
.addform /deep/.el-form-item__content{
    width: 300px;
    display: flex;
}
.adImage{
    width: 50px;
    height: 50px;
}
.avatar-uploader /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.avatar-uploader /deep/.el-upload:hover {
    border-color: #409EFF;
  }
  /deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  /deep/.el-pagination{
 margin: 10px 0;
}
</style>