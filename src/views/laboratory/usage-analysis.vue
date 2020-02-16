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
            <el-button type="primary" style="margin-left:15px">查询</el-button>
            <el-button type="success" style="margin-left:15px">导出原始Excel</el-button>
        </el-form-item>
    </el-form>
    <div style="margin: 10px 0" class="block_background" v-loading="loading">
      <div class="block_title flex between">
        <div>
          <span>实验人时数</span>
        </div>
        <el-button style="margin-right:20px" type="text">转换为散点</el-button>
      </div>    
    </div>
  </div>
</template>
<script lang="ts">
import { createComponent, ref, Ref, onMounted } from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import {EChartOption} from 'echarts';
import {IDevice, IParamConfig, IResponseData} from '@/types/beans';
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
    onMounted(useLoading(loading, async () => {
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
    }));
    return{
      loading, deviceNameList, deviceName, deviceParamList, deviceParam, timeRange,
    };
  },
});
</script>
<style scoped lang="scss">

</style>
