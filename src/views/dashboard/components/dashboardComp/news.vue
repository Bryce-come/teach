<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="margin-left:1vw;margin-top:1vh">
      <div style="background-color:#28D0F1;width:0.5rem;height:1.6rem"></div>
      <div style="color:#28D0F1;font-weight:bold; margin-left: 1rem;font-size: 1.3rem">通知公告</div>
    </div>
    <div style="height:100%;overflow:hidden;margin-top:3vh;margin-left:1vw" class="flex column">
      <div v-for="(item, k) in message" :key="k" style="width:30vw;margin-left:1rem;margin-top:1rem">
        <div class="flex align-center" style="margin-bottom:0.5rem;color:white;font-size:1.3rem;">
          <div style="width:100%;overflow:auto;padding:0.5rem 0.5rem;cursor:pointer;">{{item.content}}</div>
          <div style="width:30%">{{item.createDt}}</div>
        </div>
      </div>
      <div v-if="message.length === 0" class="no-msg" style=";font-size:1rem;">暂无通知</div>
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
      message.value = await NewsList({count: 5});
    }
    async function setData() {
      while (active.value) {
        await getData();
        await sleep(3600000);
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
</style>
