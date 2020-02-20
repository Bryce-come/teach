<template>
  <div v-loading="loading">
    <div class="monitor flex align-center">
        <div v-if="lesson" class="card flex align-center column monitor-left"  ref="box">
           <h3>上课班级信息</h3>
            <el-form label-width="110px" label-position="left">
              <el-form-item label="课程名称：">{{ lesson.course.name }}</el-form-item>
              <el-form-item label="实验项目：">{{ lesson.course.programList }}</el-form-item>
              <el-form-item label="授课老师：">{{ lesson.course.teacher.name }}</el-form-item>
              <el-form-item label="授课班级：">{{ lesson.extend.clasz }}</el-form-item>
              <el-form-item label="上课人数：">{{ lesson.students.length }}</el-form-item>
              <el-form-item label="距离下课时间：">{{ timeDiff(time, lesson.end) }}</el-form-item>
            </el-form>
        </div>
        <div class="card monitor-right">
          <div class="flex align-center" style="margin:auto"><h3>设备状态统计</h3></div>
          <div class="flex align-center">
            <v-chart
              autoresize
              style="width:300px;height:200px;"
              :options="chart"/>
              <el-form v-if="summary" label-width="80px" label-position="left">
              <el-form-item label="开机：">{{ summary.on }}</el-form-item>
              <el-form-item label="故障：">{{ summary.emergency }}</el-form-item>
              <el-form-item label="离线：">{{ summary.offline }}</el-form-item>
            </el-form>
          </div>
        </div>
    </div>
    <div class="card monitor-device">
      <div style="margin:10px"><h3>操作台总览</h3></div>
      <div class="flex center wrap">
       <div class="device-card"
           @click="$router.push({name:'monitorDetail'})"
           v-for="(item,i) in stations" :key="i">
         <div class="flex align-center">
           <div class="device-img">
             <!-- 我图片链接不出来 -->
              <!-- <img class="image" :src="item.imgUrl"> -->
              <img class="image" src='../../assets/u1630.png'>
           </div>
           <div class="device-message">
             <div>{{item.name}}</div>
             <div>{{item.student.clasz.name}}</div>
             <div>{{item.student.name}}</div>
           </div>
         </div>
         <div class="device-time">

         </div>
       </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent} from '@vue/composition-api';
import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import { isUndefined, deepClone } from 'web-toolkit/src/utils';
import { lineConfig, getColors} from 'web-toolkit/src/utils/echarts-helper';
import { EChartsEvent } from 'web-toolkit/src/types/echarts';
import { EChartOption } from 'echarts';
import { urlMap } from '@/config';
import { statusMap } from '@/utils/device-utils';
export default createComponent({
  name: 'monitor',
  props: { },
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const box = ref(null);
    const lesson = ref<any>();
    const time = new Date;
    const summary = ref<any>();
    const chart: Ref<EChartOption> = ref({});
    const devicesShow = ref<any>();
    const stations = ref<any>();
    const query = async () => {
        lesson.value = {
            id: 1,
            course: {
              name: '自动化课程1',
              programList: '切刀挂刀操作',
              teacher: {
                 name: '玛丽',
                },
              },
            start: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
            end: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
            type: 0,
            students: ['马丽', '李海'],
            extend: {
              appointRecord: {result: 1},
              lessons: [1, 2, 3],
              clasz: '自动化1801',
              claszGroup: '自动化一组',
              },
          };
    };
    const timeDiff = (time1: any, time2: any) => {
        const dateDiff = time2.getTime() - time1.getTime();
        const hours = Math.floor(dateDiff / (3600 * 1000));
        const leave1 = dateDiff % (3600 * 1000);
        const minutes = Math.floor(leave1 / (60 * 1000));
        const leave2 = leave1 % (60 * 1000);     // 计算分钟数后剩余的毫秒数
        const seconds = Math.round(leave2 / 1000);
        return  hours + '小时' + minutes + '分' + seconds + '秒';
    };
    const setChart = async () => {
      summary.value = {
        emergency: 0,
        offline: 1,
        on: 9,
      };
      const xyData = Object.entries(summary.value);
      chart.value = {
        series: [{
          name: '设备数量',
          type: 'pie',
          data: [
            {value: 1, name: '故障'},
            {value: 1, name: '离线'},
            {value: 9, name: '开机'},
          ],
            // radius: document.querySelector('#index-pie')!.clientWidth * 0.25,
          radius: 50,
          label: {
          formatter: '{b}：{c}',
          fontSize: 14,
          },
        }],
        grid: {
            height: 300,
        },
        color: getColors(),
      };
    };
    const setStation = async () => {
      stations.value = [
        {
          id: 1,
          name: '操作台1',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 2,
          name: '操作台2',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 3,
          name: '操作台3',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 4,
          name: '操作台4',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 5,
          name: '操作台5',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 6,
          name: '操作台6',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
      ];
    };
    onMounted(useLoading(loading, async () => {
      await query();
      await setChart();
      await setStation();
    }));
    return{
       loading,
       box,
       time,
       lesson,
       query,
       timeDiff,
       summary,
       chart,
       setChart ,
       devicesShow,
       stations,
    };
  },
});
</script>
<style scoped lang="scss">
.monitor{
     height: 21.5rem;
    .monitor-left{
        margin-right: 1rem;
        width: 48%;
        height: 100%;
        padding: 15px 20px;
        .el-form * {
          font-size: 1rem;
        }
        .el-form-item {
           margin-bottom: 5px;
        }
    }
    .monitor-right{
        margin-right: 1rem;
        width: 48%;
        height: 100%;
        padding: 15px 20px;
      .el-form * {
          font-size: 1rem;
        }
        .el-form-item {
           margin-bottom: 5px;
        }
    }

}
.monitor-device{
  margin-top: 10px;
  .device-card{
    width: 30%;
    margin-right: 10px;
    .device-img{
      width: 50%;
      img{
        width: 100%;
      }
    }
    .device-message{
      width: 50%;
    }
  }
}
</style>
