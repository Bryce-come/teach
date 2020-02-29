<template>
  <div class="flex center">
    <div>
      <div class="flex little-space center">
        <el-button @click="restart()">重置播放</el-button>
        <el-button @click="fullScreen()">全屏</el-button>
      </div>
      <div id="contain1" class="plugin" style="width: 1300px; height: 700px"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, onUnmounted} from '@vue/composition-api';
import {init, login, startRealPlay, stopPlay, fullScreen} from '@/utils/video';
import { sleep } from 'web-toolkit/src/utils';

export default {
  setup() {
    const modalVideo = ref<any>({
      szDeviceIdentify: '',
      ip: '112.17.133.224',
      port: '11080',
      username: 'admin',
      pwd: 'lkt666666',
      start: '2020-02-26 07:00:00',
      end: '2020-02-26 14:11:11',
    });

    onMounted(async () => {
      await init('contain1', 2);
      modalVideo.value.szDeviceIndentify = modalVideo.value.ip + '_' + modalVideo.value.port;
      const msg = await login(modalVideo.value.ip, modalVideo.value.port, modalVideo.value.username, modalVideo.value.pwd);
      if (msg) {
        alert(msg);
        return ;
      }
      await sleep(1000);
      await startVideo();
    });
    async function startVideo() {
      const msg1 = await startRealPlay(0, modalVideo.value.szDeviceIndentify, 1);
      const msg2 = await startRealPlay(1, modalVideo.value.szDeviceIndentify, 1);
      if (msg1) {
        alert(msg1);
      }
      if (msg2) {
        alert(msg2);
      }
    }
    async function stopVideo() {
      await stopPlay(0);
      await stopPlay(1);
    }
    async function restart() {
      await stopVideo();
      await startVideo();
    }
    return{
      restart,
      fullScreen,
    };
  },
};
</script>
<style lang="scss" scoped>

</style>
