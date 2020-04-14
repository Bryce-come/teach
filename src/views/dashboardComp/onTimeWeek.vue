<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:1vw;margin-top:1vh">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
      <div style="color:#28D0F1;font-weight:bold;font-size:1.3rem;margin-left: 1rem">本周设备使用率</div>
    </div>
    <v-chart autoresize style="width:100%;height:100%;margin-left:1vw;margin-top:0.5vw" :options="option"/>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { MonitorStationList } from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';
import { StatusAnalysisThisWeek } from '@/dao/dashboardDao';

export default {
  name: 'onTimeWeek',
  setup() {
    const loading = ref(false);
    const active = ref<boolean>(true);
    const weekNow = ref<any>([]);
    const dataNow = ref<any>([]);
    const option = ref<any>({});


    // const option = {
    //   legend: {
    //     orient: 'vertical',
    //     left: 1,
    //     data: ['运行', '故障', '关机', '空闲'],
    //     textStyle: {
    //       color: '#28D0F1',
    //       fontSize: '14',
    //     },
    //   },
    //   series: [
    //     {
    //       name: '状态',
    //       type: 'pie',
    //       radius: ['10%', '70%'],
    //       avoidLabelOverlap: false,
    //       label: {
    //         show: false,
    //         position: 'center',
    //       },
    //       labelLine: {
    //         show: false,
    //       },
    //       data: [
    //         {value: 12, name: '运行', itemStyle: {color: '#26b229'}},
    //         {value: 0, name: '故障', itemStyle: {color: '#ff4949'}},
    //         {value: 2, name: '关机', itemStyle: {color: '#3d3d3d'}},
    //         {value: 2, name: '空闲', itemStyle: {color: '#d7d400'}},
    //       ],
    //     },
    //   ],
    // };
    async function getData() {
      const today = (new Date()).getTime();
      const lastDay = today - 604800000;
      const params = {
        start: lastDay,
        end: today,
      }
      dataNow.value = await StatusAnalysisThisWeek(params);
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
        legend: {
          orient: 'vertical',
          left: 1,
          data: ['运行', '故障', '关机', '空闲'],
          textStyle: {
            color: '#28D0F1',
            fontSize: '14',
          },
        },
        series: [
          {
            name: '状态',
            type: 'pie',
            radius: ['10%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            data: [
              {value: dataNow.value.working, name: '运行', itemStyle: {color: '#26b229'}},
              {value: dataNow.value.emergency, name: '故障', itemStyle: {color: '#ff4949'}},
              {value: dataNow.value.offline, name: '关机', itemStyle: {color: '#3d3d3d'}},
              {value: dataNow.value.idle, name: '空闲', itemStyle: {color: '#d7d400'}},
            ],
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
