<template>
  <div id="app">
    <router-view />
    <div class="cr_text">Copyright © 2026 心尘的工具集</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  mounted() {
    console.log("欢迎使用心尘工具集！")
    console.log("==============================")
    console.log(" __        ___    __  ______ ")
    console.log(" \\ \\      / / |   \\ \\/ / ___|")
    console.log("  \\ \\ /\\ / /| |    \\  / |   ")
    console.log("   \\ V  V / | |___ /  \\ |___ ")
    console.log("    \\_/\\_/  |_____/_/\\_\\____|")
    console.log("==============================")
  },
}
</script>
<style>
.cr_text {
  text-align: center;
  color: #888;
  margin: 20px 0;
  font-size: 14px;
}
</style>