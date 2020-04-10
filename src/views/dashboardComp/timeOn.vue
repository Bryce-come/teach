<template>
  <div class="flex column" style="height:30vh; overflow:hidden" v-loading="loading">
    <div class="flex" style="justify-content:space-around;width:13vw;margin-left:1vw;margin-top:3vh;margin-bottom:4vh">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.5rem"></div>
      <div style="color:#28D0F1;font-weight:bold;font-size:1rem;">实训室近一周开机总时长统计</div>
    </div>
    <v-chart autoresize style="width:100%;height:35vh;margin-top:-8vh;margin-left:1vh;" :options="option"/>
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
    //   legend: {
    //     data: ['教师', '学生'],
    //     textStyle: {
    //       color: '#28D0F1',
    //     }
    // },
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //       type: 'cross',
    //       label: {
    //           backgroundColor: '#6a7985'
    //       }
    //   }
    // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周六', '周日', '周一', '周二', '周三', '周四', '周五'],
        axisLabel: {
          show: true,
          textStyle: {
            color: '#28D0F1',
            fontSize: '1rem',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          textStyle: {
            color: '#28D0F1',
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
          data: [210, 0, 132, 101, 134, 90, 230],
        },
        {
          name: '教师',
          type: 'line',
          smooth: true,
          areaStyle: {},
          itemStyle : {
            normal : {
              lineStyle: {
                color: '#ADFF2F',
              },
            },
          },
          data: [310, 0, 182, 191, 234, 290, 330],
        },
      ],
    };
    return {
      loading, option,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
