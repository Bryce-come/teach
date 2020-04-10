<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="justify-content:space-around;width:8vw;margin-left:1vw;margin-top:1vw">
      <div style="background-color:#28D0F1;width:5px;height:20px"></div>
      <div style="color:#28D0F1;font-weight:bold">本周设备使用率</div>
    </div>
    <v-chart autoresize style="width:100%;height:100%;margin-left:1vw;margin-top:0.5vw" :options="option"/>
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
  name: 'onTimeWeek',
  setup() {
    const loading = ref(false);
    const option = {
      // title: {
      //   text: '本周设备使用率',
      //   textStyle: {
      //     color: '#28D0F1',
      //   }
      // },
      // tooltip: {
      //   trigger: 'item',
      //   formatter: '{a} <br/>{b}: {c} ({d}%)'
      // },
      legend: {
        orient: 'vertical',
        left: 1,
        data: ['运行', '故障', '关机', '其他'],
        textStyle: {
          color: '#28D0F1',
          fontSize: '10px'
        }
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
            show: false
          },
          data: [
            {value: 12, name: '运行'},
            {value: 0, name: '故障'},
            {value: 2, name: '关机'},
            {value: 2, name: '其他'},
          ]
        }
      ]
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
