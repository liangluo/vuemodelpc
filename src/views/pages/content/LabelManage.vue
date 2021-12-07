<template>
  <div class="labelContainer">
    <!-- 搜索部分 -->
    <el-card>
      <el-form :inline="true" :model="query">
        <el-form-item label="标签名称：">
          <el-input
            v-model="query.labelName"
            autocomplete="off"
            placeholder="标签名称 "
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
            @click="addLabel()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table :data="labelTable" style="width: 100%"  v-loading="loading">
        <el-table-column type="index" width="50" label="ID"> </el-table-column>
        <el-table-column prop="labelName" label="标签名称"> </el-table-column>
        <el-table-column prop="labelDes" label="标签描述"> </el-table-column>
        <el-table-column prop="labelNum" label="标签资源数"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" @click="updateLabel()">修改</el-button>
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
          label="标签名称："
          prop="labelName"
          width="100"
         >
            <el-input
             v-model="addForm.labelName"
             autocomplete="off"
             placeholder="标签名称"
             clearable
             maxlength="10"
            ></el-input>
        </el-form-item>
         <el-form-item
          label="标签描述："
          prop="labelDes"
          width="100"
         >
            <el-input
             v-model="addForm.labelDes"
             autocomplete="off"
             placeholder="标签描述"
             clearable
            ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormClose()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div> 
   </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog  
      title="修改"
      :visible.sync="upDialogShow"
       v-loading="dialogLoading"
      @close="upFormClose()"
      >
      <el-form 
      :model="UpdateForm" 
      ref="UpdateForm" 
      :rules="rules" 
      :inline="true"
       class="upForm"
       :label-position="labelPosition" 
       label-width="100px"
       >
          <el-form-item
          label="标签名称："
          prop="labelName"
          width="100"
         >
            <el-input
             v-model="UpdateForm.labelName"
             autocomplete="off"
             placeholder="标签名称"
             clearable
            ></el-input>
        </el-form-item>
         <el-form-item
          label="标签描述："
          prop="labelDes"
          width="100"
         >
            <el-input
             v-model="UpdateForm.labelDes"
             autocomplete="off"
             placeholder="标签描述"
             clearable
            ></el-input>
        </el-form-item>
         <el-form-item
          label="标签资源数："
          prop="labelNum"
          width="100"
         >
            <el-input
             v-model="UpdateForm.labelNum"
             autocomplete="off"
             placeholder="标签资源数"
             clearable
            ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upFormClose()">取 消</el-button>
        <el-button type="primary" @click="upSubmit()">确 定</el-button>
      </div> 
   </el-dialog>   
  </div>
</template>

<script>
export default {
  name: "LabelManage",
  data() {
    return {
      query: {}, //搜索列表
      labelTable: [
        {
          labelName: "标签名称",
          labelDes: "标签描述",
          labelNum: "10",
        },
        {
          labelName: "标签名称",
          labelDes: "标签描述",
          labelNum: "10",
        },
        {
          labelName: "标签名称",
          labelDes: "标签描述",
          labelNum: "10",
        },
        {
          labelName: "标签名称",
          labelDes: "标签描述",
          labelNum: "10",
        },
      ], //标签表格数据
      loading:false,
      addForm:{},//新增分类数据
      addLoading: false,
      addDialogShow:false,//新增弹窗
      upDialogShow: false, //修改弹窗
      dialogLoading: false,
      UpdateForm:{},//修改表格数据
      labelPosition: 'right',
      page: 1, //当前页
      pagesize: 10, //每页条数
      pageTotal: 100, // 总个数
      rules:{
        labelName: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
          labelDes: [
          { required: true, message: "请输入标签描述", trigger: "blur" },
        ]
        },
    };
  },
  methods: {
    //修改弹窗确认按钮
    upSubmit() {

    },
      //修改弹窗关闭按钮
    upFormClose() {
        this.upDialogShow = false;
    },
      //修改
    updateLabel() {
      this.upDialogShow = true;
    },
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
    addLabel() {
        this.addDialogShow = true;
    },
    //查询
    queryLine() {
      this.loading = false;
      const _query = {};
      if (!!this.query.labelName) {
        _query["labelName"] = this.query.labelName;
      }
      //   if (this.query.labelName) {
      //     //状态查询
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
};
</script>

<style lang="scss" scoped>
.labelContainer {
  margin: 20px;
}
.addform /deep/.el-form-item__content{
    width: 300px;
    display: flex;
}
.upForm /deep/.el-form-item__content{
    width: 300px;
}
.upForm /deep/.el-form-item{
    margin-right: 80px;
}
/deep/.el-pagination{
 margin: 10px 0;
}
</style>