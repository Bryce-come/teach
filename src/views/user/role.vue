<template>
  <div class="page" v-loading="loading">
    <div class="flex between align-center little-space">
      <el-button type="success" @click="showForm()">添加角色</el-button>
<!--      <el-input class="search-bar" placeholder="请输入搜索内容" prefix-icon="el-icon-search" clearable v-model="keywords"/>-->
    </div>
    <lkt-table :data="filtered" stripe>
      <el-table-column prop="name" label="角色名称" width="150"/>
      <el-table-column prop="department.name" label="所属部门" width="120"/>
      <el-table-column label="权限列表">
        <span slot-scope="{ row }">
          {{ chinesize(row.privileges).join('，') }}
        </span>
      </el-table-column>
      <el-table-column width="200" label="操作" align="center">
        <template slot-scope="{ row }" >
          <el-button style="margin-right: 10px" type="primary" size="mini" @click="showForm(row)">修改</el-button>
          <el-button v-if="!row.extend || !row.extend.immutable" type="danger" size="mini" @click="deleteRole(row)">删除</el-button>
        </template>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="40%">
      <div slot="title">{{modal.data.id? '修改':'添加'}}角色</div>
      <el-form ref="form" label-position="left" label-width="100px" :model="modal.data">
        <el-form-item label="角色名称：" prop="name" :rules="{ required: true, message: '请填写角色名称', trigger: 'blur' }">
          <el-input clearable v-model="modal.data.name" placeholder="请输入账户登录名" />
        </el-form-item>
        <el-form-item label="所属部门：" prop="department" :rules="{ required: true, message: '请选择所属部门', trigger: 'blur' }">
          <lkt-select v-model="modal.data.department" :disabled="modal.data.extend && modal.data.extend.immutable" :list="departmentList" />
        </el-form-item>
        <el-transfer class="flex align-center between" filterable filter-placeholder="输入关键字查询" v-model="modal.data.privileges" :data="privilegeList.map(({ id, name }) => ({ key: id, label: name, disabled: false }))" :titles="['可选权限', '已选权限']">
        </el-transfer>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { Message } from 'element-ui';
  import { ref, onMounted } from '@vue/composition-api';
  import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
  import { isUndefined, deepClone } from 'web-toolkit/src/utils';
  import {IRole} from 'web-toolkit/src/types/interfaces';
  import {postService} from 'web-toolkit/src/case-main';
  import {urlMap} from '@/config';
  import {ElForm} from 'element-ui/types/form';
  import {DepartmentList, PrivilegeList, RoleList} from '@/dao/userDao';

  export default {
  setup() {
    const loading = ref(false);
    const roleList = ref<any>([]);
    const [keywords, filtered] = useSearch(roleList);
    const departmentList = ref<any>([]);
    const privilegeList = ref<any>([]);
    const modal = ref<any>({
      visible: false,
      data: {
        name: undefined,
        privileges: [],
        department: undefined,
        extend: {},
      },
    });
    const form = ref<ElForm|null>(null);

    async function showForm(row?: IRole) {
      modal.value.data = row ? deepClone(row) : initRoleForm();
      modal.value.visible = true;
    }
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (!valid) { return ; }
      const { department, privileges, name, id } = modal.value.data as IRole;
      const params = {
        name,
        id,
        departmentId: department.id,
        privilegesJson: JSON.stringify(privileges),
      };
      if (isUndefined(id)) {
        await postService(urlMap.role_create.url, params);
        Message.success(`添加成功`);
      } else {
        await postService(urlMap.role_update.url, params);
        Message.success(`修改成功`);
      }
      modal.value.visible = false;
      await queryRoleList();
    }

    async function queryRoleList() {
      roleList.value = await RoleList({});
    }

    async function deleteRole(role: IRole) {
      await postService(urlMap.role_del.url, { id: role.id });
      await queryRoleList();
      Message.success('删除成功');
    }
    function chinesize(privileges: string[]) {
      return privileges.map((eng: string) => {
        for (const privilege of privilegeList.value) {
          if (privilege.id === eng) {
            return privilege.name;
          }
        }
      }).filter((item) => item);
    }
    onMounted(useLoading(loading, async () => {
      await queryRoleList();
      departmentList.value = await DepartmentList();
      privilegeList.value = await PrivilegeList();
    }));
    return {
      loading, modal, form,
      keywords,
      filtered,
      deleteRole: useConfirm('确认删除？', useLoading(loading, deleteRole)),
      showForm,
      chinesize,
      update: useLoading(loading, update), privilegeList, departmentList,
    };
  },
};
  function initRoleForm(): Partial<IRole> {
  return {
    name: '',
    privileges: [],
    department: undefined,
  };
}
</script>
