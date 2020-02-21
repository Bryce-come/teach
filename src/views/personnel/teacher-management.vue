<template>
  <div v-loading="loading" class="teacher-management">
    <el-form :inline="true" style="display:flex;justify-content:space-between;flex-wrap:wrap">
      <el-form-item>
        <el-button type="primary" @click="showForm()">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filterText" placeholder="请输入关键字搜索" style="width:100%"></el-input>
      </el-form-item>
    </el-form>
    <lkt-table
      :data="teacherUserList"
      style="width:100%">
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="username" label="账号名称"/>
      <el-table-column prop="pwd" label="密码"/>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="address" label="邮箱地址"/>    
      <el-table-column label="操作">
        <el-button type="danger" size="mini" @click="remove()">删除</el-button>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="addModal"
      :confirm="update"
      width="700px">
        <div slot="title">录入授课教师信息</div>
        <el-form v-if="addModal.teacherInfo" ref="form" :model="addModal.teacherInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="姓名" prop="name" :rules="{ required: true, message: '请输入姓名'}">
              <el-input v-model="addModal.teacherInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="账号名称" prop="username" :rules="{ required: true, message: '请输入账号名称'}">
              <el-input v-model="addModal.teacherInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" :rules="{ required: true, message: '请输入联系电话'}">
              <el-input v-model="addModal.teacherInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd" :rules="{ required: true, message: '请输入密码'}">
              <el-input v-model="addModal.teacherInfo.pwd"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="address" :rules="{ required: true, message: '请输入邮箱地址'}">
              <el-input v-model="addModal.teacherInfo.address"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const filterText = ref<string|null>(null);
    const teacherUserList = ref<any>();
    const remove = async (row: any) => {
        Message.success('删除成功');
    };
    const addModal = ref<any>({
        visible: false,
        teacherInfo: null,
    });
    const form = ref<ElForm|null>(null);
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initForm();
      }
      addModal.value.teacherInfo = data;
      addModal.value.visible = true;
    };
    async function update() {
      const valid = true;
      if (valid) {
        const { name, username, pwd, address, phone } = addModal.value.teacherInfo;
        addModal.value.visible = false;
        Message.success('添加成功');
        await query();
      }
    }
    function validator(rule: any, value: string, callback: Function) {
      if (!value && (addModal.value.data.pwd !== '' )) {
        callback(new Error('请再次输入密码'));
      } else if (value !== addModal.value.data.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    const query = async () => {
        teacherUserList.value = [
            {id: '0', role: '', username: 'xx', name: 'xxx', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
            extend: {no: '', clasz: '', claszGroup: ''}, createDt: ''},
            {id: '1', role: '', username: 'xx', name: 'xxx', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
            extend: {no: '', clasz: '', claszGroup: ''}, createDt: ''},
            {id: '2', role: '', username: 'xx', name: 'xxx', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
            extend: {no: '', clasz: '', claszGroup: ''}, createDt: ''},
            {id: '3', role: '', username: 'xx', name: 'xxx', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
            extend: {no: '', clasz: '', claszGroup: ''}, createDt: ''},
            {id: '4', role: '', username: 'xx', name: 'xxx', phone: '18269928223', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
            extend: {no: '', clasz: '', claszGroup: ''}, createDt: ''},
        ];
    };
    onMounted(useLoading(loading, async () => {
        await query();
    }));
    return{
      loading, filterText, query, teacherUserList,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
      addModal, form, showForm,
      validator,
    };
  },
};
function initForm() {
  return {
      name: '', username: '', pwd: '', phone: '', address: '',
  };
}
</script>
<style scoped lang="scss">

</style>
