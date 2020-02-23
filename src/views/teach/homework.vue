<template>
  <div v-loading="loading" class="homework">
    <div style="display:flex;justify-content:center">
      <el-button :type="reportButton? 'primary':''" style="width:200px" @click="showReport()">实验报告上传及结果查看</el-button>
      <el-button :type="templateButton? 'primary':''" style="width:200px;margin-left:5px" @click="showTemplate()">实验模板下载</el-button>
    </div>
    <div v-if="reportButton">
      <div style="margin-top:20px">
        <el-form class="flex between">
          <el-form-item label="课程名称" label-width="80px">
            <lkt-select/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <lkt-table
        :data="experimentResultList"
        style="width:100%">
        <el-table-column label="提交时间" prop="createDt" sortable/>
        <el-table-column label="课程名称" prop="course"/>
        <el-table-column label="实验名称" prop="experiment_program.name"/>
        <el-table-column label="实验类型" prop="experiment_program.label"/>
        <el-table-column label="操作过程评分" prop="extend.score1"/>
        <el-table-column label="实验报告" prop=""/>
        <el-table-column label="实验报告评分" prop="extend.score2"/>
        <el-table-column label="总分">
          <div slot-scope="props">
            <span v-if="props.row.extend.score1 && props.row.extend.score2">
              {{props.row.extend.score1 + props.row.extend.score2}}
            </span>
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="props">
            <el-button type="text" :style="props.row.extend.score1 && props.row.extend.score2?'color:grey':''">提交报告</el-button>
          </div>
        </el-table-column>
      </lkt-table>
    </div>
    <div v-if="templateButton">
      <div style="margin: 20px 0" class="block_background">
        <div class="block_title flex start">实验报告模板下载</div>
        <lkt-table
          :data="experimentReportTemplateList"
          style="width:100%">
          <el-table-column label="上传时间" prop="createDt" sortable width="500px"/>
          <el-table-column label="实验报告模板名称" prop="name" width="500px"/>
          <el-table-column label="操作">
            <div slot-scope="{row}">
              <el-button type="text" @click="download(row)">下载</el-button>
            </div>
          </el-table-column>
        </lkt-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted} from '@vue/composition-api';
import {useConfirm, useLoading} from 'web-toolkit/src/service';
import {Message} from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {deepClone, formatDate} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const reportButton = ref(true);
    const templateButton = ref(false);
    const experimentResultList = ref<any>();
    const experimentReportTemplateList = ref<any>();
    const query = async () => {
      experimentResultList.value = [
        {id: '0', course: '自动化操作', experiment_program: {id: '', name: '自动化操作及原理', label: '课内实验'}, program: '', student: '', content: '', attachment: '', scoreSum: '', comment: '',
        note: '', teacher: '', createDt: '', handleDt: '', extend: {score1: 60, score2: 24, ratio1: 60, ratio2: 40}},
        {id: '1', course: '自动化操作', experiment_program: {id: '', name: '自动化操作及原理', label: '课内实验'}, program: '', student: '', content: '', attachment: '', scoreSum: '', comment: '',
        note: '', teacher: '', createDt: '', handleDt: '', extend: {score1: null, score2: null, ratio1: 60, ratio2: 40}},
      ];
      experimentReportTemplateList.value = [
        {id: '0', name: '自动化操作实验报告模板1', path: '', createDt: ''},
        {id: '1', name: '自动化操作实验报告模板2', path: '', createDt: ''},
        {id: '2', name: '自动化操作实验报告模板3', path: '', createDt: ''},
        {id: '3', name: '自动化操作实验报告模板4', path: '', createDt: ''},
        {id: '4', name: '自动化操作实验报告模板5', path: '', createDt: ''},
      ];
    };
    const showReport = async () => {
      reportButton.value = true;
      templateButton.value = false;
    };
    const showTemplate = async () => {
      reportButton.value = false;
      templateButton.value = true;
    };
    const download = async () => {
      Message.success('下载成功');
    }; 
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return {
      loading, experimentResultList, query,
      reportButton, templateButton,
      showReport: useLoading(loading, showReport),
      showTemplate: useLoading(loading, showTemplate),
      experimentReportTemplateList,
      download: useConfirm('确认下载？', useLoading(loading, download)),
    };
  }
}
</script>
<style lang="scss">

</style>