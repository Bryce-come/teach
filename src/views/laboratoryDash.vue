<template>
  <div class="backwall max-width" v-loading="loading">
    <div class="flex" style="justify-content:space-around;align-items:center;height:9vh">
      <div id="mainTitle" class="flex center" style="color:#28D0F1;font-size:3.5rem;font-weight:bold;width:33vw">
        实训室数据展示平台
      </div>
    </div>
    <hr style="color:#28D0F1;">
    <div class="flex" style="height:90vh;justify-content:space-around;">
      <div>
        <div class="flex column center bk" style="width:32vw;height:60vh;margin-top:1vh;">
          <div class="flex" style="margin-left:1rem;margin-top:1vh">
            <div class="yuan" style="width:2vw;height:3vh"></div>
            <div style="color:#28D0F1;font-weight:bold;font-size: 2rem;margin-left: 1rem">设备运行统计</div>
            <div class="hengxian" style="width:14vw;height:3vh;margin-left:8vw"></div>
          </div>
          <stateCount ref="stateCount" style="width:28vw;margin-top:3vh"/>
          <timeLine ref="timeLine" style="width:100%;height:100%;width:33vw;height:54vh;margin-top:1vh"/>
        </div> 
        <NCExam ref="NCExam" :courseRecord="courseRecord" class="bk" style="width:32vw;height:28vh;margin-top:1vh"/>
      </div>
      
      <div class="flex column" style="height:84vh;">
        <parameter ref="parameter" style="width:33vw;height:48vh;margin-top:1vh"/>
      </div>
      <div class="flex column" style="height:90vh;">
        <div class="bk" style="width:33vw;height:22vh;margin-top:1vh">
          <news ref="news" style="width:100%;height:100%"/>
        </div>
        <div class="bk" style="width:33vw;height:89vh;margin-top:1vh">
          <lessonInfo  :courseRecord="courseRecord" ref="lessonInfo"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted} from '@vue/composition-api';
import { ref, createComponent} from '@vue/composition-api';
import { useLoading } from 'web-toolkit/src/service';
import { updateStoreUserInfo} from 'web-toolkit/src/case-main';
import {scheme} from '@/config';
import {sleep} from 'web-toolkit/src/utils/index';
import {Login} from '@/dao/userDao';
import stateCount from '@/views/LabDashComp/stateCount.vue';
import parameter from '@/views/LabDashComp/parameter.vue';
import timeLine from '@/views/LabDashComp/timeLine.vue';
import lessonInfo from '@/views/LabDashComp/lessonInfo.vue';
import news from '@/views/LabDashComp/news.vue';
import NCExam from '@/views/LabDashComp/NCExam.vue';
import {CourseRecordInClass} from '@/dao/courseRecordDao';
import {SettingGet} from '@/dao/settingDao';

export default createComponent({
  components: { stateCount, parameter, timeLine, lessonInfo, news, NCExam},
  setup() {
    const loading = ref(false);
    const stateCount = ref<any>();
    const parameter = ref<any>();
    const timeLine = ref<any>();
    const lessonInfo = ref<any>();
    const news = ref<any>();
    const NCExam = ref<any>();
    const courseRecord = ref<any>();

    onMounted(useLoading(loading, async () => {
      await Promise.all([
        courseRecord.value = await CourseRecordInClass(),
      ]);
      const data = await Login( {
          username: '@dashboard',
          pwd: '666666',
          schema: scheme,
      });
      updateStoreUserInfo(data);
      parameter.value.init0();
      stateCount.value.init();
      timeLine.value.init();
      lessonInfo.value.init();
      news.value.init();
      NCExam.value.init();
    }));
    return {
      loading, lessonInfo, news, NCExam,
      stateCount, parameter, timeLine,
      courseRecord,
    };
  },
});
</script>
<style lang="scss" scoped>
.backwall{
  width: 100vw;
  height: 100vh;
  background: url("../assets/dashboard/dabeijing.png") no-repeat;
  background-size: 100% 100%;
}
#timeBoard{
  color:#F6EB1C;
  font-size: 2rem;
  font-weight: bold;
}
.bk {
  background: url("../assets/dashboard/toumingbeijing.png") no-repeat;
  background-size: 100% 100%;
}
.yuan {
  background: url("../assets/dashboard/yuan.png") no-repeat;
  background-size: 100% 100%;
}
.hengxian {
  background: url("../assets/dashboard/hengxian.png") no-repeat;
  background-size: 100% 100%;
}
</style>
