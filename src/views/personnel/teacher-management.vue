<template>
  <div v-loading="loading" class="teacher-management">
    <el-form :inline="true">
      <el-form-item>
          <div class="flex align-center between little-space">
            <el-button type="success" @click="showForm()">添加新教员</el-button>
            <el-input class="search-bar" v-model="keywords" placeholder="请输入搜索内容" clearable/>
        </div>
      </el-form-item>
    </el-form>
    <lkt-table
      :data="filtered"
      style="width:100%" >
      <el-table-column prop="username" label="登录用户名"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="role.name" label="角色"/>
      <el-table-column prop="extend.no" label="工号"/>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="extend.address" label="邮箱地址"/>
      <el-table-column label="操作" align="center" min-width="160">
        <div class="flex center little-space wrap" slot-scope="{ row }">
          <el-button type="primary" class="align" size="mini" @click="showForm(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="addModal"
      :confirm="update"
      width="700px">
        <div slot="title">录入授课教师信息</div>
        <el-form v-if="addModal.teacherInfo" ref="form" :model="addModal.teacherInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="账号名称" prop="username" :rules="{ required: true, message: '请输入账号名称'}">
              <el-input v-model="addModal.teacherInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name" :rules="{ required: true, message: '请输入姓名'}">
              <el-input v-model="addModal.teacherInfo.name"></el-input>
          </el-form-item>
          <el-form-item :label="!addModal.teacherInfo.id ? '密码：' : '修改密码：'" prop="pwd" :rules="[{ required: !addModal.teacherInfo.id, message: '请填写密码' }, { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}]">
          <el-input clearable v-model="addModal.teacherInfo.pwd" type="password" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="pwdCheck" :rules="{ required: !addModal.teacherInfo.id, validator: validator }">
            <el-input clearable v-model="addModal.teacherInfo.pwdCheck" type="password" />
          </el-form-item>
          <el-form-item label="老师类型" prop="role" :rules="{ required: true, message: '请选择类型'}">
              <el-select v-model="addModal.teacherInfo.role">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="工号" prop="no">
              <el-input v-model="addModal.teacherInfo.no"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="address">
              <el-input v-model="addModal.teacherInfo.address"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
              <el-input v-model="addModal.teacherInfo.phone"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { useSearch, useConfirm, useLoading } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {urlMap} from '@/config';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {TeacherList,UserAdd,RoleList,UserDel,UserUpdate} from '../../dao/userDao'
interface Iid{
  id:number;
}
export default {
  data() {
      return {
        options: [{
          value: '2',
          label: '教师'
        }, {
          value: '4',
          label: '教师2'
        }],
        value: ''
      }
    },
  setup() {
    const loading = ref(false);
    const teacherUserList = ref<any>();
    const [keywords, filtered] = useSearch(teacherUserList, {
      includeProps: ['username', 'role.name', 'name', 'phone' ,'address'],
    });
    const remove = async (row:any) => {
        await UserDel({
        id: row.id,
        off: 0,
        });
        await query();
    };
    const addModal = ref<any>({
        visible: false,
        teacherInfo: null,
    });
    const form = ref<ElForm|null>(null);
    function validator(rule: any, value: string, callback: Function) {
      if (!value && (addModal.value.teacherInfo.pwd !== '' )) {
        callback(new Error('请再次输入密码'));
      } else if (value !== addModal.value.teacherInfo.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    function showForm(row: any) {
      if (row) {
        row.pwd = '';
        (row as any).pwdCheck = '';
      }
      addModal.value.teacherInfo = row ? deepClone(row) : initForm();
      addModal.value.visible = true;
      if (form.value) { (form.value as ElForm).clearValidate(); }
    }
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (!valid) { return ; }
      const result = {
        id: addModal.value.teacherInfo.id,
        // address: addModal.value.teacherInfo.address,
        username: addModal.value.teacherInfo.username,
        name: addModal.value.teacherInfo.name,
        phone: addModal.value.teacherInfo.phone,
        pwd: addModal.value.teacherInfo.pwd,
        role: addModal.value.teacherInfo.role,
        extend: {no:addModal.value.teacherInfo.no,address: addModal.value.teacherInfo.address,},
        extendJson:'',
      };
      result.extendJson = JSON.stringify(result.extend)
      if (!addModal.value.teacherInfo.id) {
        await UserAdd(result);
        console.log(result)
        Message.success('添加成功');
      } else {
        await UserUpdate(result);
        Message.success('修改成功');
      }
      addModal.value.visible = false;
      await query();
    }
    const query = async () => {
        const firstList = await TeacherList()
        teacherUserList.value = firstList
        console.log(firstList[2])
    };
    onMounted(useLoading(loading, async () => {
        await query();
    }));
    return{
      loading, query, teacherUserList,keywords, filtered,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
      addModal, form, showForm,
      validator,
    };
  },
};
function initForm() {
  return {
      name: '', username: '', pwd: '', phone: '',  role:'', extend:{}, pwdCheck: '',
  };
}
</script>
<style scoped lang="scss">

</style>
