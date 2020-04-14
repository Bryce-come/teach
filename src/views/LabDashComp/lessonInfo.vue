<template>
  <div class="flex column" style="justify-content:space-around" v-loading="loading">
    <div class="flex" style="margin-left:1rem;margin-top:1vh">
        <div class="yuan" style="width:2vw;height:3vh"></div>
        <div style="color:#28D0F1;font-weight:bold;font-size: 2rem;margin-left: 1rem">授课内容</div>
        <div class="hengxian" style="width:15vw;height:3vh;margin-left:10vw"></div>
      </div>
    <div class="flex column center">
      <div class="monitor-left" style="border:0.5rem solid #263B5A;width:32vw;margin-top:3vh">
        <div class="title" style="color: white; font-size:2rem">授课信息</div>
        <div v-if="!courseRecord" style="color: grey;text-align: center">暂无上课信息</div>
        <div v-else-if="courseRecord" class="content">
          <div class="flex wrap" style="width:60vh;">
            <div style="color: white; font-size:1.5rem;width:8vw" class="flex between">
              <div>{{'课程名称：'}}</div>
              <div>{{courseRecord.course?courseRecord.course.name:''}}</div>
            </div>
            <div style="color: white; font-size:1.5rem;width:15vw" class="flex between">
              <div>{{"实验项目："}}</div>
              <div>{{courseRecord.program?courseRecord.program.name:''}}</div>
            </div>
            <div style="color: white; font-size:1.5rem;width:8vw" class="flex between">
              <div>{{"授课老师："}}</div>
              <div>{{courseRecord.teacher?courseRecord.teacher.name:''}}</div>
            </div>
            <div style="color: white; font-size:1.5rem;width:15vw" class="flex between">
              <div>{{"授课班级分组："}}</div>
              <div>{{courseRecord.clasz?courseRecord.clasz.name:''}}</div>
              <!-- <div>{{courseRecord.clasz?courseRecord.clasz.name:''}}</div> -->
            </div>
            <div style="color: white; font-size:1.5rem;width:10vw" class="flex between">
              <div>{{"上课时间："}}</div>
              <div>{{courseRecord.course?(courseRecord.extend.lessons[0] + '-' + 
              courseRecord.extend.lessons[courseRecord.extend.lessons.length-1] + '节'):''}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex column wrap" style="border:0.5rem solid #263B5A;width:32vw;margin-top:2vh">
        <div class="title" style="color: white; font-size:2rem;margin-left:1vh;margin-top:1vh">实验介绍</div>
        <div style="color: white; font-size:1.5rem;margin-left:1vh;margin-top:1vh;">
          {{courseRecord.clasz?courseRecord.program.purpose:''}}</div>
        <div class="title" style="color: white; font-size:2rem;margin-left:1vh;margin-top:1vh">实验原理</div>
        <div style="color: white; font-size:1.5rem;margin-left:1vh;margin-top:1vh;">
          {{courseRecord.clasz?courseRecord.program.steps:''}}</div>
        <div class="title" style="color: white; font-size:2rem;margin-left:1vh;margin-top:1vh">实验结果</div>
        <div style="color: white; font-size:1.5rem;margin-left:1vh;margin-top:1vh;">
          {{courseRecord.clasz?courseRecord.program.results:''}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { MonitorStationList } from '@/dao/monitorDao';
import {CourseRecordInClass} from '@/dao/courseRecordDao';

export default {
  name: 'lessonInfo',
  setup() {
    const loading = ref(false);
    const courseRecord = ref<any>();

    async function getLessonInfo() {
      await Promise.all([
        courseRecord.value = await CourseRecordInClass(),
      ]);
    }
    async function init() {
      try {
        await getLessonInfo();
      } catch (err) {}
    }
    return {
      loading, courseRecord,
      init,
    };
  },
};
</script>


<style scoped lang="scss">
  .yuan {
    background: url("../../assets/dashboard/yuan.png") no-repeat;
    background-size: 100% 100%;
  }
  .hengxian {
    background: url("../../assets/dashboard/hengxian.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
