<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex column bk" style="width:33vw;height:48vh">
      <div class="flex" style="margin-left:1vw;">
        <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
        <div style="color:#28D0F1;font-weight:bold;margin-left: 1rem;font-size: 1.3rem">学生操作监控</div>
      </div>
      <div class="flex center">
        <div id="video" style="padding:1rem 0;width:52vh;height:25vh;"></div>
      </div>
    </div>
    <div style="width:30vw;height:32vh;margin-top:1vh">
      <div class="flex between">
        <div class="flex" style="margin-left:1rem;">
          <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
          <div style="color:#28D0F1;font-weight:bold;font-size: 1.3rem;margin-left: 1rem">设备运行参数</div>
        </div>
        <div style="color:#28D0F1;font-weight:bold;font-size: 1.3rem;" v-if="stationList[sort.up]">{{'操作台名称：' + stationList[sort.up].name}}</div>
      </div>
      <div
        v-if="paramList && paramList.record && paramList.record.paramsMap"
        class="flex wrap between"
        style="margin-left:2vw;overflow:hidden;height:20vh;margin-top: 1rem">
        <div
          class="monitor-detail--param-item flex between"
          v-for="(param,index) of paramList.record.paramsMap.filter(p => p.available !== false).slice(0,18)"
          :key="index">
          <div class="flex between" style="margin-top:0.5rem;width:18rem;height:40%">
            <span style="text-align:center;color:white;font-size:1.2rem;padding-left:20px">{{ param.nameSimple }}：</span>
            <div style="text-align:center;color:white;font-size:1.2rem;">{{ param.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, watch } from '@vue/composition-api';
import { ref} from '@vue/composition-api';
import { sleep } from 'web-toolkit/src/utils';
import {SettingGet} from '@/dao/settingDao';
import {AnalysisDeviceParam} from '@/dao/analysisDao';
import {init, login, startRealPlay, stopPlay} from '@/utils/video';
import {Message} from 'element-ui';

export default {
  name: 'parameter',
  props: {
    stationAll: {
      type: Array,
      default: () => {},
    },
  },
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const device = ref<any>({});
    const count = ref<any>(0);
    const active = ref<boolean>(true);
    const stationList = ref<any>([]);
    const modalVideo = ref<any>({
      szDeviceIdentify: '',
      start: '2020-02-26 07:00:00',
      end: '2020-02-26 14:11:11',
    });
    const paramList = ref<any>();
    const sort = ref<any>({
      up: 0,
      count: 0,
      sum: 0,
    });
    function summaryHandle(summary: any, key: string) {
      if (summary[key]) {
        summary[key] = summary[key] + 1;
      } else {
        summary[key] = 1;
      }
    }
    async function getData() {
      stationList.value = props.stationAll;
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
        }
      }
    }
    async function changeStation() {
      for (let i = sort.value.count; i < stationList.value.length; i++) {
        sort.value.count = i + 1;
        if (stationList.value[i].extend.status !== 'offline' || stationList.value[i].extend.status !== 'close') {
          sort.value.up = i;
          // device.value = (await MonitorStationDetail({stationId: stationList.value[i].id})).deviceList[0];
          if (sort.value.count >= stationList.value.length) {
            sort.value.count = 0;
          }
          if (stationList.value[sort.value.up] && stationList.value[sort.value.up].extend &&
          stationList.value[sort.value.up].extend.cameras && stationList.value[sort.value.up].extend.cameras.length > 0 &&
          stationList.value[sort.value.up].extend.cameras[0].channelId !== undefined) {
            startVideo(stationList.value[sort.value.up].extend.cameras[0].channelId);
          }
          break;
        }
      }
    }
    async function setDevice() {
      if (stationList.value[sort.value.up]) {
        paramList.value = await AnalysisDeviceParam({deviceId: stationList.value[sort.value.up].deviceList[0].id});
      }
    }
    async function drawStation() {
      while (active.value) {
        await changeStation();
        // darwVideo();
        await sleep(30000);
      }
    }
    async function updata() {
      while (active.value) {
        await setDevice();
        await sleep(3000);
      }
    }
    async function setData() {
      initVideo();
      await getData();
      drawStation();
      updata();
    }
    async function initVideo() {
      const setting = await SettingGet({onlyNVR: true});
      modalVideo.value.ip = setting.nvrIp;
      modalVideo.value.port = setting.nvrPort;
      modalVideo.value.username = setting.nvrUsername;
      modalVideo.value.pwd = setting.nvrPwd;
      await init('video', 1);
      modalVideo.value.szDeviceIndentify = modalVideo.value.ip + '_' + modalVideo.value.port;
      const msg = await login(modalVideo.value.ip, modalVideo.value.port, modalVideo.value.username, modalVideo.value.pwd);
      if (msg) { Message.error(msg + ''); }
      await startVideo(null);
    }
    async function startVideo(id: any) {
      await stopPlay(0);
      if (id === undefined || id === null) { id = 1; }
      // if (id === undefined || id === null) { return ; }
      await startRealPlay(0, modalVideo.value.szDeviceIndentify, id);
    }
    async function init0() {
      setData();
    }
    watch(() => props.stationAll, async () => {
      await setData();
    });
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, device, init0,
      sort, stationList, paramList,
    };
  },
};
</script>
<style scoped lang="scss">
  .bk {
    background: url("../../../../assets/dashboard/chartbk.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
