<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:1vw;margin-top:1vw">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
      <div style="color:#28D0F1;font-weight:bold;font-size:1.3rem;margin-left: 1rem">设备运行时间轴</div>
    </div>
    <div class="flex center wrap column content" style="margin-top:-1vh;overflow:hidden;height:27vh;width:30vw;margin-left:2vw;">
      <div class="device-card flex center" style="width:18vw;margin-left:1rem;" v-for="(item,i) in stationList" :key="i">
        <div
          class="flex align-center center" style="margin-top:1vh;">
          <div class="device-img">
            <img class="image" style="width:5vw;height:10vh" :src='ImageLink(item.extend.deviceImg)' alt="">
          </div>
        </div>
        <div style="color:#28D0F1;margin-left:1vw;font-size:1.5rem;">{{item.extend.deviceId}}</div>
        <div class="device-time">
          <v-chart
            style="width:22vw; height: 6vh"
            autoresize
            :options="times[item.extend.deviceId]"/>
        </div>
      </div>
    </div>
    <div class="flex center wrap column content" style="margin-top:-3vh;overflow:hidden;height:25vh;width:30vw;margin-left:2vw;">
      <div class="device-card flex center" style="width:18vw;margin-left:1vw;" v-for="(item,i) in stationList" :key="i">
        <div
          class="flex align-center center" style="margin-top:1vh;">
          <div class="device-img">
            <img class="image" style="width:5vw;height:10vh" :src='ImageLink(item.extend.deviceImg)' alt="">
          </div>
        </div>
        <div style="color:#28D0F1;margin-left:1vw;font-size:1.5rem;">{{'fanuc0'+(i+3)}}</div>
        <div class="device-time">
          <v-chart
            style="width:22vw; height: 6vh"
            autoresize
            :options="times[item.extend.deviceId]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, onBeforeUpdate } from '@vue/composition-api';
import { leftFill0 } from 'web-toolkit/src/utils';
import { ref,set} from '@vue/composition-api';
import { statusMap } from '@/utils/device-utils';
import { ImageLink } from '@/dao/commonDao';
import { MonitorStationList } from '@/dao/monitorDao';
import { MonitorStationDetail} from '@/dao/monitorDao';
import { AnalysisDeviceParam, AnalysisDeviceTime, AnalysisParams } from '@/dao/analysisDao';
import { sleep } from 'web-toolkit/src/utils';
import { AnalysisDeviceTimes } from '@/dao/analysisDao';
import { timelineConfig, getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';

export default {
  name: 'timeLine',
  setup() {
    const loading = ref(false);
    const stationList = ref<any>([]);
    const chart = ref<any>({});
    const times = ref<any>({});

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
    const timeCount = ref<any>({
      timeValue: null,
      timeIf: null,
    });
    async function fetchTimes() {
      const d2 = new Date();
      const d1 = new Date();
      d1.setHours(d1.getHours() - 1);
      const list = await AnalysisDeviceTimes({
        start: d1.getTime(),
        end: d2.getTime(),
        needSummary: false,
      });
      for (const d of list) {
        const time = d.extend.times || [];
        set(times.value, d.id, timelineConfig(time, statusMap, { height: 40, dataZoom: false, showTime: true}));
        times.value[d.id].xAxis.axisLabel = {
          show: true,
          textStyle: {
            color: '#28D0F1',
          },
        };
      }
      console.log(times.value)
    }
    async function init() {
      stationList.value = await MonitorStationList();
      const data = [];
      const summary: any = {};
      for (const station of stationList.value) {
        if (!station.deviceList || station.deviceList.length === 0) {
          station.extend.status = 'offline';
        } else {
          const device = station.deviceList[0];
          station.extend.status = device.extend.status;
          // 数据二次处理
          station.extend.deviceId = device.id;
          station.extend.deviceImg = device.deviceType.img;
        }
      }
      await fetchTimes();
    }
    // onBeforeUpdate( async () => {
    //   await init()
    // });
    return {
      init,
      loading,
      timeDiff, chart, times,
      stationList,
      ImageLink, timeCount, statusMap,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
