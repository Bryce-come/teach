<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:1rem;margin-top:1vh">
        <div class="yuan" style="width:2vw;height:3vh"></div>
        <div style="color:#28D0F1;font-weight:bold;font-size: 1.6rem;margin-left: 1rem;width:7vw">通知公告</div>
        <div class="hengxian" style="width:15vw;height:3vh;margin-left:10vw"></div>
      </div>
    <div style="height:100%;overflow:hidden;margin-top:1.5vh;margin-left:1vw" class="flex column">
      <div v-for="(item, k) in message" :key="k" style="width:30vw;margin-left:1rem;margin-top:1rem">
        <div class="flex align-center" style="margin-bottom:0.5rem;color:white;font-size:1.3rem;">
          <div style="width:100%;overflow:auto;padding:0.1rem 0.1rem;cursor:pointer;font-size:1.2rem;">{{item.content}}</div>
          <div style="width:30%;font-size:1.2rem;">{{item.createDt}}</div>
        </div>
      </div>
      <div v-if="message.length === 0" class="no-msg" style=";font-size:2rem;">暂无通知</div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { MonitorStationList } from '@/dao/monitorDao';
import {MonitorStationDetail} from '@/dao/monitorDao';
import { sleep } from 'web-toolkit/src/utils';
import {NewsList} from '@/dao/newsDao';

export default {
  name: 'news',
  setup() {
    const loading = ref(false);
    const message = ref<any>([]);
    const active = ref<boolean>(true);
    async function getData() {
      message.value = await NewsList({count: 3});
    }
    async function setData() {
      while (active.value) {
        await getData();
        await sleep(21600000);
      }
    }
    async function init() {
      try {
        await setData();
        // if (!message.value) throw "设备不存在";
      } catch (err) {}
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, message,
      init,
    };
  },
};
</script>


<style scoped lang="scss">
  .no-msg{
    color: white;
    text-align: center;
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
