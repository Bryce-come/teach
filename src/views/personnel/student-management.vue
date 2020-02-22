<template>
  <div v-loading="loading" class="student-management">
    <el-row :gutter="40" type="flex" justify="space-between">
      <el-col :span="4">
        <el-button type="success" @click="showForm()">添加班级</el-button>
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
        <div class="flex align-center between little-space">
          <el-button type="success" @click="showForm()">添加学生</el-button>
          <el-input class="search-bar" v-model="keywords" placeholder="请输入搜索内容" clearable/>
        </div>
        <lkt-table
          :data="filtered"
          style="width:100%">
          <el-table-column prop="username" label="登录用户名" width="150px"/>
          <el-table-column prop="name" label="姓名" width="80px"/>
          <el-table-column prop="extend.clasz" label="班级" width="100px"/>
          <el-table-column prop="extend.claszGroup" label="教学分组" width="100px"/>
          <el-table-column prop="extend.address" label="邮箱地址" width="180px"/>
          <el-table-column prop="phone" label="联系电话" width="120px"/>
          <el-table-column label="账号状态" sortable width="100">
            <template slot-scope="{ row }">
              <el-tag v-if="row.off === 0" type="success">正常</el-tag>
              <el-tag v-if="row.off === 1" type="danger">冻结</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="160">
            <div class="flex center little-space wrap" slot-scope="{ row }">
              <el-button type="primary" class="align" size="mini" @click="showForm(row)">修改</el-button>
              <el-button
                v-if="storeUserInfo.user.id !== row.id"
                size="mini" :type="row.off === 0 ? 'warning' : 'success'"
                @click="toggleStatus(row)"
              >{{ row.off === 0 ? '冻结' : '恢复' }}</el-button>
              <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
            </div>
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
          <el-form-item label="姓名" prop="name" :rules="{ required: true, message: '请输入姓名'}">
              <el-input v-model="modal.studentInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="班级" prop="extend.clasz" :rules="{ required: true, message: '请选择班级'}">
              <!-- <el-input v-model="modal.studentInfo.extend.clasz"></el-input> -->
              <!-- <el-select v-model="modal.studentInfo.extend.clasz" @change="armasd()">
                <el-option v-for="clas in classList" :key="clas.id" :label="clas.name" :value="clas.name" />
              </el-select> -->
              <el-cascader
                v-model="modal.studentInfo.extend.clasz"
                :options="blist"></el-cascader>
          </el-form-item>
          <!-- <el-form-item label="教学分组" prop="extend.claszGroup" :rules="{ required: true, message: '请选择分组'}">
              <el-select v-model="modal.studentInfo.extend.claszGroup">
                <el-option v-for="grop in groupList" :key="grop.id" :label="grop.name" :value="grop.name" />
              </el-select>
          </el-form-item> -->
          <el-form-item label="登录用户名" prop="username" :rules="{ required: true, message: '请输入登录用户名'}">
              <el-input v-model="modal.studentInfo.username"></el-input>
          </el-form-item>
          <el-form-item :label="!modal.studentInfo.id ? '密码：' : '修改密码：'" prop="pwd" :rules="[{ required: !modal.studentInfo.id, message: '请填写密码' }, { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}]">
          <el-input clearable v-model="modal.studentInfo.pwd" type="password" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="pwdCheck" :rules="{ required: !modal.studentInfo.id, validator: validator }">
            <el-input clearable v-model="modal.studentInfo.pwdCheck" type="password" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
              <el-input v-model="modal.studentInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="extend.address">
              <el-input v-model="modal.studentInfo.extend.address"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, watch } from '@vue/composition-api';
