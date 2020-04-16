<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex column" style="width:33vw;height:48vh;margin-top:1vh">
      <div class="flex center">
        <div id="video" style="padding:1rem 0;width:52vh;height:25vh;"></div>
      </div>
    </div>
    <div style="width:33vw;height:71vh;margin-top:1vh" class="bk">
      <div class="flex between" style="margin-left:1rem;margin-top:1vh">
        <div class="flex">
          <div class="yuan" style="width:2vw;height:3vh"></div>
          <div style="color:#28D0F1;font-weight:bold;font-size: 2rem;margin-left: 1rem">设备运行参数</div>
        </div>
        <div style="color:#28D0F1;font-weight:bold;font-size: 2rem;" v-if="stationList[sort.up]">{{'操作台名称：' + stationList[sort.up].name}}</div>
      </div>
      <div
        v-if="paramList"
        class="flex wrap between"
        style="margin-left:0.5vh;margin-right:1.5vh;overflow:hidden;height:20vh;margin-top: 1rem">
        <div
          class="monitor-detail--param-item flex between"
          v-for="(param,index) of paramList.record.paramsMap.filter(p => p.available !== false).slice(0,18)"
          :key="index">
          <div class="flex between" style="margin-top:0.5rem;width:15rem;height:40%">
            <span style="text-align:center;color:white;font-size:1.2rem;padding-left:1rem">{{ param.nameSimple }}：</span>
            <div style="text-align:center;color:white;font-size:1.2rem;">{{ param.value }}</div>
          </div>
        </div>
      </div>
      <div class="flex column center between" style="height: 37vh;width: 35vw;margin-left:-2vh">
        <v-chart autoresize :options="line1" style="width: 100%; height: 100%"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent} from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import {leftFill0, sleep, formatTime} from 'web-toolkit/src/utils';
import { statusMap } from '@/utils/device-utils';
import { MonitorStationList } from '@/dao/monitorDao';
import {MonitorStationDetail} from '@/dao/monitorDao';
import {AnalysisDeviceParam, AnalysisDeviceTime, AnalysisParams} from '@/dao/analysisDao';
import {timelineConfig, getColor, getColors} from 'web-toolkit/src/utils/echarts-helper';
import {SettingGet} from '@/dao/settingDao';
import {init, login, startRealPlay, stopPlay} from '@/utils/video';
import {Message} from 'element-ui';

