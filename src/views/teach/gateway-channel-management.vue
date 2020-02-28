<template>
  <div v-loading="loading" class="gateway-channel-management">
    <div class="flex between">
      <div class="flex center little-space wrap">
        <el-button type="primary">批量开启</el-button>
        <el-button type="danger">批量关闭</el-button>
      </div>
      <!-- <el-input placeholder="请输入操作台/设备名称/设备型号/设备编号/LKT-MAN编号搜索" style="width:500px;margin-top:5px"></el-input> -->
    </div>
    <el-table
      :data="list">
      <el-table-column type="selection"/>
      <el-table-column label="操作台" prop="station"/>
      <el-table-column label="设备名称" prop="device.name"/>
      <el-table-column label="设备型号" prop="device.type.name"/>
      <el-table-column label="设备编号" prop="device.id"/>
      <el-table-column label="LKT-MAN编号" prop="lktMan"/>
      <el-table-column label="网管通道">
        <el-switch></el-switch>   
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import { CNCLinkStatus,CNCLinkSet } from '../../dao/inClassDao'
export default {
  setup() {
    const loading = ref(false);
    const list = ref<any>();
    const query = async () => {
      const result = await CNCLinkStatus()
      list.value = result
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return {
      loading, list, query,
    };
  },
};
</script>
<style scoped lang="scss">

</style>