import {ElTree} from 'element-ui/types/tree';
import {ElForm} from 'element-ui/types/form';
import { useSearch, useConfirm, useLoading } from 'web-toolkit/src/service';
import {postService, storeUserInfo} from 'web-toolkit/src/case-main';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {StudentList, UserAdd,RoleList,UserDel,UserUpdate,ClassList4Select,ClassList} from '@/dao/userDao';
export default {
  setup() {
    function armasd(){
      console.log("!")
    }
    const loading = ref(false);
    const tree = ref<ElTree<any, any>|null>(null);
    const filterText = ref<string|null>(null);
    const list = ref<any>();
    const studentUserList = ref<any>();
    const classList = ref<any>();
    const groupList = ref<any>();
    const blist = ref<any>();
    const props = ref({
      children: 'children',
      label: 'name',
    });
    const remove = async (row:any) => {
        await UserDel({
        id: row.id,
        off: 0,
        });
        await queryStudentList();
    };
    watch(filterText, () => {
      if (tree.value) { (tree.value as ElTree<any, any>).filter(filterText.value); }
    });
    const [keywords, filtered] = useSearch(studentUserList, {
      includeProps: ['username', 'name', 'phone' ,'address','extend.clasz','extend.claszGroup'],
    });
    const form = ref<ElForm|null>(null);
    const modal = ref<any>({
      visible: false,
      studentInfo: null,
    });
    async function toggleStatus(row: any) {
      const off = row.off;
      await UserDel({
        id: row.id,
        off: off === 0 ? 1 : 2,
      });
      Message.success(`${off === Status.Normal ? '冻结' : '恢复'}成功`);
      await queryStudentList();
    }
    function validator(rule: any, value: string, callback: Function) {
      if (!value && (modal.value.studentInfo.pwd !== '' )) {
        callback(new Error('请再次输入密码'));
      } else if (value !== modal.value.studentInfo.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    // const showForm = async (data?: any) => {
    //   if (form.value) { (form.value as ElForm).clearValidate(); }
    //   if (data) {
    //     data = deepClone(data);

    //   } else {
    //     data = initForm();
    //   }
    //   modal.value.studentInfo = data;
    //   modal.value.visible = true;
    // };
    function showForm(row: any) {
      if (row) {
        row.pwd = '';
        (row as any).pwdCheck = '';
      }
      modal.value.studentInfo = row ? deepClone(row) : initForm();
      modal.value.visible = true;
      if (form.value) { (form.value as ElForm).clearValidate(); }
    }
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (!valid) { return ; }
      // watch(modal.studentInfo.extend.clasz,()=>{
      //   console.log("变了！")
      // })
      const result = {
        id: modal.value.studentInfo.id,
        // address: addModal.value.teacherInfo.address,
        username: modal.value.studentInfo.username,
        name: modal.value.studentInfo.name,
        phone: modal.value.studentInfo.phone,
        pwd: modal.value.studentInfo.pwd,
        role: 3,
        extend: {
          address: modal.value.studentInfo.extend.address,
          clasz: modal.value.studentInfo.extend.clasz,
          claszGroup: modal.value.studentInfo.extend.claszGroup
        },
        extendJson:'',
      };
      result.extendJson = JSON.stringify(result.extend)
      if (!modal.value.studentInfo.id) {
        await UserAdd(result);
        Message.success('添加成功');
      } else {
        await UserUpdate(result);
        Message.success('修改成功');
      }
      modal.value.visible = false;
      await queryStudentList();
    }
    const queryStudentList = async () => {
        const firstList = await StudentList();
        studentUserList.value  = firstList;
    };
    const filterNode = async (value: any, data: any) => {
      if (!value) {return true; }
      return data.label.indexOf(value) !== -1;
    };
    onMounted(useLoading(loading, async () => {
      classList.value = await ClassList4Select();
      // groupList.value = classList.value[0].groups
      // console.log(classList)
      // console.log(classList.value[0].groups)
      // console.log(groupList)
      await queryStudentList();
      const aList=await ClassList();
      list.value=[];
      blist.value=[];
      list.value.children=[];
      blist.value.children=[];
      for(let i=0;i<aList.length;i++){
        list.value[i]={id:aList[i].id,name:aList[i].name,children:[...aList[i].groups]}
        blist.value[i]={value:aList[i].name,label:aList[i].name,children:[...aList[i].groups]}
      }
      // console.log(list.value[0].children)
      // for(let i=0;i<list.value[i].length;i++){
      //   for(let j=0;j<list.value[i].children.length;j++){
      //     blist.value[i].children=[{value:list.value[i].children[j].name,label:list.value[i].children[j].name}]
      //     console.log(j)
      //   }
      // }
      // blist.value[0].children[0]={value:list.value[0].children[0].name,label:list.value[0].children[0].name}
      // blist.value[0].children[1]={value:list.value[0].children[1].name,label:list.value[0].children[1].name}
      // blist.value[0].children=[
      //   {value:list.value[0].children[0].name,label:list.value[0].children[0].name},
      //   {value:list.value[0].children[1].name,label:list.value[0].children[1].name}
      // ]
      console.log(list)
      console.log(blist)
      // console.log(list)
    }));
    return{
      loading, filterText, list, tree, props, filterNode, studentUserList,filtered,keywords,blist,
      storeUserInfo,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      toggleStatus: useLoading(loading, toggleStatus),
      queryStudentList,
      modal, form, showForm,
      update: useLoading(loading, update),
      validator,classList,groupList,
    };
    return{

    }
  },
};
enum Status {
  Normal = 0,
  Frozen = 1,
}
function initForm() {
  return {
    name: '', username: '', phone: '', status: '',role:3,pwdCheck: '',
    extend: {clasz: '', claszGroup: ''},
  };
}
</script>
<style scoped lang="scss">

</style>
