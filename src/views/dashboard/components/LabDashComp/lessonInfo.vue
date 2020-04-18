<template>
  <div class="flex column" style="justify-content:space-around" v-loading="loading">
    <div class="flex" style="margin-left:1rem;margin-top:1vh;">
        <div class="yuan" style="width:2vw;height:3vh"></div>
        <div style="color:#28D0F1;font-weight:bold;font-size: 2rem;margin-left: 1rem">授课内容</div>
        <div class="hengxian" style="width:15vw;height:3vh;margin-left:10vw"></div>
      </div>
    <div class="flex column center">
      <div v-if="!courseRecord" style="color:#28D0F1;font-weight:bold;font-size:2rem;text-align:center;margin-top: 3rem">暂无上课信息</div>
      <div v-if="courseRecord" class="monitor-left" style="border:0.5rem solid #263B5A;width:32vw;margin-top:3vh;overflow:hidden">
        <div v-if="courseRecord" class="title" style="color:#28D0F1;font-weight:bold;font-size: 2rem;margin-top:1vh;margin-left:1vh">授课信息</div>
        <div v-if="courseRecord" class="content" style="margin-left:1vh;margin-top:1vh;color: white; font-size:1.7rem;">
          <div class="flex wrap between" style="width:60vh;">
            <div style="width:8vw" class="flex between">
              <div>{{'课程名称：'}}</div>
              <div>{{courseRecord.course?courseRecord.course.name:''}}</div>
            </div>
            <div style="width:18vw" class="flex between">
              <div>{{"实验项目："}}</div>
              <div>{{courseRecord.program?courseRecord.program.name:''}}</div>
            </div>
            <div style="width:8vw;margin-top:1vh" class="flex between">
              <div>{{"授课老师："}}</div>
              <div>{{courseRecord.teacher.name?courseRecord.teacher.name:''}}</div>
            </div>
            <div style="width:18vw;margin-top:1vh" class="flex between">
              <div>{{"授课班级分组："}}</div>
              <div>{{courseRecord.clasz?courseRecord.clasz.name:''}}</div>
              <div>{{courseRecord.claszGroup?courseRecord.claszGroup.name:''}}</div>
            </div>
            <div style="width:18vw;margin-top:1vh;;margin-bottom:1vh" class="flex between">
              <div>{{"上课时间："}}</div>
              <div>{{courseRecord.course?('第' + courseRecord.extend.lessons[0] + '-' + 
              courseRecord.extend.lessons[courseRecord.extend.lessons.length-1] + '节'):''}}</div>
              <div>{{lessonTime.str + '-' + lessonTime.end}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex column wrap" style="border:0.5rem solid #263B5A;width:32vw;margin-top:2vh;max-height:40vh;overflow:hidden;" v-if="courseRecord&&courseRecord.program">
        <div class="title" style="color: white; font-size:2rem;margin-left:1vh;margin-top:1vh">实验介绍</div>
        <div style="color: white; font-size:1.5rem;margin-left:1vh;margin-top:1vh;">
          {{courseRecord.program.purpose?courseRecord.program.purpose:''}}</div>
        <div class="title" style="color: white; font-size:2rem;margin-left:1vh;margin-top:1vh">实验原理</div>
        <div style="color: white; font-size:1.5rem;margin-left:1vh;margin-top:1vh;">
          {{courseRecord.program.steps?courseRecord.program.steps:''}}</div>
        <div class="title" style="color: white; font-size:2rem;margin-left:1vh;margin-top:1vh">实验结果</div>
        <div style="color: white; font-size:1.5rem;margin-left:1vh;margin-top:1vh;margin-bottom:1vh;">
          {{courseRecord.program.results?courseRecord.program.results:''}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, onBeforeUpdate } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { sleep } from 'web-toolkit/src/utils';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { MonitorStationList } from '@/dao/monitorDao';
import {CourseRecordInClass} from '@/dao/courseRecordDao';
import {SettingGet} from '@/dao/settingDao';

export default {
  name: 'lessonInfo',
  props: {
    courseRecord: {
      type: Object,
      default: () => {},
    },
  },
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const courseId = ref<any>({});
    const lessonMap = ref<any>({});
    const lessonTime = ref<any>({
      str: undefined,
      end: undefined,
    });
    const active = ref<boolean>(true);
    async function getLessonInfo() {
      await Promise.all([
        lessonMap.value = await SettingGet({onlyLesson: true}),
      ]);
      courseId.value = props.courseRecord;
      lessonTime.value.str = new Date(lessonMap.value['lesson' + courseId.value.extend.lessons[0]][0]).toTimeString().slice(0, 8);
      lessonTime.value.end = new Date(lessonMap.value['lesson' + courseId.value.extend.lessons[courseId.value.extend.lessons.length - 1]][1]).toTimeString().slice(0, 8);
    }
    async function drawLine() {
      while (active.value) {
        await getLessonInfo();
        await sleep(600000);
      }
    }
    async function init() {
      try {
        await drawLine();
      } catch (err) {}
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, courseId,
      init, lessonTime,
    };
  },
};
</script>


<style scoped lang="scss">
  .yuan {
    background: url("../../../../assets/dashboard/yuan.png") no-repeat;
    background-size: 100% 100%;
  }
  .hengxian {
    background: url("../../../../assets/dashboard/hengxian.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
