<template>
  <div v-loading="loading">
    <div class="block-card">
      <div class="title">查询条件</div>
      <div class="content flex align-center">
        <div class="flex column" style="margin-right: 3rem">
          <div><el-radio v-model="condition" label="1" border>按课时查询</el-radio></div>
          <div style="margin-top: 10px"><el-radio v-model="condition" label="2" border>按日期查询</el-radio></div>
        </div>
        <div v-if="condition==='1'" class="flex center" style="width: 100%">
          <courseList mode="timeRange" :range="courseTimeRange"/>
        </div>
        <div v-else class="flex center" style="width: 100%">
          <lkt-date-picker type="daterange" v-model="range"/>
          <el-button type="primary" style="margin-left: 20px" @click="query">开始查询</el-button>
        </div>
      </div>
    </div>
    <div class="block-card" v-if="courseRecord || courseRecordList">
      <div class="title">课程情况</div>
      <div class="content" v-if="courseRecord">
        <el-form label-width="110px" label-position="left" style="width:100%" >
          <div class="flex align-center wrap course-content">
            <el-form-item label="课程名称：">{{ courseRecord.course?courseRecord.course.name:'' }}</el-form-item>
            <el-form-item label="实验项目：">{{ courseRecord.program?courseRecord.program.name:'' }}</el-form-item>
            <el-form-item label="授课老师：">{{ courseRecord.teacher?courseRecord.teacher.name:'' }}</el-form-item>
            <el-form-item label="授课班级分组：">{{ (courseRecord.clasz?courseRecord.clasz.name:'')+' '+(courseRecord.claszGroup?courseRecord.claszGroup.name:'') }}</el-form-item>
            <el-form-item label="上课人数：">{{ courseRecord.studentList?courseRecord.studentList.length:0 }}</el-form-item>
          </div>
        </el-form>
      </div>
      <div class="content" v-else style="padding-left: 2rem">
        <el-collapse accordion v-model="collapseVal">
          <el-collapse-item
            v-for="record in courseRecordList"
            :key="record.id"
            :title="handleCourseRecordTitle(record)" :name="record.id">
            <el-form label-width="110px" label-position="left" style="width:100%" >
              <div class="flex align-center wrap course-content">
                <el-form-item label="类型：">{{ getTypeName(record) }}</el-form-item>
                <el-form-item label="课程名称：">{{ record.course?record.course.name:'' }}</el-form-item>
                <el-form-item label="实验项目：">{{ record.program?record.program.name:'' }}</el-form-item>
                <el-form-item label="授课老师：">{{ record.teacher?record.teacher.name:'' }}</el-form-item>
                <el-form-item label="授课班级分组：">{{ (record.clasz?record.clasz.name:'')+' '+(record.claszGroup?record.claszGroup.name:'') }}</el-form-item>
                <el-form-item label="上课人数：">{{ record.studentList?record.studentList.length:'- -' }}</el-form-item>
                <el-form-item label="课程时间：">{{ record.startDt+' - '+record.endDt }}</el-form-item>
              </div>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="block-card" v-if="courseRecord || courseRecordList">
      <div class="title">操作台总览</div>
      <div class="flex column content">
        <div class="device-card flex align-center" v-for="(item,i) in stationList" :key="i">
          <div
            class="flex align-center"
            style="cursor: pointer"
            @click="$router.push({name:'monitorHistoryDetail', query:{
              id: item.id,
              start: dt[0].getTime(),
              end: dt[1].getTime(),
            }})">
            <div class="device-img">
              <img class="image" :src='ImageLink(item.extend.deviceImg)' alt="">
            </div>
            <div class="device-message">
              <div style="font-size: 1.1em;font-weight: 600">{{item.name}}</div>
              <div class="flex wrap">
                <el-tag
                  style="margin-right: 5px"
                  v-for=" s in item.extend.students"
                  :key="s.id" type="primary" size="small" >{{s.name}}</el-tag>
              </div>
            </div>
          </div>
          <div class="device-time" v-if="item.extend.deviceId">
            <v-chart
              style="width:100%; height: 90px"
              autoresize
              :options="times[item.extend.deviceId]"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, createComponent,watch } from '@vue/composition-api';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import courseList from '../../components/courseList.vue';
