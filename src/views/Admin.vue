<template>
  <div>
    <div class="header_card my_card remove_flex">
      <el-button type="primary" @click="backTools()">返回工具集</el-button>
      <el-button type="danger" @click="logout()">退出</el-button>
    </div>
    <div class="header_card my_card remove_flex">
      <h3 class="panel_title">控制面板</h3>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="stat_card">
            <p class="stat_label">服务器状态</p>
            <p class="stat_value">{{ getPara.statServerStatus }}</p>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="stat_card">
            <p class="stat_label">总工具数量</p>
            <p class="stat_value">{{ getPara.statTotalTools }}</p>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="stat_card">
            <p class="stat_label">可见工具</p>
            <p class="stat_value">{{ getPara.statVisibleTools }}</p>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="stat_card">
            <p class="stat_label">有效 Cookie</p>
            <p class="stat_value">{{ getPara.statValidCookies }}</p>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="stat_card">
            <p class="stat_label">用户数量</p>
            <p class="stat_value">{{ getPara.userCount }}</p>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="stat_card">
            <p class="stat_label">预留接口</p>
            <p class="stat_value">{{ getPara.uselessAPI }}</p>
          </div>
        </el-col>
      </el-row>
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
      </el-button-group>&nbsp;
      <el-button-group>
        <el-button type="primary" @click="exportToolsJson()">导出Json</el-button>
        <el-button type="primary" @click="exportToolsCSV()">导出CSV</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '添加网址' : '编辑网址'" width="500" align-center>
      <el-form>
        <el-form-item label="ID" v-if="dialogMode === 'edit'">
          <el-input v-model="editToolForm.id" disabled/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input :model-value="dialogMode === 'add' ? newToolForm.name : editToolForm.name" @update:model-value="dialogMode === 'add' ? newToolForm.name = $event : editToolForm.name = $event" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select :model-value="dialogMode === 'add' ? newToolForm.type : editToolForm.type" @update:model-value="dialogMode === 'add' ? newToolForm.type = $event : editToolForm.type = $event" placeholder="选择" allow-create filterable>
            <el-option v-for="i in toolTypes" :key="i" :label="i" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="网址">
          <el-input :model-value="dialogMode === 'add' ? newToolForm.url : editToolForm.url" @update:model-value="dialogMode === 'add' ? newToolForm.url = $event : editToolForm.url = $event" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input :model-value="dialogMode === 'add' ? newToolForm.til : editToolForm.til" @update:model-value="dialogMode === 'add' ? newToolForm.til = $event : editToolForm.til = $event" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select :model-value="dialogMode === 'add' ? newToolForm.isvis : editToolForm.isvis" @update:model-value="dialogMode === 'add' ? newToolForm.isvis = $event : editToolForm.isvis = $event" placeholder="选择" allow-create filterable>
            <el-option v-for="i in isvisOptions" :key="i.value" :label="i.lb" :value="i.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button type="success" @click="openURL(dialogMode === 'add' ? newToolForm.url : editToolForm.url)" v-if="dialogMode === 'edit'">访问</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogMode === 'add' ? addGitTool() : editGitTool()">提交</el-button>
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
      dialogVisible: false,
      dialogMode: 'add', // 'add' or 'edit'
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
      cookieMgts: [],
      getPara: {
        statServerStatus: '',
        statTotalTools: 0,
        statVisibleTools: 0,
        statValidCookies: 0,
        userCount: 0,
        uselessAPI: ''
      }
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
        this.dialogMode = 'add'
        this.newToolForm = {
          type: '',
          name: '',
          url: '',
          til: '',
          isvis: 1
        }
        this.dialogVisible = true
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
          this.dialogVisible = false
        })
    },
    editTool(id){
      const tool = this.tools.find(tool => tool.id === id)
      this.editToolForm = { ...tool }
      this.dialogMode = 'edit'
      this.dialogVisible = true
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
          this.dialogVisible = false
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
    exportToolsJson(){
      if (!this.tools || !this.tools.length) {
          ElMessage({ message: '没有可导出的数据', type: 'warning' });
          return;
        }
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
    exportToolsCSV(){
      try {
        if (!this.tools || !this.tools.length) {
          ElMessage({ message: '没有可导出的数据', type: 'warning' });
          return;
        }
        const headers = ['ID', '类型', '名称', '网址', '简介', '状态'];
        const rows = this.tools.map(t => [
          t.id,
          t.type,
          t.name,
          t.url,
          t.til,
          t.isvis
        ]);
        const csvContent =
          headers.join(',') +
          '\n' +
          rows
            .map(r =>
              r
                .map(field => {
                  const str = field == null ? '' : String(field);
                  return '"' + str.replace(/"/g, '""') + '"';
                })
                .join(',')
            )
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const filename =
          'xinchentools_export_' +
          now.toISOString().slice(0, 19).replace(/[:T]/g, '_') +
          '.csv';
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

<style scoped>
.panel_title {
  text-align: center;
  margin: 0 0 12px 0;
  font-size: 1.3em;
  color: #303133;
}
.stat_card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 14px 10px;
  text-align: center;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stat_card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.15);
  background-color: #ecf5ff;
}
.stat_label {
  font-size: 1em;
  font-weight: 600;
  color: #606266;
  margin: 0 0 8px 0;
  line-height: 1.4;
}
.stat_value {
  font-size: 0.95em;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .stat_card {
    height: auto;
    padding: 10px 6px;
  }
  .stat_label {
    font-size: 0.85em;
  }
  .stat_value {
    font-size: 0.8em;
  }
}
</style>