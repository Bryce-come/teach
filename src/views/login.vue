<template>
  <div class="flex column center login-wrapper" v-loading="loading">
    <div class="login-underlay">
      <div>
        <img :src="loginLogo" style="height: 7vh;padding: 10px 0 0 20px" />
      </div>
      <div class="flex align-center" style="width: 100%; height: 70vh; margin-top: -4vh">
        <div class="login-title flex column center">
          <div class="title1">{{loginTitle1}}</div>
          <div class="title2">{{loginTitle2}}</div>
        </div>
        <el-form hide-required-asterisk class="login-body vivify popIn flex column around" ref="formRef" :model="form" :rules="rule">
          <el-form-item prop="username">
            <label>用户名</label>
            <input v-model="form.username" autofocus autocomplete="off" placeholder="用户名" @keyup.enter="login($refs.formRef)" />
          </el-form-item>
          <input class="login-fake-autocomplete" tabindex="-1" type="text">
          <input class="login-fake-autocomplete" tabindex="-1" type="password">
          <el-form-item prop="pwd">
            <label>密 码</label>
            <input type="password" autocomplete="off" v-model="form.pwd" placeholder="密  码" @keyup.enter="login($refs.formRef)" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login($refs.formRef)">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-support">技术支持：杭州领克信息科技有限公司</div>
  </div>
</template>
<script lang="ts">
import { ref, createComponent, Ref} from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { useLoading } from 'web-toolkit/src/service';
import { storeUserInfo, updateStoreUserInfo } from 'web-toolkit/src/case-main';
import {loginTitle1, loginTitle2, loginLogo, scheme} from '@/config';
import {router} from '@/main';
import { Route } from 'vue-router';
import {assert} from 'web-toolkit/src/utils/index';
import {Login} from '@/dao/userDao';

export default createComponent({
  setup() {
    const loading = ref(false);
    const form = ref({ username: '', pwd: '' });
    const formRef: Ref<ElForm|null> = ref(null);
    const rule = {
      username: {
        required: true,
        message: '请填写用户名',
        trigger: 'none',
      },
      pwd: [{
        required: true,
        message: '请填写密码',
        trigger: 'none',
      }, {
        type: 'string',
        min: 6,
        message: '密码长度不能小于6位',
        trigger: 'none',
      }],
    };
    async function login() {
      const valid = await (formRef.value as ElForm).validate();
      assert(valid);
      const data = await Login( {
        ...form.value,
        schema: scheme,
      });
      updateStoreUserInfo(data);
      // 设置登录后回到登录前页面
      // @ts-ignore
      const redirect: Route = {
        name: 'index',
        query: {},
      };
      if (
        storeUserInfo.redirect &&
        storeUserInfo.redirect.name &&
        storeUserInfo.redirect.name !== 'notFound' &&
        storeUserInfo.redirect.name !== 'login'
      ) {
        redirect.name = storeUserInfo.redirect.name;
        redirect.query = storeUserInfo.redirect.query;
      }
      // @ts-ignore
      storeUserInfo.redirect = redirect;
      router.push(redirect);
    }
    return {
      formRef, loginTitle1, loginTitle2, loginLogo,
      loading, form, rule, login: useLoading(loading, login),
    };
  },
});
</script>
<style lang="scss" scoped>
.login-wrapper {
  position: relative;
  /*background-color: #334156;*/
  background-color: #6499e8;
  width: 100vw;
  height: 100vh;
}
.login-underlay {
  /*background-color: #4a5166;*/
  background-color: rgba(48, 62, 67, 0.84);
  border-radius: 10px;
  box-shadow: 3px 3px 10px rgba($color: #000000, $alpha: .3);
  width: 70vw;
  height: 75vh;
}
.login-title{
  color: #0297ff;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 25px;
  font-weight: 400;
  margin-left: 15%;
  margin-right: 15%;
  .title2 {
    font-size: 2.5rem;
  }
}
.login-body {
  background: #525050;
  padding: 5% 7%;
  box-shadow: 3px 3px 10px rgba($color: #000, $alpha: .5);
  border-radius: 10px;
  width: 30vw;
  max-width: 30rem;
  height: 50vh;
  max-height: 40rem;
  border: none;
  margin-right: -40%;
  font-size: 1rem;
  .login-fake-autocomplete {
    width: 0;
    height: 0;
    border: none;
    position: absolute;
  }
  .el-form-item {
    label {
      font-size: 1.05rem;
      color: #fff;
    }
    input {
      font-size: 1rem;
      display: block;
      letter-spacing: 1px;
      width: 100%;
      border: none;
      border-bottom: 1px solid #fff;
      line-height: 2rem;
      background-color: transparent;
      color: #fff;
    }
  }
  .el-button{
    width: 100%;
    font-weight: 600;
  }
}
.login-support{
  color: #fff;
  width: 100%;
  position: absolute;
  bottom: 10px;
  font-weight: 700;
  font-size: 1.05rem;
  text-align: center;
}
</style>
