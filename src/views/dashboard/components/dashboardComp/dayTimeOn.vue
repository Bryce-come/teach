<template>
  <div class="flex column center" style="" v-loading="loading">
    <div style="color:white;font-size: 2rem;margin-bottom: 1rem">当日开机总时长</div>
    <div style="color:#F6EB1C;font-size: 2.5rem;font-weight: bold;" class="flex center">{{timeSum + '小时'}}</div>
  </div>
</template>

<script lang="ts">
  import {onUnmounted, ref} from '@vue/composition-api';
  import {sleep} from 'web-toolkit/src/utils';
  import {TodayOpenHours} from '@/dao/dashboardDao';

  export default {
  name: 'dayTimeOn',
  setup() {
    const loading = ref(false);
    const active = ref<boolean>(true);
    const timeSum = ref<any>();
    async function getData() {
      timeSum.value = await TodayOpenHours();
    }
    async function setTimeOn() {
      while (active.value) {
        await getData();
        await sleep(1800000);
      }
    }
    function init() {
      setTimeOn();
    }
    onUnmounted(() => {
      active.value = false;
    });
    return {
      loading, init, timeSum,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
