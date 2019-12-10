<template>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
<el-container>
  <el-header>
   <el-menu
  :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item @click="$router.push('/')" index="1">事件列表</el-menu-item>
  <!-- <el-menu-item @click="$router.push('/warntracker')" index="2">异常跟踪</el-menu-item>
  <el-menu-item @click="$router.push('/eventtracker')" index="3">UDP测试</el-menu-item> -->
</el-menu>
  </el-header>
  <el-container>
   <!-- <el-aside width="200px">
    <el-menu>
      <el-menu-item :height="tableHeight" ><i class="el-icon-setting"></i>事件列表</el-menu-item>
    </el-menu>
  </el-aside> -->
    <el-main><router-view/></el-main>
  </el-container>
</el-container>
</template>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    text-align: center;
    padding: 0!important;
  }
  .el-menu{
    border-right: solid 0px #e6e6e6!important;
  }
  .el-aside {
    color: #333;
    border-right:1px solid #B3C0D1;
  }

  .el-main{
    padding: 0;
  }
</style>
<script>
export default {
  data() {
     return {
        activeIndex: '1'
      };
  },
   mounted:function(){
    //this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
    //window.innerHeight:浏览器的可用高度
    //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    //后面的50：根据需求空出的高度，自行调整
      if(window.location.pathname=="/eventtracker"){
        this.activeIndex=3;
      }else if(window.location.pathname=="/warntracker"){
        this.activeIndex=2;
      }
      else{
        this.activeIndex=1;
      }
    },
  methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>


