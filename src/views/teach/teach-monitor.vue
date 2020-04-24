<template v-loading="loading">
  <div>
    <div class="flex end" style="margin-bottom:10px" v-if="show.flag">
      <el-button type="primary" @click="delay()" style='margin-right:10px'>延迟下课</el-button>
      <el-button type="danger" v-if="linkOn" @click="off()">下课</el-button>
    </div>
    <monitor v-if="show.flag" />
    <div style="color: grey;text-align: center" v-if="!show.flag">暂无上课信息</div>
    <kit-dialog-simple
      id="teach-monitor"
      :modal="delayMode"
      :confirm="confirm"
      width="500px">
      <div class="flex center">
         <span style="margin:0 30px 0 10px">延迟</span>
        <el-input-number v-model="delayMode.data" :min="1" :max="60" controls-position="right"/>
        <span style="margin:0 30px 0 10px">分钟</span>
      </div>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, onUnmounted, watch, createComponent } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import monitor from '../monitor/monitor.vue';
import {ClassLengthen, ClassOver} from '@/dao/inClassDao';
import {SettingGet} from '@/dao/settingDao';
import {CourseRecordInClass} from '@/dao/courseRecordDao';
export default createComponent({
  components: { monitor },
  setup() {
    const loading = ref(false);
    const delayMode = ref({
      visible: false,
      data: 5,
    });
    const linkOn = ref<boolean>(false);
    const record = ref<any>();
    const show = ref<any>({
      flag: false,
    });

    const delay = async () => {
      delayMode.value.visible = true;
    };
    const confirm = async () => {
      await ClassLengthen({
        id: record.value.id,
        minutes: delayMode.value.data,
      });
      delayMode.value.visible = false;
      Message.success('操作成功，即将刷新页面');
      window.location.reload();
    };
    const off = async () => {
      await ClassOver();
      Message.success('已下课并断开所有操作台网络');
    };
    onMounted(useLoading(loading, async () => {
      const data = await SettingGet({onlyLinkOn: true});
      linkOn.value = data.on;
      show.value.flag = (await CourseRecordInClass()).record;
    }));
    return{
     loading, linkOn, record,
     delay, show,
     delayMode,
     off: useConfirm('点击“确定”按钮后将断开所有电脑与机床的通信连接,请确认所有学生完成机床操作！', useLoading(loading, off)),
     confirm,
    };
  },
});
</script>
<style scoped lang="scss">

</style>
