<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex column bk" style="width:33vw;height:48vh">
      <div class="flex" style="justify-content:space-around;width:8vw;margin-left:1vw;">
        <div style="background-color:#28D0F1;width:5px;height:20px"></div>
        <div style="color:#28D0F1;font-weight:bold">学生操作监控</div>
      </div>
      <div class="flex center" style="margin-top:1vh">
        <div id="video" style="width:48vh;height:23vh;"></div>
      </div>
    </div>
    <div style="width:30vw;height:33vh;margin-top:1vh">
      <div class="flex" style="justify-content:space-around;width:8vw;margin-left:1vw;">
        <div style="background-color:#28D0F1;width:5px;height:20px"></div>
        <div style="color:#28D0F1;font-weight:bold">设备运行参数</div>
      </div>
      <div
        v-if="device && device.extend && device.extend.paramsMap"
        class="flex wrap between"
        style="margin-left:2vw;overflow:hidden;height:15vh">
        <div
          class="monitor-detail--param-item flex between"
          v-for="(param,index) of device.extend.paramsMap.filter(p => p.available !== false).slice(0,18)"
          :key="index">
          <div class="flex between" style="margin-top:5px;width:145px;height:40%">
            <span style="text-align:center;color:white;font-size:1rem;padding-left:20px">{{ param.nameSimple }}：</span>
            <div style="text-align:center;color:white;font-size:1rem;">{{ param.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted,onUnmounted } from '@vue/composition-api';
import { ref, createComponent} from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { MonitorStationList } from '@/dao/monitorDao';
import {MonitorStationDetail} from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';
import {SettingGet} from "@/dao/settingDao";
import {init, login, startRealPlay, stopPlay} from "@/utils/video";
import {Message} from 'element-ui'

export default {
  name: 'parameter',
  setup() {
    const loading = ref(false);
    const device = ref<any>({});
    const station = ref<any>();
    const count = ref<any>(0);
    const active = ref<boolean>(true);
    const modalVideo = ref<any>({
      szDeviceIdentify: '',
      start: '2020-02-26 07:00:00',
      end: '2020-02-26 14:11:11',
    });

    async function getData(){
      station.value = await MonitorStationDetail({stationId: 36});
      device.value = station.value.deviceList[0];
    }
    async function setData(){
      // 异步
      initVideo();
      while(active.value){
        await getData();
        if(count.value>0 && count.value%5===0){
          await startVideo((count.value%2+1))
        }
        await sleep(3000);
        count.value++
      }
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
      if(msg) Message.error(msg+"");
      await startVideo(null);
    }
    async function startVideo(id:any){
      await stopPlay(0);
      if (id === undefined || id === null) { id = 1; }
      // if (id === undefined || id === null) { return ; }
      await startRealPlay(0, modalVideo.value.szDeviceIndentify, id);
    }
    function init0(){
      setData()
    }
    onUnmounted(()=>{
      active.value = false;
    });
    return {
      loading, device,
      init0
    };
  },
};
</script>


<style scoped lang="scss">
  .bk {
    background: url("../../assets/dashboard/chartbk.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
