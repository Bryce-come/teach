<template>
  <div class="out">
    <i class="iconfont icon-404"/>
    <div class="info">{{ router.currentRoute.params.msg === undefined?'当前页面找不到':router.currentRoute.params.msg }}</div>
    <br />
    <el-button type="primary" @click="router.back()">返 回</el-button>
    <el-button type="primary" @click="toLogin()" style="margin-left: 10px">返回至登录页</el-button>
  </div>
</template>

<script lang="ts">
import {router} from '@/main';

export default {
  name: 'page404',
  setup() {
    function toLogin() {
      router.push({name: 'login'});
    }
    return{
      router, toLogin
    };
  },
};
</script>


<style scoped lang="scss">
  .out{
    text-align: center;
    padding: 70px 0;
  }

  img{
    height: 200px;
    margin-bottom: 10px;
  }

  i{
    color: $active-text;
    font-size: 16rem;
  }

  .info{
    color: $active-text;
    margin-bottom: 10px;
    font-size: 1.5rem;
  }
</style>
