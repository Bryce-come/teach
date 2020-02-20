<template>
  <div v-loading="loading" class="experiment">
    <div style="display:flex;justify-content:center;margin-bottom:10px">
      <el-button type="primary">所有实验</el-button>
      <el-button type="primary" style="margin-left:20px">课内实验</el-button>
      <el-button type="primary" style="margin-left:20px">开放实验</el-button>
    </div>
    <div style="margin-left:30px;margin-bottom:10px">
      <el-button type="primary">导入</el-button>
      <el-button type="success" style="margin-left:10px">添加</el-button>
      <el-input placeholder="输入关键字搜索" style="width:350px;margin-left:600px"></el-input>
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
        <el-button type="warning" size="mini">修改</el-button>
        <el-button type="danger" size="mini" style="margin-left:5px" @click="remove()">删除</el-button>
        <el-button type="text" style="margin-left:5px">查看详情</el-button>
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
export default {
  setup() {
    const loading = ref(false);
    const experimentList = ref<any>();
    const remove = async (row: any) => {
      Message.success('删除成功');
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
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, experimentList, query,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
    };
  }
}
</script>
<style scoped lang="scss">

</style>