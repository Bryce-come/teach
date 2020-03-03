<template>
  <div v-loading="loading">
    <el-form :inline="true">
        <el-form-item label="设备名称:" label-width="80px">
          <el-select v-model="deviceName" multiple :clearable="false" placeholder="请选择设备名称">
            <el-option
              v-for="item of devicesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号:" label-width="80px">
          <el-select v-model="deviceType" multiple :clearable="false" placeholder="请选择设备型号">
            <el-option
              v-for="item of deviceTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>        
        </el-form-item>
        <el-form-item label="发生时间:" label-width="80px">
            <lkt-date-picker v-model="date">
            </lkt-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" style="margin-left: 60px" @click="query()">查询</el-button>
        </el-form-item>
    </el-form>  
    <div> 
    <lkt-table
      :data="deviceAlarmList"
      style="width:100%">
      <el-table-column prop="device.name" label="设备名称"/>
      <el-table-column prop="device.referencedColumnName" label="设备编号"/>
      <el-table-column prop="type" label="报警类型">
          <el-tag slot-scope="{ row }">
            {{(row.type===1? '保养':'')+(row.type===2? '维修':'')+(row.type===0? '巡检':'')}}
          </el-tag>
      </el-table-column>
      <el-table-column prop="position" label="报警来源"/>
      <el-table-column prop="statues" label="设备状态"/>
      <el-table-column prop="occurDt" label="发生时间"/>
      <el-table-column label="操作" width="220px">
        <div slot-scope="{ row }" class="flex column" style="width:100px">
        <el-button type="text" @click="snapshot(row)" style="width:85px">查看详情</el-button>
        <el-tag v-if="row.extend.confirm" type="warning" style="width:85px">已被确认</el-tag>
        </div>
      </el-table-column>
    </lkt-table>
    </div> 
      <kit-dialog-simple
      :modal="modal"
      :no-footer="true"
      width="60%">
      <div class="flex align-center">
        <div style="font-weight: 700;padding: 5px 40px;width:45%" v-if="modal.data.operator">操作人：{{modal.data.operator.name }}</div>
        <div style="text-align: center;font-weight: 600;">问题描述：{{ modal.data.description }}</div>
      </div>
      <div style="width:300px;height:200px;background-color:black;margin:auto">
      </div>
      </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {postService} from 'web-toolkit/src/case-main';
import {isString} from 'web-toolkit/src/utils';
import {timelineConfig} from 'web-toolkit/src/utils/echarts-helper';
import {LktDialog} from 'web-toolkit/src/utils/lkt-dialog';
import {IDeviceAlarmRecord, IParamConfig} from '@/types/beans';
import { EChartOption } from 'echarts';
import {urlMap} from '@/config';
import {statusMap} from '@/utils/device-utils';
import {router} from '@/main';
import { DeviceList, DeviceTypeList } from '@/dao/deviceDao';
import { AlarmRecordConfirm, MonitorAlarm, AlarmDeviceHistory, AlarmMaintenDelay, AlarmUsageList, AlarmUsageLatest } from '@/dao/alarmDao';
export default {
  setup() {
    const loading = ref(false);
    const deviceName = ref<any>();
    const devicesList = ref<any>([]);
    const deviceTypeList = ref<any>([]);
    const deviceType = ref<any>();
    const manager = ref<any>();
    const managerList = ref<any>();
    const deviceAlarmList = ref<any>();
    const date = ref([new Date(Date.now() - 3 * 24 * 3600000), new Date()]);
    const modal = ref<any>({
      visible: false,
      data: {},
    });
    const remove = async (row: any) => {
        Message.success('删除成功');
    };
    const query = async () => {
        deviceAlarmList.value = AlarmDeviceHistory({
          deviceTypeJson:deviceType.value?JSON.stringify(deviceType.value):null,
          devicesJson:deviceName.value?JSON.stringify(deviceName.value):null,
          start: date.value && date.value[0] ? (date.value[0] as Date).getTime() : null,
          end: date.value && date.value[1] ? (date.value[1] as Date).getTime() : null,
        });
        console.log(deviceAlarmList);
    };
    const snapshot = async (row: any) => {
      modal.value.data = row;
      modal.value.visible = true;
    };
    onMounted(useLoading(loading, async () => {
      await query();
      deviceTypeList.value = await DeviceTypeList();
      devicesList.value = await DeviceList({
        types: null,
        start: null,
        end: null,
      });
      // console.log(devicesList.value);
      // console.log(deviceTypeList.value);
    }));
    return{
        loading,
        devicesList,
        deviceName,
        deviceTypeList,
        deviceType,
        manager,
        managerList,
        date,
        deviceAlarmList,
        modal,
        query,
        snapshot,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
