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
  name: 'timeON',
  setup() {
    const loading = ref(false);
    const option = {
      // title: {
      //   text: '实训室近一周开机总时长统计',
      //   textStyle: {
      //     color: '#28D0F1',
      //   }
      // },
      legend: {
        data: ['教师', '学生'],
        textStyle: {
          color: '#28D0F1',
        }
    },
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
        data: ['周六', '周日', '周一', '周二', '周三', '周四', '周五'],
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
      series: [
        {
          name: '学生',
          type: 'line',
          smooth: true,
          areaStyle: {},
          data: [210, 0, 132, 101, 134, 90, 230]
        },
        {
          name: '教师',
          type: 'line',
          smooth: true,
          areaStyle: {},
          data: [310, 0, 182, 191, 234, 290, 330]
        },
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