export default {
  name: 'parameter',
  setup() {
    const loading = ref(false);
    const device = ref<any>({});
    const station = ref<any>();
    const count = ref<any>(0);
    const active = ref<boolean>(true);
    const line1 = ref<any>({});
    const datetimeRange = ref<any>([]);
    const refreshTimeRatio = ref(false);
    const paramNameString = ref('');
    const checkList = ref<any>([]);
    const stationList = ref<any>([]);
    const modalVideo = ref<any>({
      szDeviceIdentify: '',
      start: '2020-02-26 07:00:00',
      end: '2020-02-26 14:11:11',
    });

    // async function getData() {
    //   station.value = await MonitorStationDetail({stationId: 36});
    //   device.value = station.value.deviceList[0];
    //   checkList.value = ['params.103', 'params.109', 'params.105'];
    // }
    const paramList = ref<any>();
    const sort = ref<any>({
      up: 0,
      count: 0,
      sum: 0,
    });
    function summaryHandle(summary: any, key: string) {
      if (summary[key]) {
        summary[key] = summary[key] + 1;
      } else {
        summary[key] = 1;
      }
    }
    async function getData() {
      await Promise.all([
        stationList.value = await MonitorStationList(),
      ]);
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
        }
      }
    }
    async function changeStation() {
      for (let i = sort.value.count; i < stationList.value.length; i++) {
        sort.value.count = i + 1;
        if (stationList.value[i].extend.status !== 'offline' || stationList.value[i].extend.status !== 'close') {
          sort.value.up = i;
          // device.value = (await MonitorStationDetail({stationId: stationList.value[i].id})).deviceList[0];
          if (sort.value.count >= stationList.value.length) {
            sort.value.count = 0;
          }
          // startVideo((count.value % 2 + 1));
          break;
        }
      }
    }
    async function setDevice() {
      if (stationList.value[sort.value.up]) {
        paramList.value = await AnalysisDeviceParam({deviceId: stationList.value[sort.value.up].deviceList[0].id});
      }
    }
    async function drawStation() {
      while (active.value) {
        await changeStation();
        // darwVideo();
        await sleep(180000);
      }
    }
    async function setData() {
      // await getData();
      initVideo();
      getData();
      drawStation();
      updata();
    }
    async function updata() {
      while (active.value) {
        await setDevice();
        await sleep(3000);
      }
    }
    async function initVideo() {
      const setting = await SettingGet({onlyNVR: true});
      modalVideo.value.ip = setting.nvrIp;
      modalVideo.value.port = setting.nvrPort;
      modalVideo.value.username = setting.nvrUsername;
      modalVideo.value.pwd = setting.nvrPwd;
      await init('video', 1);
      modalVideo.value.szDeviceIndentify = modalVideo.value.ip + '_' + modalVideo.value.port;
      const msg = await login(modalVideo.value.ip, modalVideo.value.port, modalVideo.value.username, modalVideo.value.pwd);
      if (msg) { Message.error(msg + ''); }
      await startVideo(null);
    }
    async function startVideo(id: any) {
      await stopPlay(0);
      if (id === undefined || id === null) { id = 1; }
      // if (id === undefined || id === null) { return ; }
      await startRealPlay(0, modalVideo.value.szDeviceIndentify, id);
    }
    async function setLine() {
      while (active.value) {
        await getLine();
        await sleep(3000);
      }
    }
    async function getLine() {
      const dif: number = 300000;
      const now = Date.now();
      datetimeRange.value = [new Date(now - dif), new Date()];
      const range = datetimeRange.value;
      if (!range || !range[0] || !range[1]) {
        Message.error('请选择时间范围');
        return;
      }
      if (range[1] < range[0]) {
        Message.error('开始时间必须小于结束时间');
        return;
      }
      const allParams: any[] = [{
        deviceId: stationList.value[sort.value.up].deviceList[0].id,
        keys: checkList.value,
      }];
      const list = await AnalysisParams({
        paramsJson: JSON.stringify(allParams),
        start: range[0].getTime(),
        end: range[1].getTime(),
        sampleNum: 2000,
      });
      const series: any[] = [];
      for (const dataset of list) {
        const paramsDataMap: any = {};
        for (const dataItem of dataset.data) {
          const time = dataItem.time;
          const keys = Object.keys(dataItem).filter(key => key !== 'time');
          for (const key of keys) {
            paramsDataMap[key]
              ? (paramsDataMap[key].push({name: time.toString(), value: [time, dataItem[key]]}))
              : (paramsDataMap[key] = [{name: time.toString(), value: [time, dataItem[key]]}]);
          }
        }
        for (const param of dataset.paramConfigs) {
          const data = paramsDataMap[(device.value as any).id + '.' + param.keyFull] || [];
          if (line1.value === null || refreshTimeRatio.value) {
            series.push({
              name: `${param.nameSimple}`,
              type: 'line',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: { width: 2 },
              hoverAnimation: false,
              data,
            });
          } else {
            (line1.value as any).series.find((x: any) => x.name === param.nameSimple).data = data;
          }
        }
      }
      if (line1.value === null || refreshTimeRatio.value) {
        refreshTimeRatio.value = false;
        const option: any = getOption();
        if (list[0]!.paramConfigs!.length === 1) {
          option.yAxis.name = `${list[0].paramConfigs[0].nameSimple}${list[0].paramConfigs[0].unit ? '/' + list[0].paramConfigs[0].unit : ''}`;
        }
        option.series = series;
        line1.value = option;
        let str = '';
        for (const p of list[0].paramConfigs) {
          str += p.nameSimple + ' | ';
        }
        paramNameString.value = str.slice(0, -3);
      }
    }
    function getOption() {
      return {
        color: getColors(),
        xAxis: {
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
          axisLabel: {
          show: true,
          textStyle: {
            color: '#28D0F1',
            fontSize: '14',
          },
        },
        },
        yAxis: {
          type: 'value',
          name: '',
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
          axisLabel: {
          show: true,
          textStyle: {
            color: '#28D0F1',
            fontSize: '14',
          },
        },
        },
        grid: {
          bottom: '15%',
        },
        dataZoom: [
          {
            type: 'inside',
            filterMode: 'weakFilter',
          },
        ],
        series: [],
      };
    }
    function init0() {
      setData();
      setLine();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, device, init0,
      sort, stationList, paramList,
    };
  },
};
</script>


<style scoped lang="scss">
  .bk {
    background: url("../../../../assets/dashboard/toumingbeijing.png") no-repeat;
    background-size: 100% 100%;
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
