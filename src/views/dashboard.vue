<template>
  <div class="backwall " v-loading="loading">
		<div class="flex">
			<div id="timeBoard" class="flex column center">
				<div>{{timeBoard.time}}</div>
				<div class="flex center">
					<div>{{timeBoard.month}}</div><div>{{timeBoard.day}}</div>
				</div>
			</div>
			<div id="weatherBoard" class="flex">
				<div style="color:white" class="flex column center weatherbk">
					<i class="el-icon-cloudy cloudy">多云</i>
					<div>周六</div>
					<div>4/11</div>
				</div>
				<div style="color:white" class="flex column center weatherbk">
					<i class="el-icon-cloudy cloudy">多云</i>
					<div>周日</div>
					<div>4/12</div>
				</div>
				<div style="color:white" class="flex column center weatherbk">
					<i class="el-icon-cloudy cloudy">多云</i>
					<div>周一</div>
					<div>4/13</div>
				</div>
			</div>
			<div id="mainTitle" style="color:#28D0F1;font-size:30px;font-weight:bold;">
				教学实训数据展示平台
			</div>
			<div id="timeOn">
				<div style="color:white">当日开机总时长</div>
				<div style="color:#F6EB1C;font-size: 25px;font-weight: bold;" class="flex center">{{timeBoard.timeOn + '小时'}}</div>
			</div>
			<stateCount/>
		</div>
    <hr>
    <div class="flex">
      <div class="flex column">
        <useTime class="bk" style="width:33vw;height:250px"/>
        <useCount class="bk" style="width:33vw;height:250px"/>
        <div class="flex">
          <timeOn class="bk" style="width:17vw;height:125px"/>
          <onTimeWeek class="bk" style="width:16vw;height:125px"/>
        </div>
      </div>
      <div class="flex column">
        <iframe id="iframe" name="iframe" :src="'http://192.168.0.132:9000'" style="width:33vw;height:280px"></iframe>
        <div class="flex column bk" style="width:33vw;height:350px">
          <div style="color:#28D0F1">学生操作监控</div>
          <div class="flex">
            <div class="bk" style="width:15vw;height:150px"></div>
            <div class="bk" style="width:15vw;height:150px"></div>
          </div>
          <div style="color:#28D0F1">设备运行参数</div>
          <parameter style="width:30vw;height:150px;" />
        </div>
      </div>
      <div class="flex column">
        <div class="bk" style="width:33vw;height:250px">
          <news style="width:100%;height:100%"/>
        </div>
        <div class="bk" style="width:33vw;height:380px">
          <timeLine style="width:100%;height:100%"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted} from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { useLoading } from 'web-toolkit/src/service';
import { storeUserInfo, updateStoreUserInfo, submitErrChanel, pushMsgErr } from 'web-toolkit/src/case-main';
import {loginTitle1, loginTitle2, loginLogo, scheme} from '@/config';
import {router} from '@/main';
import {assert, sleep} from 'web-toolkit/src/utils/index';
import {Login} from '@/dao/userDao';
import stateCount from '@/views/dashboardComp/stateCount.vue';
import useTime from '@/views/dashboardComp/useTime.vue';
import useCount from '@/views/dashboardComp/useCount.vue';
import timeOn from '@/views/dashboardComp/timeOn.vue';
import onTimeWeek from '@/views/dashboardComp/onTimeWeek.vue';
import parameter from '@/views/dashboardComp/parameter.vue';
import news from '@/views/dashboardComp/news.vue';
import timeLine from '@/views/dashboardComp/timeLine.vue';

export default createComponent({
  components: { stateCount, useTime, useCount, timeOn, onTimeWeek, parameter, news, timeLine},
  setup() {
    const loading = ref(false);
    const timeBoard = ref<any>({
      now: undefined,
      time: undefined,
      month: undefined,
      day: undefined,
      timeOn: undefined,
    });
    const week = ['日', '一', '二', '三', '四', '五', '六'];

    function getTimeBoard() {
      const str = new Date();
      timeBoard.value.time = str.toTimeString().slice(0, 8);
      timeBoard.value.month = (str.getMonth() + 1) + '月' + str.getDate() + '日';
      timeBoard.value.day = '星期' + week[str.getDay()];
    }
    async function setTimeBoard() {
      while (timeBoard) {
        getTimeBoard();
        await sleep(1000);
      }
    }
    function getTimeOn() {
      const str = new Date();
      timeBoard.value.timeOn = (str.getHours() - 8) * 2;
    }
    async function setTimeOn() {
      while (timeBoard) {
        getTimeOn();
        await sleep(1800000);
        // await sleep(1000);
      }
    }
    onMounted(useLoading(loading, async () => {
      const data = await Login( {
          username: 'admin',
          pwd: '666666',
          schema: scheme,
      });
      updateStoreUserInfo(data);
      setTimeBoard();
      setTimeOn();
    }));
    return {
      loading,
      timeBoard,
    };
  },
});
</script>
<style lang="scss" scoped>
.backwall{
	width: 100vw;
  height: 100vh;
  background: url("../assets/dashboard/bw.png") no-repeat;
  background-size: 100% 100%;
}
#timeBoard{
	color:#F6EB1C;
	font-size: 25px;
	font-weight: bold;
}
.weatherbk{
	background: url("../assets/dashboard/weatherbk.png") no-repeat;
  background-size: 100% 100%;
}
.bk {
  background: url("../assets/dashboard/chartbk.png") no-repeat;
  background-size: 100% 100%;
}
</style>
