<template>
  <div v-loading="loading" class="gateway-channel-management">
    <div class="flex between">
      <div class="flex center little-space wrap">
        <el-button type="primary" @click="openSomething()">批量开启</el-button>
        <el-button type="danger" @click="closeSomething()">批量关闭</el-button>
      </div>
    </div>
    <el-table
      :data="list"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column label="操作台" prop="name"/>
      <el-table-column label="设备名称" prop="deviceList[0].name"/>
      <el-table-column label="设备型号" prop="deviceList[0].type"/>
      <el-table-column label="设备编号" prop="deviceList[0].id"/>
      <el-table-column label="LKT-MAN编号" prop="collector.id"/>
      <el-table-column label="网管通道"> 
        <template slot-scope="{ row }">
            <el-switch 
            :disabled='row.disabledMa'
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="row.extend.linkStatus"
            @change="toggleStatus(row)"
            ></el-switch> 
        </template>
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
import { CNCLinkStatus, CNCLinkSet } from '../../dao/inClassDao';
export default {
  setup() {
    const loading = ref(false);
    const list = ref<any>({
      disabledMa:''
    });
    const status = ref<any>({
       statusList: [],
       disabledList: [],
       rowIDList: [],
    });
    function handleSelectionChange(row: any) {
      status.value.rowIDList = [];
      for (let i = 0; i < row.length; i++) {
        status.value.rowIDList[i] = row[i].id;
      }
    }
    async function closeSomething() {
      const idList = JSON.stringify(status.value.rowIDList);
      const result = {
        stationJson: idList,
        status: false,
      };
      await CNCLinkSet(result);
    }
    async function openSomething() {
      const idList = JSON.stringify(status.value.rowIDList);
      const result = {
        stationJson: idList,
        status: true,
      };
      await CNCLinkSet(result);
    }
    async function getStatusList() {
      const result = await CNCLinkStatus();
      list.value = result;
      status.value.statusList = [];
      status.value.disabledList = [];
      for (let i = 0; i < list.value.length; i++) {
        status.value.statusList[i] = list.value[i].extend.linkStatus;
      }
      for (let i = 0; i < status.value.statusList.length; i++) {
        if (status.value.statusList[i] === undefined) {
          status.value.disabledList[i] = true;
        } else {
          status.value.disabledList[i] = false;
        }
      }
      for (let i = 0; i < status.value.statusList.length; i++) {
        list.value[i].disabledMa = status.value.disabledList[i];
      }
      console.log(status.value.disabledList)
    }
    async function toggleStatus(row: any) {
      status.value.rowIDList=[row.id]
      const id = JSON.stringify(status.value.rowIDList)
        const result = {
          stationJson: id,
          status: row.extend.linkStatus,
        };
        await CNCLinkSet(result);
        await getStatusList()
    }
    const query = async () => {
      const result = await CNCLinkStatus();
      list.value = result;
      console.log(result)
    };
    onMounted(useLoading(loading, async () => {
      // await query();
      await getStatusList();
    }));
    return {
      loading, list, query, toggleStatus, status, getStatusList, handleSelectionChange, openSomething,
      closeSomething,
    };
  },
};
</script>
<style scoped lang="scss">

</style>