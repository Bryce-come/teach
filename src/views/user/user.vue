<template>
  <div v-loading="loading">
    <div class="flex align-center between little-space">
      <el-button type="success" @click="showForm()">添加系统用户</el-button>
      <el-input class="search-bar" v-model="keywords" placeholder="请输入搜索内容" clearable/>
    </div>
    <lkt-table :data="filtered">
      <el-table-column label="账户登录名" prop="username" sortable min-width="120"/>
      <el-table-column label="角色" prop="role.name" sortable min-width="120"/>
      <el-table-column label="姓名" prop="name" sortable min-width="140"/>
      <el-table-column label="手机" prop="phone" sortable width="130"/>
      <el-table-column label="账号状态" sortable width="100">
        <template slot-scope="{ row }">
          <el-tag v-if="row.off === 0" type="success">正常</el-tag>
          <el-tag v-if="row.off === 1" type="danger">冻结</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="240">
        <div class="flex wrap button-in-row" slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="showForm(row)">修改</el-button>
          <el-button
            v-if="storeUserInfo.user.id !== row.id"
            size="mini" :type="row.off === 0 ? 'warning' : 'success'"
            @click="toggleStatus(row)"
          >{{ row.off === 0 ? '冻结' : '恢复' }}</el-button>
          <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      id="user"
      :modal="modal"
      :confirm="update"
      width="40%">
      <div slot="title">{{modal.data.id? '修改':'添加'}}账户</div>
      <el-form ref="form" label-position="left" label-width="120px" :model="modal.data">
        <el-form-item label="账户登录名：" prop="username" :rules="{ required: true, message: '请填写账户登录名' }">
          <el-input clearable v-model="modal.data.username" placeholder="请输入账户登录名" />
        </el-form-item>
        <el-form-item label="角色：" prop="role" :rules="{ required: true, message: '请选择角色' }">
          <el-select value-key="id" v-model="modal.data.role">
            <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role" />
          </el-select>
        </el-form-item>
        <el-form-item :label="!modal.data.id ? '密码：' : '修改密码：'" prop="pwd" :rules="[{ required: !modal.data.id, message: '请填写密码' }, { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}]">
          <el-input clearable v-model="modal.data.pwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="pwdCheck" :rules="{ required: !modal.data.id, validator: validator }">
          <el-input clearable v-model="modal.data.pwdCheck" type="password" />
        </el-form-item>
        <el-form-item label="姓名：" prop="name" :rules="{ required: true, message: '请填写姓名' }">
          <el-input clearable v-model="modal.data.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="手机：" prop="phone" >
          <el-input clearable v-model="modal.data.phone"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, createComponent } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
import { deepClone } from 'web-toolkit/src/utils';
import {postService, storeUserInfo} from 'web-toolkit/src/case-main';
import {IUser} from '@/types/beans';
import {urlMap} from '@/config';
import {ElForm} from 'element-ui/types/form';
import {AdminUserList, RoleList, UserDel} from '@/dao/userDao';

export default createComponent({
  name: 'User',
  setup() {
    const loading = ref(false);
    const list = ref<any>([]);
    const roleList = ref<any>([]);
    const [keywords, filtered] = useSearch(list, {
      includeProps: ['username', 'role.name', 'name', 'phone'],
    });
    const modal = ref<any>({
      visible: false,
      data: {},
    });
    const form = ref<ElForm|null>(null);

    function validator(rule: any, value: string, callback: Function) {
      if (!value && (modal.value.data.pwd !== '' )) {
        callback(new Error('请再次输入密码'));
      } else if (value !== modal.value.data.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    function showForm(row?: IUser) {
      if (row) {
        row.pwd = '';
        (row as any).pwdCheck = '';
      }
      modal.value.data = row ? deepClone(row) : initForm();
      modal.value.visible = true;
      if (form.value) { (form.value as ElForm).clearValidate(); }
    }
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (!valid) { return ; }
      const payload = {
        id: modal.value.data.id,
        username: modal.value.data.username,
        name: modal.value.data.name,
        phone: modal.value.data.phone,
        pwd: modal.value.data.pwd,
        role: modal.value.data.role.id,
      };
      if (!modal.value.data.id) {
        await postService(urlMap.user_add.url, payload);
        Message.success('添加成功');
      } else {
        await postService(urlMap.user_update.url, payload);
        Message.success('修改成功');
      }
      modal.value.visible = false;
      await query();
    }
    async function toggleStatus(row: IUser) {
      const off = row.off;
      await UserDel({
        id: row.id,
        off: off === 0 ? 1 : 2,
      });
      Message.success(`${off === Status.Normal ? '冻结' : '恢复'}成功`);
      await query();
    }
    async function remove(row: IUser) {
      await UserDel({
        id: row.id,
        off: 0,
      });
      await query();
      Message.success('删除成功');
    }
    async function query() {
      list.value = await AdminUserList();
    }
    onMounted(useLoading(loading, async () => {
      roleList.value = await RoleList({root: 0});
      await query();
    }));
    return {
      loading, keywords, filtered,
      showForm,
      storeUserInfo, roleList,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      toggleStatus: useLoading(loading, toggleStatus),
      validator, modal, form,
      update: useLoading(loading, update),
      query,
    };
  },
});
enum Status {
  Normal = 0,
  Frozen = 1,
}
function initForm(): any {
  return {
    username: undefined,
    role: undefined,
    name: undefined,
    phone: undefined,
    pwd: '',
    pwdCheck: '',
  };
}
</script>

