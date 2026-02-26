<template>
  <div>
    <div class="header_card my_card remove_flex">
      <el-button type="primary" @click="backTools()">返回工具集</el-button>
      <el-button type="danger" @click="logout()">退出</el-button>
    </div>
    <div class="header_card my_card remove_flex">
      <el-menu mode="horizontal">
        <el-menu-item index="1" @click="addTool()">快速新增</el-menu-item>
        <el-sub-menu index="2">
          <template #title>测试</template>
          <el-menu-item index="2-1"  @click="testCookie()">测试Cookie</el-menu-item>
          <el-menu-item index="2-2" @click="testIP()">测试IP/UA</el-menu-item>
        </el-sub-menu>
      </el-menu>

    </div>
    <div class="header_card my_card">
        <el-input
            v-model="searchInput"
            placeholder="输入关键词"
            class="input-with-select"
            >
            <template #prepend>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
            </template>
            <template #append>
                <el-button @click="searchToolsBtn">搜索</el-button>
            </template>
        </el-input>
    </div>
    <div class="header_card my_card remove_flex">
      <el-button-group>
        <el-button type="primary" @click="getTools('searchAll.php')">获取全部</el-button>
        <el-button type="warning" @click="getTools('searchNull.php')">获取空</el-button>
        <el-button type="primary" @click="exportTools()">导出</el-button>
      </el-button-group>
      <p>共有<el-text type="success">{{tools.length}}</el-text>个网站</p>
      <p>状态说明：
        <span class="status_circle green_status"/> 可见
        <span class="status_circle yellow_status"/> 隐藏
        <span class="status_circle red_status"/> 删除
      </p>
      <el-table :data="tools" stripe border v-loading="loading" style="width: 100%" height="600">
        <el-table-column prop="id" label="ID" sortable>
          <template #default="{row}">
            <span class="status_circle green_status" v-if="row.isvis == 1"/>
            <span class="status_circle yellow_status" v-else-if="row.isvis == 0"/>
            <span class="status_circle red_status" v-else/>
            {{ row.id }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="url" label="网址" show-overflow-tooltip>
          <template #default="{row}">
            <a :href="row.url" target="_blank">{{ row.url }}</a>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="{row}">
            <el-button link type="primary" @click="editTool(row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="header_card my_card remove_flex">
      <el-button type="primary" @click="mgtCookieGet()">获取有效Cookie</el-button>
      <p>共有<el-text type="success">{{cookieMgts.length}}</el-text>个有效Cookie</p>
      <el-table :data="cookieMgts" stripe border style="width: 100%" height="400">
          <el-table-column prop="cookie" label="Cookie" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="LoginTime" label="登录时间" />
          <el-table-column prop="LostTime" label="失效时间" />
          <el-table-column prop="ip" label="IP地址" show-overflow-tooltip />
          <el-table-column prop="ua" label="User-Agent" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作">
              <template #default="{row}">
                  <el-button link type="primary" @click="mgtCookieLost(row.id)">立即失效</el-button>
              </template>
          </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="addFormVisible" title="添加网址" width="500" align-center>
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="newToolForm.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="newToolForm.type" placeholder="选择" allow-create filterable>
            <el-option v-for="i in toolTypes" :key="i" :label="i" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="newToolForm.url" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="newToolForm.til" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="newToolForm.isvis" placeholder="选择" allow-create filterable>
            <el-option v-for="i in isvisOptions" :key="i.value" :label="i.lb" :value="i.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addGitTool()">提交</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="editFormVisible" title="编辑网址" width="500" align-center>
      <el-form>
        <el-form-item label="ID">
          <el-input v-model="editToolForm.id" disabled/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="editToolForm.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="editToolForm.type" placeholder="选择" allow-create filterable>
            <el-option v-for="i in toolTypes" :key="i" :label="i" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="editToolForm.url" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="editToolForm.til" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"/>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="editToolForm.isvis" placeholder="选择" allow-create filterable>
              <el-option v-for="i in isvisOptions" :key="i.value" :label="i.lb" :value="i.value" />
            </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button type="success" @click="openURL(editToolForm.url)">访问</el-button>
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editGitTool()">提交</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="searchVisible" title="搜索结果" width="500" align-center>
      <p>共搜到<el-text type="success">{{searchTools.length}}</el-text>个包含关键词<el-text type="warning">“{{searchInput}}”</el-text>网站</p>
      <el-table :data="searchTools" stripe border style="width: 100%" height="700">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="type" label="类型" />
          <el-table-column fixed="right" label="操作">
              <template #default="{row}">
                  <el-button link type="primary" @click="editTool(row.id)">编辑</el-button>
              </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'Admin',
  components: {
  },
  data(){
    return{
      loading: false,
      addFormVisible: false,
      editFormVisible: false,
      searchVisible: false,
      cookieMgtVisible: false,
      searchInput: '',
      toolTypes: ['工具', '实用', '趣味', '游戏', '资源', '其他'],
      isvisOptions: [
        { value: 1, lb: '可见' },
        { value: 0, lb: '隐藏' },
        { value: -1, lb: '删除' }
      ],
      newToolForm: {
        type: '',
        name: '',
        url: '',
        til: '',
        isvis: 1
      },
      editToolForm: {
        id: '',
        type: '',
        name: '',
        url: '',
        til: '',
        isvis: 1
      },
      tools: [],
      searchTools: [],
      cookieMgts: []
    }
  },
  methods:{
    backTools(){
        this.$router.push('/')
    },
    openURL(url){
      window.open(url, '_blank')
    },
    logout(){
        Cookies.remove('xinchentools');
        this.$router.push('/login')
    },
    testCookie(){
        const cookieValue = Cookies.get('xinchentools');
        if (cookieValue != undefined) {
          axios.get('https://my.wulvxinchen.cn/tools2/api/testCookie.php', {
          }).then(res => {
              if (res.data.code == 200) {
                  ElMessage({
                      message: 'Cookie验证成功,值为:' + cookieValue + ',有效期到' + res.data.time,
                      type: 'success',
                  });
              } else if(res.data.code == 500) {
                  ElMessage({
                      message: '失败：' + res.data.msg,
                      type: 'error',
                  });
              }
          }).catch(err => {
              ElMessage({
                  message: '网络异常，请稍后再试',
                  type: 'error',
              });
          });
        } else {
            ElMessage({
                message: 'Cookie不存在',
                type: 'error',
            });
        }
    },
    testIP(){
      axios.get('https://my.wulvxinchen.cn/tools2/api/testIP.php', {
      }).then(res => {
        if (res.data.code == 200) {
          ElMessageBox.alert(
            '当前IP地址为:' + res.data.ip + ',\n\n当前设备UA为:' + res.data.ua,
            'IP/UA信息',
            {
              confirmButtonText: '确定',
              type: 'success',
            }
          );
        }
      });
    },
    mgtCookieGet(){
      this.cookieMgtVisible = true
      axios.get('https://my.wulvxinchen.cn/tools2/api/getCookieMgt.php').then(res=>{
        if(res.data.code === 200){
          this.cookieMgts = res.data.cookies
          ElMessage({
            message: '获取成功',
            type: 'success',
          });
        } else {
          ElMessage({
            message: '失败：' + res.data.msg,
            type: 'error',
          });
        }
      })
    },
    mgtCookieLost(id){
      axios.get('https://my.wulvxinchen.cn/tools2/api/delCookieMgt.php?id=' + id).then(res=>{
        if(res.data.code === 200){
          ElMessage({
            message: res.data.msg,
            type: 'success',
          });
          this.mgtCookieGet()
        } else {
          ElMessage({
            message: '删除失败：' + res.data.msg,
            type: 'error',
          });
        }
      })
    },
    addTool(){
        this.addFormVisible = true
    },
    addGitTool(){
        ElMessageBox.confirm(
          '确定要添加吗？',
          '再次确认',
          {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          axios.post('https://my.wulvxinchen.cn/tools2/api/addTool.php', this.newToolForm).then(res=>{
            if(res.data.code === 200){
              ElMessage({
                message: res.data.msg,
                type: 'success',
              });
              this.getTools('searchAll.php')
              this.newToolForm = {
                type: '',
                name: '',
                url: '',
                til: '',
                isvis: 1
              }
            } else {
              ElMessage({
                message: '添加失败：' + res.data.msg,
                type: 'error',
              });
            }
          })
          this.addFormVisible = false
        })
    },
    editTool(id){
      const tool = this.tools.find(tool => tool.id === id)
      this.editToolForm = { ...tool }
      this.editFormVisible = true
    },
    delTool(id){
      ElMessageBox.confirm(
        '确定要隐藏该网址吗？',
        '再次确认',
        {
          confirmButtonText: '隐藏',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        axios.post('https://my.wulvxinchen.cn/tools2/api/delTool.php', { id: id }).then(res=>{
          if(res.data.code === 200){
            ElMessage({
              message: '隐藏成功',
              type: 'success',
            });
            this.getTools('searchAll.php')
          } else {
            ElMessage({
              message: '隐藏失败：' + res.data.msg,
              type: 'error',
            });
          }
        })
    })
    },
    editGitTool(){
      ElMessageBox.confirm(
          '确定要修改吗？',
          '再次确认',
          {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          axios.post('https://my.wulvxinchen.cn/tools2/api/editTool.php', this.editToolForm).then(res=>{
            if(res.data.code === 200){
              ElMessage({
                message: res.data.msg,
                type: 'success',
              });
              this.getTools('searchAll.php')
            } else {
              ElMessage({
                message: '修改失败：' + res.data.msg,
                type: 'error',
              });
            }
          })
          this.editFormVisible = false
      })
    },
    searchToolsBtn(){
      if (this.searchInput.trim() == ''){
        ElMessage({
            message: '请输入搜索关键词',
            type: 'warning'
        });
        return;
      }
      const lowerKeyword = this.searchInput.toLowerCase().trim();
      this.searchTools = this.tools.filter(tool => {
          return (
              (tool.name && tool.name.toLowerCase().includes(lowerKeyword)) || 
              (tool.type && tool.type.toLowerCase().includes(lowerKeyword)) ||
              (tool.til && tool.til.toLowerCase().includes(lowerKeyword)) ||
              (tool.url && tool.url.toLowerCase().includes(lowerKeyword))
          )
      })
      this.searchVisible = true
    },
    exportTools(){
      try {
        const dataStr = JSON.stringify(this.tools || [], null, 2);
        const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const filename = 'xinchentools_export_' + now.toISOString().slice(0,19).replace(/[:T]/g, '_') + '.json';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        ElMessage({ message: '导出成功：' + filename, type: 'success' });
      } catch (e) {
        ElMessage({ message: '导出失败: ' + e.message, type: 'error' });
      }
    },
    getTools(url){
      this.loading = true
      axios.get('https://my.wulvxinchen.cn/tools2/api/' + url).then(res=>{
        this.tools = res.data.data
        this.loading = false
      })
    },
  }
}
</script>