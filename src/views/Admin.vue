<template>
  <div>
    <div class="header_card my_card remove_flex">
      <el-button type="primary" @click="backTools()">返回工具集</el-button>
      <el-button type="danger" @click="logout()">退出</el-button>
    </div>
    <div class="header_card my_card">
      <el-button type="primary" @click="addTool()">快速新增</el-button>
    </div>
    <div class="header_card my_card remove_flex">
      <el-button type="primary" @click="getTools()">获取</el-button><br><br>
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
        <el-form-item label="ID">
          <el-input v-model="newToolForm.id" />
        </el-form-item>
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
            <el-switch v-model="newToolForm.isvis" active-value="1" inactive-value="0"/>
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
          <el-input v-model="editToolForm.id" />
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
            <el-switch v-model="editToolForm.isvis" active-value="1" inactive-value="0"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editGitTool()">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
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
      toolTypes: ['实用', '趣味', '游戏', '其他'],
      newToolForm: {
        id: '',
        type: '',
        name: '',
        url: '',
        til: '',
        isvis: ''
      },
      editToolForm: {
        id: '',
        type: '',
        name: '',
        url: '',
        til: '',
        isvis: ''
      },
      tools: [],
    }
  },
  methods:{
    backTools(){
        this.$router.push('/')
    },
    logout(){
        // 清除cookie操作写这里
        this.$router.push('/login')
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
          // 提交新增请求操作写这里
          axios.post('https://my.wulvxinchen.cn/tools2/api/addTool.php', this.newToolForm).then(res=>{
            if(res.data.code === 200){
              ElMessage({
                message: '添加成功',
                type: 'success',
              });
              this.getTools()
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
      this.editToolForm = this.tools.find(tool => tool.id === id)
      this.editFormVisible = true
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
          // 提交编辑请求操作写这里
          alert(Cookies.get('xinchentools_auth_token'))
          this.editFormVisible = false
      })
    },
    getTools(){
      this.loading = true
      axios.get('https://my.wulvxinchen.cn/tools2/api/searchAll.php').then(res=>{
        this.tools = res.data.data
        this.loading = false
        // 最后删掉输出
        console.log(this.tools)
      })
    }
  }
}
</script>