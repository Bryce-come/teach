<template v-loading="loading">
  <div>
    <div class="flex align-center little-space" style="height: 45px;margin-bottom: 5px">
      <el-button type="primary" icon="el-icon-arrow-left" @click="$router.back()">返回总览</el-button>
    </div>
    <div v-if="station">
      <div><span style="font-size:1.5rem">{{station.name+' ' +station.student.name}}</span></div>
      <div class="flex align-center" style="width:100%">
        <div class="watch1">
          <el-button >关闭</el-button>
        </div>
        <div class="watch2">
          <el-button>关闭</el-button>
        </div>
      </div>
      <div style="font-size:1.2rem">距离下课时间还有<span style="color:red" v-if="lesson">{{timeDiff(time, lesson.end)}}</span></div>
      <div>时间状态轴有现成，超哥说等数据接口出来直接加上去</div>
      <div class="flex align-center" style="width:100%">
        <div class="flex align-center wrap watch3">
          <div class="param-item flex align-center" v-for="(item,i) in station.paramsMap" :key="i">
              <div style="font-weight: 700;padding: 5px 40px">{{ item.nameSimple }}：</div>
              <div style="text-align: center;color: #014cff;font-weight: 600;">{{ item.value!==''?item.value:'--'  }}</div>
          </div>
        </div>
        <div class="watch2">
          <el-button>关闭</el-button>
        </div>
      </div>
    </div>    
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, onUnmounted, watch } from '@vue/composition-api';
import { router } from '@/main';
import { useLoading } from 'web-toolkit/src/service';
export default {
  setup() {
    const loading = ref(false);
    const station = ref<any>();
    const lesson = ref<any>();
    const time = new Date;
    const setStation = async () => {
      station.value = {
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
          paramsMap: [
            {nameSimple: '运行次数', value: 4},
            {nameSimple: '运行状态', value: 4},
            {nameSimple: '运行时间', value: 4},
            {nameSimple: '启动按钮', value: ''},
            {nameSimple: '运行半径', value: 4},
            {nameSimple: '数据记录', value: 4},
            {nameSimple: '运行次数', value: 4},
          ],
        };
     };
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
    onMounted(useLoading(loading, async () => {
      await setStation();
      await query();
    }));
    return{
      loading,
      station,
      setStation,
      time,
      lesson,
      query,
      timeDiff,
    };
  },
};
</script>
<style scoped lang="scss">
 .watch1 {
   width: 48%;
   margin-right: 20px;
   height: 20rem;
   background-color: darkcyan;
 }
  .watch2 {
   width: 48%;
   height: 20rem;
   background-color: rgb(210, 224, 85);
 }
  .watch3 {
   width: 48%;
   background-color: rgb(242, 243, 237);
   margin-right: 20px;
   .param-item{
     width: 47%;
     margin-left: 10px;
   }
   }
</style>