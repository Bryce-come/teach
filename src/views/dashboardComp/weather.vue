<template>
  <div  style="" v-loading="loading">
    <div class="flex between">
        <div v-for="(item,i) of weatherList" :key="i" class="weatherbk" style="width:5vw;height:10vh">
            <div style="color:white">{{item.date.slice(5,10)}}</div>
            <div><img :src="weatherIconMap.itme.dayweather"/></div>
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
    async function getData(){
      weatherList.value = await weather();
      imgList.value = weatherList.value.map((cc: any) => cc.dayweather);
    }
    async function setData(){
      getData();
    }
    onMounted(useLoading(loading, async () => {
      try {
        setData()
        // if (!message.value) throw "设备不存在";
      }
      catch(err) {
        console.log(err)
      }
    }));
    return {
      loading, weatherList, weatherIconMap,
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
