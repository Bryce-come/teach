<template>
  <div class="flex column" style="" v-loading="loading">
    <div class="flex" style="justify-content:space-around;width:6vw;margin-left:1vw;margin-top:1vw">
      <div style="background-color:#28D0F1;width:5px;height:20px"></div>
      <div style="color:#28D0F1;font-weight:bold">通知公告</div>
    </div>
    <div style="height:100%;overflow:hidden" class="flex column">
      <div v-for="(item, k) in message" :key="k" style="width:30vw;margin-left:1vw;margin-top:1vw">
        <div class="flex align-center" style="margin-bottom:5px;color:white">
          <div style="width:100%;overflow:auto;padding:5px 5px;cursor:pointer">{{item.content}}</div>
          <div style="width:30%">{{item.createDt}}</div>
        </div>
      </div>
      <div v-if="message.length === 0" class="no-msg">暂无通知</div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from '@vue/composition-api';
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
    const message = ref<any>();
    async function getData() {
      message.value = await NewsList({count: 5});
    }
    async function setData() {
      getData();
    }
    onMounted(useLoading(loading, async () => {
      try {
        setData();
        // if (!message.value) throw "设备不存在";
      } catch (err) {}
    }));
    return {
      loading, message,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
