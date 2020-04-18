<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:1vw;margin-top:1vw">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
      <div style="color:#28D0F1;font-weight:bold;font-size:1.3rem;margin-left: 1rem">设备运行时间轴</div>
    </div>
    <div class="flex wrap column content"
      style="align-items:flex-start;margin-top:2vh;height:50vh;margin-left:14vh;">
      <div class="device-card flex center" v-for="(item,i) in stationList.slice(sort.up*4,(sort.up+1)*4)" :key="i"
        style="width:18vw;margin-left:1vh;align-items:center;margin-top:1vh" >
        <img class="image" style="width:5vw;height:10vh" :src='ImageLink(item.extend.deviceImg)' alt="">
        <div style="color:#28D0F1;margin-left:1vw;font-size:1.5rem;" class="flex column center">
          <div>{{item.extend.deviceId}}</div>
          <div>
            <el-tag style="margin-bottom: 5px" effect='dark' :type="statusMap(item.extend.status) && statusMap(item.extend.status).tag">{{ statusMap(item.extend.status) && statusMap(item.extend.status).arrName }}</el-tag>
          </div>
        </div>
        <div class="device-time">
          <v-chart
            style="width:20vw; height: 7vh;margin-top: 2vh"
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
import { ref, set} from '@vue/composition-api';
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
  props: {
    stationAll: {
      type: Array,
      default: () => {},
    },
  },
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const stationList = ref<any>([]);
    const chart = ref<any>({});
    const times = ref<any>({});
    const active = ref<boolean>(true);
    const sort = ref<any>({
      up: 0,
      count: 0,
      sum: 0,
    });
    const timeCount = ref<any>({
      timeValue: null,
      timeIf: null,
    });
    async function draw() {
      while (active.value) {
        await fetchTimes();
        await getData();
        await sleep(300000);
      }
    }
    async function tagPage() {
      while (active.value) {
        sort.value.up += 1;
        sort.value.count += 1;
        if (sort.value.count >= sort.value.sum) {
          sort.value.up = 0;
          sort.value.count = 0;
        }
        await sleep(5000);
      }
    }
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
    }
    async function getData() {
      stationList.value = props.stationAll;
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
    }
    async function changeList() {
      if (stationList.value.length > 4) {
        sort.value.up = -1;
        sort.value.count = -1;
        sort.value.sum = stationList.value.length / 4;
        tagPage();
      }
    }
    async function setDate() {
      await getData();
      changeList();
      draw();
    }
    async function init() {
      setDate();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      init,
      loading,
      // timeDiff,
      chart, times, sort,
      stationList,
      ImageLink, timeCount, statusMap,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
