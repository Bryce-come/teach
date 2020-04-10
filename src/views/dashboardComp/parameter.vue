<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="justify-content:space-around;width:8vw;margin-left:1vw;margin-top:1vh">
      <div style="background-color:#28D0F1;width:5px;height:20px"></div>
      <div style="color:#28D0F1;font-weight:bold">设备运行参数</div>
    </div>
    <div class="flex wrap between" style="margin-left:2vw;overflow:hidden;height:16vh">
      <div
        class="monitor-detail--param-item flex between" style="width:"
        v-for="(param,index) of device.extend.paramsMap.filter(p => p.available !== false).slice(0,18)"
        :key="index">
        <div class="flex between" style="margin-top:5px;width:8vw;height:40%">
          <span style="text-align:center;color:white;font-size:10px;padding-left:20px">{{ param.nameSimple }}：</span>
          <div style="text-align:center;color:white;font-size:10px;">{{ param.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { MonitorStationList } from '@/dao/monitorDao';
import {MonitorStationDetail} from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';

export default {
  name: 'parameter',
  setup() {
    const loading = ref(false);
    const device = ref<any>();
    const station = ref<any>();
    async function getData(){
      await Promise.all([
          station.value = await MonitorStationDetail({stationId: 36}),
      ]);
      device.value = station.value.deviceList[0];
    }
    async function setData(){
      while(1 === 1){
          getData()
          await sleep(3000)
      }
    }
    onMounted(useLoading(loading, async () => {
      try {
        setData()
        if (!device.value) throw "设备不存在";
      }
      catch(err) {
        console.log(err)
      }
    }));
    return {
      loading, device,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
