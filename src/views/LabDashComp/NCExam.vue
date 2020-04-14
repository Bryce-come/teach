<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:2rem;margin-top:1vh">
      <div class="yuan" style="width:2vw;height:3vh"></div>
      <div style="color:#28D0F1;font-weight:bold;font-size: 2rem;margin-left: 1rem">程序审核记录</div>
      <div class="hengxian" style="width:14vw;height:3vh;margin-left:8vw"></div>
    </div>
    <div style="height:100%;overflow:hidden;margin-top:2vh;margin-left:1vw" class="flex column">
      <div v-for="(item,i) of ncProgramList.slice(0,8)" :key="i" class="flex"
        style="color:white;justify-content:space-around;align-items:center;font-size:1.5rem">
        <div>{{item.student.name}}</div>
        <div>{{item.station.name}}</div>
        <div>
          <el-tag v-if="item.result === true" type="success">通过审核</el-tag>
          <el-tag v-if="item.result === false" type="danger">未通过审核</el-tag>
          <el-tag v-if="item.result === undefined" type="warning">未审核</el-tag>
        </div>
        <div>{{item.createDt}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { NCExamList } from '../../dao/inClassDao';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { MonitorStationList } from '@/dao/monitorDao';
import {MonitorStationDetail} from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';
import {NewsList} from '@/dao/newsDao';

export default {
  name: 'NCExam',
  setup() {
    const loading = ref(false);
    const ncProgramList = ref<any>([]);
    const courseRecord = ref<any>([]);
    const active = ref<boolean>(true);
    async function getData() {
      await Promise.all([
        courseRecord.value = await CourseRecordInClass(),
        ncProgramList.value = await NCExamList({recordId: courseRecord.value.id}),
      ]);
    }
    async function setData() {
      while (active.value) {
        await getData();
        await sleep(21600000);
      }
    }
    async function init() {
      try {
        await setData();
      } catch (err) {}
    }
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
    background: url("../../assets/dashboard/yuan.png") no-repeat;
    background-size: 100% 100%;
  }
  .hengxian {
    background: url("../../assets/dashboard/hengxian.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
