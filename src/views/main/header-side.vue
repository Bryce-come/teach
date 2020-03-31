<template>
  <div class="theme flex center end align-center">
    <el-popover
      v-if="isNotStudent"
      class="msg-panel"
      placement="bottom"
      width="500"
      trigger="click">
      <template>
        <div style="min-height: 10vh;overflow-y: auto;">
          <el-row v-for="(key) in Object.keys(alarmsMsg)" :key="key" type="flex" justify="start" align="top" class="alarm-device">
            <span class="alarm-device-name">{{alarmsMsg[key].name}}</span>
            <div class="flex column alarm-message">
              <div class="hover flex between" v-for="(b, index) in alarmsMsg[key].alarm" :key="index">
                <div>
                  <el-tag type="danger" size="small" v-if="b.type==='serious'">严重</el-tag>
                  <el-tag type="warning" size="small" v-else>警告</el-tag>
                </div>
                <div class="message" :title="b.msg === undefined ? '无描述' : b.msg">
                  {{ b.msg === undefined ? '无描述' : b.msg }}
                </div>
                <span class="no-message" @click="noMessage(b.id)">不再提醒</span>
              </div>
            </div>
          </el-row>
          <div v-if="alarmsLength === 0" class="no-msg">暂无设备报警</div>
        </div>
      </template>
      <el-badge class="header-alarm" slot="reference" :value="alarmsLength"><i class="icon-warning iconfont"/></el-badge>
    </el-popover>
    <el-dropdown @command="handleCmdOfUser" class="user-panel" trigger="click">
      <img class="user-avatar" src="../../assets/head.png"/>
      <el-dropdown-menu slot="dropdown" class="flex column center around">
        <img class="user-avatar" src="../../assets/head.png" />
        <span class="user-name">{{ storeUserInfo.user ? storeUserInfo.user.name : '' }}</span>
        <div class="user-actions flex center around">
          <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="updateInfo">修改信息</el-dropdown-item>
        </div>
        <el-dropdown-item command="logout"><el-button type='danger' size="mini">注销用户</el-button></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <kit-dialog-simple
      id="user-pwd"
      :modal="modalUpdatePwd"
      :confirm="updatePwd"
      width="30%">
      <div slot="title">修改登录密码</div>
      <el-form
        style="margin: 0 auto;width: 90%"
        :model="modalUpdatePwd.params"
        ref="form"
        label-position="left" label-width="100px">
        <el-form-item
          label="旧密码" prop="oldPwd"
          :rules="[{required: true, message: '密码不能为空', trigger: 'blur'},{ type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}]">
          <el-input type="password" v-model="modalUpdatePwd.params.oldPwd"/>
        </el-form-item>
        <el-form-item
          label="新密码" prop="newPwd"
          :rules="[{required: true, message: '密码不能为空',trigger: 'blur'},{ type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}]">
          <el-input type="password" v-model="modalUpdatePwd.params.newPwd"/>
        </el-form-item>
        <el-form-item
          label="确认密码" prop="pwdCheck"
          :rules="[{required: true, validator: validatePassCheck, trigger: 'blur'},{ type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'none'}]">
          <el-input type="password" v-model="modalUpdatePwd.params.pwdCheck"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      id="user-info"
      :modal="modalUpdateInfo"
      :confirm="updateInfo"
      width="30%">
      <div slot="title">修改账户信息</div>
      <el-form
        style="margin: 0 auto;width: 90%"
        :model="modalUpdateInfo.params"
        ref="formInfo"
        label-position="left" label-width="100px">
        <el-form-item label="用户名：">
          {{storeUserInfo.user?storeUserInfo.user.username:''}}
        </el-form-item>
        <el-form-item label="姓  名：" prop="name"
                      :rules="[{required: true, message: '请填写性名', trigger: 'blur'}]">
          <el-input v-model="modalUpdateInfo.params.name"/>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone"
                      :rules="[{required: true, message:'请填写手机号', trigger: 'blur'}]">
          <el-input v-model="modalUpdateInfo.params.phone"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, onMounted, onUnmounted, createComponent, computed } from '@vue/composition-api';
import {rmStoreUserInfo, updateStoreUserInfo} from 'web-toolkit/src/case-main';
import { sleep } from 'web-toolkit/src/utils';
import {useLoading, useLoadingDirect} from 'web-toolkit/src/service';
import {router} from '@/main';
import {Message} from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {storeUserInfo} from 'web-toolkit/src/case-main';
import {LoginOut, UserUpdateInfo, UserUpdatePwd} from '@/dao/userDao';
import {AlarmRecordConfirm, MonitorAlarm} from '@/dao/alarmDao';

