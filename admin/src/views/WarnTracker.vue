
<template>
<div>
  <el-form ref="form" :model="form" :inline="true" label-width="80px">
  <el-form-item label="事件类型:">
    <el-select v-model="aggregationType" placeholder="请选择">
    <el-option
      v-for="item in eventoptions"
      :key="item.Id"
      :label="item.AggregationType"
      :value="item.AggregationType">
    </el-option>
  </el-select>
    
  </el-form-item>
    <el-form-item label="事件标识:">
    <el-input v-model="aggregationId" placeholder="请输入内容"></el-input>
  </el-form-item>
  <el-form-item label="发生时间:">
    <el-date-picker
      v-model="startCurrentOn"
      type="datetime"
      placeholder="选择日期时间">
  </el-date-picker>
  </el-form-item>
   <el-form-item>
    <el-date-picker
      v-model="endCurrentOn"
      type="datetime"
      placeholder="选择日期时间">
  </el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
  </el-form-item>
</el-form>
<el-table v-loading="loading" border ref="table" :data="tableData" max-height="500px"
:span-method="colspanMethod" :height="tableHeight">
    <el-table-column
      prop="TenantId"
      label="租户ID"
      width="180">
    </el-table-column>
     <el-table-column
      prop="AggregationType"
      label="事件类型"
      width="200">
    </el-table-column>
    <el-table-column
      prop="AggregationId"
      label="事件标识"
      width="250">
    </el-table-column>
    <el-table-column
      prop="ErrorMessage"
      label="跟踪信息"
      width="250">
      <!-- <template slot-scope="scope">
        <span v-if="scope.row.TrackType==0">发送</span>
        <span v-else>接收</span>
      </template> -->
    </el-table-column>
    <el-table-column
      prop="CurrentOn"
      label="事件时间"
      width="200">
    </el-table-column>
    <el-table-column
      label="操作"
      width="220">
      <template slot-scope="scope">
        <el-button
          size="mini"
           type="danger"
          @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
         <el-button
          size="mini"
           type="danger"
          @click="handleEdit(scope.$index, scope.row)">重试</el-button>
      </template>
    </el-table-column>
</el-table>
 <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</div>
</template>
<script>
export default {
  methods: {
  onSubmit() {
    this.request();
  },
  handleCurrentChange(val) {
    this.pageIndex=val;
    this.request();
  },
  request(){
    this.loading=true;
    this.$http.get('/index/EventTrackers',
    {params:{pageindex:this.pageIndex,aggregationId:this.aggregationId,
    aggregationType:this.aggregationType,endCurrentOn:this.endCurrentOn,
    startCurrentOn:this.startCurrentOn}},{
      headers:{contentType:"application/json;charset=UTF-8"}
    }).then(function(res){
      this.tableData = res.body.data.events.data;  
      this.total=res.body.data.events.count;
      this.pageSize=res.body.data.events.pageSize;
      this.loading=false;
    },function(res){
      console.warn(res);
    });
  },
  requestEventTypes(){
    this.$http.get('/index/EventTypes',{},{
      headers:{contentType:"application/json;charset=UTF-8"}
    }).then(function(res){
      this.eventoptions = res.body.data.eventtypes;  
    },function(res){
      console.warn(res);
    });
  }
  },
  mounted:function(){
    //this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
    //window.innerHeight:浏览器的可用高度
    //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    //后面的50：根据需求空出的高度，自行调整
    this.request();
    this.requestEventTypes();
    },
    data() {
      return {
        pageIndex:0,
        tableData: [],
        eventoptions:[],
        aggregationType:"",
        endCurrentOn:"",
        startCurrentOn:"",
        aggregationId:"",
        loading: false,
        pageSize:10,
        total:1000
      }
    }
  }
</script>
<style>
.el-row {
    margin-bottom: 20px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

