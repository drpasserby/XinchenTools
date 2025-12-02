<template>
  <div>
    <div class="header_card my_card remove_flex">
      <el-button type="primary" @click="backTools()">返回工具集</el-button>
      <el-button type="danger" @click="logout()">退出</el-button>
    </div>
    <div class="header_card my_card">
      <el-button-group>
        <el-button type="primary" @click="testCookie()">测试Cookie</el-button>
        <el-button type="primary" @click="addTool()">快速新增</el-button>
      </el-button-group>
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
      </el-button-group>
      <p>共有<el-text type="success">{{tools.length}}</el-text>个网站</p>
      <el-table :data="tools" stripe border v-loading="loading" style="width: 100%" height="600">
        <el-table-column prop="id" label="ID" sortable/>
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="url" label="网址" />
        <el-table-column prop="isvis" label="可见" />
        <el-table-column fixed="right" label="操作">
            <template #default="{row}">
                <el-button link type="primary" @click="editTool(row.id)">编辑</el-button>
                <el-button link type="danger" @click="delTool(row.id)">隐藏</el-button>
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
        <el-form-item label="是否可见">
            <el-switch v-model="newToolForm.isvis" :active-value=1 :inactive-value=0 />
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
        <el-form-item label="是否可见">
            <el-switch v-model="editToolForm.isvis" :active-value=1 :inactive-value=0 />
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
                  <el-button link type="danger" @click="delTool(row.id)">隐藏</el-button>
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
      searchInput: '',
      toolTypes: ['实用', '趣味', '游戏', '其他'],
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
                      message: 'Cookie验证成功,值为:' + cookieValue,
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
        this.$message({
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
    getTools(url){
      this.loading = true
      axios.get('https://my.wulvxinchen.cn/tools2/api/' + url).then(res=>{
        this.tools = res.data.data
        this.loading = false
        // 最后删掉输出
        console.log(this.tools)
      })
    },
  }
}
</script>