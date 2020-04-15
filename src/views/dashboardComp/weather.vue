<template>
  <div  style="" v-loading="loading">
    <div class="flex" style="justify-content:space-between;width:20vw;">
      <div v-for="(item,i) of weatherList" :key="i" class="flex column center weatherbk" style="width:4.5vw;height:10vh">
        <div><img :src="iList[i]" style="height: 2rem;margin-bottom: 1rem"/></div>
        <div style="color:white;font-size:1.1rem;">{{imgList[i]}}</div>
        <div style="color:white;font-size:1.1rem;">{{item.date.slice(5,10)}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, onBeforeUpdate } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { MonitorStationList } from '@/dao/monitorDao';
import { MonitorStationDetail} from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';
import { NewsList } from '@/dao/newsDao';
import { weather } from '@/dao/commonDao';
import { weatherIconMap } from '@/utils/weather';

export default {
  name: 'weather',
  setup() {
    const loading = ref(false);
    const weatherList = ref<any>();
    const imgList = ref<any>();
    const iList = ref<any>([]);
    const active = ref<boolean>(true);
    const weatherMap: any = weatherIconMap;
    async function getData() {
      weatherList.value = await weather();
      imgList.value = weatherList.value.map((cc: any) => cc.dayweather);
      for (const d of imgList.value) {
        const str = weatherMap[d];
        iList.value.push(str);
      }
    }
    async function setData() {
      while (active.value) {
        await getData();
        await sleep(21600000);
      }
    }
    function init() {
      setData();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, weatherList, weatherIconMap, iList, imgList, init,
    };
  },
};
</script>


<style scoped lang="scss">
  .weatherbk{
    background: url("../../assets/dashboard/weatherbk.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
