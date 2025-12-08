<template>
  <div id="app">
    <router-view />
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