export default createComponent({
  setup() {
    const loading = ref(false);
    const over = ref(false);
    const alarms = ref([]);
    const alarmsMsg = ref({});
    const alarmsLength = ref(0);
    const modalUpdatePwd = reactive({
      visible: false,
      loading: false,
      flag: '',
      params: {
        oldPwd: undefined,
        newPwd: undefined,
        pwdCheck: undefined,
      },
    });
    const modalUpdateInfo = reactive({
      visible: false,
      loading: false,
      flag: '',
      params: {
        id: undefined,
        name: undefined,
        phone: undefined,
      },
    });
    const form: Ref<ElForm|null> = ref(null);
    const formInfo: Ref<ElForm|null> = ref(null);
    const count = ref(0);

    function validatePassCheck(rule: any, value: string, callback: (...arg: any[]) => any) {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'));
      } else if (value !== modalUpdatePwd.params.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    async function noMessage(id: number) {
      await AlarmRecordConfirm({ id });
      query();
    }
    async function handleCmdOfUser(cmd: string) {
      switch (cmd) {
        case 'logout':
          await LoginOut();
          rmStoreUserInfo();
          router.push({name: 'login'});
          break;
        case 'updatePwd':
          modalUpdatePwd.visible = true;
          if (form.value) { (form.value as ElForm).clearValidate(); }
          break;
        case 'updateInfo':
          // @ts-ignore
          modalUpdateInfo.params.name = storeUserInfo.user!.name;
          // @ts-ignore
          modalUpdateInfo.params.phone = storeUserInfo.user!.phone;
          modalUpdateInfo.visible = true;
          if (formInfo.value) { (formInfo.value as ElForm).clearValidate(); }
          break;
      }
    }
    async function updatePwd() {
      const valid = await (form.value as ElForm).validate();
      if (!valid) {
        return;
      }
      await UserUpdatePwd(modalUpdatePwd.params);
      Message.success('修改成功');
      (form.value as ElForm).resetFields();
      modalUpdatePwd.visible = false;
    }
    async function updateInfo() {
      const valid = await (formInfo.value as ElForm).validate();
      if (!valid) {
        return;
      }
      await UserUpdateInfo({
        id: modalUpdateInfo.params.id,
        name: modalUpdateInfo.params.name,
        phone: modalUpdateInfo.params.phone,
      });
      Message.success('修改成功');
      (storeUserInfo.user as any).name = modalUpdateInfo.params.name;
      (storeUserInfo.user as any).phone = modalUpdateInfo.params.phone;
      updateStoreUserInfo(storeUserInfo as any);
      modalUpdateInfo.visible = false;
    }
    const isNotStudent = computed(() => {
      // 如果是学生，有些不显示
      return storeUserInfo.user && storeUserInfo.user.role && storeUserInfo.user.role.department && storeUserInfo.user.role.department.id !== 2;
    });
    onMounted(async () => {
      over.value = false;
      count.value = 0;
      while (!over.value) {
        if (isNotStudent) { await query(); }
        // count.value += 1;
        await sleep(15000);
      }
    });
    onUnmounted(() => {
      over.value = true;
      count.value = 0;
    });
    async function query() {
      const res = await MonitorAlarm();
      if (res.result === 1) {
        const cache: any = {};
        res.data.alarms.forEach((a: any) => {
          const id = a.device ? a.device.id : a.extend.lineId;
          const name = a.device ? a.device.name : '产线:' + a.extend.lineName;
          const e = cache[id];
          if (!e) {
            cache[id] = {name, alarm: [a]};
          } else {
            e.alarm.push(a);
          }
        });
        alarmsMsg.value = cache;
        alarmsLength.value = 0;
        for (const ee of Object.keys(cache)) {
          alarmsLength.value += cache[ee].alarm.length;
        }
      }
    }
    return{
      storeUserInfo, router,
      over,
      alarms,
      alarmsMsg,
      alarmsLength,
      modalUpdatePwd,
      modalUpdateInfo,
      form,
      formInfo,
      validatePassCheck,
      noMessage,
      handleCmdOfUser,
      updatePwd: useLoadingDirect(modalUpdatePwd.loading, updatePwd),
      updateInfo: useLoading(loading, updateInfo),
      query,
      isNotStudent,
    };
  },

});
</script>
<style scoped lang="scss">
  .header-alarm {
    font-size: 15px;
    cursor: pointer;
  }
  .user-avatar {
    height: 35px;
    border-radius: 50%;
    overflow: hidden;
    cursor:pointer;
  }
  .user-name {
    line-height: 35px;
  }
  .user-actions {
    height: 40px;
  }
  .hover {
    padding: 3px 5px;
    margin: 3px 3px 6px 3px;
    transition: all .2s;
    border-radius: 3px;
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      background-color: $blue-2;
    }
  }
  .alarm-device{
    border-bottom: 1px solid #bcbcbc;
    padding: 5px;
    .alarm-device-name {
      margin-top: 3px;
      background-color: #00afff;
      min-width: 110px;
      color: #fff;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 3px;
    }
    &:last-child {
      border: none;
    }
    .alarm-message {
      width: 100%;
      .no-message {
        font-size: .8rem;
        color: #0ae;
        width: 4rem;
        cursor: pointer;
      }
      .message {
        padding: 0 5px;
        width: 50%;
        text-align: center;
      }
    }
  }
  .icon-chatlist{
    font-size: 30px;
    color: #00aaee;
  }
  .icon-warning{
    font-size: 28px;
    color: $icon-warning
  }
  .user-panel{
    padding-left: 4vw;
    padding-right: 2rem;
  }
  .msg-panel{
    padding-left: 4rem;
  }
  .no-msg{
    text-align: center;
    width: 100%;
    margin-top: 1rem;
    color: grey;
    font-size: 1rem
  }
  .msg{
    .title{
      color: #00aaee;
    }
  }
</style>
