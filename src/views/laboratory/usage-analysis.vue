<template>
  <div v-loading="loading" class="usage-analysis">
    <el-form :inline="true">
      <el-form-item label="设备名称" label-width="80px">
        <lkt-select :list="deviceNameList" value-key="name" v-model="deviceName" :clearable="false" placeholder="请选择设备名称"/>
      </el-form-item>
      <el-form-item label="属性参数" label-width="80px">
        <lkt-select :list="deviceParamList" value-key="param" v-model="deviceParam" :clearable="false" placeholder="请选择参数"/>
      </el-form-item>
      <el-form-item label="时间范围:" label-width="80px">
            <el-date-picker v-model="timeRange" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            <el-button type="primary" style="margin-left:15px" @click="query()">查询</el-button>
            <el-button type="success" style="margin-left:15px">导出原始Excel</el-button>
        </el-form-item>
    </el-form>
    <div style="margin: 10px 0" class="block_background" v-loading="loading">
      <div class="block_title flex between">
        <div>
          <span>{{deviceName + '-' + deviceParam}}</span>
        </div>
        <el-button style="margin-right:20px" type="text">转换为散点</el-button>
      </div>
      <div class="block_content">
        <v-chart autoresize :options="chart" @datazoom="dataZoomEvent" style="width: 95%; height: 500px"/></div>    
    </div>
  </div>
</template>
<script lang="ts">
import { createComponent, ref, Ref, onMounted } from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import {EChartOption} from 'echarts';
import {IDevice, IParamConfig, IResponseData} from '@/types/beans';
import {isString, debounce, assert, formatTime} from 'web-toolkit/src/utils';
import {getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';
interface ILimit {
  datetimeRange: Date[];
  sample: boolean;
  series: Array<{
    device: IDevice;
    params: IParamConfig[];
  }>;
}
export default createComponent({
  name: 'parameter-history',
  setup() {
    const loading = ref(false);
    const deviceNameList = ref<any>();
    const deviceName = ref<any>();
    const deviceParamList = ref<any>();
    const deviceParam = ref<any>();
    const timeRange = '';
    const chart: Ref<EChartOption | void> = ref(undefined);
    const zoomRange: Ref<Date[]> = ref([]);
    const limit: Ref<ILimit> = ref({
      datetimeRange: [],
      sample: true,
      series: [],
    });
    const query = async () => {
      deviceNameList.value = [
        {id: '001', collector: '', name: '工控机', type: {id: '0', name: 'NLJT1', img: '', extend: {ctrName: ''}},
        createDt: '', extend: {ip: '192.168.0.101', buyDt: '2019-12-23', keeper: '', maintenTime: '', address: '浙江自动化学院实验室01', price: '', producer: '浙江金华机床厂',
        producerContact: '', producerTel: '18977538970'}},
        {id: '002', collector: '', name: '切削机', type: {id: '1', name: 'NLJT2', img: '', extend: {ctrName: ''}},
        createDt: '', extend: {ip: '192.168.0.102', buyDt: '2019-12-23', keeper: '', maintenTime: '', address: '浙江自动化学院实验室02', price: '', producer: '浙江金华机床厂',
        producerContact: '', producerTel: '18977538970'}},
        {id: '003', collector: '', name: '磨光机', type: {id: '2', name: 'NLJT3', img: '', extend: {ctrName: ''}},
        createDt: '', extend: {ip: '192.168.0.103', buyDt: '2019-12-23', keeper: '', maintenTime: '', address: '浙江自动化学院实验室03', price: '', producer: '浙江金华机床厂',
        producerContact: '', producerTel: '18977538970'}},
      ];
      deviceParamList.value = [
        {id: '1', param: '实验人时数'}, {id: '2', param: '运行时间'},
      ];
      const option: any = getOption();
    };
    function getOption() {
      const yName = '';
      return {
        legend: {
          show: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            if (params.length === 0) { return ''; }
            let res = '';
            const date = new Date(params[0].data[0]);
            res += '<div>' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + formatTime(date) + '</div>';
            for (const p of params) {
              res += `${p.marker}<span>${p.seriesName}: ${p.data[1]}</span><br/>`;
            }
            return res;
          },
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
            // saveAsImage: {
            //   name: param.nameFull,
            //   backgroundColor: '#0a1931',
            //   iconStyle: {
            //     borderColor: 'black',
            //   },
            // },
          },
        },
        // calculable: true,
        xAxis: {
          // min: currentChartRange[0].getTime(),
          // max: currentChartRange[1].getTime(),
          type: 'time',
          name: '时间',
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
      };
    }
    function dataZoomEvent(data: any) {
      zoomRange.value = [];
      // const dir = currentChartRange[1].getTime() - currentChartRange[0].getTime();
      // zoomRange.value.push(new Date(currentChartRange[0].getTime() + dir * data.start / 100));
      // zoomRange.value.push(new Date(currentChartRange[0].getTime() + dir * data.end / 100));
    }
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
      loading, deviceNameList, deviceName, deviceParamList, deviceParam, timeRange, query,
      chart, zoomRange, limit,
      dataZoomEvent: debounce(dataZoomEvent, { interval: 500 }),
    };
  },
});
</script>
<style scoped lang="scss">

</style>
