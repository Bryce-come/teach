<template>
  <div class="flex column" style="justify-content:space-around" v-loading="loading">
    <div style="color: white; font-size:3rem">授课内容</div>
    <div class="flex column center">
      <div class="monitor-left" style="border:0.1rem solid white;width:32vw;">
        <div class="title" style="color: white; font-size:2rem">授课信息</div>
        <div v-if="!courseRecord" style="color: grey;text-align: center">暂无上课信息</div>
        <div v-else-if="courseRecord" class="content">
          <div class="flex wrap" style="width:60vh">
            <div style="color: white; font-size:1.5rem">{{'课程名称：' + (courseRecord.course?courseRecord.course.name:'') }}</div>
            <div style="color: white; font-size:1.5rem">{{"实验项目：" + (courseRecord.program?courseRecord.program.name:'') }}</div>
            <div style="color: white; font-size:1.5rem">{{"授课老师：" + (courseRecord.teacher?courseRecord.teacher.name:'') }}</div>
            <div style="color: white; font-size:1.5rem">{{"授课班级分组：" + (courseRecord.clasz?courseRecord.clasz.name:'')
              +' '+(courseRecord.claszGroup?courseRecord.claszGroup.name:'') }}</div>
            <div style="color: white; font-size:1.5rem">{{'上课时间：' + 
              (courseRecord.course?(courseRecord.extend.lessons[0] + '-' + 
              courseRecord.extend.lessons[courseRecord.extend.lessons.length-1] + '节'):'') }}</div>
          </div>
        </div>
      </div>
      <div class="flex column wrap" style="border:0.1rem solid white;width:32vw;">
        <div class="title" style="color: white; font-size:2rem">实验介绍</div>
        <div style="color: white; font-size:1.5rem">{{courseRecord.clasz?courseRecord.program.purpose:''}}</div>
        <div class="title" style="color: white; font-size:2rem">实验原理</div>
        <div style="color: white; font-size:1.5rem">{{courseRecord.clasz?courseRecord.program.steps:''}}</div>
        <div class="title" style="color: white; font-size:2rem">实验结果</div>
        <div style="color: white; font-size:1.5rem">{{courseRecord.clasz?courseRecord.program.results:''}}</div>
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
</style>
