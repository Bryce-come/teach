<template>
  <div v-loading="loading" class="student-management">
    <el-row :gutter="40" type="flex" justify="space-between">
      <el-col :span="4">
        <el-button type="success" @click="showFormB()">添加班级</el-button>
        <div v-if='addClazFlag.visible'>
          <el-input  v-model="addClazFlag.addClazInfo" placeholder="请输入班级名称"></el-input>
          <el-button type="success" @click="addClaz(addClazFlag.addClazInfo)">确定</el-button>
        </div>
        <el-tree
          class="filter-tree"
          :data="list"
          :props="props"
          node-key="id"
          default-expand-all
          ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data }" @click="() => firstTab(node)">

            <!-- <span disabled="true">{{ node.label }}</span> -->
            <input style="background-color:transparent; width:80px;border-radius: 6px;height: 27px;border:none;"
            class="tel" type="text" disabled="disabled"
            v-model="node.label">
            <span>
              <!-- <el-button
                type="text"
                size="mini"
                v-if="node.level===1"
                @click="() => toggleClazStatus(data)">
                {{ data.off === 0 ? '冻结' : '恢复' }}
              </el-button> -->
              <el-button
                type="text"
                size="mini"
                v-if="node.level===1"
                @click="() => FrozenClaz(data)">
                <i class="el-icon-circle-close" title="冻结"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if="node.level===1"
                @click="() => unFrozenClaz(data)">
                <i class="el-icon-circle-check" title="解冻"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                v-if='node.level===1'
                @click="() => addGrop(data)">
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
      <el-col :span="20" style="box-shadow:0 2px 12px 0 rgba(0, 0, 0, .12);margin-right:100px">
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
      // todo
        console.log(row);
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
    const [keywords, filtered= ref<any>({clasz: [],
        claszGroip: []})] = useSearch(studentUserList, {
      includeProps: ['username', 'name', 'phone' , 'address', 'clasz', 'claszGroup'],
    });
    async function chFiltered() {
      const filGrp = ref<any>({
        claszId: [],
        claszGroipId: [],
        claszIdN: [],
        claszGroipIdNa: [],
        claszGroipIdNb: [],
        claszGroipIdNc: [],
        claszGroipIdNd: [],
        claszGroipIdNe: [],
        claszGroipIndex: [],
        claszGroipName: [],
        claszIndex: [],
        claszName: [],
      });
      for (let i = 0; i < filtered.value.length; i++) {
        filGrp.value.claszId[i] = filtered.value[i].extend.clasz;
        filGrp.value.claszGroipId[i] = filtered.value[i].extend.claszGroup;
      }
      for (let i = 0; i < list.value.length; i++) {
        filGrp.value.claszIdN[i] = list.value[i].id;
      }
      for (let i = 0; i < filtered.value.length; i++) {
        filGrp.value.claszIndex[i] = filGrp.value.claszIdN.indexOf(filtered.value[i].extend.clasz);
      }
      for (let i = 0; i < filGrp.value.claszIndex.length; i++) {
        filGrp.value.claszName[i] = list.value[filGrp.value.claszIndex[i]].name;
      }
      for (let i = 0; i < filtered.value.length; i++) {
        filtered.value[i].clasz = filGrp.value.claszName[i];
      }
      for (let i = 0; i < list.value.length; i++) {
        filGrp.value.claszGroipIdNa[i] = [...list.value[i].children];
      }
      for (let i = 0; i < filGrp.value.claszGroipIdNa.length; i++) {
        filGrp.value.claszGroipIdNb[i] = [filGrp.value.claszGroipIdNa[i]];
      }
      for (let i = 0; i < filGrp.value.claszGroipIdNa.length; i++) {
        filGrp.value.claszGroipIdNd[i] = [filGrp.value.claszGroipIdNa[i]];
      }
      for (let i = 0; i < classList.value.length; i++) {
        for (let j = 0; j < classList.value[i].groups.length; j++) {
          filGrp.value.claszGroipIdNb[i][j] = classList.value[i].groups[j].id;
        }
      }
      for (let i = 0; i < classList.value.length; i++) {
        for (let j = 0; j < classList.value[i].groups.length; j++) {
          filGrp.value.claszGroipIdNd[i][j] = classList.value[i].groups[j].name;
        }
      }
      filGrp.value.claszGroipIdNc = filGrp.value.claszGroipIdNb.reduce(function(a: any, b: any) { return a.concat(b); } );
      filGrp.value.claszGroipIdNe = filGrp.value.claszGroipIdNd.reduce(function(a: any, b: any) { return a.concat(b); } );
      for (let i = 0; i < filGrp.value.claszGroipId.length; i++) {
        filtered.value[i].claszGroup = filGrp.value.claszGroipIdNe[filGrp.value.claszGroipIdNc.indexOf(filGrp.value.claszGroipId[i])];
      }
    }
    const form = ref<ElForm|null>(null);
    // const clazForm = ref<ElForm|null>(null);
    const modal = ref<any>({
      visible: false,
      studentInfo: null,
    });
    // const addClaz = ref<any>({
    //   visible: false,
    //   clazInfo: null,
    // });
    async function toggleStatus(row: any) {
      const off = row.off;
      await UserDel({
        id: row.id,
        off: off === 0 ? 1 : 2,
      });
      Message.success(`${off === 0 ? '冻结' : '恢复'}成功`);
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
    function showFormB(row: any) {
      // 重复班级未修改
        addClazFlag.value.visible = !addClazFlag.value.visible;
    }
    function firstTab(row: any) {
      const result = ref<any>();
      keywords.value = row.data.id;
    }
    const upgrpFlag = ref<any>({
      visible: false,
      upgrpInfo: '',
      data: '',
    });
    function updataGropFlag(row: any) {
      upgrpFlag.value.visible = true;
      upgrpFlag.value.data = row;
      upgrpFlag.value.upgrpInfo = row.data.name;
    }
    const ForzenStatus = ref<any>({
      isForzenStatus: false,
      notForzenStatus: true,
    });
    // const some =ref<any>({
    //   classList[row.id].
    // })
    async function FrozenClaz(row: any) {
      const result = {
        id: row.id,
        off: 1,
      };
      ForzenStatus.value.isForzenStatus = true,
      ForzenStatus.value.notForzenStatus = false,
      await ClassFreeze(result);
      await queryClassList();
      classList.value = await ClassList();
    }
    async function unFrozenClaz(row: any) {
      const result = {
        id: row.id,
        off: 2,
      };
      ForzenStatus.value.notForzenStatus = true,
      ForzenStatus.value.isForzenStatus = false,
      await ClassUnFreeze(result);
      await queryClassList();
      classList.value = await ClassList();
    }
    async function addGrop(row: any) {
      const result = {
        cid: row.id,
        name: `组${row.children.length + 1}`,
      };
      await ClassGroupUpdate(result);
      await queryClassList();
      classList.value = await ClassList();
    }
    async function removeGrop(row: any) {
      const result = {
        id: row.id,
      };
      await ClassGroupDel(result);
      await queryClassList();
      classList.value = await ClassList();
    }
    // 重复名未定
    async function addClaz(row: any) {
      if (addClazFlag.value.addClazInfo !== '') {
        const result = {
          name: addClazFlag.value.addClazInfo,
        };
        await ClassUpdate(result);
        addClazFlag.value.visible = !addClazFlag.value.visible;
        await queryClassList();
        classList.value = await ClassList();
        addClazFlag.value.addClazInfo = '';
      } else {
        addClazFlag.value.visible = !addClazFlag.value.visible;
      }
    }
    async function showForm(row: any) {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (row) {
        row.pwd = '';
        (row as any).pwdCheck = '';
      }
      modal.value.studentInfo = row ? deepClone(row) : initForm();
      modal.value.visible = true;
      await armasd(row.extend.clasz);
    }
    async function upgrpDate() {
      const result = {
        cid: upgrpFlag.value.data.parent.data.id,
        name: upgrpFlag.value.upgrpInfo,
        id: upgrpFlag.value.data.data.id,
      };
      if (result.name !== '') {
        await ClassGroupUpdate(result);
        await queryClassList();
        await chFiltered();
        classList.value = await ClassList();
      }
      upgrpFlag.value.visible = false;
    }
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (!valid) { return ; }
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
      await chFiltered();
    }
    const queryStudentList = async () => {
        const firstList = await StudentList();
        studentUserList.value  = firstList;
        await ClassList();
    };
    async function queryClassList() {
      const aList = await ClassList();
      list.value = [];
      blist.value = [];
      list.value.children = [];
      blist.value.children = [];
      for (let i = 0; i < aList.length; i++) {
        list.value[i] = {id: aList[i].id, name: aList[i].name, children: [...aList[i].groups]};
        blist.value[i] = {value: aList[i].name, label: aList[i].name, children: [...aList[i].groups]};
      }
    }
    async function armasd(row: any) {
      modal.value.studentInfo.extend.claszGroup = '';
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
      await chFiltered();
    }));

    return{
      loading, filterText, list, tree, props, studentUserList, filtered, keywords, blist, addClazFlag,
      storeUserInfo, removeClass: useConfirm('确认删除？', useLoading(loading, removeClass)),
      armasd, showFormB, upgrpFlag,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      toggleStatus: useLoading(loading, toggleStatus),
      queryStudentList, queryClassList, removeGrop: useConfirm('确认删除？', useLoading(loading, removeGrop)),
      modal, form, showForm, addClaz, addGrop, upgrpDate,
      update: useLoading(loading, update), updataGropFlag, ForzenStatus, chFiltered,
      validator, classList, groupList, ctogList, append, FrozenClaz, unFrozenClaz, firstTab,
    };
  },
};
function initForm() {
  return {
    name: '', username: '', role: 3,
    extend: {},
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
