<template>
  <div v-loading="loading" class="report-template-management">
    <div style="margin-bottom:10px;display:flex;justify-content:space-between;flex-wrap:wrap">
      <el-upload
        action=""
        :http-request="(option)=>upload(option)"
        :show-file-list="false">
        <el-button type="primary" icon="el-icon-upload2">上传实验摸板</el-button>
      </el-upload>
      <el-input v-model="keywords" placeholder="输入模板名称搜索" style="width:400px"/>
    </div>
    <lkt-table
      :data="filtered"
      style="width:100%">
      <el-table-column label="文件名" prop="name"/>
      <el-table-column label="上传时间" prop="createDt"/>
      <el-table-column label="操作" width="120px" align="center">
        <div slot-scope="{row}">
          <el-button type="text" @click="downFile(row)">下载</el-button>
          <el-button type="danger" size="mini" style="margin-left:10px" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {ReportTemplateList, ReportTemplateAdd, ReportTemplateDel} from '@/dao/reportDao';
import {DownLoadPrivate} from '@/dao/commonDao';
export default {
  setup() {
    const loading = ref(false);
    const experimentReportTemplateList = ref<any>();
    const [keywords, filtered] = useSearch(experimentReportTemplateList, {
      includeProps: ['name'],
    });
    const remove = async (row: any) => {
      await ReportTemplateDel({
        id: row.id,
      });
      Message.success('删除成功');
      await query();
    };
    async function upload(option: any) {
      await ReportTemplateAdd({
        file: option.file,
      });
      await query();
    }
    async function downFile(row: any) {
      await DownLoadPrivate(row.path, row.name);
    }
    const query = async () => {
      experimentReportTemplateList.value = await ReportTemplateList();
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, query, experimentReportTemplateList, keywords, filtered,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      upload: useLoading(loading, upload), downFile,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
