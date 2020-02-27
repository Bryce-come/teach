<template>
  <div v-loading="loading">
    <div class="flex between align-center" style="margin-bottom: 10px">
      <el-button type="primary" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      <div v-if="station" class="flex center" style="font-size: 1.2rem;margin-right: 10%">
        <div>操作台名称：{{station.name}}</div>
        <div style="margin-left: 2rem">
          <span>学生：</span>
          <span v-if="!station.extend.students || station.extend.students.length===0">无</span>
          <el-tag
            v-else
            style="margin-right: 5px"
            v-for="s of station.extend.students"
            :key="s.id" type="primary" size="small" >{{s.name}}</el-tag>
        </div>
      </div>
    </div>
    <div v-if="station">
      <div class="flex align-center between">
        <div class="watch1">
        </div>
        <div class="watch2">
        </div>
      </div>
      <div class="timeline">
        <v-chart
          style="width:100%; height: 70px"
          autoresize
          :options="timeLine"/>
      </div>
      <div class="flex align-center between">
        <div class="watch3">
          <div v-if="device">
            <div class="card-header">
              实时参数列表
              <el-button style="margin: 0 10px" type="success" size="mini" :disabled="disabled" @click="setAnalysisParam">显示参数实时曲线</el-button>
              <el-button type="danger" size="mini" plain @click="clearSelect">清空选择</el-button>
            </div>
            <div class="monitor-detail-param-all flex wrap">
              <div
                class="monitor-detail--param-item flex between align-center"
                v-for="(param,index) of device.extend.paramsMap.filter(p => p.available !== false)"
                :key="index"
                :style="{ cursor: param.showAnalysis ? 'pointer' : 'default' }"
                @change="isAbled()">
                <el-checkbox-group v-if="param.showAnalysis" class="flex little-space" style="padding: 5px 20px" v-model="checkList">
                  <el-checkbox
                    style="min-width: 50%;"
                    :label="param.keyFull">
                    <span>{{ param.nameSimple }}：</span>
                  </el-checkbox>
                </el-checkbox-group>
                <span v-else style="min-width: 50%;color:#303133;padding: 5px 40px">{{ param.nameSimple }}：</span>
                <div style="text-align: center;color: #014cff;font-weight: 600;">{{ param.value }}</div>
              </div>
            </div>
          </div>
          <div v-else class="flex" style="font-size: 1.1em">无数据</div>
        </div>
        <div class="watch2">
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="modal.visible" width="70%">
      <div slot="title" style="font-size: 1.1rem;text-align: center">
        <span style="color: #00aaee">参数实时曲线：</span>
        <span>{{paramNameString}}</span>
      </div>
      <div class="flex center little-space">
        <div>统计范围: </div>
        <el-radio-group v-model="refreshTime" size="medium" @change="refreshTimeRatio=true">
          <el-radio-button label="5分钟"/>
          <el-radio-button label="10分钟"/>
          <el-radio-button label="30分钟"/>
        </el-radio-group>
      </div>
      <div class="flex column center between" style="height: 400px">
        <v-chart autoresize :options="line1" style="width: 100%; height: 100%"/>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, onUnmounted, watch } from '@vue/composition-api';