import { Message } from 'element-ui';
import { timelineConfig} from 'web-toolkit/src/utils/echarts-helper';
import {ImageLink} from '@/dao/commonDao';
import {StationList} from '@/dao/stationDao';
import {AnalysisDeviceTimes} from '@/dao/analysisDao';
import {statusMap} from '@/utils/device-utils';
import {CourseRecordDetail, CourseRecordList} from '@/dao/courseRecordDao';

export default createComponent({
  components: { courseList },
  setup() {
    const loading = ref(false);
    const condition = ref<string>('1');
    const range = ref<any>([]);
    const dt = ref<any>([new Date(), new Date()]);
    const stationList = ref<any>([]);
    const times = ref<any>({});
    const courseRecord = ref<any>();
    const courseRecordList = ref<any>();
    const courseTimeRange = ref<any>([null,null]);
    const collapseVal = ref<any>();

    watch(()=>courseTimeRange.value, ()=>{
      // 点击课时后直接查询
      if(courseTimeRange.value && courseTimeRange.value.length===2 && courseTimeRange.value[0]){
        useLoading(loading, query)();
      }
    });
    async function query() {
      if (condition.value === '1') {
        dt.value[0] = courseTimeRange.value[0];
        dt.value[1] = courseTimeRange.value[1];
      }
      else {
        if (range.value.length !== 2) {
          Message.error('请选择时间范围');
          return;
        }
        courseRecord.value = null;
        dt.value[0].setTime(range.value[0].getTime());
        dt.value[1].setTime(range.value[1].getTime());
        dt.value[0].setHours(0); dt.value[0].setMinutes(0); dt.value[0].setSeconds(0); dt.value[0].setMilliseconds(0);
        dt.value[1].setHours(0); dt.value[1].setMinutes(0); dt.value[1].setSeconds(0); dt.value[1].setMilliseconds(0);
        dt.value[1] = new Date(dt.value[1].getTime() + 24 * 3600 * 1000);
      }
      // 获取courseRecord list
      courseRecordList.value = await CourseRecordList({
        start: dt.value[0].getTime(),
        end: dt.value[1].getTime(),
      });
      if(courseRecordList.value && courseRecordList.value.length>0){
        collapseVal.value = courseRecordList.value[0].id
      }
      const list = await AnalysisDeviceTimes({
        start: dt.value[0].getTime(),
        end: dt.value[1].getTime(),
        needSummary: false,
      });
      for (const d of list) {
        const time = d.extend.times || [];
        times.value[d.id] = timelineConfig(time, statusMap, { height: 40, dataZoomTop: 70, dataZoom: true, showTime: true });
      }
    }
    onMounted(useLoading(loading, async () => {
      stationList.value = await StationList({simple: false});
      for (const station of stationList.value) {
        if (station.deviceList && station.deviceList.length > 0) {
          const device = station.deviceList[0];
          // 数据二次处理
          station.extend.deviceId = device.id;
          station.extend.deviceImg = device.deviceType.img;
        }
      }
    }));
    function handleCourseRecordTitle(record: any) {
      if (record.course) { return record.course.name; }
      if (record.type === 1) { return '授课预约'; }
      if (record.type === 2) { return '个人预约'; }
    }
    function getTypeName(record: any) {
      switch (record.type) {
        case 0: return '计划内课程';
        case 1: return '授课预约';
        case 2: return '个人预约';
      }
    }
    return{
      loading, condition, range, dt,
      stationList, times,
      ImageLink,
      courseRecord, courseRecordList,
      query: useLoading(loading, query),
      handleCourseRecordTitle,
      getTypeName, courseTimeRange, collapseVal
    };
  },
});
</script>
<style scoped lang="scss">
  .device-card {
    width: 100%;
    margin-bottom: 10px;
    .device-img {
      width: 100px;
      img {
        width: 100%;
      }
    }
    .device-message {
      padding-left: 10px;
      width: 100px;
    }
    .device-time{
      width: 100%;
      padding-right: 10px;
    }
  }
  .course-content{
    .el-form-item{
      width: 48%;
      margin-bottom: 10px;
    }
  }
</style>
