<template>
  <div v-loading="loading" class="experiment">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
      <div class="flex start little-space wrap">
        <el-radio-group v-model="tab" @change="changeTab">
          <el-radio-button label="所有实验"></el-radio-button>
          <el-radio-button label="课内实验"></el-radio-button>
          <el-radio-button label="开放实验"></el-radio-button>
        </el-radio-group>
        <el-button type="success" @click="showForm()">添加实验</el-button>
      </div>
      <el-input v-model="keywords" placeholder="输入搜索：实验名称" style="margin-top:5px;width:350px"></el-input>
    </div>
    <lkt-table
      :data="filtered"
      style="width:100%">
      <el-table-column label="实验名称" prop="name"/>      
      <el-table-column label="实验类型" prop="label"/>    
      <el-table-column label="实验简介" prop="purpose"/>
      <el-table-column label="关联操作台">
        <div class="flex start" slot-scope="{row}" >
           <div v-for="(item,i) in row.stationList" :key="i" style="padding: 0">
             {{item.name + ','}}
           </div>
         </div>
      </el-table-column>
      <!-- <el-table-column label="实验设备"/> -->
      <el-table-column label="附件" prop="attachment" width="350px">
        <div slot-scope="{row}">
          <div v-for="(item,i) in row.attachment" :key="i">
            {{item.split('/')[item.split('/').length-1]}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <div class="flex center little-space wrap" slot-scope="{row}">
          <el-button type="warning" size="mini" @click="showForm(row)">修改</el-button>
          <el-button type="text" @click="attachmentForm(row)">管理附件</el-button>
          <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
          <el-button type="text" @click="detailForm(row)">查看详情</el-button>
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
        <el-form-item label="实验类型：" prop="label" :rules="{ required: true, message: '请选择实验类型'}">
          <el-select v-model="modal.experimentInfo.label">
            <el-option
              v-for="item of expTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"></el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="项目编号：" prop="code" :rules="{ required: true, message: '请输入实验项目编号'}">
          <el-input v-model="modal.experimentInfo.code"></el-input>
        </el-form-item>
        <el-form-item label="实验目的：" prop="purpose">
          <el-input type="textarea" v-model="modal.experimentInfo.purpose"></el-input>
        </el-form-item>
        <el-form-item label="实验原理：" prop="principle">
          <el-input type="textarea" v-model="modal.experimentInfo.principle"></el-input>
        </el-form-item>
        <el-form-item label="实验步骤：" prop="steps">
          <el-input type="textarea" v-model="modal.experimentInfo.steps"></el-input>
        </el-form-item>
        <el-form-item label="实验结果：" prop="results">
          <el-input type="textarea" v-model="modal.experimentInfo.results"></el-input>
        </el-form-item>
        <el-form-item label="关联操作台：" prop="stations" :rules="{required: true, message: '请选择关联操作台'}">
          <el-select multiple v-model="modal.experimentInfo.stations">
            <el-option
              v-for="item of stationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上传附件：" prop="attachment">
          <el-upload
            :http-request="(option)=>upload(option, row)"
            ref="upload"
            :limit="1"
            action=""
            :auto-upload="false">
            <el-button type="primary" icon="el-icon-upload2">点击上传文件</el-button>
          </el-upload>
        </el-form-item> -->
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="detailModal"
      :confirm="detailUpdate">
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
          <div class="flex start">
            <div v-for="item of detailModal.detailInfo.stationList" :key="item.id">{{item.name + ','}}</div>
          </div>
        </el-form-item>
        <el-form-item label="附件：">
          <div v-for="(item,i) in detailModal.detailInfo.attachment" :key="i">{{item.split('/')[item.split('/').length-1]}}</div>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="attachmentModal"
      :confirm="attachmentUpdate">
      <div slot="title">管理附件</div>
      <el-upload
            :http-request="(option)=>upload(option)"
            action=""
            :file-list="fileList"
            :show-file-list="false"
            >
            <el-button type="primary" icon="el-icon-upload2">点击上传附件</el-button>
      </el-upload>
      <el-table
        :data="attachmentList">
        <el-table-column label="附件名称" prop="name" width="550px">
          <div slot-scope="{row}">
            {{row.name.split('/')[row.name.split('/').length-1]}}
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="{row}">
            <el-button type="danger" size="mini" @click="attachmentRemove(row)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
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
import {StationList} from '@/dao/stationDao';
export default {
  setup() {
    const loading = ref(false);
    const experimentList = ref<any>([]);
    const stationList = ref<any>();
    const fileList = ref<any>();
    const expID = ref<any>();
    const attachmentList = ref<any>([]); 
    const [keywords, filtered] = useSearch(experimentList, {
      includeProps: ['name'],
    });
    const tab = ref<'所有实验' | '课内实验' | '开放实验'>('所有实验');
    async function changeTab(tab: any) {
      if (tab === '所有实验') {
        await showAllExp();
      } else if (tab === '课内实验') {
        showInExp();
      } else  {
        showOutExp();
      }
    }
    const expTypeList = ref<any>([
      {id: 0, name: '课内实验'},
      {id: 1, name: '开放实验'},
    ]);
    const remove = async (row: any) => {
      await ProgramDel({
        id: row.id,
      });
      Message.success('删除成功');
      // experimentList.value = await ProgramList();
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
            // id: modal.value.experimentInfo.id,
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
        // experimentList.value = await ProgramList();
        await showAllExp();
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
    const detailUpdate = async () => {
      detailModal.value.visible = false;
    };
    const form2 = ref<ElForm | null>(null);
    const attachmentModal = ref<any>({
      visible: false,
      attachmentInfo: null,
    });
    const attachmentForm = async (data?: any) => {
      attachmentModal.value.visible = true;
      attachmentModal.value.attachmentInfo = data;
      expID.value = data.id;
      // console.log(expID.value);
      // 将附件字符串数组转化成对象
      const turnObj: any = [];
      data.attachment.forEach((item: any, index: any) => {
        const id = index;
        const name = item;
        var obj = {id, name};
        turnObj.push(obj);
      });
      attachmentList.value = turnObj;
      // console.log(attachmentList.value);
      await showAllExp();
    };
    const attachmentUpdate = async () => {
      attachmentModal.value.visible = false;
    };
    const attachmentRemove = async (row: any) => {
      await ProgramUploadDel({
        id: expID.value,
        path: row.name,
      })
      await showAllExp();
      // 将附件字符串数组转化成对象，并更新附件列表
      const updateAttList = experimentList.value.filter(function(item: any) {
        return item.id === expID.value;
      })
      const turnObj: any = [];
      updateAttList[0].attachment.forEach((item: any, index: any) => {
        const id = index;
        const name = item;
        var obj = {id, name};
        turnObj.push(obj);
      });
      attachmentList.value = turnObj;
    };
    const showAllExp = async () => {
      experimentList.value = await ProgramList();
      console.log(experimentList.value);
    };
    const showInExp = async () => {
      const firstList = await ProgramList();
      experimentList.value = firstList.filter(function(item: any) {
        return item.label === '课内实验';
      });
    };
    const showOutExp = async () => {
      const secondList = await ProgramList();
      experimentList.value = secondList.filter(function(item: any) {
        return item.label === '开放实验';
      });
    };
    async function upload(option: any) {
      await ProgramUpload({
        id: expID.value,
        file: option.file,
      });
      await showAllExp();
      // 将附件字符串数组转化成对象，并更新附件列表
      const updateAttList = experimentList.value.filter(function(item: any) {
        return item.id === expID.value;
      })
      const turnObj: any = [];
      updateAttList[0].attachment.forEach((item: any, index: any) => {
        const id = index;
        const name = item;
        var obj = {id, name};
        turnObj.push(obj);
      });
      attachmentList.value = turnObj;
    }
    onMounted(useLoading(loading, async () => {
      // experimentList.value = await ProgramList();
      await showAllExp();
      stationList.value = await StationList(true);
      console.log(stationList.value);
    }));
    return{
      loading, experimentList, keywords, filtered, expTypeList, tab,
      changeTab: useLoading(loading, changeTab),
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      modal, showForm, form,
      update: useLoading(loading, update),
      showAllExp: useLoading(loading, showAllExp),
      showInExp: useLoading(loading, showInExp),
      showOutExp: useLoading(loading, showOutExp),
      detailModal, detailForm, detailUpdate,
      stationList,      
      upload, form2, attachmentModal, attachmentForm, fileList, expID,
      attachmentUpdate: useLoading(loading, attachmentUpdate),
      attachmentList,
      attachmentRemove: useConfirm('确认删除？', useLoading(loading, attachmentRemove)),
    };
  },
};
function initForm() {
  return {
    id: '', code: '', name: '', label: '', purpose: '', principle: '', steps: '', results: '', extend: {},
  };
}
</script>
<style scoped lang="scss">

</style>