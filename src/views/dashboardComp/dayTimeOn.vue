<template>
  <div class="flex column center" style="" v-loading="loading">
    <div style="color:white;font-size: 2rem;margin-bottom: 1rem">当日开机总时长</div>
    <div style="color:#F6EB1C;font-size: 2.5rem;font-weight: bold;" class="flex center">{{timeSum + '小时'}}</div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { sleep } from 'web-toolkit/src/utils';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { MonitorStationList } from '@/dao/monitorDao';
import { TodayOpenHours } from '@/dao/dashboardDao';

export default {
  name: 'dayTimeOn',
  setup() {
    const loading = ref(false);
    const active = ref<boolean>(true);
    const timeSum = ref<any>();
    async function getData() {
      const result = await TodayOpenHours();
      timeSum.value = result;
    }
    async function setTimeOn() {
      while (active.value) {
        await getData();
        await sleep(1800000);
        // await sleep(1000);
      }
    }
    function init() {
      setTimeOn();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, init, timeSum,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
