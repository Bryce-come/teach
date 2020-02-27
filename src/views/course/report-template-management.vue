<template>
  <div v-loading="loading" class="report-template-management">
    <div style="margin-bottom:10px;display:flex;justify-content:space-between;flex-wrap:wrap">
      <el-button type="primary" icon="el-icon-upload2" @click="showUpload()">上传实验摸板</el-button>
      <el-input placeholder="输入关键字搜索" style="width:400px"></el-input>
    </div>
    <lkt-table
      :data="experimentReportTemplateList"
      style="width:100%">
      <el-table-column label="文件名" prop="name"/>
      <el-table-column label="大小">
        <div slot-scope="{row}">{{row.size / 1024 / 1024 + 'M'}}</div>
      </el-table-column>
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
      :confirm="upload"
      width="500px">
      <el-upload
            :http-request="(option)=>upload(option.file)"
            action=""
            accept=".doc, .docx"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
            :before-upload="beforeUpload">
            <el-button type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传doc/docx文件，且文件大小不超过10M</div>
      </el-upload>
      <!-- <span slot="footer" class="flex end little-space wrap">
        <el-button @click="modal.visible = false">取 消</el-button>
        <el-button type="primary" @click="upload()">确 定</el-button>
      </span> -->
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {ReportTemplateList, ReportTemplateAdd, ReportTemplateDel} from '@/dao/reportDao';
export default {
  setup() {
    const loading = ref(false);
    const experimentReportTemplateList = ref<any>();
    const fileList = ref<any>([]);
    const remove = async (row: any) => {
      await ReportTemplateDel({
        id: row.id,
      });
      Message.success('删除成功');
    };
    const modal = ref<any>({
      visible: false,
      reportTemplateInfo: null,
    });
    const form = ref<ElForm | null>(null);
    const showUpload = async () => {
      modal.value.visible = true;
    };
    async function upload(option: any) {
      await ReportTemplateAdd({
        file: option.file,
      });
      await query();
    }
    const beforeUpload = async (file: any) => {
      const isLimit10M = file.size / 1024 / 1024 < 10;
      if (!isLimit10M) {
        Message.warning('上传实验报告模板大小不能超过10M！');
        return false
      }
    };
    const download = async () => {
      Message.success('下载成功');
    };
    const query = async () => {
      experimentReportTemplateList.value = await ReportTemplateList({
        file: '',
      });
      console.log(experimentReportTemplateList.value);
      console.log(fileList.value);
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, query, experimentReportTemplateList, fileList,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      modal, showUpload,
      upload: useLoading(loading, upload),
      beforeUpload,
      download: useConfirm('确认下载？', useLoading(loading, download)),
    };
  },
};
</script>
<style scoped lang="scss">

</style>