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
          <v-chart autoresize :options="chart" @datazoom="dataZoomEvent" style="width: 95%; height: 500px"/>
        </div>
      </div>
    </div>
    <div v-show="timeButton">
      <el-form :inline="true">
        <el-form-item label="设备名称:" label-width="100px">
          <el-select v-model="deviceName" :clearable="false" placeholder="请选择设备名称">
            <el-option
              v-for="item1 of deviceNameList"
              :key="item1.id"
              :label="item1.name"
              :value="item1.id"/>
          </el-select>
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
          <div>
            <span>运行时间分析</span>
          </div>
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
import {StationList} from '@/dao/stationDao';
import {sleep, formatMilliseconds} from 'web-toolkit/src/utils';
import {statusMap} from '@/utils/device-utils';
import {timelineConfig, timesPieConfig} from 'web-toolkit/src/utils/echarts-helper';
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
      const option: any = getOption();
      let series = {};
      let dataset = {};
      const num = await AnalysisCourseManClassHours({
        courseJson: courseName.value ? JSON.stringify(courseName.value) : null,
        start,
        end,
      });
      series = {
        type: 'line',
        symbolSize: 3,
        lineStyle: {width: 4},
      };
      dataset = {
        dimensions: ['x', 'y'],
        source: num,
      };
      option.series = series;
      option.dataset = dataset;
      chart.value = option;
    };
    const queryTime = async () => {
      const start = timeRange1.value[0].getTime();
      const end = timeRange1.value[1].getTime();
      const data = await AnalysisDeviceTime({
        deviceId: deviceName.value,
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
    function getOption() {
      const yName = '';
      const xName = '';
      return {
        legend: {
          show: true,
        },
        tooltip: {
          trigger: 'axis',
          // formatter: (params: any) => {
          //   if (params.length === 0) { return ''; }
          //   let res = '';
          //   const date = new Date(params[0].data[0]);
          //   res += '<div>' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + formatTime(date) + '</div>';
          //   for (const p of params) {
          //     res += `${p.marker}<span>${p.seriesName}: ${p.data[1]}</span><br/>`;
          //   }
          //   return res;
          // },
        },
        color: getColors(),
        toolbox: {
          feature: {
            restore: {
              title: '还原',
              iconStyle: {
                borderColor: 'black',
              },
            },
          },
        },
        // calculable: true,
        xAxis: {
          // min: currentChartRange[0].getTime(),
          // max: currentChartRange[1].getTime(),
          type: 'value',
          name: '课程',
          nameGap: 2,
          nameTextStyle: {
            color: getColor(),
            fontSize: 14,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: getColor(),
            },
          },
        },
        yAxis: {
          type: 'value',
          name: yName,
          nameTextStyle: {
            color: getColor(),
            fontSize: 16,
          },
          axisLine: {
            lineStyle: {
              color: getColor(),
            },
          },
          splitLine: {
            show: false,
          },
        },
        grid: {
          bottom: '15%',
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            dataBackground: {
              areaStyle: {
                color: getColors(),
              },
            },
            textStyle: {
              color: getColors(),
            },
            realtime: true,
            showDataShadow: true,
            bottom: 5,
          },
        ],
        series: [],
        dataset: {},
      };
    }

    function dataZoomEvent(data: any) {
      zoomRange.value = [];
      const dir = currentChartRange[1].getTime() - currentChartRange[0].getTime();
      zoomRange.value.push(new Date(currentChartRange[0].getTime() + dir * data.start / 100));
      zoomRange.value.push(new Date(currentChartRange[0].getTime() + dir * data.end / 100));
    }

    const queryStation = async () => {
      stationNameList.value = await StationList({
        simple: false,
      });
      for (const item of stationNameList.value) {
        if (item.deviceList && item.deviceList.length !== 0) {
          deviceNameList.value.push(item.deviceList[0]);
        }
      }
      deviceName.value = deviceNameList.value && deviceNameList.value.length !== 0 ? deviceNameList.value[0].id : null;
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
      dataZoomEvent: debounce(dataZoomEvent, {interval: 500}),
      queryStation, timeList, statusMap, formatMilliseconds, timeRange1, currentChartRange,
      numButton, timeButton,
      showNum,
      showTime,
    };
  },
});
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
