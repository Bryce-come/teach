<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:1vw;margin-top:2vh;">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
      <div style="color:#28D0F1;font-weight:bold;margin-left: 1rem;font-size: 1.3rem">实训室近一个月使用率</div>
    </div>
    <v-chart autoresize style="width:100%;height:30vh;" :options="option"/>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref} from '@vue/composition-api';
import { sleep } from 'web-toolkit/src/utils';
import { ClassroomUsageDaily } from '@/dao/dashboardDao';

export default {
  name: 'useTime',
  setup() {
    const loading = ref(false);
    const active = ref<boolean>(true);
    const monthNow = ref<any>([]);
    const dataNow = ref<any>([]);
    const option = ref<any>({});

    async function getData() {
      const today = (new Date()).getTime();
      const lastDay = today - 2592000000;
      const params = {
        start: lastDay,
        end: today,
      };
      const result = await ClassroomUsageDaily(params);
      monthNow.value = result.map((cc: any) => cc.x);
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
          data: monthNow.value,
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
        series: [{
          data: dataNow.value,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#ADFF2F',
              },
            },
          },
        }],
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
