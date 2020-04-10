<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="justify-content:space-around;width:11vw;margin-left:1vw;margin-top:1vw">
      <div style="background-color:#28D0F1;width:5px;height:20px"></div>
      <div style="color:#28D0F1;font-weight:bold">实训室近一个月使用率</div>
    </div>
    <v-chart autoresize style="width:100%;height:100%;margin-top:2vw" :options="option"/>
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

export default {
  name: 'useTime',
  setup() {
    const loading = ref(false);
    const monthNow = [
      '3.11','3.12','3.13','3.14','3.15','3.16',
      '3.17','3.18','3.19','3.20','3.21','3.22','3.23','3.24','3.25',
      '3.26','3.27','3.28','3.29','3.30','3.31','4.1','4.2','4.3',
      '4.4','4.5','4.6','4.7','4.8','4.9','4.10','4.11',
    ]
    const dataNow = [
                '70','88','83','72','0',
      '64','90','70','88','83','72','0',
      '64','90','70','88','83','72','0',
      '64','90','70','88','83','0','0',
      '0','90','70','88','83','72',
    ]
    const option = {
      // title: {
      //   text: '实训室近一个月使用率',
      //   textStyle: {
      //     color: '#28D0F1',
      //   }
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: monthNow,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#28D0F1',
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#28D0F1',
          }
        }
      },
      series: [{
        data: dataNow,
        type: 'line',
      }]
    };
    onMounted(useLoading(loading, async () => {
      try {
        
      }
      catch(err) {}
    }));
    return {
      loading, option,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
