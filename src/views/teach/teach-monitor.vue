<template v-loading="loading">
  <div>  
      <div class="flex align-center">
          <el-button type="primary" size="mini" @click="delay()">延迟</el-button>
          <el-button type="danger" size="mini" @click="off()">下课</el-button>
      </div>
      <monitor></monitor>  
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, onUnmounted, watch, createComponent } from '@vue/composition-api';
import { router } from '@/main';
import { useLoading } from 'web-toolkit/src/service';
import monitor  from '../laboratory/monitor.vue';
export default createComponent({
  components: { monitor },
  setup() {
    const loading = ref(false);
    const delay = async () => {

    };
    const off = async () => {

    };
    onMounted(useLoading(loading, async () => {

    }));
    return{
     loading,
     delay,
     off,
    };
  },
});
</script>
<style scoped lang="scss">
 
</style>