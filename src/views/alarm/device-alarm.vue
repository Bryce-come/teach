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
      <el-table-column prop="device.id" label="设备编号" sortable="custom" width="110"/>
      <el-table-column prop="device.name" label="设备名称" sortable="custom" width="110"/>
      <el-table-column prop="no" label="报警编号" sortable="custom" width="110"/>
      <el-table-column prop="category" label="报警来源" sortable="custom" width="110">
        <template slot-scope="{row}">
          <div>{{ row.category==='device'?'设备采集':'设定规则' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="报警类型" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.type==='normal'?'warning':'danger'">{{ row.type === 'normal' ? '一般' : '严重' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="报警内容" min-width="100"/>
      <!-- <el-table-column label="持续时间" sortable="custom" prop="duration" width="120">
        <template slot-scope="{row}">
          <el-tag type="danger" v-if="row.duration === undefined">报警中</el-tag>
          <div v-else>{{ row.duration | HMS }}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="createDt" label="发生时间" sortable="custom" width="170"/>
      <el-table-column label="操作" align="center" width="120">
        <div slot-scope="{ row }" class="flex column">
          <el-tag v-if="row.extend.confirm" type="warning">已被确认</el-tag>
          <el-button type="primary" size="mini" @click="snapshot(row)">设备参数快照</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    </div> 
      <kit-dialog-simple
      :modal="modal"
      :no-footer="true"
      width="60%">
      <div class="flex align-center">
        <div style="text-align: center;font-weight: 600;">问题描述：{{ modal.data.msg }}</div>
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
        deviceAlarmList.value = await AlarmDeviceHistory({
          deviceTypeJson: deviceType.value ? JSON.stringify(deviceType.value) : null,
          devicesJson: deviceName.value ? JSON.stringify(deviceName.value) : null,
          start: date.value && date.value[0] ? (date.value[0] as Date).getTime() : null,
          end: date.value && date.value[1] ? (date.value[1] as Date).getTime() : null,
        });
        console.log(deviceAlarmList.value);
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
