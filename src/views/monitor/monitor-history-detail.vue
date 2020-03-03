<template>
  <div v-loading="loading">
    <div class="flex between align-center" style="margin-bottom: 10px">
      <el-button type="primary" icon="el-icon-arrow-left" @click="$router.back()">返回</el-button>
    </div>
    <div v-if="station" style="min-width: 1300px">
      <div class="timeline">
        <v-chart
          style="width:100%; height: 100px"
          autoresize
          :options="timeLine"/>
      </div>
      <div class="time flex center">
        <el-tag type="primary">{{startTimestamp | datetime}}</el-tag>
        <el-slider v-model="slide" :range="true" :disabled="starting" style="width: 70%;margin: 0 20px" :format-tooltip="(val) => formatDateTime(new Date(startTimestamp+(endTimestamp-startTimestamp)*val/100))"/>
        <el-tag type="primary">{{endTimestamp | datetime}}</el-tag>
      </div>
      <div class="flex between" style="width: 100%">
        <div class="watch3">
          <div class="card-header">
            操作台：{{station.name}}
          </div>
          <div v-if="paramsMap" class="monitor-detail-param-all flex wrap">
            <div
              class="monitor-detail--param-item flex between align-center"
              v-for="(param,index) of paramsMap.filter(p => p.available !== false)"
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
            <el-button type="success" @click="open()">开始</el-button>
            <el-button type="danger" @click="close()">停止</el-button>
            <el-radio-group v-model="flag" :disabled="starting">
              <el-radio-button :label="0">通道1</el-radio-button>
              <el-radio-button :label="1">通道2</el-radio-button>
            </el-radio-group>
            <el-button type="primary" plain @click="fullScreen()">全屏</el-button>
          </div>
          <div id="contain"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { ref, onMounted, onUnmounted, watch } from '@vue/composition-api';
  import { router } from '@/main';
  import {leftFill0, sleep, formatDateTime} from 'web-toolkit/src/utils';
  import { useLoading } from 'web-toolkit/src/service';
  import {AnalysisDeviceParam, AnalysisDeviceTime, AnalysisParams} from '@/dao/analysisDao';
  import {statusMap} from '@/utils/device-utils';
  import {timelineConfig, getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';
  import {Message} from 'element-ui';
  import {init, login, startPlayback, stopPlay, fullScreen} from '@/utils/video';
  import {SettingGet} from '@/dao/settingDao';
  import {StationInfo} from "@/dao/stationDao";

  export default {
    setup() {
      const loading = ref(false);
      const over = ref(false);
      const station = ref<any>();
      const device = ref<any>();
      const timeLine = ref<any>();
      const flag = ref<number>(0);
      const modal = ref({
        visible: false,
      });
      const modalVideo = ref<any>({
        szDeviceIdentify: '',
        start: '2020-02-26 07:00:00',
        end: '2020-02-26 14:11:11',
      });
      const videoChannel = ref<any>([null, null]);
      const paramsMap = ref<any>();
      // 时间总范围
      const startTimestamp = ref<any>();
      const endTimestamp = ref<any>();
      // 实际范围
      const start = ref<any>();
      const end = ref<any>();
      // 滑块位置
      const slide = ref<any>([0,100]);
      // 是否在播放
      const starting = ref<any>(false);
      const startingClock = ref<any>();

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
      onMounted(useLoading(loading, async () => {
        if(!router.currentRoute.query.id || !router.currentRoute.query.start || !router.currentRoute.query.end){
          Message.error("页面参数缺失");
          return ;
        }
        startTimestamp.value = parseInt(router.currentRoute.query.start as any);
        endTimestamp.value = parseInt(router.currentRoute.query.end as any);
        if(startTimestamp.value>endTimestamp.value){
          Message.error("页面参数中时间范围错误");
          return ;
        }
        start.value = startTimestamp.value;
        end.value = endTimestamp.value;
        station.value = await StationInfo({id: router.currentRoute.query.id});
        const cameras = station.value.extend.cameras;
        if(cameras && cameras.length>0){
          videoChannel.value[0] = cameras[0].channelId;
          if(cameras.length>1) videoChannel.value[1] = cameras[1].channelId;
        }
        device.value = station.value.deviceList[0];
        if (device.value) {
          const list = await AnalysisDeviceTime({
            start: startTimestamp.value,
            end: endTimestamp.value,
            deviceId: device.value.id,
          });
          timeLine.value = timelineConfig(list, statusMap, { height: 40, dataZoomTop: 70, dataZoom: true, showTime: true });
        }
        // video
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
        open();
      }));
      onUnmounted(() => {
        over.value = true;
        if(startingClock.value){
          clearInterval(startingClock.value);
        }
        stopPlay(0);
      });
      async function open() {
        await stopPlay(0);
        if(videoChannel.value[flag.value]===null || videoChannel.value[flag.value]===undefined){
          return ;
        }
        const msg1 = await startPlayback(0, modalVideo.value.szDeviceIndentify, videoChannel.value[flag.value], formatDateTime(new Date(start.value)), formatDateTime(new Date(end.value)));
        if (msg1) {
          alert(msg1);
        }else{
          starting.value = true;
        }
      }
      async function close(){
        starting.value = false;
        await stopPlay(0);
      }
      async function paramAnalysisMonitor() {
        while (modal.value.visible) {
          await sleep(2500);
        }
      }
      watch(slide, ()=>{
        if(!starting.value){
          // console.log(slide.value)
          const dif = endTimestamp.value-startTimestamp.value;
          start.value = parseInt(slide.value[0]*dif/100+startTimestamp.value);
          end.value = parseInt(slide.value[1]*dif/100+startTimestamp.value);
        }
      });
      watch(starting, ()=>{
        if(starting.value){
          if(startingClock.value){
            clearInterval(startingClock.value);
          }
          startingClock.value = setInterval(function () {
            let arr = [slide.value[0], slide.value[1]];
            start.value = start.value+3000;
            console.log(new Date(start.value));
            let s = parseInt((start.value-startTimestamp.value)*100/(endTimestamp.value-startTimestamp.value) as any);
            if(s>slide.value[1]){
              s=slide.value[1];
            }
            if(start.value >= parseInt((endTimestamp.value-startTimestamp.value)*slide.value[1]/100+startTimestamp.value)){
              close();
              return;
            }
            arr[0] = s;
            slide.value = arr;
            // todo get params
          },3000)
        }else{
          if(startingClock.value){
            clearInterval(startingClock.value);
          }
        }
      });
      return{
        loading, modal,
        station, timeLine, slide,
        query,
        fullScreen,
        videoChannel, flag, paramsMap,
        startTimestamp, endTimestamp,
        start,end, starting,
        open, close, formatDateTime
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
    background-color: rgb(210, 224, 85);
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
  .time{
    margin-bottom: 1rem;
  }

  .el-checkbox{
    color: #303133;
  }
</style>
