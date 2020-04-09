<template>
  <div v-loading="loading">
    <div class="monitor flex">
      <div class="block-card monitor-left">
        <div class="title">上课信息</div>
        <div v-if="!courseRecord" style="color: grey;text-align: center">暂无上课信息</div>
        <div v-else class="content">
          <el-form label-width="110px" label-position="left" style="width:100%;margin-top:20px" >
            <div class="flex align-center wrap course-content">
              <el-form-item label="课程名称：">{{ courseRecord.course?courseRecord.course.name:'' }}</el-form-item>
              <el-form-item label="实验项目：">{{ courseRecord.program?courseRecord.program.name:'' }}</el-form-item>
              <el-form-item label="授课老师：">{{ courseRecord.teacher?courseRecord.teacher.name:'' }}</el-form-item>
              <el-form-item label="授课班级分组：">{{ (courseRecord.clasz?courseRecord.clasz.name:'')+' '+(courseRecord.claszGroup?courseRecord.claszGroup.name:'') }}</el-form-item>
              <el-form-item label="上课人数：">{{ courseRecord.studentList?courseRecord.studentList.length:'- -' }}</el-form-item>
              <el-form-item label="距离下课时间：">{{ timeCount.timeValue }}</el-form-item>
            </div>
            <el-form-item label="本课程进度：">
              <div style="margin-top: 8px">
                <el-progress :text-inside="true" :stroke-width="22" :percentage="percentage()" status="success"/>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="block-card monitor-right">
        <div class="title">设备状态统计</div>
        <div class="flex align-center center">
          <v-chart
            autoresize
            style="width:300px;height: 200px"
            :options="chart"/>
        </div>
      </div>
    </div>
    <div class="block-card monitor-device">
      <div class="title">操作台总览</div>
      <div class="flex center wrap content">
        <div class="device-card" v-for="(item,i) in stationList" :key="i">
          <div
            class="flex align-center center"
            style="cursor: pointer"
            @click="$router.push({name:'monitorDetail', params:{id:item.id}})">
            <div class="device-img">
              <img class="image" :src='ImageLink(item.extend.deviceImg)' alt="">
            </div>
            <div class="device-message">
              <div style="font-size: 1.1em;font-weight: 600">{{item.name}}</div>
              <el-tag style="margin-bottom: 5px" :type="statusMap(item.extend.status) && statusMap(item.extend.status).tag">{{ statusMap(item.extend.status) && statusMap(item.extend.status).arrName }}</el-tag>
              <div class="flex wrap">
                <div
                  v-for="s in item.extend.students"
                  :key="s.id"
                  style="margin-right: 5px">{{s.name}}</div>
<!--                <el-tag-->
<!--                  style="margin-right: 5px"-->
<!--                  v-for=" s in item.extend.students"-->
<!--                  :key="s.id" type="primary" size="small" >{{s.name}}</el-tag>-->
              </div>
            </div>
          </div>
          <div class="device-time">
            <v-chart
              style="width:100%; height: 70px"
              autoresize
              :options="times[item.extend.deviceId]"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted, createComponent, onUnmounted} from '@vue/composition-api';
import {useLoading, useConfirm} from 'web-toolkit/src/service';
import {Message} from 'element-ui';
import {leftFill0} from 'web-toolkit/src/utils';
import {statusMap} from '@/utils/device-utils';
import {CourseRecordInClass} from '@/dao/courseRecordDao';
import {MonitorStationList} from '@/dao/monitorDao';
import {ImageLink} from '@/dao/commonDao';
import {AnalysisDeviceTimes} from '@/dao/analysisDao';
import {timelineConfig} from 'web-toolkit/src/utils/echarts-helper';

