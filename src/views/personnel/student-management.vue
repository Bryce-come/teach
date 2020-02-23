<template>
  <div v-loading="loading" class="student-management">
    <el-row :gutter="40" type="flex" justify="space-between">
      <el-col :span="4">
        <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom:5px"></el-input>
        <el-tree 
          class="filter-tree" 
          :data="list" 
          :props="props" 
          default-expand-all
          accordion 
          :filter-node-method="filterNode" 
          ref="tree">
        </el-tree>
      </el-col>
      <el-col :span="20" style="box-shadow:0 2px 12px 0 rgba(0, 0, 0, .12);margin-right：100px">
        <el-form :inline="true" style="margin-top:10px;display:flex;justify-content:space-between;flex-wrap:wrap">
          <el-form-item>
            <el-button type="primary" @click="showForm()">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-input style="width:100%" placeholder="输入关键字搜索"></el-input>
          </el-form-item>
        </el-form>
        <lkt-table
          :data="studentUserList"
          style="width:100%">
          <el-table-column prop="name" label="姓名" width="70px"/>
          <el-table-column prop="extend.clasz" label="班级" width="100px"/>
          <el-table-column prop="extend.claszGroup" label="教学分组" width="100px"/>
          <el-table-column prop="username" label="账号名称" width="80px"/>
          <el-table-column prop="pwd" label="密码" width="70px"/>
          <el-table-column prop="address" label="邮箱地址"/>
          <el-table-column prop="phone" label="联系电话" width="120px"/>
          <el-table-column prop="createDt" label="状态" width="70px"/>
          <el-table-column label="操作" width="140px">
            <el-button type="warning" size="mini" @click="showForm()">修改</el-button>
            <el-button type="danger" size="mini" style="margin-left:5px" @click="remove()">删除</el-button>
          </el-table-column>
        </lkt-table>
      </el-col>
    </el-row>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="700px">
        <div slot="title">{{modal.studentInfo && modal.studentInfo.id ? '修改' : '录入'}}学生信息</div>
        <el-form v-if="modal.studentInfo" ref="form" :model="modal.studentInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="姓名：" prop="name" :rules="{ required: true, message: '请输入姓名'}">
              <el-input v-model="modal.studentInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="班级：" prop="extend.clasz" :rules="{ required: true, message: '请输入班级'}">
              <el-input v-model="modal.studentInfo.extend.clasz"></el-input>
          </el-form-item>
          <el-form-item label="教学分组：" prop="extend.claszGroup" :rules="{ required: true, message: '请输入教学分组'}">
              <el-input v-model="modal.studentInfo.extend.claszGroup"></el-input>
          </el-form-item>
          <el-form-item label="账号名称：" prop="username" :rules="{ required: true, message: '请输入账号名称'}">
              <el-input v-model="modal.studentInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="pwd" :rules="{ required: true, message: '请输入密码'}">
              <el-input v-model="modal.studentInfo.pwd"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="phone">
              <el-input v-model="modal.studentInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址：" prop="address">
              <el-input v-model="modal.studentInfo.address"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
              <el-select v-model="modal.studentInfo.status"></el-select>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, watch } from '@vue/composition-api';
import {ElTree} from 'element-ui/types/tree';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const tree = ref<ElTree<any, any>|null>(null);
    const filterText = ref<string|null>(null);
    const list = ref<any>();
    const studentUserList = ref<any>();
    const props = ref({
      children: 'children',
      label: 'name',
    });
    const remove = async (row: any) => {
      Message.success('删除成功');
    };
    watch(filterText, () => {
      if (tree.value) { (tree.value as ElTree<any, any>).filter(filterText.value); }
    });
    const form = ref<ElForm|null>(null);
    const modal = ref<any>({
      visible: false,
      studentInfo: null,
    });
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initForm();
      }
      modal.value.studentInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid = true;
      if (valid) {
        const { id, name } = modal.value.studentInfo;
        modal.value.visible = false;
        Message.success(`${isUndefined(id) ? '添加' : '修改'}成功`);
        await queryStudentList();
      }
    }
    const queryStudentList = async () => {
      studentUserList.value = [
        {id: '0', role: '', username: 'xx', name: '张晓明', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
        extend: {no: '', clasz: '自动化1602', claszGroup: '自动化一组'}, createDt: '', status: ''},
        {id: '1', role: '', username: 'xx', name: '王小明', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
        extend: {no: '', clasz: '自动化1602', claszGroup: '自动化一组'}, createDt: '', status: ''},
        {id: '2', role: '', username: 'xx', name: '李晓明', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
        extend: {no: '', clasz: '自动化1602', claszGroup: '自动化二组'}, createDt: '', status: ''},
        {id: '3', role: '', username: 'xx', name: '陈晓明', phone: '18269927667', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
        extend: {no: '', clasz: '自动化1602', claszGroup: '自动化三组'}, createDt: '', status: ''},
        {id: '4', role: '', username: 'xx', name: '刘晓明', phone: '18269928223', pwd: 'xxxxxx', gender: '', image: '', address: '18809457890@163.com',
        extend: {no: '', clasz: '自动化1602', claszGroup: '自动化三组'}, createDt: '', status: ''},
      ];
    };
    const filterNode = async (value: any, data: any) => {
      if (!value) {return true; }
      return data.label.indexOf(value) !== -1;
    };
    onMounted(useLoading(loading, async () => {
      await queryStudentList();
      list.value = [
        {id: 0, name: '自动化1601', children: [{id: 4, name: '自动化一组'}, {id: 5, name: '自动化二组'}, {id: 6, name: '自动化三组'}]},
        {id: 1, name: '自动化1602', children: [{id: 7, name: '自动化一组'}, {id: 8, name: '自动化二组'}, {id: 9, name: '自动化三组'}]},
        {id: 2, name: '自动化1603', children: [{id: 10, name: '自动化一组'}, {id: 11, name: '自动化二组'}, {id: 12, name: '自动化三组'}]},
        {id: 3, name: '自动化1604', children: [{id: 13, name: '自动化一组'}, {id: 14, name: '自动化二组'}, {id: 15, name: '自动化三组'}]},
      ];
    }));
    return{
      loading, filterText, list, tree, props, filterNode, studentUserList,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      queryStudentList,
      modal, form, showForm,
      update: useLoading(loading, update),
    };
  },
};
function initForm() {
  return {
    name: '', username: '', phone: '', address: '', status: '',
    extend: {clasz: '', claszGroup: ''},
  };
}
</script>
<style scoped lang="scss">

</style>
