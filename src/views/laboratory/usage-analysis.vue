<template>
  <div v-loading="loading" class="usage-analysis">
    <div style="display:flex;justify-content:center;margin-bottom:15px">
      <el-button :type="numButton? 'primary':''" style="width:200px" @click="showNum()">实验人时数分析</el-button>
      <el-button :type="timeButton? 'primary':''" style="width:200px;margin-left:5px" @click="showTime()">操作台运行时间分析</el-button>
    </div>
    <div v-show="numButton">
      <el-form :inline="true" >
        <el-form-item label="课程名称:" label-width="100px">
          <el-select v-model="courseName" :clearable="true" multiple placeholder="请选择课程名称">
            <el-option
              v-for="item of courseNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围:" label-width="100px">
          <lkt-date-picker v-model="timeRange" :clearable="false"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left:15px" @click="queryNum()">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0" class="block_background" v-loading="loading">
        <div class="block_title flex between">
          <div>
            <span>实验人时数分析</span>
          </div>
        </div>
        <div class="block_content">
          <v-chart autoresize :options="chart" style="width: 95%; height: 500px"/>
        </div>
      </div>
    </div>
    <div v-show="timeButton">
      <el-form :inline="true">
        <el-form-item label="操作台名称:" label-width="100px">
          <!-- <el-select v-model="deviceName" :clearable="false" placeholder="请选择操作台名称">
            <el-option
              v-for="item1 of stationNameList"
              :key="item1.id"
              :label="item1.name"
              :value="item1"/>
          </el-select> -->
          <lkt-select :list="stationNameList" value-key="name" option-value-key="id" v-model="deviceName" placeholder="请选择操作台名称"/>
        </el-form-item>
        <el-form-item label="时间范围:" label-width="100px">
          <lkt-date-picker v-model="timeRange1" :clearable="false"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left:15px" @click="queryTime()">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0" class="block_background" v-loading="loading">
        <div class="block_title flex between">
          <div v-if="oneStation">{{oneStation.name}}运行时间分析</div>
        </div>
        <div class="block_content">
          <div class="time-chart flex center align-center" v-if="timeList.length>0">
            <v-chart :autoresize="true" :options="pie" class="pie"/>
            <v-chart :autoresize="true" :options="line" class="timeline"/>
          </div>
          <lkt-table class="time-table" :data="timeList">
            <el-table-column label="设备状态">
              <div slot-scope="{row}">
                <el-tag :type="statusMap(row.status).tag">{{statusMap(row.status).arrName}}</el-tag>
              </div>
            </el-table-column>
            <el-table-column label="开始时间" prop="dt" sortable="custom"
                             :formatter="(row, column, cellValue)=>{ return cellValue.replace(/\//g,'-') }"/>
            <el-table-column label="持续时间" prop="duration" sortable="custom"
                             :formatter="(row, column, cellValue)=>{ return formatMilliseconds(cellValue) }"/>
            <el-table-column label="结束时间">
              <div class="flex" slot-scope="{row}">
                {{ new Date(new Date(row.dt).getTime()+row.duration)|datetime }}
              </div>
            </el-table-column>
          </lkt-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {createComponent, ref, Ref, onMounted} from '@vue/composition-api';
