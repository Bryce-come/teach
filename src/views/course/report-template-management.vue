<template>
  <div v-loading="loading" class="report-template-management">
    <div style="margin-bottom:10px;display:flex;justify-content:space-between;flex-wrap:wrap">
      <el-button type="primary" @click="showForm()">添加</el-button>
      <el-input placeholder="输入关键字搜索" style="width:400px"></el-input>
    </div>
    <lkt-table
      :data="experimentReportTemplateList"
      style="width:100%">
      <el-table-column label="文件名" prop="name"/>
      <el-table-column label="大小"/>
      <el-table-column label="上传时间" prop="createDt"/>
      <el-table-column label="操作" width="120px" align="center">
        <div slot-scope="{row}">
          <el-button type="text" @click="download(row)">下载</el-button>
          <el-button type="danger" size="mini" style="margin-left:10px" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="500px">
      <div style="display:flex;justify-content:center">
        <el-input type="file" style="width:300px"/>
        <el-button type="primary" style="margin-left:30px">点击上传</el-button>
      </div>
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
    const experimentReportTemplateList = ref<any>();
    const remove = async (row: any) => {
      Message.success('删除成功');
    };
    const modal = ref<any>({
      visible: false,
      reportTemplateInfo: null,
    });
    const form = ref<ElForm | null>(null);
    const showForm = async () => {
      modal.value.visible = true;
    };
    async function update() {
      modal.value.visible = false;
      Message.success('添加成功');
      await query();
    }
    const download = async () => {
      Message.success('下载成功');
    };
    const query = async () => {
      experimentReportTemplateList.value = [
        {id: '0', name: '自动化操作实验报告模板', path: '', createDt: ''},
        {id: '1', name: '自动化操作实验报告模板', path: '', createDt: ''},
        {id: '2', name: '自动化操作实验报告模板', path: '', createDt: ''},
        {id: '3', name: '自动化操作实验报告模板', path: '', createDt: ''},
        {id: '4', name: '自动化操作实验报告模板', path: '', createDt: ''},
      ];
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, query, experimentReportTemplateList,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      modal, showForm,
      update: useLoading(loading, update),
      download: useConfirm('确认下载？', useLoading(loading, download)),
    };
  },
};
</script>
<style scoped lang="scss">

</style>