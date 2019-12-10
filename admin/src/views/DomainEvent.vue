
<template>
<div>
   <el-form ref="form" :inline="true" label-width="90px">
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
  <el-form-item label="事件时间戳:">
    <el-input v-model="TimeStamp" placeholder="请输入内容"></el-input>
  </el-form-item>
    <el-form-item label="是否异常:">
     <el-select v-model="IsError" placeholder="请选择">
    <el-option
      v-for="item in IsErrors"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </el-form-item>
  <br>
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

<el-dialog width="90%" title="" :visible.sync="dialogTableVisible">
  <el-tag type="warning">重试需要几分钟，有需要请自行重新打开窗口。</el-tag>
  <el-table :row-class-name="tableDialogRowClassName" v-loading="dialogloading" max-height="400" :data="trackers" >
    <el-table-column fixed property="ErrorMessage" label="异常信息" width="300"></el-table-column>
    <el-table-column property="AggregationType" label="事件名称" width="400"></el-table-column>
    <el-table-column property="AggregationId" label="事件标识"></el-table-column>
    <el-table-column property="CreateTime" width="300" label="创建时间"></el-table-column>
    <el-table-column property="AggregationId" label="请求类型">
      <template slot-scope="scope">
        <span v-if="scope.row.TrackType==0">发送</span>
        <span v-else>接收</span>
      </template>
    </el-table-column>
     <!-- <el-table-column label="操作">
      <template v-if="scope.row.TrackType==1" slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="Resend(scope.$index, scope.row)">重试</el-button>
      </template>
     </el-table-column> -->
  </el-table>
  <div class="resend"><el-button @click="ReSend()" type="danger">重新发送</el-button></div>
</el-dialog>
<el-table v-loading="loading" :row-class-name="tableRowClassName" border ref="table" :data="tableData" max-height="500px"
>
   <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="事件内容">
            <span>{{ props.row.Content }}</span>
          </el-form-item>
          <el-form-item label="事件时间">
            <span>{{ props.row.CurrentOn }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
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
      show-overflow-tooltip=true
      prop="Content"
      label="事件内容"
      width="250">
    </el-table-column>
    <el-table-column
      prop="CurrentOn"
      label="事件时间"
      width="250">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
         <el-button 
          size="mini"
          @click="getTracker(scope.$index,tableData)">跟踪明细</el-button>
      </template>
    </el-table-column>
</el-table>
 <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <template>
  <el-button :plain="true" @click="opensusses">成功</el-button>
  <el-button :plain="true" @click="openerror">错误</el-button>
</template>
</div>
</template>
<script>
export default {
  methods: {
    opensusses() {
         this.$message({
          message: '发送重试成功',
          type: 'success'
        });
      },
      openerror() {
        this.$message.error('发送重试失败');
      },
  onSubmit() {
    this.request();
  },
  getTracker(index,rows){
    var row=rows[index];
    this.requestTracker(row.Id);
    this.dialogTableVisible = true
  },
  handleCurrentChange(val) {
    
    this.request(val);
  },
  ReSend(){
    this.$http.post('/index/ReSend',{eventid:this.currentEventId},
      ).then(function (res) {
              console.log(res);
              this.dialogTableVisible=false;
              this.opensusses();
      },
        function (res) {
            console.log(res.status);
            this.dialogTableVisible=false;
            this.openerror();
        }
    );
  },
  request(index){
    this.loading=true;
    console.log("开始时间"+this.startCurrentOn);
    console.log("开始时间"+this.endCurrentOn);
    var startCurrentOn="";
    var endCurrentOn="";
    if(this.startCurrentOn!=null)
      startCurrentOn=this.startCurrentOn.getTime()/1000;
    if(this.endCurrentOn!=null)
      endCurrentOn=this.endCurrentOn.getTime()/1000;

    const params={params:{pageindex:index,
    aggregationId:this.aggregationId,TimeStamp:this.TimeStamp,
    aggregationType:this.aggregationType,endCurrentOn:endCurrentOn,
    startCurrentOn:startCurrentOn,IsError:this.IsError}}
    console.log(params)
    this.$http.get('/index/Events',params,{
      headers:{contentType:"application/json;charset=UTF-8"}
    }).then(function(res){
      console.log(res.body.data.events.count);
      this.tableData = res.body.data.events.data;  
      this.total=res.body.data.events.count;
      this.currentPage=res.body.data.events.currentPage;
      this.pageSize=res.body.data.events.pageSize;
      this.loading=false;
    },function(res){
      console.warn(res);
    });
  },
  requestTracker(id){
    this.dialogloading=true;
    this.$http.get('/index/TrackerDetails',{params:{id:id}},{
      headers:{contentType:"application/json;charset=UTF-8"}
    }).then(function(res){
      this.trackers=res.body.data.trackers.trackers;
      this.currentEventId=res.body.data.trackers.eventid;
      this.dialogloading=false;
    },function(res){
      console.warn(res);
      this.dialogloading=false;
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
  },
  trasforjson(date){ 
    var year = date.getFullYear(); 
    var month =(date.getMonth() + 1).toString(); 
    var day = (date.getDate()).toString();  
    if (month.length == 1) { 
      month = "0" + month; 
    } 
    if (day.length == 1) { 
      day = "0" + day; 
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime; 
  },
  tableRowClassName({row}) {
    if (row.IsError == 0) {
      return 'warning-row';
    }
    return '';
   }
  },
  tableDialogRowClassName({row}){
    console.log("当前"+row.IsError);
    if (row.IsError== 0) {
      return 'warning-row';
    }
    return '';
  },
  mounted:function(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var strDate = date.getDate();

    var yesterday = new Date(year,month,strDate-1,0,0);

    var nowaday = new Date(year,month,strDate,0,0);

    console.info(nowaday);
    this.startCurrentOn=yesterday;
    this.endCurrentOn=nowaday;
    //this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
    //window.innerHeight:浏览器的可用高度
    //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    //后面的50：根据需求空出的高度，自行调整
    this.request(0);
    this.requestEventTypes();
    },
    data() {
      return {
        IsErrors: [{
          value: '全部',
          label: '全部'
        },{
          value: '0',
          label: '异常'
        },{
          value: '1',
          label: '正常'
        }],
        currentEventId:0,
        IsError:"",
        tableData: [],
        trackers:[],
        eventoptions:[],
        aggregationType:"",
        endCurrentOn:"",
        startCurrentOn:"",
        aggregationId:"",
        TimeStamp:"",
        currentPage:0,
        pageSize:0,
        dialogTableVisible:false,
        dialogloading:true,
        loading:true,
        total:1000
      }
    }
  }
</script>
<style>
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
  .el-table .warning-row {
    background:	#FFD700!important;
  }
  .resend{
    text-align: center;
    padding-top: 10px;
  }
</style>

