<template>
  <div class="flex" v-loading="loading">
      <v-chart autoresize style="width:100%;height: calc(100% - 33px)" :options="option"/>
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
  name: 'useTimeWeek',
  setup() {
    const loading = ref(false);
    const option = {
      title: {
        text: '本周设备使用率',
        textStyle: {
          color: '#28D0F1',
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['运行', '故障', '关机', '其他'],
        textStyle: {
          color: '#28D0F1',
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
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: [
            {value: 12, name: '运行'},
            {value: 0, name: '故障'},
            {value: 2, name: '关机'},
            {value: 0, name: '其他'},
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
