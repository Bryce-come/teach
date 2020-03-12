<template>
  <div v-loading="loading" class="student-management">
    <el-row :gutter="10" type="flex" justify="space-between">
      <el-col :span="4" class="treewidth">
        <el-button type="success" @click="() => upClazGrop(null,1)">添加班级</el-button>
        <el-tree
            :data="classList"
            :props="props"
            node-key="id"
            default-expand-all
            :expand-on-click-node='false'
            style="box-shadow:0 2px 12px 0 rgba(0, 0, 0, .12);margin-top:10px"
            min-width="350px"
            ref="tree">
            <div
              :style="data.freez?'background-color:	Tomato':''"
              class="flex between align-center"
              style="width: 100%; cursor: default"
              slot-scope="{ node, data }"
              @click="changeBackgroundColor(node,$event)"
              @mousemove="moveNow(node)" @mouseleave="moveNotNow()" >
              <div
                style="cursor: pointer"
                @click="firstTab(node,$event)">{{node.label}}</div>
              <div class="flex">
                <el-button
                  type="text"
                  size="mini"
                  v-if="node.level===1&&data.freez===false&&moveNowTrue.moveNowId===node.id"
                  @click="() => FrozenClaz(data)">
                  <i class="iconfont icon-dongjie1" title="冻结班级"/>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="node.level===1&&data.freez===true&&moveNowTrue.moveNowId===node.id"
                  @click="() => unFrozenClaz(data)">
                  <i class="iconfont icon-jiedong1" title="解冻班级"/>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if='node.level===1&&moveNowTrue.moveNowId===node.id'
                  @click="() => upClazGrop(node,3)">
                  <i class="el-icon-plus" title="增加小组"/>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if='node.level===1&&moveNowTrue.moveNowId===node.id'
                  @click="() => upClazGrop(node,2)">
                  <i class="el-icon-edit" title="班级改名"/>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="node.level===1&&moveNowTrue.moveNowId===node.id"
                  @click="()=>{setRemoveName(data);removeClass(data)}">
                  <i class="el-icon-delete" title="删除班级"/>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="node.level===2&&moveNowTrue.moveNowId===node.id"
                  @click="() => upClazGrop(node,4)">
                  <i class="el-icon-edit" title="组名改名"/>
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="node.level===2&&moveNowTrue.moveNowId===node.id"
                  @click="()=>{setRemoveName(data);removeGrop(data)}">
                  <i class="el-icon-delete" title="删除小组"/>
                </el-button>
              </div>
            </div>
          </el-tree>
      </el-col>
      <el-col :span="20">
        <div class="block-card">
          <div class="title" style="font-weight: 400; font-size: 1rem">
            <span>班级：{{clasz.name}}</span>
            <span style="margin-left: 2rem" v-if="claszGroup.id">分组：{{claszGroup.name}}</span>
          </div>
          <div class="content">
            <div class="flex align-center between little-space">
              <el-button type="success" @click="showForm()">添加学生</el-button>
              <el-input class="search-bar" v-model="keywords" placeholder="请输入搜索内容" clearable/>
            </div>
            <lkt-table
              :data="filtered"
              style="width:100%">
              <el-table-column prop="username" label="登录用户名" width="120px"/>
              <el-table-column prop="name" label="姓名" width="90px"/>
              <el-table-column prop="extend.claszName" label="班级" width="100px"/>
              <el-table-column prop="extend.claszGroupName" label="教学分组" width="100px"/>
              <el-table-column prop="role.name" label="角色" width="80px"/>
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
                  <el-button type="danger" size="mini" @click="()=>{setRemoveName(row);remove(row)}">删除</el-button>
                </div>
              </el-table-column>
            </lkt-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <kit-dialog-simple
      @submit.native.prevent
      :modal="upClazGropFlag"
      :confirm="upClazGropdate">
      <div slot="title">{{upClazGropFlag.typeName}}</div>
        <el-form v-if="upClazGropFlag.visible" ref="form1" :model="upClazGropFlag" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="名称：" prop="upClazGropInfo" :rules="{ required: true, message: '请输入名称'}">
            <el-input v-model="upClazGropFlag.upClazGropInfo" clearable/>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="700px">
        <div slot="title">{{modal.studentInfo && modal.studentInfo.id ? '修改' : '录入'}}学生信息</div>
        <el-form v-if="modal.studentInfo" ref="form" :model="modal.studentInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="登录用户名：" prop="username" :rules="{ required: true, message: '请输入登录用户名'}">
            <el-input v-model="modal.studentInfo.username" clearable/>
          </el-form-item>
          <el-form-item label="姓名：" prop="name" :rules="{ required: true, message: '请输入姓名'}">
            <el-input v-model="modal.studentInfo.name" clearable/>
          </el-form-item>
          <el-form-item label="角色：" prop="role" :rules="{ required: true, message: '请选择角色' }">
            <el-select value-key="id" v-model="modal.studentInfo.role">
              <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role" />
            </el-select>
          </el-form-item>
          <el-form-item label="班级：" prop="extend.clasz" :rules="{ required: true, message: '请选择班级'}">
              <el-select v-model="modal.studentInfo.extend.clasz" @change="armasdb(modal.studentInfo.extend.clasz)">
                <el-option v-for="clas in classList" :key="clas.id" :label="clas.name" :value="clas.id" />
              </el-select>
          </el-form-item>
          <el-form-item label="教学分组：" prop="extend.claszGroup" :rules="{ required: true, message: '请选择分组'}">
              <el-select v-model="modal.studentInfo.extend.claszGroup">
                <el-option v-for="grop in groupList" :key="grop.id" :label="grop.name" :value="grop.id" />
              </el-select>
          </el-form-item>
          <el-form-item :label="!modal.studentInfo.id ? '密码：' : '修改密码：'" prop="pwd" :rules="[{ required: !modal.studentInfo.id, message: '请填写密码' }, { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}]">
          <el-input clearable v-model="modal.studentInfo.pwd" type="password"/>
          </el-form-item>
          <el-form-item label="确认密码：" prop="pwdCheck" :rules="modal.studentInfo.pwd?{ required: true, validator: validator }:{required: false}">
            <el-input clearable v-model="modal.studentInfo.pwdCheck" type="password" />
          </el-form-item>
          <el-form-item label="联系方式：" prop="phone">
            <el-input v-model="modal.studentInfo.phone" maxlength='11' clearable/>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import {onMounted, ref} from '@vue/composition-api';
