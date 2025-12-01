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
                <img src="https://my.wulvxinchen.cn/pictures/logo/logo.webp" alt="xinchen" class="header_card_img">
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
      loginForm:{
        username:'',
        password:''
      },
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
    this.fetchCookies();
  }
}
</script>