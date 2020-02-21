<template>
  <div v-loading="loading" class="gateway-channel-management">
    <div style="display:flex;justify-content:flex-end;margin:10px">
      <el-input placeholder="请输入操作台/设备名称/设备型号/设备编号/LKT-MAN编号搜索" style="width:500px"></el-input>
    </div>
    <lkt-table
      :data="list">
      <el-table-column label="操作台" prop="station"/>
      <el-table-column label="设备名称" prop="device.name"/>
      <el-table-column label="设备型号" prop="device.type.name"/>
      <el-table-column label="设备编号" prop="device.id"/>
      <el-table-column label="LKT-MAN编号" prop="lktMan"/>
      <el-table-column label="网管通道">
        <el-switch></el-switch>   
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
    const list = ref<any>();
    const query = async () => {
      list.value = [
        {id: '0', station: '操作台01', device: {id: '001', name: '磨光机', type: {id: '0', name: 'xxx'}}, lktMan: 'xxxx'},
      ];
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return {
      loading, list, query,
    };
  }
}
</script>
<style scoped lang="scss">

</style>