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
      <el-input class="search bar" v-model="keywords" placeholder="输入关键字搜索" style="margin-bottom:10px;width:350px"></el-input>    
    </div>
    <lkt-table
      :data="filtered"
      style="width:100%">
      <el-table-column label="名称" prop="name"/>      
      <el-table-column label="类型" prop="label"/>    
      <el-table-column label="简介" prop="purpose"/>
      <el-table-column label="关联操作台" prop="stations"/>
      <el-table-column label="实验设备"/>
      <el-table-column label="附件" prop="attachment"/>
      <el-table-column label="操作" width="200px" align="center">
        <div slot-scope="{row}">
          <el-button type="warning" size="mini" @click="showForm(row)">修改</el-button>
          <el-button type="danger" size="mini" style="margin-left:5px" @click="remove(row)">删除</el-button>
          <el-button type="text" style="margin-left:5px" @click="detailForm(row)">查看详情</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update">
      <div slot="title">{{modal.experimentInfo && modal.experimentInfo.id ? '修改' : '录入'}}实验信息</div>
      <el-form v-if="modal.experimentInfo" ref="form" :model="modal.experimentInfo" label-width="120px" label-position="left" style="margin: 0 10px">
        <el-form-item label="实验名称：" prop="name" :rules="{ required: true, message: '请输入实验名称'}">
          <el-input v-model="modal.experimentInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="实验目的：" prop="purpose">
          <el-input v-model="modal.experimentInfo.purpose"></el-input>
        </el-form-item>
        <el-form-item label="实验原理：" prop="principle">
          <el-input v-model="modal.experimentInfo.principle"></el-input>
        </el-form-item>
        <el-form-item label="实验步骤：" prop="steps">
          <el-input v-model="modal.experimentInfo.steps"></el-input>
        </el-form-item>
        <el-form-item label="实验结果：" prop="results">
          <el-input v-model="modal.experimentInfo.results"></el-input>
        </el-form-item>
        <el-form-item label="关联操作台：" prop="stations" :rules="{required: true, message: '请选择关联操作台'}">
          <lkt-select :list="stationList" value-key="name" option-value-key="id" v-model="modal.experimentInfo.stations"></lkt-select>
        </el-form-item>
        <el-form-item label="上传附件：" prop="attachment">
          <el-upload
            :http-request="(option)=>upload(option, row)"
            ref="upload"
            :limit="1"
            action=""
            :auto-upload="false">
            <el-button type="primary" icon="el-icon-upload2">点击上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="detailModal">
      <div slot="title">查看详情</div>
      <el-form v-if="detailModal.detailInfo" ref="form" :model="detailModal.detailInfo" label-width="120px" label-position="left" style="margin: 0 10px">
        <el-form-item label="实验名称：">
          <div>{{detailModal.detailInfo.name}}</div>
        </el-form-item>
        <el-form-item label="实验目的：">
          <div>{{detailModal.detailInfo.purpose}}</div>
        </el-form-item>
        <el-form-item label="实验原理：">
          <div>{{detailModal.detailInfo.principle}}</div>
        </el-form-item>
        <el-form-item label="实验步骤：">
          <div>{{detailModal.detailInfo.steps}}</div>
        </el-form-item>
        <el-form-item label="实验结果：">
          <div>{{detailModal.detailInfo.results}}</div>
        </el-form-item>
        <el-form-item label="关联操作台：">
          <div>{{detailModal.detailInfo.stations}}</div>
        </el-form-item>
        <el-form-item label="附件：">
          <div>{{detailModal.detailInfo.attachment}}</div>
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
import {ProgramList, ProgramAdd, ProgramUpdate, ProgramDel, ProgramUpload, ProgramUploadDel} from '@/dao/courseProgramDao';
import {StationList} from '@/dao/stationDao'
export default {
  setup() {
    const loading = ref(false);
    const experimentList = ref<any>([]);
    const stationList = ref<any>();
    const [keywords, filtered] = useSearch(experimentList, {
      includeProps: ['name'],
    });
    const allExp = ref(true);
    const inExp = ref(false);
    const outExp = ref(false);
    const remove = async (row: any) => {
      await ProgramDel({
        id: row.id,
      });
      Message.success('删除成功');
      // await query();
      await showAllExp();
    };
    const modal = ref<any>({
      visible: false,
      experimentInfo: null,
      type: 'add',
    });
    const form = ref<ElForm | null>(null);
    const showForm = async (data?: any) => {
      if (form.value) {
        (form.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        modal.value.type = 'update';
      } else {
        data = initForm();
        modal.value.type = 'add';
      }
      modal.value.experimentInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        // *id, code, name, purpose, principle, steps, results, label, stationJson, extendJson
        if (modal.value.type === 'add') {
          await ProgramAdd({
            id: modal.value.experimentInfo.id,
            code: modal.value.experimentInfo.code,
            name: modal.value.experimentInfo.name,
            purpose: modal.value.experimentInfo.purpose,
            principle: modal.value.experimentInfo.principle,
            steps: modal.value.experimentInfo.steps,
            results: modal.value.experimentInfo.results,
            label: modal.value.experimentInfo.label,
            stationJson: JSON.stringify(modal.value.experimentInfo.stations),
            extendJson: JSON.stringify(modal.value.experimentInfo.extend),
          });
        } else {
          await ProgramUpdate({
            id: modal.value.experimentInfo.id,
            code: modal.value.experimentInfo.code,
            name: modal.value.experimentInfo.name,
            purpose: modal.value.experimentInfo.purpose,
            principle: modal.value.experimentInfo.principle,
            steps: modal.value.experimentInfo.steps,
            results: modal.value.experimentInfo.results,
            label: modal.value.experimentInfo.label,
            stationJson: JSON.stringify(modal.value.experimentInfo.stations),
            extendJson: JSON.stringify(modal.value.experimentInfo.extend),
          });
        }
        modal.value.visible = false;
        Message.success(`${modal.value.type === 'add' ? '添加' : '修改'}成功`);
        // await query();
        await showAllExp();
        // await showInExp();
        // await showOutExp();
      }
    }
    const detailModal = ref<any>({
      visible: false,
      detailInfo: null,
    });
    const detailForm = async (data?: any) => {
      detailModal.value.detailInfo = data;
      detailModal.value.visible = true;
    };
    const showAllExp = async () => {
      allExp.value = true;
      inExp.value = false;
      outExp.value = false;
      const firstList = await ProgramList();
      // const inExpList = firstList.课内实验;
      // const outExpList = firstList.开放实验;
      // for(var i = 0;i < outExpList.length;i++) {
      //     inExpList.push(outExpList[i])
      //   }
      // experimentList.value = inExpList;
      console.log(firstList);
    };
    const showInExp = async () => {
      allExp.value = false;
      inExp.value = true;
      outExp.value = false;
      // const firstList = await ProgramList();
      // const inExpList = firstList.课内实验;
      // experimentList.value = inExpList;
    };
    const showOutExp = async () => {
      allExp.value = false;
      inExp.value = false;
      outExp.value = true;
      // const firstList = await ProgramList();
      // const outExpList = firstList.开放实验;
      // experimentList.value = outExpList;
      // console.log(experimentList.value[0].stations);
    };
    async function upload(option: any, row: any) {
      await ProgramUpload({
        id: row.id,
        file: option.file,
      });
      await showAllExp();
    }
    onMounted(useLoading(loading, async () => {
      //await query();
      await showAllExp();
      stationList.value = await StationList(true);
      // console.log(stationList.value);
      // await showInExp();
      // await showOutExp();
    }));
    return{
      loading, experimentList, keywords, filtered,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      modal, showForm, form,
      update: useLoading(loading, update),
      allExp, inExp, outExp,
      showAllExp: useLoading(loading, showAllExp),
      showInExp: useLoading(loading, showInExp),
      showOutExp: useLoading(loading, showOutExp),
      detailModal, detailForm,
      stationList,
      upload: useLoading(loading, upload),
    };
  },
};
function initForm() {
  return {
    id: '', code: '', name: '', purpose: '', principle: '', steps: '', results: '', attachment: '', extend: {},
  };
}
</script>
<style scoped lang="scss">

</style>