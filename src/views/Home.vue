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
                    <div class="my_card body_card_item">
                        <h3>状态</h3>
                        <p :v-model="count">共有{{count}}个网站</p>
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
                                <el-button>搜索</el-button>
                            </template>
                        </el-input>
                    </div>
                </el-col>
                <el-col :xs="24" :xl="8">
                    <div class="my_card body_card_item">
                        <h3>随机一站</h3>
                        <el-button type="primary" plain>抽卡</el-button>
                    </div>
                </el-col>
        </el-row>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Home',
  components: {},
    data() {
    return {
        count: 128,
        searchInput: '',
        randomTool: {
            "id": 1,
            "type": "实用",
            "name": "申论生成器",
            "url": "https://sojo.im/slscq/",
            "til": "在线生成申论"
        }
    };
    },
  
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
    height: 6em;
    margin: .5em auto;
    text-align: center;
}
</style>