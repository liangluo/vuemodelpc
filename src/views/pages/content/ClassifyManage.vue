<template>
 <div class="sortContainer">
    <!-- 搜索部分 -->
    <el-card>
      <el-form :inline="true" :model="query">
        <el-form-item label="分类名称：">
          <el-input
            v-model="query.sortName"
            autocomplete="off"
            placeholder="分类名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="分类层级：">
          <el-select 
          v-model="query.sortLevel" 
          placeholder="分类层级"
           clearable
           >
            <el-option
              v-for="item in sortLevelData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
             @click="addSort()"
            >新增</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button icon="el-icon-delete" size="small"
            >清空</el-button
          >
        </el-form-item> -->
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table 
      :data="sortTable" 
      style="width: 100%"
      v-loading="loading"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column 
        prop="sortName" 
        label="分类名称"
        > 
        </el-table-column>
        <el-table-column 
        prop="sortLevel" 
        label="分类层级"
        > 
        </el-table-column>
        <el-table-column 
        prop="superiorSort" 
        label="上级分类名"
        >
        </el-table-column>
        <el-table-column 
        prop="createTime" 
        label="创建时间"
        > </el-table-column>
        <el-table-column 
        prop="createName" 
        label="创建人"
        >
        </el-table-column>
        <el-table-column 
        label="操作"
        width="300"
         >
          <template  slot-scope="scope">
            <el-button
            size="mini"
            @click="addNextSort()"
            >
            添加</el-button
            >
            <el-button 
            size="mini"
            @click="check()"
            >
            查看</el-button
            >
            <el-button 
            size="mini"
            @click="sortUpdate(scope.row)"
            >
            修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
            >
            删除</el-button
            >
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

   <!-- 修改弹窗 -->
   <el-dialog  
      title="修改分类名称"
      :visible.sync="upDialogShow"
       v-loading="dialogLoading"
      @close="upFormClose()"
      >
      <el-form 
      :model="UpdateForm" 
      ref="UpdateForm" 
      :rules="rules" 
      :inline="true"
       :label-position="labelPosition" 
       label-width="100px"
       >
          <el-form-item
          label="分类名称："
          prop="sortName"
         >
            <el-input
                v-model="UpdateForm.sortName"
                autocomplete="off"
                placeholder="分类名称"
                clearable
            ></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upFormClose()">取 消</el-button>
        <el-button type="primary" @click="upSubmit()">确 定</el-button>
      </div> 
   </el-dialog>

   <!-- 添加弹窗 -->
   <el-dialog  
      title="添加下一级分类"
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
      label-width="120px"
      >
          <el-form-item
          label="分类名称："
          prop="sortName"
          width="100"
         >
            <el-input
                v-model="addForm.sortName"
                autocomplete="off"
                placeholder="分类名称"
                clearable
            ></el-input>
        </el-form-item>
        <el-form-item
          label="分类层级："
          prop="sortLevel"
          class="space"
         >
            <el-input
                v-model="addForm.sortLevel"
                autocomplete="off"
                placeholder="分类层级"
                clearable
            ></el-input>
        </el-form-item>
         <el-form-item
          label="上级分类名称："
          prop="superiorSort"
         >
            <el-input
                v-model="addForm.superiorSort"
                autocomplete="off"
                placeholder="上级分类名称"
                clearable
            ></el-input>
        </el-form-item>
         <el-form-item
          label="创建时间："
          prop="createTime"
         >
            <el-date-picker
              v-model="addForm.createTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
         <el-form-item
          label="创建人："
          prop="createName"
         >
            <el-input
                v-model="addForm.createName"
                autocomplete="off"
                placeholder="创建人"
                clearable
            ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormClose()">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </div> 
   </el-dialog>

   <!-- 查看 -->
    <el-dialog  
      title="查看资源"
      :visible.sync="checkDialogShow"
      v-loading="checkLoading"
      @close="checkFormClose()"
      >
       <el-table 
      :data="checkTable" 
      style="width: 100%"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column 
        prop="sortName" 
        label="分类名称"
        > 
        </el-table-column>
        <el-table-column 
        prop="sortLevel" 
        label="分类层级"
        > 
        </el-table-column>
        <el-table-column 
        prop="superiorSort" 
        label="上级分类名"
        >
        </el-table-column>
        <el-table-column 
        prop="createTime" 
        label="创建时间"
        > </el-table-column>
        <el-table-column 
        prop="createName" 
        label="创建人"
        >
        </el-table-column>
      </el-table>
       <div slot="footer" class="dialog-footer">
        <el-button @click="checkFormClose()">取 消</el-button>
        <el-button type="primary" @click="checkSubmit()">确 定</el-button>
      </div> 
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ClassifyManage",
  data() {
    return {
      query: {}, //搜索列表
      sortLevelData: [
        {
          id: "1",
          name: "一级",
        },
        {
          id: "2",
          name: "二级",
        },
        {
          id: "3",
          name: "三级",
        },
      ], //分类层级
      sortTable: [{
          id: 1,
        sortName: '分类名称',
        sortLevel: '分类层级',
        superiorSort: '上级分类名',
        createTime:'创建时间',
        createName:'创建人'
      },
      {
          id: 2,
       sortName: '分类名称',
        sortLevel: '分类层级',
        superiorSort: '上级分类名',
        createTime:'创建时间',
        createName:'创建人',
        children: [
          {
               id: 31,
            sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
            children: [
              {
                   id: 33,
                sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
              }
            ]
          },
          {
               id: 32,
           sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
            children: [
              {
                   id: 34,
               sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
              }
            ]
          }
        ]
      },
      {
        id: 3,
       sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
        hasChildren: true
      },
      {
        id: 4,
       sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
      }], //分类表格数据
      loading: false,
      upDialogShow: false, //修改弹窗
      dialogLoading: false,
      UpdateForm:{},//修改表格数据
      addForm:{},//添加分类数据
      addLoading: false,
      addDialogShow:false,//添加弹窗
      checkLoading:false,
      checkTable: [
       {
        id: 1,
        sortName: '分类名称',
        sortLevel: '分类层级',
        superiorSort: '上级分类名',
        createTime:'创建时间',
        createName:'创建人',
        children: [
          {
               id: 31,
            sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
            children: [
              {
                   id: 33,
                sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
              }
            ]
          },
          {
               id: 32,
           sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
            children: [
              {
                   id: 34,
               sortName: '分类名称',
            sortLevel: '分类层级',
            superiorSort: '上级分类名',
            createTime:'创建时间',
            createName:'创建人',
              }
            ]
          }
        ]
      }], //查看资源数量数据
      checkDialogShow: false,//查看资源弹窗
      labelPosition: 'right',
      rules:{
        sortName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        sortLevel:[
          { required: true, message: "请输入分类层级", trigger: "blur" },
         ],
        superiorSort:[
          { required: true, message: "请输入上级分类名称", trigger: "blur" },
         ],
         createTime:[
          { required: true, message: "请输入创建时间", trigger: "blur" },
         ],
          createName:[
          { required: true, message: "请输入创建人", trigger: "blur" },
         ],
      },
      page: 1, //当前页
      pagesize: 10, //每页条数
      pageTotal: 100, // 总个数
    };
  },
  methods: {
    //查看资源弹窗关闭按钮
    checkSubmit() {

    },
    //查看资源弹窗关闭按钮 
    checkFormClose() {
      this.checkDialogShow = false;
    },
    //查看
    check() {
         this.checkDialogShow = true;
    },
      //添加弹窗确定按钮 
    addSubmit() {
      
    },
    //添加弹窗关闭按钮
    addFormClose() {
        this.addDialogShow = false;
    },
    //添加弹窗 
    addNextSort() {
        this.addDialogShow = true;
    },
    //修改弹窗确定按钮
    upSubmit() {
    //   this.$refs.UpdateForm.validate((valid) => {
    //     if (valid) {
    //       const _self = this;
    //       this.dialogLoading = true;
    //       updateline(_self.UpdateForm).then((res) => {
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
    //         this.dialogLoading = false;
    //         this.updialogShow = false;
    //         this.UpdateForm = {};
    //       });
    //     }
    //   });
    },
    //修改弹窗关闭按钮
    upFormClose() {
      this.upDialogShow = false;
    },
     //修改
    sortUpdate(row) {
      this.upDialogShow = true;
      this.UpdateForm.sortName = row.sortName
    },
    //查询
    queryLine() {
      this.loading = false;
      const _query = {};
      if (!!this.query.sortName) {
        _query["sortName"] = this.query.sortName;
      }
       if (!!this.query.sortLevel) {
        _query["sortLevel"] = this.query.sortLevel;
      }
    //   if (this.query.sortName) {
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
    //添加
    addSort() {
        this.addDialogShow = true;
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
.sortContainer {
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