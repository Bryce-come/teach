<template>
  <div v-loading="loading" class="student-management">
    <el-row :gutter="40" type="flex" justify="space-between">
      <el-col :span="4">
        <el-button type="success" @click="showFormB()">添加班级</el-button>
        <el-tree 
          class="filter-tree" 
          :data="list" 
          :props="props" 
          node-key="id"
          default-expand-all
          :expand-on-click-node='false'
          ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data }" @click="() => firstTab(node)">
            <input style="background-color:transparent; width:80px;border-radius: 6px;height: 27px;border:none;" 
            class="tel" type="text" disabled="disabled" 
            v-model="node.label">
            <span>
              <el-button
                type="text"
                size="mini"
                v-if="node.level===1&&data.tagoff===false"
                @click="() => FrozenClaz(data)">
                <i class="iconfont icon-dongjie1" title="冻结"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if="node.level===1&&data.tagoff===true"
                @click="() => unFrozenClaz(data)">
                <i class="iconfont icon-jiedong1" title="解冻"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if='node.level===1'
                @click="() => addNewGroup(node)">
                <i class="el-icon-plus" title="增加"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if="node.level===1"
                @click="() => removeClass(data)">
                <i class="el-icon-delete" title="删除"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if="node.level===2"
                @click="() => updataGropFlag(node)">
                <i class="el-icon-edit" title="改名"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if="node.level===2"
                @click="() => removeGrop(data)">
                <i class="el-icon-delete" title="删除"></i>
              </el-button>
            </span>
          </span>
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
          <el-table-column prop="clasz" label="班级" width="100px"/>
          <el-table-column prop="claszGroup" label="教学分组" width="100px"/>
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
      :modal="upgrpFlag"
      :confirm="upgrpDate">
      <div slot="title">修改小组名</div>
        <el-form v-if="upgrpFlag.visible" ref="form" :model="upgrpFlag.upgrpInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="名称：" prop="name" :rules="{ required: true, message: '请输入名称'}">
              <el-input v-model="upgrpFlag.upgrpInfo"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="addNewGroupFlag"
      :confirm="addNewGroupDate">
      <div slot="title">增加新的小组</div>
        <el-form v-if="addNewGroupFlag.visible" ref="form" :model="addNewGroupFlag.addNewGroupInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="名称：" prop="name" :rules="{ required: true, message: '请输入名称'}">
              <el-input v-model="addNewGroupFlag.addNewGroupInfo"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="addClazFlag"
      :confirm="addClaz">
      <div slot="title">增加新的班级</div>
        <el-form v-if="addClazFlag.visible" ref="form" :model="addClazFlag.addClazInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="名称：" prop="name" :rules="{ required: true, message: '请输入名称'}">
              <el-input v-model="addClazFlag.addClazInfo"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="700px">
        <div slot="title">{{modal.studentInfo && modal.studentInfo.id ? '修改' : '录入'}}学生信息</div>
        <el-form v-if="modal.studentInfo" ref="form" :model="modal.studentInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="姓名：" prop="name" :rules="{ required: true, message: '请输入姓名'}">
              <el-input v-model="modal.studentInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="班级" prop="extend.clasz" :rules="{ required: true, message: '请选择班级'}">
              <el-select v-model="modal.studentInfo.extend.clasz" @click="armasd(modal.studentInfo.extend.clasz)" @change="armasd(modal.studentInfo.extend.clasz)">
                <el-option v-for="clas in classList" :key="clas.id" :label="clas.name" :value="clas.id" />
              </el-select>
          </el-form-item>
          <el-form-item label="教学分组" prop="extend.claszGroup" :rules="{ required: true, message: '请选择分组'}">
              <el-select v-model="modal.studentInfo.extend.claszGroup">
                <el-option v-for="grop in groupList" :key="grop.id" :label="grop.name" :value="grop.id" />
              </el-select>
          </el-form-item>
          <el-form-item label="登录用户名" prop="username" :rules="{ required: true, message: '请输入登录用户名'}">
              <el-input v-model="modal.studentInfo.username"></el-input>
          </el-form-item>
          <el-form-item :label="!modal.studentInfo.id ? '密码：' : '修改密码：'" prop="pwd" :rules="[{ required: !modal.studentInfo.id, message: '请填写密码' }, { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}]">
          <el-input clearable v-model="modal.studentInfo.pwd" type="password" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="pwdCheck" :rules="{ required: !modal.studentInfo.id, validator: validator }">
            <el-input clearable v-model="modal.studentInfo.pwdCheck" type="password" />
          </el-form-item>
          <el-form-item label="联系方式：" prop="phone">
              <el-input v-model="modal.studentInfo.phone" maxlength='11'></el-input>
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
import {ClassFreeze, ClassUnFreeze, ClassGroupDel, StudentList, UserAdd, RoleList, UserDel, UserUpdate, ClassList4Select, ClassList, ClassUpdate, ClassDel, ClassGroupUpdate} from '@/dao/userDao';
export default {
  setup() {
    const a = 1;
    const loading = ref(false);
    const tree = ref<ElTree<any, any>|null>(null);
    const filterText = ref<string|null>(null);
    const list = ref<any>();
    const studentUserList = ref<any>();
    const classList = ref<any>();
    const ctogList = ref<any>();
    const groupList = ref<any>();
    const blist = ref<any>();
    const props = ref({
      children: 'children',
      label: 'name',
    });
    const append = async (row: any) => {
    };
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
        classList.value = await ClassList();
    };
    watch(filterText, () => {
      if (tree.value) { (tree.value as ElTree<any, any>).filter(filterText.value); }
    });
    const TreeBtnFlag=ref<any>({
      visible:false
    })
    function chgTreeBtnFlag(){
      TreeBtnFlag.value.visible=!TreeBtnFlag.value.visible

    }
    const grpandclzList=ref<any>({
          claszIdList:[],
          claszNameList:[],
          groupLista:[],
          groupListb:[],
          groupIdList:[],
          groupNmaeList:[]
        })
    async function getGroupList(){
        
        const result = await ClassList()
        for(let i =0;i<result.length;i++){
          grpandclzList.value.claszIdList[i]=result[i].id
          grpandclzList.value.claszNameList[i]=result[i].name
        }
        for(let i =0;i<result.length;i++){
          grpandclzList.value.groupLista[i]=[]
          grpandclzList.value.groupListb[i]=[]
          for(let j=0;j<result[i].groups.length;j++){
            grpandclzList.value.groupLista[i][j]=result[i].groups[j].id
            grpandclzList.value.groupListb[i][j]=result[i].groups[j].name
          }
        }
        grpandclzList.value.groupIdList=grpandclzList.value.groupLista.reduce(function (a:any, b:any) { return a.concat(b)} );
        grpandclzList.value.groupNmaeList=grpandclzList.value.groupListb.reduce(function (a:any, b:any) { return a.concat(b)} );
        for(let i=0;i<studentUserList.value.length;i++){
          studentUserList.value[i].claszGroup=grpandclzList.value.groupNmaeList[grpandclzList.value.groupIdList.indexOf(studentUserList.value[i].extend.claszGroup)]
          studentUserList.value[i].clasz=grpandclzList.value.claszNameList[grpandclzList.value.claszIdList.indexOf(studentUserList.value[i].extend.clasz)]
        }
    }
    const form = ref<ElForm|null>(null);
    // const clazForm = ref<ElForm|null>(null);
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
    const addClazFlag  =  ref<any>({
      visible: false,
      addClazInfo: '',
    });
    function firstTab(row: any) {
      if(row.level=1){
        keywords.value = grpandclzList.value.claszNameList[grpandclzList.value.claszIdList.indexOf(row.data.id)]
      }
      else if (row.level=2){
        keywords.value = grpandclzList.value.groupNameList[grpandclzList.value.groupIdList.indexOf(row.data.id)]
      }
      
    }
    const upgrpFlag = ref<any>({
      visible: false,
      upgrpInfo: '',
      data: '',
    });
    function showFormB(){
      addClazFlag.value.visible = true
    }
    function updataGropFlag(row: any) {
      upgrpFlag.value.visible = true;
      upgrpFlag.value.data = row;
      upgrpFlag.value.upgrpInfo = row.data.name;
    }
    const addNewGroupFlag = ref<any>({
      visible: false,
      addNewGroupInfo: '',
      data: '',
      claz:''
    });
    function addNewGroup(row:any){
      addNewGroupFlag.value.visible = true;
      addNewGroupFlag.value.data = row;
    }
    async function FrozenClaz(row: any) {
      const result = {
        id: row.id,
        off: 1,
      };
      row.tagoff=true
      await ClassFreeze(result);
      await queryClassList();
      classList.value = await ClassList();
      Message.success('冻结成功')
    }
    async function unFrozenClaz(row: any) {
      const result = {
        id: row.id,
        off: 2,
      };
      row.tagoff=false
      await ClassUnFreeze(result);
      await queryClassList();
      classList.value = await ClassList();
      Message.success('解冻成功')
    }
    async function removeGrop(row: any) {
      const result = {
        id: row.id,
      };
      await ClassGroupDel(result);
      await queryClassList();
      classList.value = await ClassList();
    }
    async function addClaz(row: any) {
      const claszList=ref<any>({
        claszNameList:[]
      })
      for(let i =0;i<classList.value.length;i++){
          claszList.value.claszNameList[i]=classList.value[i].name
      }
      if (addClazFlag.value.addClazInfo != ''&&claszList.value.claszNameList.indexOf(addClazFlag.value.addClazInfo)===-1) {
        const result = {
          name: addClazFlag.value.addClazInfo,
        };
        await ClassUpdate(result);
        await queryClassList();
        classList.value = await ClassList();
        addClazFlag.value.addClazInfo = '';
        addClazFlag.value.visible = false
      }else if(addClazFlag.value.addClazInfo != ''&&claszList.value.claszNameList.indexOf(addClazFlag.value.addClazInfo)!=-1){
        addClazFlag.value.visible = false
        Message.error('请输入名称或该名称已存在')
      }else if(addClazFlag.value.addClazInfo === ''){
        addClazFlag.value.visible = false
        Message.error('请输入名称或该名称已存在')
      }
    }
    async function showForm(row: any) {
      // if (modal.value.studentInfo.extend.clasz=''){
        console.log(row)
      // }
      if (row) {
        row.pwd = '';
        (row as any).pwdCheck = '';
      }
      
      modal.value.studentInfo = row ? deepClone(row) : initForm();
      modal.value.visible = true;
      await armasd(row.extend.clasz);
      if (form.value) { (form.value as ElForm).clearValidate(); }
    }
    async function upgrpDate() {
      if(grpandclzList.value.claszIdList.indexOf(upgrpFlag.value.data.parent.data.id)!=-1){
        upgrpFlag.value.visible = false;
        Message.error("请输入名称或该名称已存在")
      }else{
          const result = {
          cid: upgrpFlag.value.data.parent.data.id,
          name: upgrpFlag.value.upgrpInfo,
          id: upgrpFlag.value.data.data.id,
        };
        if ( upgrpFlag.value.upgrpInfo != '') {
          await ClassGroupUpdate(result);
          await queryClassList();
          // await chFiltered();
          classList.value = await ClassList();
          upgrpFlag.value.visible = false;
        }
      }
      
      
    }
    async function addNewGroupDate() {
      if(grpandclzList.value.claszIdList.indexOf(addNewGroupFlag.value.data.data.id)!=-1){
        addNewGroupFlag.value.visible = false;
        Message.error("请输入名称或该名称已存在")
      }
      else {
        const result = {
        cid: addNewGroupFlag.value.data.data.id,
        name: addNewGroupFlag.value.addNewGroupInfo,
      };
      if (addNewGroupFlag.value.addNewGroupInfo != '') {
        await ClassGroupUpdate(result);
        await queryClassList();
        // await chFiltered();
        classList.value = await ClassList();
        addNewGroupFlag.value.visible = false;
      }
      }
      
      
    }
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (!valid) { return ; }
      if(modal.value.studentInfo.phone===''){
        modal.value.studentInfo.phone=undefined
      }
      const result = {
        id: modal.value.studentInfo.id,
        username: modal.value.studentInfo.username,
        name: modal.value.studentInfo.name,
        phone: modal.value.studentInfo.phone,
        pwd: modal.value.studentInfo.pwd,
        role: 3,
        extend: {
          address: modal.value.studentInfo.extend.address,
          clasz: modal.value.studentInfo.extend.clasz,
          claszGroup: modal.value.studentInfo.extend.claszGroup,
        },
        extendJson: '',
      };
      result.extendJson = JSON.stringify(result.extend);
      if (!modal.value.studentInfo.id) {
        await UserAdd(result);
        Message.success('添加成功');
      } else {
        await UserUpdate(result);
        Message.success('修改成功');
      }
      modal.value.visible = false;
      await queryStudentList();
      // await chFiltered();
    }
    const queryStudentList = async () => {
        const firstList = await StudentList();
        studentUserList.value  = firstList;
        await ClassList();
        await getGroupList()
        brigList.value = studentUserList.value
    };
    const brigList = ref<any>({
    })
    async function queryClassList() {
      const aList = await ClassList();
      list.value = [];
      blist.value = [];
      list.value.children = [];
      blist.value.children = [];
      for (let i = 0; i < aList.length; i++) {
        list.value[i] = {id: aList[i].id, name: aList[i].name, tagoff:aList[i].freez,children: [...aList[i].groups]};
        blist.value[i] = {value: aList[i].name, label: aList[i].name, children: [...aList[i].groups]};
      }

    }
    async function armasd(row: any) {
      // modal.value.studentInfo.extend.claszGroup = '';
      const midList = ref<any>();
      midList.value = [];
      await queryClassList();
      for (let i = 0; i < classList.value.length; i++) {
        midList.value[i] = classList.value[i].id;
      }
      groupList.value = classList.value[midList.value.indexOf(row)].groups;
    }
    onMounted(useLoading(loading, async () => {
      classList.value = await ClassList();
      await queryStudentList();
      await queryClassList();
      // await chFiltered();
      await getGroupList()
    }));
    const [keywords, filtered] = useSearch(brigList, {
          includeProps: ['username', 'name', 'phone' , 'address', 'clasz', 'claszGroup'],
      });
    return{
      loading, filterText, list, tree, props, studentUserList, filtered, keywords, blist, addClazFlag,
      addNewGroup,addNewGroupDate,storeUserInfo, removeClass: useConfirm('确认删除？', useLoading(loading, removeClass)),
      armasd, upgrpFlag,showFormB,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      toggleStatus: useLoading(loading, toggleStatus),
      queryStudentList, queryClassList, removeGrop: useConfirm('确认删除？', useLoading(loading, removeGrop)),
      modal, form, showForm, addClaz, upgrpDate,TreeBtnFlag,
      update: useLoading(loading, update), updataGropFlag,getGroupList,addNewGroupFlag,chgTreeBtnFlag,
      // chFiltered,
      validator, classList, groupList, ctogList, append, FrozenClaz, unFrozenClaz, firstTab,grpandclzList,
    };
    return{

    };
  },
};
enum Status {
  Normal = 0,
  Frozen = 1,
}
function initForm() {
  return {
    name: '', username: '', phone: '', status: '', role: 3, pwdCheck: '',
    extend: {clasz: '', claszGroup: ''},
  };
}
</script>
<style scoped lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
