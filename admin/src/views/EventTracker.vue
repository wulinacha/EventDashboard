<template>
<div>
  <el-tag type="warning">用于查询所有事件跟踪项，作用不大</el-tag>
   <el-button @click="postudp()" type="success">成功按钮</el-button>
</div>
</template>
<script src="http://lib.baomitu.com/socket.io/2.0.1/socket.io.js"></script>
<script>

export default {
  methods: {
   postudp(){
   console.log('开始发送');
     this.$socket.emit('addUser','cxb');
     console.log('已经发送');
   }
  },
  mounted:function(){
    //this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
    //window.innerHeight:浏览器的可用高度
    //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    //后面的50：根据需求空出的高度，自行调整
      
    },
    data() {
      return {

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

