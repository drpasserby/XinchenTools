<template>
    <div>
        <div class="header_card my_card">
            <div class="header_card_logo">
                <a href="./about" >
                    <img src="https://my.wulvxinchen.cn/pictures/logo/logo.webp" alt="xinchen" class="header_card_img">
                </a>
                <strong>心尘的工具集</strong>
            </div>
            <div class="header_card_info">
                    <span style="font-weight:600"><a href="https://wulvxinchen.cn/">导航站</a>
                        <el-divider direction="vertical" />
                        <a href="https://github.com/drpasserby/XinchenTools/issues">反馈</a>
                        <el-divider direction="vertical" />
                        <a href="./about">关于</a>
                    </span>
                </div>
        </div>
        <div class="body_card">
            <el-row :gutter="10">
                <el-col :xs="24" :xl="8">
                    <div class="my_card body_card_item" v-loading="loading">
                        <h3>状态</h3>
                        <p>共有{{tools.length}}个网站</p>
                    </div>
                </el-col>
                <el-col :xs="24" :xl="8">
                    <div class="my_card body_card_item">
                        <h3>搜索</h3>
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
                </el-col>
                <el-col :xs="24" :xl="8">
                    <div class="my_card body_card_item">
                        <h3>随机一站</h3>
                        <el-button type="primary" @click="randomToolShow">抽卡</el-button>
                    </div>
                </el-col>
        </el-row>
        </div>
        <div class="body_card">
            <el-row :gutter="10">
                <el-col :xs="24" :md="12" :lg="8" :xl="6" v-for="i in tools" :key="i">
                    <div class="my_card body_card_item tool_card">
                        <p class="tool_name"><strong>{{ i.name }}</strong></p>
                        <p class="tool_type">{{ i.type }}</p>
                        <div>
                            <el-button type="primary" @click="toolOpenInfo(i.id)">详情</el-button>
                            <el-button type="success" @click="openURL(i.url)">访问</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog v-model="toolWinVisible" :title="'工具ID:' + showTool.id" width="800" align-center>
            <p class="tool_name"><strong>{{ showTool.name }}</strong></p>
            <p class="tool_type"><strong>类型：{{ showTool.type }}</strong></p>
            <p class="tool_til">简介：{{ showTool.til }}</p>
            <p class="tool_url">网址：<a :href="showTool.url" target="_blank">{{ showTool.url }}</a></p>
            <template #footer>
                <el-button-group>
                    <el-button type="warning" @click="randomToolShow()" v-if="randomBtnVisible">再换一个</el-button>
                    <el-button type="success" @click="openURL(showTool.url)">直接访问</el-button>
                    <el-button type="info" @click="openURL('./page?id='+showTool.id)">独立页面</el-button>
                    <el-button type="primary" @click="shareURL(showTool.id)">分享</el-button>
                </el-button-group>
            </template>
        </el-dialog>
        <el-dialog v-model="searchVisible" title="搜索结果" width="500" align-center>
            <p>共搜到<el-text type="success">{{searchTools.length}}</el-text>个包含关键词<el-text type="warning">“{{searchInput}}”</el-text>网站</p>
            <el-table :data="searchTools" stripe border style="width: 100%" height="700">
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="type" label="类型" />
                <el-table-column fixed="right" label="操作">
                    <template #default="{row}">
                        <el-button link type="primary" @click="toolOpenInfo(row.id)">打开</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  components: {},
    data() {
    return {
        toolWinVisible: false,
        randomBtnVisible: false,
        searchVisible: false,
        loading: false,
        searchInput: '',
        settings:{
            autoRedirect: true,
            redirectDelay: 3000,
            autoRandomTool:false
        },
        showTool:{},
        randomTool: {},
        tools: [],
        searchTools: []
    };},
    methods: {
        getSettings(){
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) {
                this.settings = JSON.parse(savedSettings);
            }
            else{
            this.settings = {
                autoRedirect: true,
                redirectDelay: 3000,
                autoRandomTool:false
            };
        }
        },
        getTools(){
            this.loading = true
            axios.get('https://my.wulvxinchen.cn/tools2/api/searchAll.php').then(res=>{
                this.tools = res.data.data.slice().reverse()
                this.loading = false
                // 最后删掉输出
                console.log(this.tools)
            })
        },
        randomToolShow(){
            const randomIndex = Math.floor(Math.random() * this.tools.length);
            this.showTool = this.tools[randomIndex];
            this.randomBtnVisible = true
            this.toolWinVisible = true
        },
        toolOpenInfo(id){
            this.showTool = this.tools.find(tool => tool.id === id);
            this.randomBtnVisible = false
            this.toolWinVisible = true
        },
        openURL(url){
            window.open(url, '_blank')
        },
        shareURL(id){
            const input = document.createElement('input')
            if(this.settings.autoRedirect == true){
                input.value = window.location.href + 'page?id=' + id + "&auto=1"
            }
            else{
                input.value = window.location.href + 'page?id=' + id
            }
            document.body.appendChild(input)
            input.select()
            document.execCommand('Copy')
            document.body.removeChild(input)
            this.$message({
                    message: '已复制网址到剪贴板,快去分享吧!',
                    type: 'success'
                });
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
        // 测试函数，记得删除
        deltool(){
            this.tools.pop()
        }
    },
    mounted(){
        this.getTools(),
        this.getSettings()
    }
}
</script>

<style>
.my_card{
    background-color: #fff;
    border-radius: .5em;
    border: 1px solid #e4e7ed ;
    padding: 1em;
    transition: all 0.5s;
}
.my_card:hover{
    box-shadow:
        2.3px 1.6px 2px rgba(0, 0, 0, 0.017),
        4.4px 3px 4.2px rgba(0, 0, 0, 0.026),
        6.5px 4.4px 7px rgba(0, 0, 0, 0.034),
        8.7px 6px 11.1px rgba(0, 0, 0, 0.042),
        11.5px 7.9px 18.5px rgba(0, 0, 0, 0.053),
        16px 11px 37px rgba(0, 0, 0, 0.07);
}
.header_card{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    margin: 2em auto;
}

.header_card_logo{
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1em;
}
.header_card_info{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1em;
}
.header_card_img{
    width: 5em;
    border: 2px solid #d5ffea;
    border-radius: .5em;
    box-shadow:
        2.3px 1.6px 2px rgba(0, 0, 0, 0.017),
        4.4px 3px 4.2px rgba(0, 0, 0, 0.026),
        6.5px 4.4px 7px rgba(0, 0, 0, 0.034),
        8.7px 6px 11.1px rgba(0, 0, 0, 0.042),
        11.5px 7.9px 18.5px rgba(0, 0, 0, 0.053),
        16px 11px 37px rgba(0, 0, 0, 0.07);
    transition: all .5s;
}
.header_card_img:hover{
    border-radius: 100%;
    border: 2px solid #ffaa7f;
}
.header_card_logo strong{
    font-size: 2em;
    margin-left: .3em;
    transition: all .5s;
}
.header_card_logo strong:hover{
    color: #ffaa7f;
}
.body_card{
    width: 80%;
    margin: 2em auto;
}
.body_card_item{
    margin: .5em auto;
    text-align: center;
}
.tool_card{
    transition: all .5s;
}
.tool_card:hover{
    border: 1px solid #999;
    background-color: #f2ffe5;
}
.tool_name{
    color: #000;
    font-size: 1.75em;
    margin: .3em 0;
}
.tool_type{
    color: #6c757d;
}
.tool_til{
    padding: .3em;
    border: 1px dashed #8b8b8b;
}
</style>