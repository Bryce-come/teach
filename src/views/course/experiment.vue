<template>
  <div v-loading="loading" class="experiment">
    <div style="display:flex;justify-content:flex-start;margin-bottom:10px">
      <el-button :type="allExp?'primary':''" @click="showAllExp()">所有实验</el-button>
      <el-button :type="inExp?'primary':''" style="margin-left:20px" @click="showInExp()">课内实验</el-button>
      <el-button :type="outExp?'primary':''" style="margin-left:20px" @click="showOutExp()">开放实验</el-button>
    </div>
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
      <div style="margin-bottom:10px">
        <el-button type="primary">导入</el-button>
        <el-button type="success" style="margin-left:10px" @click="showForm()">添加</el-button>
      </div>      
      <el-input placeholder="输入关键字搜索" style="margin-bottom:10px;width:350px"></el-input>    
    </div>
    <lkt-table
      :data="experimentList"
      style="width:100%">
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="类型" prop="label"/>
      <el-table-column label="简介" prop="purpose"/>
      <el-table-column label="关联操作台" prop="stations"/>
      <el-table-column label="实验设备"/>
      <el-table-column label="附件" prop="attachment"/>
      <el-table-column label="操作" width="200px">
        <div slot-scope="{row}">
          <el-button type="warning" size="mini" @click="showForm(row)">修改</el-button>
          <el-button type="danger" size="mini" style="margin-left:5px" @click="remove(row)">删除</el-button>
          <el-button type="text" style="margin-left:5px" @click="detialForm(row)">查看详情</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update">
      <div slot="title">录入实验信息</div>
      <el-form v-if="modal.experimentInfo" ref="form" :model="modal.experimentInfo" label-width="120px" label-position="left" style="margin: 0 10px">
        <el-form-item label="实验名称：" prop="name" :rules="{ required: true, message: '请输入实验名称'}">
          <el-input v-model="modal.experimentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="实验目的：" prop="purpose" :rules="{ required: true, message: '请输入实验目的'}">
          <el-input v-model="modal.experimentInfo.purpose"></el-input>
        </el-form-item>
        <el-form-item label="实验原理：" prop="principle" :rules="{ required: true, message: '请输入实验原理'}">
          <el-input v-model="modal.experimentInfo.principle"></el-input>
        </el-form-item>
        <el-form-item label="实验步骤：" prop="steps" :rules="{ required: true, message: '请输入实验步骤'}">
          <el-input v-model="modal.experimentInfo.steps"></el-input>
        </el-form-item>
        <el-form-item label="实验结果：" prop="results" :rules="{ required: true, message: '请输入实验结果'}">
          <el-input v-model="modal.experimentInfo.results"></el-input>
        </el-form-item>
        <el-form-item label="关联操作台：" prop="stations" :rules="{ required: true, message: '请选择关联操作台'}">
          <lkt-select v-model="modal.experimentInfo.stations"></lkt-select>
        </el-form-item>
        <el-form-item label="附件：" prop="attachment" :rules="{ required: true, message: '请上传附件'}">
          <el-input v-model="modal.experimentInfo.attachment" type="file"></el-input>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="detialModal">
      <div slot="title">查看详情</div>
      <el-form v-if="detialModal.detialInfo" ref="form" :model="detialModal.detialInfo" label-width="120px" label-position="left" style="margin: 0 10px">
        <el-form-item label="实验名称：">
          <div>{{detialModal.detialInfo.name}}</div>
        </el-form-item>
        <el-form-item label="实验目的：">
          <div>{{detialModal.detialInfo.purpose}}</div>
        </el-form-item>
        <el-form-item label="实验原理：">
          <div>{{detialModal.detialInfo.principle}}</div>
        </el-form-item>
        <el-form-item label="实验步骤：">
          <div>{{detialModal.detialInfo.steps}}</div>
        </el-form-item>
        <el-form-item label="实验结果：">
          <div>{{detialModal.detialInfo.results}}</div>
        </el-form-item>
        <el-form-item label="关联操作台：">
          <div>{{detialModal.detialInfo.stations}}</div>
        </el-form-item>
        <el-form-item label="附件：">
          <div>{{detialModal.detialInfo.attachment}}</div>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const experimentList = ref<any>();
    const allExp = ref(true);
    const inExp = ref(false);
    const outExp = ref(false);
    const remove = async (row: any) => {
      Message.success('删除成功');
    };
    const modal = ref<any>({
      visible: false,
      experimentInfo: null,
      type: 'add',
    });
    const form = ref<ElForm | null>(null);
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initForm();
      }
      modal.value.experimentInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      modal.value.visible = false;
      Message.success('添加成功');
      await query();
    }
    const detialModal = ref<any>({
      visible: false,
      detialInfo: null,
    });
    const detialForm = async (data?: any) => {
      detialModal.value.detialInfo = data;
      detialModal.value.visible = true;
    };
    const query = async () => {
      experimentList.value = [
        {id: 0, code: '', name: '1xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '课内实验', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 1, code: '', name: '2xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '开放实验', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 2, code: '', name: '3xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '课内实验', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 3, code: '', name: '4xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '开放实验', extend: {}, stations: [], attachment: [], createDt: ''},
        {id: 4, code: '', name: '5xx', purpose: 'xx', principle: 'xxxxx', steps: '', results: 'xx', label: '开放实验', extend: {}, stations: [], attachment: [], createDt: ''},
      ];
    };
    const showAllExp = async () => {
      allExp.value = true;
      inExp.value = false;
      outExp.value = false;
    };
    const showInExp = async () => {
      allExp.value = false;
      inExp.value = true;
      outExp.value = false;
    };
    const showOutExp = async () => {
      allExp.value = false;
      inExp.value = false;
      outExp.value = true;
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, experimentList, query,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      modal, showForm,
      update: useLoading(loading, update),
      allExp, inExp, outExp,
      showAllExp: useLoading(loading, showAllExp),
      showInExp: useLoading(loading, showInExp),
      showOutExp: useLoading(loading, showOutExp),
      detialModal, detialForm,
    };
  },
};
function initForm() {
  return {
    name: '', purpose: '', principle: '', steps: '', results: '', stations: '', attachment: '',
  };
}
</script>
<style scoped lang="scss">

</style>