<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:1vw;margin-top:1vh">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
      <div style="color:#28D0F1;font-weight:bold;margin-left: 1rem;font-size: 1.3rem">实训室近一周使用人数统计</div>
    </div>
    <v-chart autoresize style="width:100%;height:35vh" :options="option"/>
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
import { CountUsage } from '@/dao/dashboardDao';

export default {
  name: 'useCount',
  setup() {
    const loading = ref(false);
    const active = ref<boolean>(true);
    const weekNow = ref<any>([]);
    const dataNow = ref<any>([]);
    const option = ref<any>({});

    async function getData() {
      const today = (new Date()).getTime();
      const lastDay = today - 604800000;
      const params = {
        start: lastDay,
        end: today,
      }
      const result = await CountUsage(params);
      weekNow.value = result.map((cc: any) => cc.x);
      dataNow.value = result.map((cc: any) => cc.y);
    }
    async function setData() {
      while (active.value) {
        await getData();
        await drawLine();
        await sleep(21600000);
      }
    }
    async function drawLine() {
      option.value = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: weekNow.value,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#28D0F1',
              fontSize: '14',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#28D0F1',
              fontSize: '14',
            },
          },
        },
        series: [
          {
            name: '学生',
            type: 'line',
            smooth: true,
            areaStyle: {},
            itemStyle : {
              normal : {
                lineStyle: {
                  color: '#FFFF00',
                },
              },
            },
            data: dataNow.value,
          },
        ],
      };
    }
    function init() {
      setData();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, option, init,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
