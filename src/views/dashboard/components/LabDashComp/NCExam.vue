<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:2rem;margin-top:1vh">
      <div class="yuan" style="width:2vw;height:3vh;margin-left:-1vh"></div>
      <div style="color:#28D0F1;width:8vw;font-weight:bold;font-size: 1.6rem;margin-left: 1vh">程序审核记录</div>
      <div class="hengxian" style="width:14vw;height:3vh;margin-left:8vw"></div>
    </div>
    <div v-if="ncProgramList.length === 0" class="flex center" 
      style="color:#28D0F1;font-weight:bold;font-size: 1.6rem;margin-top:5rem">暂无审核程序</div>
    <div style="height:100%;overflow:hidden;margin-top:2vh;margin-left:1vw;" class="flex column">
      <div v-for="(item,i) of ncProgramList.slice(0,8)" :key="i" class="flex"
        style="color:white;justify-content:space-around;align-items:center;font-size:1.2rem">
        <div style="width:3vw">{{item.student.name}}</div>
        <div style="width:3vw">{{item.station.name}}</div>
        <div style="width:3vw">
          <el-tag v-if="item.result === true" type="success">已通过</el-tag>
          <el-tag v-if="item.result === false" type="danger">未通过</el-tag>
          <el-tag v-if="item.result === undefined" type="warning">未审核</el-tag>
        </div>
        <div style="width:9vw">{{item.createDt}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, watch } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { NCExamList } from '@/dao/inClassDao';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { MonitorStationList } from '@/dao/monitorDao';
import {MonitorStationDetail} from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';
import {NewsList} from '@/dao/newsDao';

export default {
  name: 'NCExam',
  props: {
    courseRecord: {
      type: Object,
      default: () => {},
    },
  },
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const ncProgramList = ref<any>([]);
    const courseId = ref<any>({});
    const active = ref<boolean>(true);
    async function getData() {
      courseId.value = props.courseRecord;
      if (courseId.value.id) {
        await Promise.all([
          ncProgramList.value = await NCExamList({recordId: courseId.value.id}),
        ]);
      }
    }
    async function setData() {
      while (active.value) {
        await getData();
        await sleep(180000);
      }
    }
    async function init() {
      try {
        await setData();
      } catch (err) {}
    }
    watch(() => props.courseRecord, async () => {
      await setData();
    });
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, ncProgramList,
      init,
    };
  },
};
</script>


<style scoped lang="scss">
  .no-msg{
    color: white;
    text-align: center;
  }
  .yuan {
    background: url("../../../../assets/dashboard/yuan.png") no-repeat;
    background-size: 100% 100%;
  }
  .hengxian {
    background: url("../../../../assets/dashboard/hengxian.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
