<template v-loading="loading">
  <div>
      <div class="flex end" style="margin-bottom:10px">
          <el-button type="primary" @click="delay()" style='margin-right:10px'>延迟</el-button>
          <el-button type="danger" @click="off()">下课</el-button>
      </div>
      <monitor></monitor>
      <kit-dialog-simple
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
import { ref, Ref, onMounted, onUnmounted, watch, createComponent } from '@vue/composition-api';
import { router } from '@/main';
import { Message } from 'element-ui';
import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
import monitor from '../monitor/monitor.vue';
export default createComponent({
  components: { monitor },
  setup() {
    const loading = ref(false);
    const delayMode = ref({
      visible: false,
      data: '',
    });
    const delay = async () => {
      delayMode.value.visible = true;
    };
    const confirm = async () => {
      delayMode.value.visible = false;
    };
    const off = async () => {
      Message.success('断开连接');
    };
    onMounted(useLoading(loading, async () => {

    }));
    return{
     loading,
     delay,
     delayMode,
     off: useConfirm('点击“确定”按钮后将断开所有电脑与机床的通信连接,请确认所有学生完成机床操作！', useLoading(loading, off)),
     confirm,
    };
  },
});
</script>
<style scoped lang="scss">

</style>
