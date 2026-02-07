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
                <a href="./login" ><img src="https://my.wulvxinchen.cn/pictures/logo/logo.webp" alt="xinchen" class="header_card_img"></a>
                <strong>心尘的工具集</strong>
            </div>
            <div class="header_card_info">
            <span style="font-weight:600">更新，更美观，更现代化的心尘工具集！</span>
            </div>
    </div>
    <div class="header_card my_card remove_flex">
        <h3>关于</h3>
        <p>感谢使用心尘的工具集！这个网站倾注我的努力和知识，也希望这个网站的工具能够给你的学习、工作、生活带来积极的作用。</p>
        <p>总之，期待与你的每一次相遇！</p>
        <p>祝你昨天、今天、明天开心，幸福！</p>
    </div>
    <div class="header_card my_card remove_flex">
        <h3>求赞</h3>
        <span style="font-weight:600">
            喜欢可以在
            <a href="https://github.com/drpasserby/XinchenTools" class="issues_link">GitHub</a>
            给个☆Star！<br><br>
            如果有添加/下架/举报/反馈/支持等需求的请在
            <a href="https://github.com/drpasserby/XinchenTools/issues" class="issues_link">反馈</a>
            这里发布一个Issue，系统会自动通过邮件快速告知我。
        </span>
    </div>
    <div class="header_card my_card remove_flex">
        <h3>网站设置</h3>
        <p style="color:dimgray"><strong>注意：本设置仅对当前设备以及浏览器有效。</strong></p>
        <el-form :model="settings" label-width="auto" style="max-width: 600px">
            <el-form-item label="分享的链接是否自动跳转">
                <el-switch v-model="settings.autoRedirect"/>
            </el-form-item>
            <el-form-item label="网站跳转的延迟时间(ms)">
                <el-input
                    v-model="settings.redirectDelay"
                    placeholder="默认3000"
                    >
                </el-input>
            </el-form-item>
            <el-form-item label="打开主页是否立即抽卡">
                <el-switch v-model="settings.autoRandomTool"/>
            </el-form-item>
            <el-form-item label="清空本地收藏夹">
                <el-button type="danger" @click="clearStar">清除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSettings">保存</el-button>
                <el-button type="success" @click="backupSettings">恢复默认设置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="header_card my_card remove_flex">
        <h3>赞助</h3>
        <p style="color:dimgray"><strong>这是非强制性的赞助项目，本网站依旧完全免费!如果你喜欢这个网站的话，只需要一瓶大可乐就可以让我开心很久很久！</strong></p>
        <a href="https://afdian.com/a/wulvxinchen" ><img src="https://my.wulvxinchen.cn/pictures/things/爱发电.png" alt="xinchen" class="header_card_img" style="width:10em"></a>
    </div>
    <div class="header_card my_card remove_flex">
        <h3>鸣谢 | 技术使用</h3>
        <svg viewBox="0 0 128 128" width="24" height="24" data-v-71e07b25=""><path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" data-v-71e07b25=""></path><path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" data-v-71e07b25=""></path></svg>
        &nbsp;
        <img src="https://cn.vitejs.dev/assets/vite-dark.D2ACe7TL.svg" alt="Vite Logo" wuidth="24" height="24"/>
        &nbsp;
        <img src="https://element-plus.org/images/element-plus-logo.svg" alt="Element Plus Logo" wuidth="24" height="24">
        &nbsp;
        <img src="https://www.subscriptioninsider.com/wp-content/uploads/2021/10/Axios-logo.png" alt="Axios Logo" wuidth="24" height="24"/>
    </div>
    <div class="header_card my_card remove_flex">
        <strong>{{ timeText }}</strong>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ta } from 'element-plus/es/locales.mjs';
export default {
  name: 'About',
  data(){
    return{
        timeText: '这里已经被尘埃覆盖了9999天99小时99分99秒',
        settings:{
            autoRedirect: true,
            redirectDelay: 3000,
            autoRandomTool:false
        }
    }
  },
  methods:{
    getSettings(){
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
        else{
            this.saveSettings();
        }
    },
    backTools(){
        this.$router.push('/')
    },
    openURL(url){
        window.open(url, '_blank')
    },
    clearStar(){
        ElMessageBox.confirm(
            '你确定要清空本地收藏夹吗？此操作不可逆！',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            localStorage.removeItem('starTools');
            this.$message({
                type: 'success',
                message: '已清除本地收藏夹'
            });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消清除'
            });
        });
    },
    saveSettings(){
        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.$message({
            message: '保存成功',
            type: 'success'
        });
    },
    backupSettings(){
        this.settings = {
            autoRedirect: true,
            redirectDelay: 3000,
            autoRandomTool:false
        };
        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.$message({
            message: '恢复成功',
            type: 'success'
        });
    },
    getNewTime(){
        const t1 = "2017/05/29 18:00:00" // 起始日期
        const dateBegin = new Date(t1)

        const dateEnd = new Date() // 现在日期
        const dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
        
        const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
        
        const leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
        const hours = String(Math.floor(leave1 / (3600 * 1000))).padStart(2, '0') // 计算出小时数
        
        const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
        const minutes = String(Math.floor(leave2 / (60 * 1000))).padStart(2, '0') // 计算相差分钟数
        
        const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
        const seconds = String(Math.round(leave3 / 1000)).padStart(2, '0')
        
        this.timeText = `这里已经被尘埃覆盖了${dayDiff}天${hours}小时${minutes}分${seconds}秒`
        console.log("+1s")
    }
  },
  mounted(){
    this.getSettings(),
    setInterval(this.getNewTime, 1000)
  }
}
</script>
<style>
.issues_link{
    color: #ffaa7f;
}
.issues_link:hover{
    color: #00b53c;
}
.remove_flex{
    display: block;
}
</style>