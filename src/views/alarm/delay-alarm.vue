<template>
  <div v-loading="loading">
    <!-- <el-form class="flex little-space" label-width="120px" label-position="left">
      <el-form-item label="提前提醒时间：">
        <el-input-number v-model="limit.days"/>
        <span style="margin:0 30px 0 10px">天</span>
        <el-button type="primary" @click="queryManually">查询</el-button>
      </el-form-item>
    </el-form> -->
    <lkt-table :data="list" stripe>
      <el-table-column prop="device.name" label="设备名称"/>
      <el-table-column label="设备编号" prop="device.id" sortable="custom" min-width="110"/>
      <el-table-column label="设备类型" prop="device.deviceType.name" sortable="custom" min-width="110"/>
      <el-table-column label="生产产商" prop="extend.productorName" sortable="custom" min-width="150"/>
      <el-table-column label="购买时间" prop="extend.productDt" sortable="custom" min-width="100">
      </el-table-column>
      <el-table-column label="距到期时间" align="center" sortable="custom" width="130">
        <div class="flex center" slot-scope="{row}">
          <el-tag v-if="row.nextDt" type="danger">过期{{parseInt((new Date().getTime()-new Date(row.nextDt).getTime())/(24*3600*1000))}} 天</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <el-button size="mini" type="success"  @click="$router.push({name:'equipmentMaintenance'})">查看</el-button>
      </el-table-column>
    </lkt-table>
  </div>
</template>
<script lang='ts'>
import { ref, computed, onMounted } from '@vue/composition-api';
import {useConfirm, useLoading} from 'web-toolkit/src/service';
import {postService, storeUserInfo} from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { Filter } from '@/types/filter';
import { AlarmRecordConfirm, MonitorAlarm, AlarmDeviceHistory, AlarmMaintenDelay, AlarmUsageList, AlarmUsageLatest } from '@/dao/alarmDao';
export default {
  setup() {
    const loading = ref(false);
    const limit = ref({
      days: 30,
    });
    const list = ref<any>();
    const queryManually = async () => {
      list.value = await AlarmMaintenDelay();
      };
    const confirm = async (row: any) => {
    };
    const exportExcel = async () => {};
    onMounted(useLoading(loading, async () => {
      await queryManually();
    }));
    return{
      // filter,
      loading,
      limit,
      list,
      queryManually: useLoading(loading, queryManually),
      exportExcel: useLoading(loading, exportExcel),
      confirm: useConfirm('确认不再提醒？', useLoading(loading, confirm)),
    };
  },
};
</script>
