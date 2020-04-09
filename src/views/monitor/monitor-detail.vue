<template>
  <div v-loading="loading">
    <div class="flex between align-center" style="margin-bottom: 10px">
      <el-button type="primary" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
      <div v-if="station" class="flex center align-center" style="font-size: 1.2rem;margin-right: 10%">
        <div style="margin-right: 10px">操作台名称：{{station.name}}</div>
        <el-tag
          v-if="device && device.extend && device.extend.status"
          style="margin-bottom: 5px"
          :type="statusMap(device.extend.status) && statusMap(device.extend.status).tag">{{ statusMap(device.extend.status) && statusMap(device.extend.status).arrName }}</el-tag>
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
    <div v-if="station" style="min-width: 1300px">
      <div class="timeline">
        <v-chart
          style="width:100%; height: 100px"
          autoresize
          :options="timeLine"/>
      </div>
      <div class="flex between" style="width: 100%">
        <div class="watch3">
          <div class="card-header">
            实时参数列表
            <el-button style="margin: 0 10px" type="success" size="mini" :disabled="disabled" @click="setAnalysisParam">显示参数实时曲线</el-button>
            <el-button type="danger" size="mini" plain @click="clearSelect">清空选择</el-button>
          </div>
          <div v-if="device" class="monitor-detail-param-all flex wrap">
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
          <div v-else class="flex center" style="font-size: 1.2em;color: grey">无数据</div>
        </div>
        <div style="min-width: 900px;width: 58%">
          <div class="flex little-space center">
            <el-button type="success" :plain="flag!==1" @click="restartVideo(videoChannel[0],1)">通道1</el-button>
            <el-button type="success" :plain="flag!==2" @click="restartVideo(videoChannel[1],2)">通道2</el-button>
            <el-button type="primary" plain @click="fullScreen()">全屏</el-button>
          </div>
          <div id="contain" v-loading="loadingCamera"></div>
          <div class="flex center little-space"><el-button type="primary" @click="connectPC()">连接学生屏幕</el-button></div>
          <div class="watch2">
            <iframe v-if="pcIp" id="iframe" name="iframe" :src="'http://'+pcIp+':9000'" style="width:100%;height:100%"></iframe>
          </div>
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
import {leftFill0, sleep, formatTime} from 'web-toolkit/src/utils';
import { useLoading } from 'web-toolkit/src/service';
import {MonitorStationDetail} from '@/dao/monitorDao';
import {AnalysisDeviceParam, AnalysisDeviceTime, AnalysisParams} from '@/dao/analysisDao';
import {CourseRecordInClass} from '@/dao/courseRecordDao';
import {statusMap} from '@/utils/device-utils';
import {timelineConfig, getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';
import {Message} from 'element-ui';
import {init, login, startRealPlay, stopPlay, fullScreen} from '@/utils/video';
import {SettingGet} from '@/dao/settingDao';

export default {
  setup() {
    const loading = ref(false);
    const loadingCamera = ref(false);
    const over = ref(false);
    const station = ref<any>();
    const device = ref<any>();
    const courseRecord = ref<any>();
    const timeLine = ref<any>();
    const line1 = ref<any>(null);
    const disabled  = ref(true);
    const flag = ref<number>(1);
    const paramNameString = ref('');
    const refreshTime = ref('5分钟');
    const checkList = ref([]);
    const datetimeRange = ref<any>([]);
    const refreshTimeRatio = ref(false);
    const modal = ref({
      visible: false,
    });
    const modalVideo = ref<any>({
      szDeviceIdentify: '',
      start: '2020-02-26 07:00:00',
      end: '2020-02-26 14:11:11',
    });
    const videoChannel = ref<any>([null, null]);
    const pcIp = ref<any>();

    const query = async () => {
      while (!over.value) {
        await sleep(2000);
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
    function connectPC() {
      const pcs = station.value.extend.PCs;
      if (pcs && pcs.length > 0) {
        pcIp.value = pcs[0].PCIP;
      } else {
        Message.error('无PC配置');
      }
    }
    async function initVideo(){
      // video
      loadingCamera.value = true;
      const setting = await SettingGet({onlyNVR: true});
      modalVideo.value.ip = setting.nvrIp;
      modalVideo.value.port = setting.nvrPort;
      modalVideo.value.username = setting.nvrUsername;
      modalVideo.value.pwd = setting.nvrPwd;
      await init('contain', 1);
      modalVideo.value.szDeviceIndentify = modalVideo.value.ip + '_' + modalVideo.value.port;
      const msg = await login(modalVideo.value.ip, modalVideo.value.port, modalVideo.value.username, modalVideo.value.pwd);
      if (msg) {
        alert(msg);
        return ;
      }
      loadingCamera.value = false;
      startVideo(null);
    }
    onMounted(useLoading(loading, async () => {
      await Promise.all([
        courseRecord.value = await CourseRecordInClass(),
        station.value = await MonitorStationDetail({stationId: router.currentRoute.params.id}),
      ]);
      const cameras = station.value.extend.cameras;
      if (cameras && cameras.length > 0) {
        videoChannel.value[0] = cameras[0].channelId;
        if (cameras.length > 1) { videoChannel.value[1] = cameras[1].channelId; }
      }
      if (courseRecord.value && courseRecord.value.stationBind && courseRecord.value.stationBind[station.value.id.toString()]) {
        station.value.extend.students = courseRecord.value.stationBind[station.value.id.toString()];
      }
      device.value = station.value.deviceList[0];
      if (device.value) {
        const d1 = new Date();
        d1.setHours(d1.getHours() - 1);
        const { list } = await AnalysisDeviceTime({
          start: courseRecord.value ? new Date(courseRecord.value.startDt).getTime() : d1.getTime(),
          end: new Date().getTime(),
          deviceId: device.value.id,
        });
        timeLine.value = timelineConfig(list, statusMap, { height: 40, dataZoomTop: 70, dataZoom: true, showTime: true });
        query();
      }
      initVideo();
    }));
    onUnmounted(() => {
      over.value = true;
      stopVideo();
    });
    async function startVideo(id: any) {
      if (id === undefined || id === null) { id = videoChannel.value[0]; }
      if (id === undefined || id === null) { return ; }
      const msg1 = await startRealPlay(0, modalVideo.value.szDeviceIndentify, id);
      // const msg2 = await startRealPlay(1,modalVideo.value.szDeviceIndentify,1);
      if (msg1) {
        alert(msg1);
      }
    }
    async function stopVideo() {
      await stopPlay(0);
    }
    async function restartVideo(id: any, f: number) {
      flag.value = f;
      await stopVideo();
      if (id) { await startVideo(id); }
    }
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
      const list = await AnalysisParams({
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
        let str = '';
        for (const p of list[0].paramConfigs) {
          str += p.nameSimple + ' | ';
        }
        paramNameString.value = str.slice(0, -3);
      }
    }
    return{
      loading, loadingCamera, courseRecord, modal,
      station, timeLine,
      query,
      timeDiff,
      line1,
      datetimeRange, device,
      setAnalysisParam: useLoading(loading, setAnalysisParam),
      queryParamAnalysis: useLoading(loading, queryParamAnalysis),
      checkList, disabled,
      isAbled, clearSelect, paramNameString, refreshTime, refreshTimeRatio,
      restartVideo, fullScreen,
      videoChannel, flag, statusMap,
      pcIp, connectPC,
    };
  },
};
</script>
<style scoped lang="scss">
  #contain{
    width: 100%;
    height: 500px;
    margin-bottom: 10px;
  }
 .watch2 {
   width: 100%;
   height: 500px;
   background-color: rgb(204, 207, 209);
 }
 .watch3 {
   margin-right: 10px;
   width: 40%;
   min-width: 500px;
   background-color: white;
   border-radius: 10px;
   box-shadow: 0 0 5px 0 rgba(0,0,0,.2);
   .monitor-detail--param-item {
     width:40%;
     height: auto;
     padding: 3px 0px;
     margin-left: 3%;
     margin-right: 4%;
   }
   .monitor-detail-param-all{
     width: 100%;
   }
 }
  .timeline{
    margin: 10px 0;
  }

  .el-checkbox{
    color: #303133;
  }
</style>
