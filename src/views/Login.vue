<template>
  <div>
    <div class="header_card my_card">
        <el-button-group>
            <el-button type="primary" @click="backTools()">返回工具集</el-button>
            <el-button type="success" @click="openURL('https://wulvxinchen.cn/')">返回导航站</el-button>
        </el-button-group>
    </div>
    <div class="header_card my_card header_card_remove_flex">
            <div class="header_card_logo">
                <img src="https://my.wulvxinchen.cn/pictures/logo/logo.webp" alt="xinchen" class="header_card_img" @click="clickLogo()">
                <strong>心尘控制面板</strong>
            </div>
            <div class="header_card_info">
            <span style="font-weight:600">欢迎回家，心尘！</span>
            </div>
    </div>
    <div class="header_card my_card remove_flex">
        <h3>登录</h3>
        <p style="color:dimgray"><strong>注意：本设置仅对当前设备以及浏览器有效。</strong></p>
        <el-form :model="loginForm" label-width="auto" style="max-width: 600px">
            <el-form-item label="用户名">
                <el-input
                    v-model="loginForm.username"
                    placeholder="输入用户名"
                    >
                </el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input
                    v-model="loginForm.password"
                    placeholder="输入用户名"
                    type="password"
                    >
                </el-input>
            </el-form-item>
            <el-form-item label="验证码">
              <div class="captcha_container">
                <el-input v-model="loginForm.captchaInput" placeholder="不区分大小写"></el-input>
                <div @click="generateCaptcha" class="captcha_box"><strong>{{ captchaCode }}</strong></div>
              </div>
            </el-form-item>
            <el-form-item label="记住密码">
                <el-switch v-model="isRemeber"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="success" @click="clearAll">清除本地密码</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';
export default {
  name: 'Login',
  components: {
  },
  data(){
    return{
      isRemeber:false,
      clickTimes:0,
      loginForm:{
        username:'',
        password:'',
        captchaInput:''
      },
      captchaCode: '',
    }
  },
  methods:{
    backTools(){
        this.$router.push('/')
    },
    openURL(url){
        window.open(url, '_blank')
    },
    login(){
      if(!this.loginForm.captchaInput || this.loginForm.captchaInput.toLowerCase() !== this.captchaCode.toLowerCase()){
        this.$message({
          message: '验证码错误，请重新输入',
          type: 'error'
        });
        this.generateCaptcha();
        return;
      }
      axios.post('https://my.wulvxinchen.cn/tools2/api/login.php',{
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then(res=>{
        if(res.data.code === 200){
          if(this.isRemeber){
            localStorage.setItem('userinfo',JSON.stringify(this.loginForm));
          }else{
            localStorage.removeItem('userinfo');
          }
          this.$router.push('/admin')
          this.$message({
            message: '登录成功',
            type: 'success'
          });
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch(err=>{
        this.$message({
          message: '网络异常，请稍后再试',
          type: 'error'
        });
      })
    },
    generateCaptcha(){
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      let code = '';
      for(let i=0;i<4;i++) code += chars.charAt(Math.floor(Math.random()*chars.length));
      this.captchaCode = code;
      this.loginForm.captchaInput = '';
    },
    clearAll(){
      localStorage.removeItem('userinfo');
      this.loginForm.username = '';
      this.loginForm.password = '';
      this.isRemeber = false;
      this.$message({
        message: '清除成功',
        type: 'success'
      });
    },
    clickLogo(){
      this.clickTimes += 1;
      if(this.clickTimes == 5){
        ElMessage({
          message: '坏蛋，你点我干嘛？',
          type: 'success',
        });
      }else if(this.clickTimes == 10){
        ElMessage({
          message: '再点我就告诉你一个秘密！',
          type: 'info'
        });
      }else if(this.clickTimes == 15){
        ElMessage({
          message: '你怎么还真继续点啊？',
          type: 'warning'
        });
      }else if(this.clickTimes == 20){
        ElMessage({
          message: '不许点了，哼！',
          type: 'error'
        });
        this.clickTimes = 0;
        setTimeout(()=>{
          this.openURL('https://wulvxinchen.cn/')
        }, 3000);
      }
    },
    handleKeydown(event){
      if(event && (event.key === 'Enter' || event.keyCode === 13)){
        this.login();
      }
    },
    fetchCookies(){
      const cookieValue = Cookies.get('xinchentools');
      if (cookieValue != undefined) {
        axios.get('https://my.wulvxinchen.cn/tools2/api/testCookie.php', {
          }).then(res => {
            if (res.data.code == 200) {
              ElMessage({
                message: 'Cookie有效,即将登录跳转',
                type: 'success',
              });
              this.$router.push('/admin');
            } else if(res.data.code == 500) {
              Cookies.remove('xinchentools');
              ElMessage({
                message: res.data.msg,
                type: 'error',
              });
              }
          }).catch(err => {
            ElMessage({
                message: '验证Cookie可用性网络异常，请稍后再试',
                type: 'error',
            });
          });
        } else {
          ElMessage({
              message: 'Cookie不存在，请登录',
              type: 'error',
          });
        }
    }
  },
  mounted(){
    let userinfo = localStorage.getItem('userinfo');
    if(userinfo){
      userinfo = JSON.parse(userinfo);
      this.loginForm.username = userinfo.username;
      this.loginForm.password = userinfo.password;
      this.isRemeber = true;
    };
    this.generateCaptcha();
    this.fetchCookies();
    window.addEventListener('keydown', this.handleKeydown);
  }
  ,
  beforeUnmount(){
    window.removeEventListener('keydown', this.handleKeydown);
  }
}
</script>
<style scoped>
.captcha_container{
  display:flex;
  align-items:center;
  gap:8px;
}
.captcha_box{
  display:flex;
  align-items:center;

  padding:.2em .5em;
  border-radius:4px;
  background:#eee;
  border:1px solid #dcdfe6;
  font-size:1.3em;
  color:#000;

  user-select:none;
  cursor:pointer;
  
  transition: all 0.5s;
}
.captcha_box:hover{
  background:#ffdbb9;
}
</style>