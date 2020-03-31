<template>
  <div class="flex column center login-wrapper" v-loading="loading">
    <div class="login-underlay flex center">
      <div class="left flex center">
        <img src="../assets/login_pic.png" >
      </div>
      <el-card class="flex column center vivify popIn">
        <div class="login-title flex column center">
          <div class="title1">实验室管理系统</div>
        </div>
        <el-form class="flex column around" ref="formRef" :model="form" :rules="rule">
          <el-form-item prop="username" label="用户名：" >
            <el-input v-model="form.username" autofocus placeholder="用户名" @keyup.enter.native="login($refs.formRef)" />
          </el-form-item>
          <el-form-item prop="pwd" label="密码：" >
            <el-input type="password" v-model="form.pwd" placeholder="密  码" @keyup.enter.native="login($refs.formRef)" />
          </el-form-item>
          <kit-err-channel id="login" style="margin-bottom: 5px" />
          <el-button style="width: 100%;margin-top: 1rem;font-size: 1.2em" type="primary" @click="login($refs.formRef)">登录</el-button>
        </el-form>
      </el-card>
    </div>
    <div class="login-support">技术支持：杭州领克信息科技有限公司</div>
  </div>
</template>
<script lang="ts">
import { ref, createComponent, Ref} from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { useLoading } from 'web-toolkit/src/service';
import { storeUserInfo, updateStoreUserInfo, submitErrChanel, pushMsgErr } from 'web-toolkit/src/case-main';
import {loginTitle1, loginTitle2, loginLogo, scheme} from '@/config';
import {router} from '@/main';
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
      submitErrChanel('login');
      const data = await Login( {
        ...form.value,
        schema: scheme,
      });
      updateStoreUserInfo(data);
      // 设置登录后回到登录前页面
      const redirect: any = {
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
  width: 100vw;
  height: 100vh;
  background: url("../assets/login_bg.jpg") no-repeat;
  background-size: 100% 100%;
}
.login-underlay {
  height: 90vh;
  .left{
    img{
      width: 32vw;
    }
  }
  .el-card{
    height: 28rem;
    padding-bottom: 1rem;
    margin-left: 3rem;
    .el-form{
      width: 20rem;
    }
    .login-title{
      width: 100%;
      font-size: 1.6rem;
      text-align: center;
      margin-bottom: 25px;
      font-weight: 500;
      .title2 {
        font-size: 2.5rem;
      }
    }
  }
}

.login-support{
  color: #fff;
  width: 100%;
  float: bottom;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
}
</style>
