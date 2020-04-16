<template>
  <div class="backwall max-width" v-loading="loading">
    <div class="flex" style="justify-content:space-around;align-items:center;height:12vh">
      <div id="timeBoard" class="flex column center" style="width:12vw">
        <div>{{timeBoard.time}}</div>
        <div class="flex center">
          <div>{{timeBoard.month}}</div><div>{{timeBoard.day}}</div>
        </div>
      </div>
      <div id="weatherBoard" class="flex" style="justify-content:space-around;align-items:center;width:12vw">
        <weather ref="weather" style="width:19vw"/>
      </div>
      <div id="mainTitle" class="flex center" style="color:#28D0F1;font-size:3.5rem;font-weight:bold;width:33vw">
        教学实训数据展示平台
      </div>
      <div id="timeOn" style="margin-left:-5vh">
        <dayTimeOn ref="dayTimeOn"/>
      </div>
      <stateCount :stationAll="stationAll" ref="stateCount" style="width:20vw"/>
    </div>
    <hr style="color:#28D0F1;">
    <div class="flex" style="height:84vh;justify-content:space-around;">
      <div class="flex column" style="width:32vw;height:84vh;">
        <useTime ref="useTime" class="bk" style="width:32vw;height:30vh;margin-top:1vh"/>
        <useCount ref="useCount" class="bk" style="width:32vw;height:30vh;margin-top:1vh"/>
        <div class="flex" style="margin-top:1vh">
          <timeOn ref="timeOn" class="bk" style="width:16vw;height:24vh"/>
          <onTimeWeek ref="onTimeWeek" class="bk" style="width:15vw;height:24vh;margin-left:2vh"/>
        </div>
      </div>
      <div class="flex column" style="height:84vh;">
        <iframe id="iframe" name="iframe" :src="'http://192.168.0.130:9000'" style="margin-top:1vh;width:33vw;height:40vh"></iframe>
        <parameter :stationAll="stationAll" ref="parameter" style="width:33vw;height:48vh;margin-top:1vh"/>
      </div>
      <div class="flex column" style="height:87vh;">
        <div class="bk" style="width:33vw;height:32vh;margin-top:1vh">
          <news ref="news" style="width:100%;height:100%"/>
        </div>
        <div class="bk" style="width:33vw;height:54vh;margin-top:1vh">
          <timeLine :stationAll="stationAll" ref="timeLine" style="width:100%;height:100%"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent} from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import { updateStoreUserInfo} from 'web-toolkit/src/case-main';
import {scheme} from '@/config';
import {sleep} from 'web-toolkit/src/utils/index';
import {Login} from '@/dao/userDao';
import stateCount from '@/views/dashboard/components/dashboardComp/stateCount.vue';
import useTime from '@/views/dashboard/components/dashboardComp/useTime.vue';
import useCount from '@/views/dashboard/components/dashboardComp/useCount.vue';
import timeOn from '@/views/dashboard/components/dashboardComp/timeOn.vue';
import onTimeWeek from '@/views/dashboard/components/dashboardComp/onTimeWeek.vue';
import parameter from '@/views/dashboard/components/dashboardComp/parameter.vue';
import news from '@/views/dashboard/components/dashboardComp/news.vue';
import timeLine from '@/views/dashboard/components/dashboardComp/timeLine.vue';
import weather from '@/views/dashboard/components/dashboardComp/weather.vue';
import dayTimeOn from '@/views/dashboard/components/dashboardComp/dayTimeOn.vue';
import { MonitorStationList } from '@/dao/monitorDao';

export default createComponent({
  components: { stateCount, useTime, useCount, timeOn, onTimeWeek, parameter, news, timeLine, weather, dayTimeOn},
  setup() {
    const loading = ref(false);
    const timeBoard = ref<any>({
      now: undefined,
      time: undefined,
      month: undefined,
      day: undefined,
    });
    const week = ['日', '一', '二', '三', '四', '五', '六'];
    const stateCount = ref<any>();
    const useTime = ref<any>();
    const useCount = ref<any>();
    const timeOn = ref<any>();
    const onTimeWeek = ref<any>();
    const parameter = ref<any>();
    const news = ref<any>();
    const timeLine = ref<any>();
    const weather = ref<any>();
    const dayTimeOn = ref<any>();
    const active = ref<boolean>(true);
    const stationAll = ref<any>();

    async function getStationAll() {
      stationAll.value = await MonitorStationList();
      console.log(stationAll.value)
    }
    async function setStationAll() {
      while (active.value) {
        await getStationAll();
        await sleep(180000);
      }
    }
    function getTimeBoard() {
      const str = new Date();
      timeBoard.value.time = str.toTimeString().slice(0, 8);
      timeBoard.value.month = (str.getMonth() + 1) + '月' + str.getDate() + '日';
      timeBoard.value.day = '星期' + week[str.getDay()];
    }
    async function setTimeBoard() {
      while (timeBoard) {
        await getTimeBoard();
        await sleep(2000);
      }
    }
    function getTimeOn() {
      const str = new Date();
      timeBoard.value.timeOn = (str.getHours() - 8) * 2;
    }
    onMounted(useLoading(loading, async () => {
      setStationAll();
      const data = await Login( {
          username: '@dashboard',
          pwd: '666666',
          schema: scheme,
      });
      updateStoreUserInfo(data);
      setTimeBoard();
      parameter.value.init0();
      stateCount.value.init();
      useTime.value.init();
      useCount.value.init();
      timeOn.value.init();
      onTimeWeek.value.init();
      news.value.init();
      timeLine.value.init();
      weather.value.init();
      dayTimeOn.value.init();
    }));
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, timeBoard, dayTimeOn, stationAll,
      stateCount, useTime, useCount, timeOn, onTimeWeek, parameter, news, timeLine, weather,
    };
  },
});
</script>
<style lang="scss" scoped>
.backwall{
  width: 100vw;
  height: 100vh;
  background: url("../../assets/dashboard/bw.png") no-repeat;
  background-size: 100% 100%;
}
#timeBoard{
  color:#F6EB1C;
  font-size: 2rem;
  font-weight: bold;
}
.bk {
  background: url("../../assets/dashboard/chartbk.png") no-repeat;
  background-size: 100% 100%;
}
</style>
