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
            <a href="./about" ><img src="https://my.wulvxinchen.cn/pictures/logo/logo.webp" alt="xinchen" class="header_card_img"></a>
            <strong>心尘的工具集</strong>
        </div>
        <div class="header_card_info">
            <span style="font-weight:600">更新，更美观，更现代化的心尘工具集！</span>
        </div>
    </div>
    <div class="header_card my_card tool_card remove_flex" v-if="tool.isvis == 0">
      <el-alert title="警告Waring:不可访问或者限制展示!" type="warning" effect="dark" :closable="false" center show-icon
      description="该工具已被管理员设置为无效工具或者访问受限,证明该工具在本工具集中已不被维护,强行访问该工具后果自负!"/>
    </div>
    <div class="header_card my_card tool_card remove_flex" v-loading="loading" v-if="tool.id != 'ERROR'">
        <p class="tool_name"><strong>{{ tool.name }}</strong></p>
        <p class="tool_type"><strong>数据库序号:{{ tool.id }}</strong></p>
        <p class="tool_type"><strong>类型:{{ tool.type }}</strong></p>
        <p class="tool_til">简介：{{ tool.til }}</p>
        <p class="tool_url">
          <span v-if="tool.isvis != 0">网址：<a :href="tool.url" target="_blank" >{{ tool.url }}</a></span>
          <span v-else>该网址已不可访问</span>
        </p>
        <div>
            <el-button type="primary" @click="toggleStar(tool.id)" v-if="!isStarred(tool.id)" :disabled="tool.isvis == 0">收藏</el-button>
            <el-button type="primary" @click="toggleStar(tool.id)" v-else :disabled="tool.isvis == 0">取消收藏</el-button>
            <el-button type="primary" @click="shareURL(tool.id)" :disabled="tool.isvis == 0">分享</el-button>
            <el-button type="info" @click="reviewURL()">预览</el-button>
            <el-button type="success" @click="openURL(tool.url)" v-if="tool.isvis != 0">访问</el-button>
            <el-button type="danger" disabled v-else>禁止访问</el-button>
        </div>
    </div>
    <div class="header_card my_card tool_card remove_flex" v-else>
      <div style="text-align: center;" v-for="n in 5" :key="n">
        <img src="https://my.wulvxinchen.cn/tools2/pubilc/error.png" alt="404" style="max-width: 100%;" v-show="errorts">
        <img src="https://my.wulvxinchen.cn/tools2/pubilc/error2.png" alt="404" style="max-width: 100%;" v-show="!errorts">
      </div>
    </div>
    <div class="header_card my_card">
      <el-button type="warning" @click="toPastNext(-1)">上一个</el-button>
      <el-button type="success" @click="toPastNext(1)">下一个</el-button>
    </div>
    <el-dialog v-model="previewVisible" title="预览" align-center>
      <p>本预览窗口仅供参考,请以实际情况为准</p>
      <iframe 
        :src="'https://cdn2.iocdn.cc/mshots/v1/' + tool.url"
        width="100%" 
        height="100%" 
        frameborder="0"
        allowfullscreen
      ></iframe>
    </el-dialog>
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
        previewVisible: false,
        tool: {
          id: 'LOADING',
          type: 'LOADING',
          name: 'LOADING',
          url: 'LOADING',
          til: 'LOADING',
          isvis: 1
          },
        errorts:'',
        settings:{
            autoRedirect: true,
            redirectDelay: 3000,
            autoRandomTool:false
        },
        starTools: JSON.parse(localStorage.getItem('starTools')) || []
    }
  },
  watch: {
    starTools: {
        handler(newstarTool) {
            localStorage.setItem('starTools', JSON.stringify(newstarTool))
        },
    deep: true
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
    toPastNext(n){
      let  newID = parseInt(this.tool.id) + n
      this.$router.push('/page?id=' + newID)
      this.tool.id = newID
      this.getTool()
    },
    toPush(url){
      this.$router.push(url)
    },
    openURL(url){
      window.open(url, '_blank')
    },
    reviewURL(){
      this.previewVisible = true
    },
    toggleStar(id) {
      const index = this.starTools.indexOf(id)
      if (index > -1) {
        this.starTools.splice(index, 1)
        ElMessage({
            message: '取消收藏成功',
            type: 'warning'
        });
      } else {
        this.starTools.push(id)
        ElMessage({
            message: '添加收藏成功',
            type: 'success'
        });
      }
    },
    isStarred(id) {
      if (id === undefined || id === null) return false
        return Array.isArray(this.starTools) && this.starTools.includes(id)
    },
    getTool(){
      this.loading = true
      axios.get('https://my.wulvxinchen.cn/tools2/api/searchID.php?id='+this.tool.id).then(res=>{
          this.tool = res.data.data[0]
          this.loading = false
          if(res.data.resultCode == 404 || res.data.data[0].isvis == -1){
            this.tool = {
              id: 'ERROR',
              type: 'ERROR',
              name: 'ERROR',
              url: 'ERROR',
              til: 'ERROR',
              isvis: -1
            }
            this.errorImg()
            ElMessageBox.alert(
              '未找到该工具。',
              '错误',
              {
                confirmButtonText: '返回',
                type: 'error',
              }
            ).then(() => {this.toPush('/')});
          
          }
          this.autoJump()
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
      ElMessage({
              message: '已复制网址到剪贴板,快去分享吧!',
              type: 'success'
          });
    },
    errorImg(){
      setInterval(()=>{
        this.errorts = !this.errorts
      },1000)
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