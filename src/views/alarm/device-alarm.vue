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
      <div slot="title" v-if="modal.data.device">{{modal.data.device.name+' - 参数快照'}}</div>
      <div>
        <h4>设备运行时间轴</h4>
        <v-chart autoresize :options="timeChart" style="width: 100%;height: 100px" />
        <h4 style="margin-top: 1rem">参数历史统计</h4>
        <v-chart v-for="(item,index) in paramCharts" :key="'param-chart-'+index+new Date().getTime()" :options="item" style="width: 100%;height: 300px"/>
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
import {AnalysisDeviceTime} from '@/dao/analysisDao';
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
    const paramCharts = ref<EChartOption[]>([]);
    const timeChart = ref<any>();
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
      const dt = new Date(row.createDt).getTime();
      const minutes15 = 15 * 60000;
      const start = dt - minutes15;
      const end = dt + minutes15;
      const list = await AnalysisDeviceTime({
        deviceId: row.device.id,
        start,
        end,
      });
       // console.log(list);
      const time = list.extend ? list.extend.times : [];
      timeChart.value = timelineConfig(time, statusMap, { left: '2%', top: 0, showTime: true, dataZoom: true, confine: true });
      let { data: { list: device } } = await postService(urlMap.params_menu.url, {
        deviceIdJson: `["${row.device.id}"]`,
      });
      device = device && device[0];
      const params: IParamConfig[] = device.extend && device.extend.paramsMenu || [];
      paramCharts.value = [];
      for (const param of params) {
        const { data: { list } } = await postService(urlMap.params_query_by_key.url, {
          deviceId: row.device.id,
          key: param.keyFull,
          start,
          end,
        });
        const timeAndData: any[] = [];
        const tdataMax: any[] = [];
        const tdataMin: any[] = [];
        let min: any;
        let max: any;
        for (const p of list) {
          p.time = new Date(p.time).getTime();
          timeAndData.push([p.time, p.val]);
          if (param.benchmarkMax && p.val) { tdataMax.push([p.time, param.benchmarkMax]); }
          if (param.benchmarkMin && p.val) { tdataMin.push([p.time, param.benchmarkMin]); }
          if (min === undefined || p.val < min) { min = p.val; }
          if (max === undefined || p.val > max) { max = p.val; }
        }
        let yName = param.nameSimple;
        if (param.unit) {
          yName += '(' + param.unit + ')';
        }
        const option: any = {
          tooltip: {
            trigger: 'axis',
          },
          color: [
            '#2269dd',
            '#dd5757',
          ],
          xAxis: {
            min: start,
            max: end,
            type: 'time',
            name: '时间',
            nameGap: 2,
            nameTextStyle: {
              fontSize: 14,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#444',
              },
            },
          },
          yAxis: {
            type: 'value',
            name: yName,
            nameTextStyle: {
              fontSize: 16,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#444',
              },
            },
          },
          dataZoom: [{
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            top: 480,
            borderColor: 'transparent',
            backgroundColor: '#333',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
            handleSize: 20,
            handleStyle: {
              shadowBlur: 6,
              shadowOffsetX: 1,
              shadowOffsetY: 2,
              shadowColor: '#666',
            },
            labelFormatter: '',
          }, {
            type: 'inside',
            filterMode: 'weakFilter',
          }],
          series: [{
            name: param.nameSimple,
            type: 'scatter',
            symbolSize: 3,
            lineStyle: {
              width: 4,
            },
            data: timeAndData,
          }],
        };
        if (min && param.benchmarkMin && param.benchmarkMin < min) { min = param.benchmarkMin; }
        if (max && param.benchmarkMax && param.benchmarkMax > max) { max = param.benchmarkMax; }
        if (max) { option.yAxis.max = max; }
        if (min) { option.yAxis.min = min; }
        if (param.benchmarkMax) {
          option.series.push({
            name: '合格线max',
            type: 'scatter',
            symbolSize: 3,
            lineStyle: {
              width: 4,
            },
            data: tdataMax,
          });
        }
        if (param.benchmarkMin) {
          option.series.push({
            name: '合格线min',
            type: 'scatter',
            symbolSize: 3,
            lineStyle: {
              width: 4,
            },
            data: tdataMin,
          });
        }
        // return option;
        paramCharts.value.push(option);
      }
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
        snapshot: useLoading(loading, snapshot),
        timeChart, paramCharts,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
