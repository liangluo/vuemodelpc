<template>
  <div class="ScenQueryContainer">
    <!-- 搜索部分 -->
    <el-card>
      <el-form :inline="true" :model="query">
        <el-form-item label="地点：">
          <el-input
            v-model="query.place"
            autocomplete="off"
            placeholder="地点"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="预约日期：">
          <el-date-picker
            v-model="query.subTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约日期：">
          <el-select v-model="query.status" placeholder="状态">
            <el-option label="正常" value="1"></el-option>
            <el-option label="已取消" value="2"></el-option>
            <el-option label="已入场" value="3"></el-option>
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
            @click="addPlace()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table :data="placeTable" style="width: 100%" v-loading="loading">
        <el-table-column type="index" width="50" label="ID"> </el-table-column>
        <el-table-column prop="userNickname" label="用户昵称"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="subTime" label="预约时间"> </el-table-column>
        <el-table-column prop="userName" label="联系人"> </el-table-column>
        <el-table-column prop="subNum" label="预约人数"> </el-table-column>
        <el-table-column prop="subStatus" label="预约状态"> </el-table-column>
        <el-table-column prop="telephone" label="电话"> </el-table-column>
        <el-table-column label="操作" width="350">
          <template>
            <el-button size="mini" @click="addPlace()">添加</el-button>
            <el-button size="mini">修改</el-button>
            <el-button size="mini">查看</el-button>
            <el-button size="mini">导出</el-button>
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
                 label="创建时间："
                 prop="createTime"
                  width="100"
                 >
                  <el-date-picker
                    v-model="addForm.createTime"
                    type="date"
                    placeholder="选择日期"
                    clearable
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                 label="预约时间："
                 prop="subTime"
                  width="100"
                 >
                  <el-date-picker
                    v-model="addForm.subTime"
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
                 label="预约人数："
                 prop="subNum"
                 width="100"
                 >
                    <el-input
                    v-model="addForm.subNum"
                    autocomplete="off"
                    placeholder="预约人数"
                    clearable
                    ></el-input>
                </el-form-item>
                <el-form-item
                label="预约状态："
                prop="subStatus"
                >
                <el-select
                    v-model="addForm.subStatus"
                    placeholder="预约状态"
                >
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="已取消" value="2"></el-option>
                    <el-option label="已入场" value="3"></el-option>
                </el-select>
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
  name: "ScenQuery",
  data() {
    return {
      query: {}, //搜索列表
      loading: false,
      placeTable: [
        {
          userNickname: "用户昵称",
          createTime: "2021-06-17",
          subTime: "2021-06-17",
          userName: "张三",
          subNum: "1",
          subStatus: "正常",
          telephone: "12345678910",
        },
        {
          userNickname: "用户昵称",
          createTime: "2021-06-17",
          subTime: "2021-06-17",
          userName: "张三",
          subNum: "2",
          subStatus: "已取消",
          telephone: "12345678910",
        },
        {
          userNickname: "用户昵称",
          createTime: "2021-06-17",
          subTime: "2021-06-17",
          userName: "张三",
          subNum: "1",
          subStatus: "正常",
          telephone: "12345678910",
        },
        {
          userNickname: "用户昵称",
          createTime: "2021-06-17",
          subTime: "2021-06-17",
          userName: "张三",
          subNum: "3",
          subStatus: "已入场",
          telephone: "12345678910",
        },
        {
          userNickname: "用户昵称",
          createTime: "2021-06-17",
          subTime: "2021-06-17",
          userName: "张三",
          subNum: "3",
          subStatus: "已入场",
          telephone: "12345678910",
        },
      ], //表格数据列表
      page: 1, //当前页
      pagesize: 10, //每页条数
      pageTotal: 100, // 总个数
      addForm:{},//新增弹窗数据
      addLoading: false,
      addDialogShow:false,//新增弹窗
      labelPosition: 'right',
      userData:[
          {
              userid:'111',
              userName:'张三',
           },
           {
              userid:'222',
              userName:'李四',
           },
           {
              userid:'333',
              userName:'张三',
           },
      ],//联系人数据列表
      rules:{
        userNickname: [
            { required: true, message: "请输入用户昵称", trigger: "blur" }
        ],
        createTime: [
            { required: true, message: "请输入创建时间", trigger: "blur" }
        ],
        subTime: [
            { required: true, message: "请输入预约时间", trigger: "blur" }
        ],
        userName: [
             { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        subNum: [
             { required: true, message: "请输入预约人数", trigger: "blur" }
        ],
        subStatus: [
            { required: true, message: "请输入预约状态", trigger: "blur" }
        ],
        telephone: [
            { required: true, message: "请输入电话", trigger: "blur" }
        ],
        },
     };
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
    addPlace() {
        this.addDialogShow = true;
    },
    //查询
    queryLine() {
      this.loading = false;
      const _query = {};
      if (!!this.query.place) {
        _query["place"] = this.query.place;
      }
      //   if (this.query.place) {
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
};
</script>

<style lang="scss" scoped>
.ScenQueryContainer {
  margin: 20px;
}
.addform /deep/.el-form-item__content{
    width: 300px;
    display: flex;
}
/deep/.el-date-editor .el-input, 
/deep/.el-date-editor .el-input__inner,
.addform /deep/.el-select .el-input{
    width: 300px;
}
/deep/.el-pagination{
 margin: 10px 0;
}
</style>