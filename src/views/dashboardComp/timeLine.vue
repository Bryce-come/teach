<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="justify-content:space-around;width:8vw;margin-left:1vw;margin-top:1vw">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.5rem"></div>
      <div style="color:#28D0F1;font-weight:bold;font-size:1rem;">设备运行时间轴</div>
    </div>
    <div class="flex center wrap column content" style="margin-top:-1vh;overflow:hidden;height:27vh;width:30vw;margin-left:2vw;">
      <div class="device-card flex center" style="width:18vw;margin-left:1vw;" v-for="(item,i) in stationList" :key="i">
        <div
          class="flex align-center center" style="margin-top:1vh;">
          <div class="device-img">
            <img class="image" style="width:5vw;height:10vh" :src='ImageLink(item.extend.deviceImg)' alt="">
          </div>
        </div>
        <div style="color:#28D0F1;margin-left:1vw;font-size:1rem;">{{item.extend.deviceId}}</div>
        <div class="device-time">
          <v-chart
            style="width:20vw; height: 5vh"
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
        <div style="color:#28D0F1;margin-left:1vw;font-size:1rem;">{{'fanuc0'+(i+3)}}</div>
        <div class="device-time">
          <v-chart
            style="width:20vw; height: 5vh"
            autoresize
            :options="times[item.extend.deviceId]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { leftFill0 } from 'web-toolkit/src/utils';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { ImageLink } from '@/dao/commonDao';
import { MonitorStationList } from '@/dao/monitorDao';
import { MonitorStationDetail} from '@/dao/monitorDao';
import { AnalysisDeviceParam, AnalysisDeviceTime, AnalysisParams } from '@/dao/analysisDao';
import { sleep } from 'web-toolkit/src/utils';
import { NewsList } from '@/dao/newsDao';
import { AnalysisDeviceTimes } from '@/dao/analysisDao';
import { timelineConfig, getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';

export default {
  name: 'timeLine',
  setup() {
    const loading = ref(false);
    const courseRecord = ref<any>();
    const stationList = ref<any>([]);
    const chart = ref<any>({});
    const times = ref<any>({});

    const percentage = () => {
      const now = new Date().getTime();
      const start = new Date(courseRecord.value.startDt).getTime();
      const end = new Date(courseRecord.value.endDt).getTime();
      let ratio = 100 * (now - start) / (end - start);
      if (ratio > 100) { ratio = 100; }
      return parseInt(ratio.toFixed(0));
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
    function countTime(this: any) {
      timeCount.value.timeValue = timeDiff(new Date(courseRecord.value.endDt));
      if (new Date(timeCount.value.timeIf) <= new Date() ) {
        clearInterval(timer);
      }
    }
    const timeCount = ref<any>({
      timeValue: null,
      timeIf: null,
    });
    const timer = setInterval(countTime, 5000);
    function summaryHandle(summary: any, key: string) {
      if (summary[key]) {
        summary[key] = summary[key] + 1;
      } else {
        summary[key] = 1;
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
        times.value[d.id] = timelineConfig(time, statusMap, { height: 30, dataZoom: false, showTime: true});
        times.value[d.id].xAxis.axisLabel = {
          show: true,
          textStyle: {
            color: '#28D0F1',
          },
        };
      }
    }
    onUnmounted(() => {
        clearInterval(timer);
    });
    async function init() {
      await Promise.all([
        courseRecord.value = await CourseRecordInClass(),
        stationList.value = await MonitorStationList(),
      ]);
      if (courseRecord.value === undefined) {
        clearInterval(timer);
      } else {
        timeCount.value.timeIf = courseRecord.value.endDt;
      }
      const data = [];
      const summary: any = {};
      for (const station of stationList.value) {
        if (!station.deviceList || station.deviceList.length === 0) {
          summaryHandle(summary, 'offline');
          station.extend.status = 'offline';
        } else {
          const device = station.deviceList[0];
          if (device.extend.status) {
            summaryHandle(summary, device.extend.status);
          } else {
            summaryHandle(summary, 'offline');
          }
          station.extend.status = device.extend.status;
          // 数据二次处理
          station.extend.deviceId = device.id;
          station.extend.deviceImg = device.deviceType.img;
          if (courseRecord.value && courseRecord.value.stationBind && courseRecord.value.stationBind[station.id.toString()]) {
            station.extend.students = courseRecord.value.stationBind[station.id.toString()];
          }
        }
      }
      for (const key of Object.keys(summary)) {
        data.push({
          name: statusMap(key).arrName,
          itemStyle: {
            color: statusMap(key).color,
          },
          value: summary[key],
        });
      }
      chart.value = {
        series: [{
          name: '设备数量',
          type: 'pie',
          data,
          radius: 50,
          label: {
            formatter: '{b}：{c}',
            fontSize: 14,
          },
        }],
      };
      // todo times的异步动态添加无效
      await fetchTimes();
      timer;
    }
    return {
      init,
      loading, courseRecord,
      timeDiff, chart, times,
      stationList, countTime,
      ImageLink, timeCount, timer,
      percentage, statusMap,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
