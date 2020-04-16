<template>
  <div class="flex" style="justify-content:space-around;align-items:center;" v-loading="loading">
      <div>
        <el-progress
          type="dashboard" :percentage="state.wp"
          color="#26b229" :show-text='false'
          :stroke-width="30" :width="100"/>
        <div style="color:#26b229;margin-left:0.5vw;margin-top:-1vh;font-size:1.2rem">{{'运行: '+state.workingNum}}</div>
        <!-- <div style="color:#26b229;margin-left:2vw;font-size:17px">{{state.workingNum}}</div> -->
      </div>
      <div>
        <el-progress
          type="dashboard" :percentage="state.ep"
          color="#ff4949" :show-text='false' :stroke-width="30" :width="100"/>
        <div style="color:#ff4949;margin-left:1vw;margin-top:-1vh;font-size:1.2rem">{{'故障: '+state.emergencyNum}}</div>
        <!-- <div style="color:#ff4949;margin-left:2vw;font-size:17px">{{state.emergencyNum}}</div> -->
      </div>
      <div>
        <el-progress
          type="dashboard" :percentage="state.op"
          color="#3d3d3d" :show-text='false' :stroke-width="30" :width="100"/>
        <div style="color:#E6E6FA;margin-left:1vw;margin-top:-1vh;font-size:1.2rem">{{'关机: '+state.offlineNum}}</div>
        <!-- <div style="color:#E6E6FA;margin-left:2vw;font-size:17px">{{state.offlineNum}}</div> -->
      </div>
      <div>
        <el-progress
          type="dashboard" :percentage="state.qp"
          color="#d7d400" :show-text='false' :stroke-width="30" :width="100"/>
        <div style="color:#d7d400;margin-left:1vw;margin-top:-1vh;font-size:1.2rem">{{'空闲: '+state.qitaNum}}</div>
        <!-- <div style="color:#d7d400;margin-left:2vw;font-size:17px">{{state.qitaNum}}</div> -->
      </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { MonitorStationList } from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';

export default {
  name: 'stateCount',
  props: {
    stationAll: {
      type: Array,
      default: () => {},
    },
  },
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const active = ref<boolean>(true);
    const state = ref<any>({
      workingNum: 0,
      wp: 0,
      emergencyNum: 0,
      ep: 0,
      offlineNum: 0,
      op: 0,
      qitaNum: 0,
      qp: 0,
    });
    const stationList = ref<any>([]);
    function summaryHandle(summary: any, key: string) {
      if (summary[key]) {
        summary[key] = summary[key] + 1;
      } else {
        summary[key] = 1;
      }
    }
    function setState() {
      for (const d of stationList.value) {
        if (d.extend.status === 'working') {
          state.value.workingNum++;
        } else if (d.extend.status === 'emergency') {
          state.value.emergencyNum++;
        } else if (d.extend.status === 'offline') {
          state.value.offlineNum++;
        } else if (d.extend.status === 'close') {
          state.value.offlineNum++;
        } else {
          state.value.qitaNum++;
        }
      }
      const count = state.value.workingNum + state.value.emergencyNum + state.value.offlineNum + state.value.qitaNum;
      state.value.wp = state.value.workingNum / count * 100;
      state.value.ep = state.value.emergencyNum / count * 100;
      state.value.op = state.value.offlineNum / count * 100;
      state.value.qp = state.value.qitaNum / count * 100;
    }
    async function getData() {
      stationList.value = props.stationAll;
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
        }
      }
      setState();
    }
    async function darwDate() {
       while (active.value) {
        await getData();
        await sleep(300000);
      }
    }
    async function init() {
      darwDate();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      state,
      loading,
      init,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