import {ElTree} from 'element-ui/types/tree';
import {ElForm} from 'element-ui/types/form';
import {useConfirm, useLoading, useSearch} from 'web-toolkit/src/service';
import {storeUserInfo} from 'web-toolkit/src/case-main';
import {Message} from 'element-ui';
import {deepClone} from 'web-toolkit/src/utils';
import {
  ClassDel,
  ClassFreeze,
  ClassGroupDel,
  ClassGroupUpdate,
  ClassList,
  ClassUnFreeze,
  ClassUpdate, RoleList,
  StudentList,
  UserAdd,
  UserDel,
  UserUpdate,
} from '@/dao/userDao';

export default {
  setup() {
  const loading = ref(false);
  const tree = ref<ElTree<any, any>|null>(null);
  const roleList = ref<any>([]);
  const clasz = ref<any>({});
  const claszGroup = ref<any>({});
  const studentUserList = ref<any>();
  const classList = ref<any>();
  const ctogList = ref<any>();
  // 一个班级的分组
  const groupList = ref<any>();
  const removeValue = ref<any>({
    name: '',
  });

  function setRemoveName(row: any) {
    removeValue.value.name = row.name;
  }
  const props = ref({
    children: 'groups',
    label: 'name',
  });
  const remove = async (row: any) => {
    await UserDel({
    id: row.id,
    off: 0,
    });
    await queryStudentList();
  };
  const removeClass = async (row: any) => {
      await ClassDel({
        id: row.id,
      });
      await queryClassList();
  };
  const form = ref<ElForm|null>(null);
  const form1 = ref<ElForm|null>(null);
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
  const moveNowTrue = ref<any>({
    moveNowId: null,
  });
  function moveNow(row: any) {
    moveNowTrue.value.moveNowId = row.id;
  }
  function moveNotNow() {
    moveNowTrue.value.moveNowId = null;
  }
  const cilckIng = ref<any>({
    str: null,
  });
  function changeBackgroundColor(node: any, row: any) {
    // if(cilckIng.value.str!==null||node.data.freez===false){
    //   cilckIng.value.str.style.backgroundColor = 'transparent';
    // }
    // else {
    //   cilckIng.value.str.style.backgroundColor = 'Tomato';
    // }
    // cilckIng.value.str = row.target
    // cilckIng.value.str.style.backgroundColor = 'PaleTurquoise';
    // console.log(node);
  }
  function firstTab(node: any, row: any) {
    if (cilckIng.value.str !== null || node.data.freez === false ) {
      cilckIng.value.str.style.backgroundColor = 'transparent';
    }
    // else {
    //   cilckIng.value.str.style.backgroundColor = 'Tomato';
    // }
    cilckIng.value.str = row.target;
    cilckIng.value.str.style.backgroundColor = 'PaleTurquoise';
    clasz.value = node.data.groups ? node.data : node.parent.data;
    claszGroup.value = node.data.groups ? {} : node.data;
    useLoading(loading, queryStudentList)();
  }
  async function FrozenClaz(row: any) {
    const result = {
      id: row.id,
      off: 1,
    };
    row.freez = true;
    await ClassFreeze(result);
    await queryClassList();
    await queryStudentList();
    Message.success('冻结成功');
  }
  async function unFrozenClaz(row: any) {
    const result = {
      id: row.id,
      off: 2,
    };
    row.freez = false;
    await ClassUnFreeze(result);
    await queryClassList();
    await queryStudentList();
    Message.success('解冻成功');
  }
  async function removeGrop(row: any) {
    const result = {
      id: row.id,
    };
    await ClassGroupDel(result);
    await queryClassList();
  }
  async function showForm(row: any) {
    if (form.value) { (form.value as ElForm).clearValidate(); }
    modal.value.studentInfo = row ? deepClone(row) : initForm();
    modal.value.visible = true;
    if (row) {
      armasdb(row.extend.clasz);
    }
  }
  const typeList = ref<any>([
    {id: 1, name: '增加班级'},
    {id: 2, name: '修改班级'},
    {id: 3, name: '增加小组'},
    {id: 4, name: '修改班级'},
  ]);
  const upClazGropFlag = ref<any>({
    visible: false,
    upClazGropInfo: null,
    data: null,
    // 1-增加班级 2-修改班级 3-增加小组 4-修改小组
    type: null,
    typeName: null,
  });
  function upClazGrop(row: any, sum: any) {
    // if (form1.value) { (form1.value as ElForm).clearValidate(); }
    if (sum !== 1) {upClazGropFlag.value.upClazGropInfo = row.data.name ? row.data.name : ''; }
    upClazGropFlag.value.visible = true;
    upClazGropFlag.value.data = row;
    upClazGropFlag.value.typeName = typeList.value.filter((item: any) => item.id === sum )[0].name;
    upClazGropFlag.value.type = sum;
  }
  async function upClazGropdate() {
    const valid = await (form1.value as ElForm).validate();
    if (!valid) { return ; }
    if (upClazGropFlag.value.type === 1) {
      const result = {
        name: upClazGropFlag.value.upClazGropInfo,
      };
      await ClassUpdate(result);
    }
    if (upClazGropFlag.value.type === 2) {
      const result = {
        id: upClazGropFlag.value.data.data.id,
        name: upClazGropFlag.value.upClazGropInfo,
      };
      await ClassUpdate(result);
    }
    if (upClazGropFlag.value.type === 3) {
      const result = {
        cid: upClazGropFlag.value.data.data.id,
        name: upClazGropFlag.value.upClazGropInfo,
      };
      await ClassGroupUpdate(result);
    }
    if (upClazGropFlag.value.type === 4) {
      const result = {
        cid: upClazGropFlag.value.data.parent.data.id,
        name: upClazGropFlag.value.upClazGropInfo,
        id: upClazGropFlag.value.data.data.id,
      };
      await ClassGroupUpdate(result);
    }
    await queryClassList();
    upClazGropFlag.value.visible = false;
    upClazGropFlag.value.upClazGropInfo = null;
  }
  async function update() {
    const valid = await (form.value as ElForm).validate();
    if (!valid) { return ; }
    if (modal.value.studentInfo.phone === '') {
      modal.value.studentInfo.phone = null;
    }
    const result = {
      id: modal.value.studentInfo.id,
      username: modal.value.studentInfo.username,
      name: modal.value.studentInfo.name,
      phone: modal.value.studentInfo.phone,
      pwd: modal.value.studentInfo.pwd,
      role: modal.value.studentInfo.role.id,
      extendJson: JSON.stringify({
        address: modal.value.studentInfo.extend.address,
        clasz: modal.value.studentInfo.extend.clasz,
        claszGroup: modal.value.studentInfo.extend.claszGroup,
      }),
    };
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
    studentUserList.value  = await StudentList({classId: clasz.value.id, groupId: claszGroup.value.id});
  };
  async function queryClassList() {
    classList.value = await ClassList();
  }
  function armasdb(clasz: any) {
    if (!clasz) { groupList.value = []; }
    const c = classList.value.filter((cc: any) => cc.id === clasz)[0];
    if (c) {
      groupList.value = c.groups;
    }
  }
  onMounted(useLoading(loading, async () => {
    roleList.value = await RoleList({root: 2});
    await queryClassList();
    await queryStudentList();
  }));
  const [keywords, filtered] = useSearch(studentUserList, {
    includeProps: ['username', 'name', 'phone', 'extend.claszName', 'extend.claszGroupName'],
  });
  return{
    loading, tree, props, studentUserList, filtered, keywords,
    roleList, clasz, claszGroup, upClazGrop,
    armasdb, upClazGropFlag,  storeUserInfo,
    removeClass: useConfirm(`确认删除${removeValue.value.name}?`, useLoading(loading, removeClass)),
    moveNow, moveNowTrue, moveNotNow, setRemoveName,
    remove: useConfirm(`确认删除${removeValue.value.name}?`, useLoading(loading, remove)),
    toggleStatus: useLoading(loading, toggleStatus),
    queryStudentList: useLoading(loading, queryStudentList),
    queryClassList, update, changeBackgroundColor,
    removeGrop: useConfirm(`确认删除${removeValue.value.name}?`, useLoading(loading, removeGrop)),
    modal, form, showForm, removeValue, upClazGropdate, form1,
    validator, classList, groupList, ctogList,  firstTab,
    FrozenClaz: useConfirm('确认冻结？', useLoading(loading, FrozenClaz)),
    unFrozenClaz: useConfirm('确认解冻？', useLoading(loading, unFrozenClaz)),
  };
},
};
enum Status {
  Normal = 0,
  Frozen = 1,
}
function initForm() {
  return {
    extend: {},
  };
}
</script>
<style scoped lang="scss">
  .treewidth{
    min-width: 250px;
  }
  .el-table .warning-row {
    background: red;
  }
  .el-table .success-row {
    background: blue;
  }
</style>