import {useLoading} from 'web-toolkit/src/service';
import {debounce} from 'web-toolkit/src/utils';
import {getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';
import {StationList, StationInfo} from '@/dao/stationDao';
import {sleep, formatMilliseconds} from 'web-toolkit/src/utils';
import {statusMap} from '@/utils/device-utils';
import {timelineConfig, timesPieConfig, lineConfig} from 'web-toolkit/src/utils/echarts-helper';
import {AnalysisDeviceTime, AnalysisCourseManClassHours} from '@/dao/analysisDao';
import {CourseList} from '@/dao/courseProgramDao';

export default createComponent({
  name: 'parameter-history',
  setup() {
    const loading = ref(false);
    const numButton = ref(true);
    const timeButton = ref(false);
    const currentChartRange: Date[] = [new Date(), new Date()];
    const deviceNameList = ref<any[]>([]);
    const deviceName = ref<any>();
    const stationNameList = ref<any>();
    const oneStation = ref<any>();
    const pie = ref({});
    const line = ref({});
    const timeList: Ref<any[]> = ref([]);
    const courseNameList = ref<any>([]);
    const courseName = ref<any>([]);
    const timeRange = ref([new Date(Date.now() - 30 * 24 * 3600000), new Date()]);
    const timeRange1 = ref([new Date(Date.now() - 6 * 3600000), new Date()]);
    const chart = ref(undefined);
    const zoomRange: Ref<Date[]> = ref([]);
    const queryNum = async () => {
      const start = timeRange.value[0].getTime();
      const end = timeRange.value[1].getTime();
      // 第一个页面
      const option: any = initLine();
      // let series = {};
      // let dataset = {};
      const num = await AnalysisCourseManClassHours({
        courseJson: courseName.value ? JSON.stringify(courseName.value) : null,
        start,
        end,
      });
      if (num && num.length !== 0 ) {
        for (const item of num) {
          option.x.push(item.x);
          option.y[0].data.push(item.y);
          option.y[0].name = '人时数统计';
        }
      }
      chart.value = lineConfig(option,{series:[{type: 'bar'}]});
    };
    const queryTime = async () => {
      const start = timeRange1.value[0].getTime();
      const end = timeRange1.value[1].getTime();
       oneStation.value = await StationInfo({
        id: deviceName.value,
      });
      const data = await AnalysisDeviceTime({
        deviceId: oneStation.value.deviceList && oneStation.value.deviceList.length ? oneStation.value.deviceList[0].id : null ,
        start,
        end,
      });
      timeList.value = data.list;
      if (data.list.length > 0) {
        pie.value = timesPieConfig(data.summary, {}, statusMap);
        line.value = timelineConfig(data.list, statusMap, {
          left: '2%',
          top: 0,
          showTime: true,
          dataZoom: true,
          confine: true,
        });
      }
    };

    const queryStation = async () => {
      stationNameList.value = await StationList({
        simple: false,
      });
      // for (const item of stationNameList.value) {
      //   if (item.deviceList && item.deviceList.length !== 0) {
      //     deviceNameList.value.push(item.deviceList[0]);
      //   }
      // }
      deviceName.value = stationNameList.value && stationNameList.value[0] && stationNameList.value[0].deviceList.length !== 0 ? stationNameList.value[0].id : null;
    };
    // 人时数分析
    const showNum = async () => {
      numButton.value = true;
      timeButton.value = false;
      // timeRange.value = [new Date(Date.now() - 30 * 24 * 3600000), new Date()];
      // courseName.value = [];
      // useLoading(loading, queryNum)();
    };
    // 运行时间分析
    const showTime = async () => {
      numButton.value = false;
      timeButton.value = true;
      // deviceName.value = deviceNameList.value && deviceNameList.value.length !== 0 ? deviceNameList.value[0].id : null;
      // useLoading(loading, queryTime)();
    };
    onMounted(useLoading(loading, async () => {
      courseNameList.value = await CourseList({
        containPrograms: true,
      });
      await queryStation();
      await queryTime();
      await queryNum();
    }));
    return {
      loading, deviceNameList, deviceName, timeRange,
      queryTime: useLoading(loading, queryTime),
      queryNum: useLoading(loading, queryNum),
      chart, zoomRange,
      stationNameList,
      courseNameList, courseName, pie, line,
      // dataZoomEvent: debounce(dataZoomEvent, {interval: 500}),
      queryStation, timeList, statusMap, formatMilliseconds, timeRange1, currentChartRange,
      numButton, timeButton,
      showNum,
      showTime,
      oneStation,
    };
  },
});
function initLine() {
  return {
      x: [], y: [{name: '人时数分析', data: []} ],
  };
}
</script>

<style scoped lang="scss">
  .pie {
    width: 20%;
    height: 250px;
  }

  .timeline {
    width: 80%;
    height: 100px;
  }
</style>