export default createComponent({
  name: 'monitor',
  props: {},
  setup(props: any, ctx: any) {
    const loading = ref(false);
    const courseRecord = ref<any>();
    const stationList = ref<any>([]);
    const chart = ref<any>({});
    const times = ref<any>({});

    const percentage = () => {
      const now = new Date().getTime();
      const start = new Date(courseRecord.value.startDt).getTime();
      const end = new Date(courseRecord.value.endDt).getTime();
      let ratio = 100 * (now - start) / (end - start);
      if (ratio > 100) { ratio = 100; }
      return parseInt(ratio.toFixed(0));
    };
    const timeDiff = (time2: any) => {
      if (!time2) { return ; }
      const dateDiff = time2.getTime() - new Date().getTime();
      const hours = Math.floor(dateDiff / (3600 * 1000));
      const leave1 = dateDiff % (3600 * 1000);
      const minutes = Math.floor(leave1 / (60 * 1000));
      const leave2 = leave1 % (60 * 1000);     // 计算分钟数后剩余的毫秒数
      const seconds = Math.round(leave2 / 1000);
      return leftFill0(hours) + ' : ' + leftFill0(minutes) + ' : ' + leftFill0(seconds);
    };
    function countTime(this: any) {
      timeCount.value.timeValue = timeDiff(new Date(courseRecord.value.endDt));
      if (new Date(timeCount.value.timeIf) <= new Date() ) {
        clearInterval(timer);
      }
    }
    const timeCount = ref<any>({
      timeValue: null,
      timeIf: null,
    });
    const timer = setInterval(countTime, 1000);
    function summaryHandle(summary: any, key: string) {
      if (summary[key]) {
        summary[key] = summary[key] + 1;
      } else {
        summary[key] = 1;
      }
    }
    async function fetchTimes() {
      const d2 = new Date();
      const d1 = new Date();
      d1.setHours(d1.getHours() - 1);
      const list = await AnalysisDeviceTimes({
        start: d1.getTime(),
        end: d2.getTime(),
        needSummary: false,
      });
      for (const d of list) {
        const time = d.extend.times || [];
        times.value[d.id] = timelineConfig(time, statusMap, { height: 30, dataZoom: false, showTime: true });
      }
    }
    onUnmounted(() => {
        clearInterval(timer);
    });
    onMounted(useLoading(loading, async () => {
      await Promise.all([
        courseRecord.value = await CourseRecordInClass(),
        stationList.value = await MonitorStationList(),
      ]);
      console.log(stationList.value);
      
      if (courseRecord.value === undefined) {
        clearInterval(timer);
      } else {
        timeCount.value.timeIf = courseRecord.value.endDt;
      }
      const data = [];
      const summary: any = {};
      for (const station of stationList.value) {
        if (!station.deviceList || station.deviceList.length === 0) {
          summaryHandle(summary, 'offline');
          station.extend.status = 'offline';
        } else {
          const device = station.deviceList[0];
          if (device.extend.status) {
            summaryHandle(summary, device.extend.status);
          } else {
            summaryHandle(summary, 'offline');
          }
          station.extend.status = device.extend.status;
          // 数据二次处理
          station.extend.deviceId = device.id;
          station.extend.deviceImg = device.deviceType.img;
          if (courseRecord.value && courseRecord.value.stationBind && courseRecord.value.stationBind[station.id.toString()]) {
            station.extend.students = courseRecord.value.stationBind[station.id.toString()];
          }
        }
      }
      for (const key of Object.keys(summary)) {
        data.push({
          name: statusMap(key).arrName,
          itemStyle: {
            color: statusMap(key).color,
          },
          value: summary[key],
        });
      }
      chart.value = {
        series: [{
          name: '设备数量',
          type: 'pie',
          data,
          radius: 50,
          label: {
            formatter: '{b}：{c}',
            fontSize: 14,
          },
        }],
      };
      // todo times的异步动态添加无效
      await fetchTimes();
      timer;
    }));
    return {
      loading, courseRecord,
      timeDiff, chart, times,
      stationList, countTime,
      ImageLink, timeCount, timer,
      percentage, statusMap,
    };
  },
});
</script>
<style scoped lang="scss">
  .monitor {
    .monitor-left {
      margin-right: 2%;
      width: 60%;
      height: 270px;
      .el-form * {
        font-size: 1rem;
      }
      .content{
        padding-top: 0;
      }
    }
    .monitor-right {
      width: 39%;
      height: 270px;
      .el-form * {
        font-size: 1rem;
      }
      .el-form-item {
        margin-bottom: 5px;
      }
    }
  }

  .monitor-device {
    margin-top: 10px;
    .device-card {
      width: 24%;
      margin-right: 20px;
      .device-img {
        width: 150px;
        img {
          width: 100%;
        }
      }
      .device-message {
        padding-left: 10px;
        width: 100px;
      }
      .device-time{
        padding-right: 10px;
      }
    }
  }
  .course-content{
    .el-form-item{
      width: 48%;
      margin-bottom: 10px;
    }
  }
</style>