import { router } from '@/main';
import {leftFill0,sleep, formatTime} from 'web-toolkit/src/utils';
import { useLoading } from 'web-toolkit/src/service';
import {MonitorStationDetail} from "@/dao/monitorDao";
import {AnalysisDeviceParam, AnalysisDeviceTime, AnalysisParams} from "@/dao/analysisDao";
import {CourseRecordInClass} from "@/dao/courseRecordDao";
import {statusMap} from "@/utils/device-utils";
import {timelineConfig,getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';
import {Message} from 'element-ui';

export default {
  setup() {
    const loading = ref(false);
    const over = ref(false);
    const station = ref<any>();
    const device = ref<any>();
    const courseRecord = ref<any>();
    const timeLine = ref<any>();
    const line1= ref<any>(null);
    const disabled  = ref(true);
    const count = ref(0);
    const paramNameString = ref('');
    const refreshTime = ref('5分钟');
    const checkList = ref([]);
    const datetimeRange = ref<any>([]);
    const refreshTimeRatio = ref(false);
    const modal = ref({
      visible: false,
    });

    const query = async () => {
      while (!over.value) {
        await sleep(1500);
        const data = await AnalysisDeviceParam({
          deviceId: device.value.id,
        });
        for (const key of Object.keys(data.record)) {
          (device.value as any).extend[key] = data.record[key];
        }
        if (data.status) {
          (device.value as any).extend.status = data.status;
        }
      }
    };
    const timeDiff = (time2: any) => {
      if (!time2) { return ; }
      const dateDiff = time2.getTime() - new Date().getTime();
      const hours = Math.floor(dateDiff / (3600 * 1000));
      const leave1 = dateDiff % (3600 * 1000);
      const minutes = Math.floor(leave1 / (60 * 1000));
      const leave2 = leave1 % (60 * 1000);     // 计算分钟数后剩余的毫秒数
      const seconds = Math.round(leave2 / 1000);
      return leftFill0(hours) + ' : ' + leftFill0(minutes) + ' : ' + leftFill0(seconds);
    };
    onMounted(useLoading(loading, async () => {
      await Promise.all([
        courseRecord.value = await CourseRecordInClass(),
        station.value = await MonitorStationDetail({stationId: router.currentRoute.params.id})
    ]);
      if (station.value.stationBind && station.value.stationBind[station.value.id.toString()]) {
        station.value.extend.students = station.value.stationBind[station.value.id.toString()];
      }
      device.value = station.value.deviceList[0];
      if(device.value){
        const d1 = new Date();
        d1.setHours(d1.getHours() - 1);
        const list = await AnalysisDeviceTime({
          start: courseRecord.value?new Date(courseRecord.value.startDt).getTime():d1.getTime(),
          end: new Date().getTime(),
          deviceId: device.value.id,
        });
        timeLine.value = timelineConfig(list, statusMap, { height: 30, dataZoom: false, showTime: true });
        query();
      }

    }));
    onUnmounted(() => {
      over.value = true;
    });
    async function paramAnalysisMonitor() {
      while (modal.value.visible) {
        await sleep(2500);
        await queryParamAnalysis();
      }
    }
    async function setAnalysisParam() {
      // analysisParam.value = param;
      paramNameString.value = '';
      refreshTime.value = '5分钟';
      line1.value = null;
      await queryParamAnalysis();
      modal.value.visible = true;
      paramAnalysisMonitor();
    }
    async function isAbled() {
      disabled.value = checkList.value.length === 0;
    }
    function clearSelect() {
      checkList.value = [];
      isAbled();
    }
    function getOption() {
      return {
        legend: {
          show: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            if (params.length === 0) { return ''; }
            let res = '';
            const date = new Date(params[0].data.value[0]);
            res += '<div>' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + formatTime(date) + '</div>';
            for (const p of params) {
              res += `${p.marker}<span>${p.seriesName}: ${p.data.value[1]}</span><br/>`;
            }
            return res;
          },
        },
        color: getColors(),
        xAxis: {
          type: 'time',
          name: '时间',
          nameGap: 2,
          nameTextStyle: {
            color: getColor(),
            fontSize: 14,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: getColor(),
            },
          },
        },
        yAxis: {
          type: 'value',
          name: '',
          nameTextStyle: {
            color: getColor(),
            fontSize: 16,
          },
          axisLine: {
            lineStyle: {
              color: getColor(),
            },
          },
          splitLine: {
            show: false,
          },
        },
        grid: {
          bottom: '15%',
        },
        dataZoom: [
          {
            type: 'inside',
            filterMode: 'weakFilter',
          },
        ],
        series: [],
      };
    }
    // todo 控制台中有个错误
    async function queryParamAnalysis() {
      let dif: number = 300000;
      if (refreshTime.value === '10分钟') {
        dif = 10 * 60 * 1000;
      } else if (refreshTime.value === '30分钟') {
        dif = 30 * 60 * 1000;
      } else if (refreshTime.value === '1小时') {
        dif = 60 * 60 * 1000;
      }
      const now = Date.now();
      datetimeRange.value = [new Date(now - dif), new Date()];
      const range = datetimeRange.value;
      if (!range || !range[0] || !range[1]) {
        Message.error('请选择时间范围');
        return;
      }
      if (range[1] < range[0]) {
        Message.error('开始时间必须小于结束时间');
        return;
      }
      const allParams: any[] = [{
        deviceId: (device.value as any).id,
        keys: checkList.value,
      }];
      let list = await AnalysisParams({
        paramsJson: JSON.stringify(allParams),
        start: range[0].getTime(),
        end: range[1].getTime(),
        sampleNum: 2000,
      });
      const series: any[] = [];
      for (const dataset of list) {
        const paramsDataMap: any = {};
        for (const dataItem of dataset.data) {
          const time = dataItem.time;
          const keys = Object.keys(dataItem).filter(key => key !== 'time');
          for (const key of keys) {
            paramsDataMap[key]
              ? (paramsDataMap[key].push({name: time.toString(), value: [time, dataItem[key]]}))
              : (paramsDataMap[key] = [{name: time.toString(), value: [time, dataItem[key]]}]);
          }
        }
        for (const param of dataset.paramConfigs) {
          const data = paramsDataMap[(device.value as any).id + '.' + param.keyFull] || [];
          if (line1.value === null || refreshTimeRatio.value) {
            series.push({
              name: `${param.nameSimple}`,
              type: 'line',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: { width: 2 },
              hoverAnimation: false,
              data,
            });
          } else {
            (line1.value as any).series.find((x: any) => x.name === param.nameSimple).data = data;
          }
        }
      }
      if (line1.value === null || refreshTimeRatio.value) {
        refreshTimeRatio.value = false;
        const option: any = getOption();
        if (list[0]!.paramConfigs!.length === 1) {
          option.yAxis.name = `${list[0].paramConfigs[0].nameSimple}${list[0].paramConfigs[0].unit ? '/' + list[0].paramConfigs[0].unit : ''}`;
        }
        option.series = series;
        line1.value = option;
        let tt = JSON.stringify(line1.value);
        console.log(tt)
        console.log(tt.indexOf('in'))
        console.log(tt.substring(tt.indexOf('in')))
        let str = '';
        for (const p of list[0].paramConfigs) {
          str += p.nameSimple + ' | ';
        }
        paramNameString.value = str.slice(0, -3);
      }
    }
    return{
      loading, courseRecord, modal,
      station, timeLine,
      query,
      timeDiff,
      line1,
      datetimeRange, device,
      setAnalysisParam: useLoading(loading, setAnalysisParam),
      queryParamAnalysis: useLoading(loading, queryParamAnalysis),
      checkList, disabled,
      isAbled, clearSelect, paramNameString, refreshTime, refreshTimeRatio,
    };
  },
};
</script>
<style scoped lang="scss">
 .watch1 {
   width: 49%;
   margin-right: 20px;
   height: 20rem;
   background-color: darkcyan;
 }
  .watch2 {
   width: 49%;
   height: 20rem;
   background-color: rgb(210, 224, 85);
 }
 .watch3 {
   width: 49%;
   background-color: rgb(242, 243, 237);
   margin-right: 20px;
   .param-item{
     width: 47%;
     margin-left: 10px;
   }
 }
  .timeline{
    margin: 10px 0;
  }
 .monitor-detail--param-item {
   width:40%;
   height: auto;
   padding: 3px 10px;
   margin-left: 4%;
   margin-right: 6%;
 }
 .monitor-detail-param-all{
   width: 100%;
 }
  .el-checkbox{
    color: #303133;
  }
</style>
