<template>
  <div>
    <div class="header_card my_card">
        <el-button-group>
            <el-button type="primary" @click="toPush('/')">返回工具集</el-button>
            <el-button type="success" @click="openURL('https://wulvxinchen.cn/')">返回导航站</el-button>
        </el-button-group>
        <el-button type="primary" @click="toPush('/about')">关于</el-button>
    </div>
    <div class="header_card my_card header_card_remove_flex">
        <div class="header_card_logo">
            <a href="./login" ><img src="https://my.wulvxinchen.cn/pictures/logo/logo.webp" alt="xinchen" class="header_card_img"></a>
            <strong>心尘的工具集</strong>
        </div>
        <div class="header_card_info">
            <span style="font-weight:600">更新，更美观，更现代化的心尘工具集！</span>
        </div>
    </div>
    <div class="header_card my_card tool_card remove_flex" v-loading="loading">
        <p class="tool_name"><strong>{{ tool.name }}</strong></p>
        <p class="tool_type"><strong>数据库序号:{{ tool.id }}</strong></p>
        <p class="tool_type"><strong>类型:{{ tool.type }}</strong></p>
        <p class="tool_til">简介：{{ tool.til }}</p>
        <p class="tool_url">网址：<a :href="tool.url" target="_blank">{{ tool.url }}</a></p>
        <div>
            <el-button type="primary" @click="shareURL(tool.id)">分享</el-button>
            <el-button type="success" @click="openURL(tool.url)">访问</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'Page',
  components: {
  },
  data(){
    return{
        loading: false,
        tool: {},
        settings:{
            autoRedirect: true,
            redirectDelay: 3000,
            autoRandomTool:false
        },
    }
  },
  methods:{
    getSettings(){
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
      else{
        localStorage.setItem('settings', JSON.stringify(this.settings));
      }
    },
    autoJump(){
      const toolUrl = this.tool.url;
      if(this.$route.query.auto == '1' ){
        setTimeout(function(){
          ElMessageBox.confirm(
            '即将跳转到网站，确认吗？',
            '自动跳转',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success',
            }
          ).then(() => {
            window.open(toolUrl, '_blank')
          })
        }, this.settings.redirectDelay);
      }
    },
    toPush(url){
      this.$router.push(url)
    },
    openURL(url){
      window.open(url, '_blank')
    },
    getTool(){
      this.loading = true
      axios.get('https://my.wulvxinchen.cn/tools2/api/searchID.php?id='+this.tool.id).then(res=>{
          this.tool = res.data.data[0]
          this.loading = false
          this.autoJump()
          // 最后删掉输出
          console.log(this.tool)
      })
      
    },
    shareURL(){
      const input = document.createElement('input')
      if(this.settings.autoRedirect == true){
          input.value = window.location.href + "&auto=1"
      }
      else{
          input.value = window.location.href
      }
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      document.body.removeChild(input)
      this.$message({
              message: '已复制网址到剪贴板,快去分享吧!',
              type: 'success'
          });
    }
  },
  mounted(){
    this.tool.id = this.$route.params.id || this.$route.query.id;
    this.getTool(),
    this.getSettings()
  }
}
</script>
<style>

</style>