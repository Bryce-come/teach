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
        <div style="color:#28D0F1;font-weight:bold;font-size: 1.3rem;">{{'操作台名称：' + stationList[sort.up].name}}</div>
      </div>
      <div
        v-if="device && device.extend && device.extend.paramsMap"
        class="flex wrap between"
        style="margin-left:2vw;overflow:hidden;height:20vh;margin-top: 1rem">
        <div
          class="monitor-detail--param-item flex between"
          v-for="(param,index) of device.extend.paramsMap.filter(p => p.available !== false).slice(0,18)"
          :key="index">
          <div class="flex between" style="margin-top:0.5rem;width:14rem;height:40%">
            <span style="text-align:center;color:white;font-size:1.2rem;padding-left:20px">{{ param.nameSimple }}：</span>
            <div style="text-align:center;color:white;font-size:1.2rem;">{{ param.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent} from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { MonitorStationList } from '@/dao/monitorDao';
import {MonitorStationDetail} from '@/dao/monitorDao';
import {CourseRecordInClass} from '@/dao/courseRecordDao';
import { sleep } from 'web-toolkit/src/utils';
import {SettingGet} from '@/dao/settingDao';
import {init, login, startRealPlay, stopPlay} from '@/utils/video';
import {StationList} from '@/dao/stationDao';
import {Message} from 'element-ui';

export default {
  name: 'parameter',
  setup() {
    const loading = ref(false);
    const device = ref<any>({});
    const station = ref<any>();
    const count = ref<any>(0);
    const active = ref<boolean>(true);
    const stationList = ref<any>([]);
    const courseRecord = ref<any>();
    const modalVideo = ref<any>({
      szDeviceIdentify: '',
      start: '2020-02-26 07:00:00',
      end: '2020-02-26 14:11:11',
    });
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
      await Promise.all([
        stationList.value = await MonitorStationList(),
      ]);
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
      console.log(stationList.value.length)
      for (let i = sort.value.count; i < stationList.value.length; i++) {
        sort.value.count = i + 1;
        console.log(sort.value.count)
        if (stationList.value[i].extend.status !== 'offline' || stationList.value[i].extend.status !== 'close') {
          sort.value.up = i;
          // device.value = (await MonitorStationDetail({stationId: stationList.value[i].id})).deviceList[0];
          if (sort.value.count >= stationList.value.length) {
            sort.value.count = 0;
            console.log(sort.value.count )
          }
          break;
        }
      }
    }
    async function setDevice() {
      if(stationList.value[sort.value.up]) {
        device.value = (await MonitorStationDetail({stationId: stationList.value[sort.value.up].id})).deviceList[0];
      }
    }
    async function drawStation() {
      while (active.value) {
        await changeStation();
        await sleep(6000);
      }
    }
    async function darwDate() {
      while (active.value) {
        await getData();
        await sleep(300000);
      }
    }
    async function updata() {
      while (active.value) {
        await setDevice();
        await sleep(3000);
      }
    }
    async function darwVideo() {
      while (active.value) {
        if (count.value > 0 && count.value % 5 === 0) {
          await startVideo((count.value % 2 + 1));
        }
        await sleep(3000);
        count.value++;
      }
    }
    async function setVideo() {
      // 异步
      await initVideo();
      darwVideo();
    }
    async function setData() {
      // await getData();
      darwDate();
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
      initVideo();
      darwVideo();
      // setVideo();
      setData();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, device, stationList,
      init0, sort,
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
