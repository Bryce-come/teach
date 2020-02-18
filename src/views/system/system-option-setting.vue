<template>
  <div v-loading='loading' class="system-option-setting">
    <div style="margin-bottom:40px">实验室使用设置</div>
    <div >
      <div style="font-weight:bold">实验室使用报警</div>
      <div style="color:grey">
        当实验室被非法时间使用、非法使用者占用均会推送报警提醒
        <el-switch v-model="stationUsageAlarmOn" style="margin-left:500px"></el-switch>
      </div>
      <div style="width:920px;height:1px;margin:20px 5px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
    </div>
    <div>
      <div style="font-weight:bold">维保到期提醒</div>
      <div style="color:grey">
        设备维保时间设定及到期提醒
        <el-switch v-model="deviceMaintenAlarmOn" style="margin-left:700px"></el-switch>
      </div>
      <div style="width:920px;height:1px;margin:20px 5px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
    </div>
    <div>
      <div style="font-weight:bold">LKT-MAN控制CNC、PC开关</div>
      <div style="color:grey">
        是否允许LKT-MAN控制CNC设备与PC联通
        <el-switch v-model="CNCLinkOn" style="margin-left:615px"></el-switch>
      </div>
      <div style="width:920px;height:1px;margin:20px 5px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
    </div>
    <el-form :inline="true">
      <div style="margin-bottom:20px">作息时间</div>
      <el-form-item label="一天课时数:" label-width="100px">
        <div>
          <el-input-number v-model="lessonNum" controls-position="right" :min="1" :max="8" style="width:100px"></el-input-number>
          课时
        </div>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="第一节时间:" label-width="100px">
        <el-time-picker is-range v-model="lesson1" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="第二节时间:" label-width="100px" style="margin-left:100px">
        <el-time-picker is-range v-model="lesson2" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="第三节时间:" label-width="100px">
        <el-time-picker is-range v-model="lesson3" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="第四节时间:" label-width="100px" style="margin-left:100px">
        <el-time-picker is-range v-model="lesson4" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="第五节时间:" label-width="100px">
        <el-time-picker is-range v-model="lesson5" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="第六节时间:" label-width="100px" style="margin-left:100px">
        <el-time-picker is-range v-model="lesson6" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="第七节时间:" label-width="100px">
        <el-time-picker is-range v-model="lesson7" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="第八节时间:" label-width="100px" style="margin-left:100px">
        <el-time-picker is-range v-model="lesson8" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
export default {
  setup() {
    const loading = ref(false);
    const stationUsageAlarmOn = ref(true);
    const deviceMaintenAlarmOn = ref(true);
    const CNCLinkOn = ref(true);
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
      loading, stationUsageAlarmOn, deviceMaintenAlarmOn, CNCLinkOn, lessonNum,
      lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8,
    };
  },
};
</script>
<style scoped lang="scss">

</style>