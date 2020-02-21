<template>
  <div v-loading='loading' class="system-option-setting">
    <el-tabs type="card">
      <el-tab-pane label="实验室使用设置">
        <div style="margin-top:20px">
          <div style="font-weight:bold">实验室使用报警</div>
          <div style="color:grey" class="flex between">
            <span>当实验室被非法时间使用、非法使用者占用均会推送报警提醒</span>
            <el-switch v-model="stationUsageAlarmOn"></el-switch>
          </div>
          <div style="width:100%;height:1px;margin:20px 5px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
        </div>
        <div>
          <div style="font-weight:bold">维保到期提醒</div>
          <div style="color:grey" class="flex between">
            <span>设备维保时间设定及到期提醒</span>
            <el-switch v-model="deviceMaintenAlarmOn"></el-switch>
          </div>
          <div v-if="deviceMaintenAlarmOn" style="margin-top:20px">
            提前时间
            <el-input v-model="advanceTime" style="width:50px"></el-input>
            天
          </div>
          <div style="width:100%;height:1px;margin:20px 5px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="网关通道设置">
        <div style="margin-top:20px">
          <div style="font-weight:bold">LKT-MAN控制CNC、PC开关</div>
          <div style="color:grey" class="flex between">
            <span>是否允许LKT-MAN控制CNC设备与PC联通</span>
            <el-switch v-model="CNCLinkOn"></el-switch>
          </div>
          <div v-if="CNCLinkOn" style="margin-top:20px">
            默认超时时间:
            <el-input v-model="overTime" style="width:50px"></el-input>
            分钟
          </div>
          <div style="width:100%;height:1px;margin:20px 5px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学期学年时间设定">
        <el-form style="display:flex;justify-content:between;flex-wrap:wrap;margin-top:20px" label-width="90px">
          <el-form-item label="学年选择:">
            <lkt-select/>
          </el-form-item>
          <el-form-item label="学期输入:">
            <el-input placeholder="请输入当前学期" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="150px">
          <el-form-item label="学期起止时间设定:">
            <el-date-picker type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="作息时间设定">
        <el-form style="margin-top:20px">
          <el-form-item label="一天课时数:" label-width="100px">
            <div>
              <el-input-number v-model="lessonNum" controls-position="right" :min="1" :max="8" style="width:100px"></el-input-number>
              课时
            </div>
          </el-form-item>
        </el-form>
        <div v-if="lessonNum" class="wrapper">
          <div class="wrapper-content" v-for="(item, i) in lessonNum" :key="i">
            第<span>{{ i+1 }}</span>节课时间:
            <el-time-picker is-range v-model="lesson1" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" style="margin-left:10px">
            </el-time-picker>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
export default {
  setup() {
    const loading = ref(false);
    const stationUsageAlarmOn = ref(true);
    const deviceMaintenAlarmOn = ref(false);
    const CNCLinkOn = ref(false);
    const advanceTime = 30;
    const overTime = 30;
    const lessonNum = 8;
    const lesson1 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    const lesson2 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    const lesson3 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    const lesson4 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    const lesson5 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    const lesson6 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    const lesson7 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    const lesson8 = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)];
    return{
      loading, stationUsageAlarmOn, deviceMaintenAlarmOn, CNCLinkOn, lessonNum, advanceTime, overTime,
      lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8,
    };
  },
};
</script>
<style scoped lang="scss">
.wrapper{
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 30px;
}
.wrapper-content{
  // width: 50%;
  margin-bottom: 20px;
}
</style>